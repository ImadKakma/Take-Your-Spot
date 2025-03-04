const CameraLogger = () => {
    const { camera } = useThree();
    const scroll = useScroll();
  
    // 📌 Liste des positions de la caméra à différents moments du scroll
    const positions = [
      [-6, 2, -10],  // Vue initiale
      [0, 4, 4],     // Vue aérienne
      [6, 2, -3],    // Vue latérale
      [0, 1, -6]     // Vue arrière
    ];
  
    useFrame(() => {
      const t = scroll.offset; // Progression du scroll entre 0 et 1
  
      // Interpolation entre les différentes positions
      let currentPos;
      if (t < 0.33) {
        currentPos = gsap.utils.interpolate(positions[0], positions[1], t * 3);
      } else if (t < 0.66) {
        currentPos = gsap.utils.interpolate(positions[1], positions[2], (t - 0.33) * 3);
      } else {
        currentPos = gsap.utils.interpolate(positions[2], positions[3], (t - 0.66) * 3);
      }
  
      camera.position.set(...currentPos);
      camera.lookAt(0, 1, 0);
    });
  
    return null;
  };  
  useFrame(() => {
    const t = scroll.offset; // Progression du scroll entre 0 et 1
    let currentPos;

    if (t < 0.33) {
      currentPos = gsap.utils.interpolate(positions[0], positions[1], t * 3);
    } else if (t < 0.66) {
      currentPos = gsap.utils.interpolate(positions[1], positions[2], (t - 0.33) * 3);
    } else {
      currentPos = gsap.utils.interpolate(positions[2], positions[3], (t - 0.66) * 3);
    }

    // 📌 Déplace la caméra ici
    camera.position.set(...currentPos);
    camera.lookAt(0, 1, 0);
  });



  const positions = [
    [-6.843, 0.888, -14.169],  // Vue initiale
    [0, 4, 4],     // Vue aérienne
    [6, 2, -3],    // Vue latérale
    [0, 1, -6]     // Vue arrière
  ];

  useFrame(() => {
    const t = scroll.offset; // Progression du scroll entre 0 et 1
    let targetPos;

    if (t < 0.33) {
      targetPos = positions[0].map((v, i) => v + (positions[1][i] - v) * (t * 3));
    } else if (t < 0.66) {
      targetPos = positions[1].map((v, i) => v + (positions[2][i] - v) * ((t - 0.33) * 3));
    } else {
      targetPos = positions[2].map((v, i) => v + (positions[3][i] - v) * ((t - 0.66) * 3));
    }

    camera.position.set(...targetPos);
    camera.lookAt(0, 1, 0);
  });

  return null;







  const positions = [
    [-6.843, 0.888, -14.169],  // Vue initiale
    [0, 4, 4],     // Vue aérienne
    [6, 2, -3],    // Vue latérale
    [0, 1, -6]     // Vue arrière
  ];




  const CameraManager = () => {
    const { camera, controls } = useThree();
    const scroll = useScroll();
  
    const { positions, addNewPosition } = useControls("Camera Positions", () => {
      return {
        positions: [
          [-6.843, 0.888, -14.169], // Vue initiale
          [0, 4, 4], // Vue aérienne
          [6, 2, -3], // Vue latérale
          [0, 1, -6] // Vue arrière
        ],
        addNewPosition: button(() => {
          console.log("📸 Position enregistrée :", camera.position.toArray());
          positions.push(camera.position.toArray());
        })
      };
    });
  
    useFrame(() => {
      const t = scroll.offset; // Valeur de scroll entre 0 et 1
      const numSections = positions.length - 1;
      const section = Math.floor(t * numSections);
      const localT = (t * numSections) - section;
  
      let targetPos;
      if (section < numSections) {
        targetPos = positions[section].map((v, i) => v + (positions[section + 1][i] - v) * localT);
      } else {
        targetPos = positions[positions.length - 1];
      }
  
      camera.position.set(...targetPos);
      camera.lookAt(0, 1, 0);
    });
  
    return null;
  };
  



