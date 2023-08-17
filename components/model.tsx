import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import {
  PresentationControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { useControls } from "leva";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger);

const ModelComponent = () => {
  const gltf = useGLTF("/test2.glb");
  const modelRef = useRef(null);
  // const { position, rotation } = useControls("Model", {
  //   position: { value: [2, 0, 1.7], step: 0.1 },
  //   rotation: { value: [0, -1.45, 0], step: 0.01 },
  // });

  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const t1 = gsap.timeline({ paused: true });
    const { position, rotation } = modelRef.current;

    // Animation for the first section
    t1.to(position, {
      x: -17,
      z: 21,
      y: -5,
      duration: 3,
    });

    // .to(
    //   rotation,
    //   {
    //     y: 5.5,
    //     x: 0.5,
    //     z: 0,
    //     duration: 1,
    //   },
    //   "<"
    // )

    ScrollTrigger.create({
      animation: t1,
      trigger: "#trigger",
      start: "top top",
      end: "5000px", // Adjust this value to control the end of the first section
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
      },
    });

    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node as THREE.Mesh;
        const material = (node as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        if (material) {
          material.roughness = 0.4;
        }

        // Shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [modelRef.current]);

  console.log(gltf.scene);
  return (
    <mesh castShadow receiveShadow>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        position={[2, 0, 1.7]}
        rotation={[0, -1.45, 0]}
      />
    </mesh>
  );
};

const MovingLight = () => {
  const lightRef = useRef<THREE.SpotLight>(null);

  // Use the useFrame hook to update the light position on each frame
  useFrame((state, delta) => {
    if (lightRef.current) {
      // Update the light's position here
      // You can change the light's position based on time or any other parameter
      const time = state.clock.elapsedTime;
      const radius = 15;
      const xPos = radius * Math.cos(time * 0.5);
      const zPos = radius * Math.sin(time * 0.5);
      lightRef.current.position.set(xPos, 0, zPos);
    }
  });

  return <spotLight ref={lightRef} intensity={2} color="white" castShadow />;
};

const Model = () => {
  return (
    <div className="h-screen w-[80vw] relative bg-black">
      <div className="fixed w-screen z-[30] h-screen overflow-x-hidden bg-black">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} shadows>
          <ambientLight intensity={1} />

          <Environment preset="warehouse" />

          {/* <PresentationControls> */}

          <Suspense fallback={null}>
            <MovingLight />
            <MovingLight />
            <ModelComponent />
          </Suspense>

          {/* </PresentationControls> */}
        </Canvas>
      </div>
      <section
        id="trigger"
        data-scroll-section
        style={{ height: "20vh" }}
      ></section>
    </div>
  );
};

export default Model;
