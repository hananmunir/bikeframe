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

  let progress = 0;
  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const t1 = gsap.timeline();

    // // Animation for the first section
    t1.to(modelRef?.current?.position, {
      x: -0.8,
      y: -0.8,
      z: 4,
      duration: 1,
      ease: "power.easeInOut",
      onStart: () => {
        const firstAnimConfig = {
          trigger: ".trigger1",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        };
        gsap.to(modelRef?.current?.rotation, {
          y: 1.04,
          ease: "power.easeInOut",
          delay: 0.5,
          scrollTrigger: firstAnimConfig,
        });
        gsap.to(camera.position, {
          y: 0.4,
          z: 4.8,
          ease: "power.easeInOut",
          delay: 1,
          scrollTrigger: firstAnimConfig,
        });
        gsap.to(camera.rotation, {
          z: 0.2,
          x: -0.4,
          ease: "power.easeInOut",
          delay: 1,
          scrollTrigger: firstAnimConfig,
        });
      },
    })
      .to(modelRef?.current?.position, {
        x: 0.9,
        y: -0.8,
        z: 4,
        duration: 1,
        ease: "power.easeInOut",
        onStart: () => {
          const secondAnimConfig = {
            trigger: ".trigger2",
            start: "top top",
            end: "bottom botom",
            scrub: true,
          };
          gsap.to(modelRef?.current?.rotation, {
            y: -1.64,
            ease: "power.easeInOut",
            scrollTrigger: secondAnimConfig,
          });
          gsap.to(camera.position, {
            y: 0,
            z: 5,
            ease: "power.easeInOut",
            delay: 1,
            scrollTrigger: secondAnimConfig,
          });
          gsap.to(camera.rotation, {
            z: 0,
            x: 0,
            ease: "power.easeInOut",
            delay: 1,
            scrollTrigger: secondAnimConfig,
          });
        },
      })
      .to(modelRef?.current?.position, {
        z: 0,
        x: 5,
        ease: "power.easeInOut",
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
          if (progress > 0.78) material.opacity = 1 - (progress - 0.78) * 5;
        }
      }
    });
  });

  // Set material properties for transparency

  return (
    <mesh
      position={[2, 0, 2.2]}
      rotation={[0, -Math.PI / 2, 0]}
      // position={position}
      // rotation={rotation}
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
      <div className='fixed w-screen z-[30] h-screen overflow-x-hidden bg-black'>
        <Canvas shadows>
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
