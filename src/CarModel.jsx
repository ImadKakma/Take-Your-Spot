import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, Environment, useGLTF, OrbitControls, Html } from "@react-three/drei";
import { Leva, useControls, button } from "leva";
import gsap from "gsap";
import * as THREE from "three";
  
const Car = () => {
  const { scene } = useGLTF("/amg_model.glb");
  const carRef = useRef();
  const scroll = useScroll();

  const carControls = useControls("Car", {
    position: { value: [0, -2, 3], step: 0.1 },
    scale: { value: 0.3, min: 0.1, max: 2, step: 0.1 },
    copySettings: button(() => {
      console.log("Car Settings:", carControls);
    })
  });
  
  useFrame(() => { 
    if (carRef.current) {
      carRef.current.position.set(...carControls.position);
      carRef.current.scale.setScalar(carControls.scale);
      // const rotationY = -1.4 + gsap.utils.mapRange(0, 1, -Math.PI / 2, Math.PI / 2, scroll.offset);
      // gsap.to(carRef.current.rotation, { y: rotationY, duration: 0.3, ease: "power2.out" });
    }
  });

  return <primitive ref={carRef} object={scene} />;
};

const Garage = () => {
  const { scene } = useGLTF("/show.glb");
  const garageControls = useControls("Garage", {
    position: { value: [0, -2, -5], step: 0.1 },
    scale: { value: 3.4, min: 0.5, max: 5, step: 0.1 },
    copySettings: button(() => {
      console.log("Garage Settings:", garageControls);
    })
  });

  return <primitive object={scene} position={garageControls.position} scale={garageControls.scale} />;
};

const CameraLogger = () => {
  const { camera, controls } = useThree();
  const scroll = useScroll();
  // [-3.91, 0.85, -7.02]
  const positions = [
    [
      -6.625238095238096,
      0.9301953601953603,
      -8.96945054945055
  ],
    [-0.01, 4.33, -0.54],
    [-0.23, -0.43, 13.50],
    [8.89, -0.66, 0.92],
    [-8.98, -0.28, -11.97]
  ];

  useFrame(() => {
    const t = scroll.offset; // Progression du scroll entre 0 et 1
    let targetPos;

    if (t < 0.25) {
      targetPos = positions[0].map((v, i) => v + (positions[1][i] - v) * (t * 3));
    } else if (t < 0.5) {
      targetPos = positions[1].map((v, i) => v + (positions[2][i] - v) * ((t - 0.25) * 3));
    } else if (t < 0.75) {
      targetPos = positions[2].map((v, i) => v + (positions[3][i] - v) * ((t - 0.5) * 3));
    } else {
      targetPos = positions[3].map((v, i) => v + (positions[4][i] - v) * ((t - 0.75) * 3));
    }

    // Mettre à jour la position de la caméra
    camera.position.set(...targetPos);
    camera.lookAt(0, 0, 0);
  });

  useControls("Camera", {
    logCurrentView: button(() => {
      console.log("📸 Position de la caméra:", camera.position.toArray());
      console.log("🎯 Cible de la caméra:", controls?.target?.toArray());
    }),
    resetCamera: button(() => {
      camera.position.set(6.41, 0.62, 6.23); // Remplace par tes valeurs
      camera.lookAt(0, 1, 0);
      console.log("📸 Caméra réinitialisée !");
    })
  });

  return null;
};

// TextOverlay component that will be rendered inside the Canvas using Html from drei
const TextOverlay = () => {
  const [textMode, setTextMode] = useState("conducteur");
  const [visible, setVisible] = useState(true);
  const smallTextRef = useRef(null);
  const bigTextRef = useRef(null);
  const scroll = useScroll();
  
  // Toggle between Conducteur and Annonceur
  useEffect(() => {
    const timer = setInterval(() => {
      setTextMode(prev => prev === "conducteur" ? "annonceur" : "conducteur");
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle text animation on scroll
  useFrame(() => {
    const scrollProgress = scroll.offset;
    
    // Start fading out the text once we scroll a bit
    if (scrollProgress > 0.1 && visible) {
      setVisible(false);
      
      if (smallTextRef.current) {
        gsap.to(smallTextRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      
      if (bigTextRef.current) {
        gsap.to(bigTextRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.1
        });
      }
    } else if (scrollProgress < 0.05 && !visible) {
      // Bring back when scrolling to top
      setVisible(true);
      
      if (smallTextRef.current) {
        gsap.to(smallTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.in"
        });
      }
      
      if (bigTextRef.current) {
        gsap.to(bigTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.in",
          delay: 0.1
        });
      }
    }
  });
  
  // Text swap animation effect
  useEffect(() => {
    if (bigTextRef.current) {
      gsap.fromTo(
        bigTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [textMode]);
  
  return (
    <Html fullscreen>
      <div 
        ref={smallTextRef}
        className="small"
        style={{
          position: "absolute",
          top: "65%",
          left: "30px",
          color: "white",
          fontWeight: "bold",
          zIndex: 10,
          padding: "10px 20px",
          opacity: visible ? 1 : 0,
        }}
      >
        vous êtes un
      </div>

      <div 
        ref={bigTextRef}
        className="big"
        style={{
          position: "absolute",
          top: "65%",
          left: "45%",
          transform: "translateX(-50%)",
          color: "white",
          zIndex: 10,
          padding: "10px 20px",
          opacity: visible ? 1 : 0,
        }}
      >
        {textMode === "conducteur" ? "Conducteur?" : "Annonceur?"}
      </div>
    </Html>
  );
};

// Main scene component that contains all elements
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      <CameraLogger />

      {/* Static Garage Model */}
      <Garage />
      
      {/* Rotating Car Model */}
      <Car />
      
      {/* Text Overlay */}
      <TextOverlay />
    </>
  );
};

const CarModel = () => {
  const { cameraPosition, fov } = useControls("Camera", {
    cameraPosition: { value: [-6.843, 0.888, -14.169], step: 0.1 },
    fov: { value: 40, min: 10, max: 100, step: 1 },
    copySettings: button(() => {
      console.log("Camera Settings:", { cameraPosition, fov });
    }),
    resetCamera: button(() => {
      // Réinitialiser la caméra à la position d'origine
      const camera = { position: {} };
      camera.position.set?.(6.414489220536148, 0.6213992317969143, 6.231437610829054);
    })
  });

  return (
    <>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <div className='logo'
          style={{
            position: "absolute",
            top: "20px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.5)",
            padding: "10px 20px",
          }}
        >
          TakeYourSpot
        </div>
        
        <Leva />
        {cameraPosition && (
          <Canvas camera={{ position: cameraPosition, fov }}>
            <ScrollControls pages={3} damping={0.2}>
              <Scene />
            </ScrollControls>
          </Canvas>
        )}
      </div>
    </>
  );
};

export default CarModel;