import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useControls, button } from "leva";
import gsap from "gsap";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useControls, button } from "leva";
import { useState } from "react";

const CameraLogger = () => {
  const { camera, controls } = useThree();
  const scroll = useScroll();
  const [positions, setPositions] = useState([
    [-6.843, 0.888, -14.169], // Vue initiale
    [0, 4, 4], // Vue aérienne
    [6, 2, -3], // Vue latérale
    [0, 1, -6] // Vue arrière
  ]);

  // Ajout de positions depuis Leva
  const { transitionSpeed, addNewPosition } = useControls("Camera", {
    transitionSpeed: { value: 1.5, min: 0.5, max: 5, step: 0.1 }, // Contrôle de la vitesse
    addNewPosition: button(() => {
      const newPos = [...camera.position.toArray()];
      setPositions((prev) => [...prev, newPos]);
      console.log("📸 Nouvelle position ajoutée :", newPos);
    })
  });

  useFrame(() => {
    const t = scroll.offset; // Progression du scroll entre 0 et 1
    const numSections = positions.length - 1;
    const section = Math.min(Math.floor(t * numSections), numSections - 1);
    const localT = (t * numSections - section) / transitionSpeed;

    // Interpolation linéaire fluide entre les positions
    const targetPos = positions[section].map((v, i) => 
      v + (positions[section + 1][i] - v) * localT
    );

    camera.position.set(...targetPos);
    camera.lookAt(0, 1, 0);
  });

  return null;
  useFrame(() => {
      const t = scroll.offset;
      const numSections = positions.length - 1;
      const section = Math.min(Math.floor(t * numSections), numSections - 1);
      const localT = (t * numSections - section) / transitionSpeed;
  
      // Interpolation fluide avec GSAP pour éviter les saccades
      const targetPos = positions[section].map((v, i) => 
        gsap.utils.interpolate(v, positions[section + 1][i], localT)
      );
  
      gsap.to(camera.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: 0.2, // Rendu immédiat
        ease: "power2.out"
      });
  
      camera.lookAt(0, 1, 0);
    });
};




