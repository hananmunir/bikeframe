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
  const gltf: any = useGLTF("/test2.glb");
  const modelRef: any = useRef(null);
  const { camera } = useThree();
  gltf.scene.traverse((node: any) => {
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

  const { position, rotation } = useControls("Camera", {
    position: {
      value: [0, 0, 5],
      step: 0.1,
    },
    rotation: {
      value: [0, 0, 0],
      step: 0.1,
    },
  });

  camera.position.set(position[0], position[1], position[2]);
  camera.rotation.set(rotation[0], rotation[1], rotation[2]);
  if (modelRef.current)
    camera.lookAt(
      modelRef?.current?.position.x,
      0.4,
      modelRef?.current?.position.z
    );

  let progress = 0;
  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const t1 = gsap.timeline();

    t1.to(camera.position, {
      x: 0,
      y: 1.7,
      z: -3.8,
      duration: 1,
      onUpdate: () => {
        camera.lookAt(
          modelRef.current.position.x,
          0.4,
          modelRef.current.position.z
        );
      },
    })
      .to(camera.position, {
        x: -1.5,
        y: 2,
        z: -4.8,
        duration: 1,
        onUpdate: () => {
          camera.lookAt(
            modelRef.current.position.x,
            0.4,
            modelRef.current.position.z
          );
        },
      })
      .to(camera.position, {
        x: -0.6,
        y: 2.3,
        z: -8,
        delay: 0.2,
        duration: 1,
        onUpdate: () => {
          camera.lookAt(
            modelRef.current.position.x,
            0.4,
            modelRef.current.position.z
          );
        },
      })

      .to(camera.position, {
        z: -20,
        delay: 0.1,
        onUpdate: () => {
          camera.lookAt(
            modelRef.current.position.x,
            0.4,
            modelRef.current.position.z
          );
        },
      });

    ScrollTrigger.create({
      animation: t1,
      trigger: ".trigger",
      start: "top top",
      end: "+=6000px", // Adjust this value to control the end of the first section
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
      },
    });
  }, [modelRef.current]);

  useFrame((delta) => {
    gltf.scene.traverse((node: any) => {
      if (node instanceof THREE.Mesh) {
        const mesh = node as THREE.Mesh;
        const material = (node as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        if (material) {
          material.transparent = true;
          if (progress > 0.8 && material.opacity <= 1)
            material.opacity = 1 - (progress - 0.8) * 5;
        }
      }
    });
  });

  useEffect(() => {
    if (modelRef.current)
      camera.lookAt(
        modelRef.current.position.x,
        0.4,
        modelRef.current.position.z
      );
  }, []);

  // Set material properties for transparency

  return (
    <mesh
      position={[0, 0, -5.5]}
      rotation={[0, -Math.PI / 2, 0]}
      ref={modelRef}
      castShadow
      receiveShadow
      material-opacity={0}
    >
      <primitive object={gltf.scene} />
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

  return <spotLight ref={lightRef} intensity={2} color='white' castShadow />;
};

const Model = () => {
  return (
    <div className=' w-[80vw] h-auto relative bg-black'>
      <div className='fixed right-0 w-[70%] z-[30] h-screen overflow-x-hidden bg-black'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 25,
          }}
          shadows
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={1} castShadow />
          <Environment preset='sunset' />
          <pointLight position={[0, 0, 0]} intensity={1} />
          <pointLight position={[0, 0, 10]} intensity={1} />

          {/* <PresentationControls> */}

          <Suspense fallback={null}>
            <ModelComponent />
          </Suspense>

          {/* </PresentationControls> */}
        </Canvas>
      </div>

      <section
        className='trigger'
        data-scroll-section
        style={{ height: "1000vh" }}
      >
        <div style={{ height: "33%" }} className='trigger1'></div>
        <div style={{ height: "33%" }} className='trigger2'></div>
        <div style={{ height: "33%" }} className='trigger3'></div>
      </section>
    </div>
  );
};

export default Model;