const CameraLogger = () => {
    const { camera, controls } = useThree();
    const scroll = useScroll();
  
    
  
    useFrame(() => {
      const t = scroll.offset; // Progression du scroll entre 0 et 1
      let targetPos;
  
      if (t < 0.33) {
        targetPos = positions[0].map((v, i) => v + (positions[1][i] - v) * (t * 3));
      } else if (t < 0.66) {
        targetPos = positions[1].map((v, i) => v + (positions[2][i] - v) * ((t - 0.33) * 3));
      } else {
        targetPos = positions[2].map((v, i) => v + (positions[3][i] - v) * ((t - 0.66) * 3));
      }
  
      // Mettre à jour la position de la caméra
      camera.position.set(...targetPos);
      camera.lookAt(0, 1, 0);
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

  import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, useGLTF } from "@react-three/drei";

const Car = () => {
  const { scene } = useGLTF("/amg_model.glb");
  const carRef = useRef();
  const scroll = useScroll();

  // Positions enregistrées pour l'animation de la voiture
  const positions = [
    [-2, -2, -2],  // Vue initiale
    [0, -2, 3],    // Vue aérienne
    [0, -2, -2],   // Vue latérale
    [0, -2, -0.3]  // Vue arrière
  ];

  useFrame(() => {
    if (carRef.current) {
      const t = scroll.offset; // Progression du scroll entre 0 et 1
      const numSections = positions.length - 1;
      const section = Math.min(Math.floor(t * numSections), numSections - 1);
      const localT = t * numSections - section;

      const interpolate = (arr1, arr2, factor) =>
        arr1.map((v, i) => v + (arr2[i] - v) * factor);

      const targetPos = interpolate(positions[section], positions[section + 1], localT);
      
      carRef.current.position.set(...targetPos);
    }
  });

  return <primitive ref={carRef} object={scene} />;
};

export default Car;




















































  

  import React, { useRef } from "react";
  import { Canvas, useFrame, useThree } from "@react-three/fiber";
  import { ScrollControls, useScroll, Environment, useGLTF, OrbitControls } from "@react-three/drei";
  import { Leva, useControls, button } from "leva";
  import gsap from "gsap";
  
  const Car = () => {
    const { scene } = useGLTF("/amg_model.glb");
    const carRef = useRef();
    const scroll = useScroll();
  
    const carControls = useControls("Car", {
      position: { value: [-2, -2, -2], step: 0.1 },
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
        //gsap.to(carRef.current.rotation, { y: rotationY, duration: 0.3, ease: "power2.out" });
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
  
    useFrame(() => {
      const t = scroll.offset; // Progression du scroll entre 0 et 1
  
      let currentPos;
      
      try {
        camera.position.set(...(t < 0.5 ? currentPos : finalPos));
        camera.lookAt(0, 1, 0);
      } catch (error) {
        console.error("Erreur dans useFrame:", error);
      }
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
  
  
  const CarModel = () => {
    const { cameraPosition, fov } = useControls("Camera", {
      cameraPosition: { value: [-6.843, 0.888, -14.169], step: 0.1 },
      fov: { value: 40, min: 10, max: 100, step: 1 },
      copySettings: button(() => {
        console.log("Camera Settings:", { cameraPosition, fov });
      }),
      resetCamera: button(() => {
        // Réinitialiser la caméra à la position d'origine
        camera.position.set(6.414489220536148, 0.6213992317969143, 6.231437610829054);
      })
    });
  
    return (
      <>
        {/* <Leva /> */}
        {cameraPosition && (<Canvas camera={{ position: cameraPosition, fov }}>
          <ScrollControls pages={3} damping={0.2}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="night" />
            <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
            <CameraLogger />
  
            {/* Static Garage Model */}
            <Garage />
            
            {/* Rotating Car Model */}
            <Car />
          </ScrollControls>
        </Canvas>)}
      </>
    );
  };
  
  export default CarModel;
  





































  import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls, button } from "leva";

const CameraLogger = () => {
  const { camera, gl } = useThree();
  const [manualMode, setManualMode] = useState(false);

  useControls("Camera", {
    toggleManualMode: button(() => {
      setManualMode((prev) => !prev);
      console.log(`Mode manuel ${!manualMode ? "activé" : "désactivé"} 🚀`);
    }),
    logCurrentView: button(() => {
      console.log("📸 Position de la caméra:", camera.position.toArray());
      console.log("🎯 Cible de la caméra:", camera.rotation.toArray());
    }),
  });

  return (
    <>
      {manualMode && <OrbitControls args={[camera, gl.domElement]} />}
    </>
  );
};

export default CameraLogger;












const CameraLogger = () => {
    const { camera } = useThree();
  
    // Déclaration de la position avec un quatrième axe (w) pour déplacer la caméra
    const controls = useControls("Camera", {
      x: { value: 0, min: -10, max: 10, step: 0.1 },
      y: { value: 1, min: 0, max: 5, step: 0.1 },
      z: { value: 5, min: -10, max: 10, step: 0.1 },
      w: { value: 0, min: -10, max: 10, step: 0.1 }, // Quatrième axe pour déplacement haut/bas ou latéral
      logPosition: button(() => {
        console.log("📸 Position:", camera.position.toArray());
      }),
    });
    const lateralOffset = new THREE.Vector3();
  
    useFrame(() => {
      // Déplacer la caméra en fonction des contrôles (x, y, z)
      camera.position.set(controls.x, controls.y, controls.z);
  
      // Calculer le vecteur latéral perpendiculaire à la caméra
      camera.getWorldDirection(lateralOffset);
      lateralOffset.cross(new THREE.Vector3(0, 1, 0)).normalize(); // Perpendiculaire à l'axe de la caméra
  
      // Ajouter l'offset latéral (w) à la caméra
      camera.position.add(lateralOffset.multiplyScalar(controls.w));
  
      // Toujours faire en sorte que la caméra regarde vers (0, 1, 0)
      camera.lookAt(0, 1, 0);
    });
  
    return null;
  
  };