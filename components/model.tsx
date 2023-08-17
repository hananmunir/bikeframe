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

//initial
//{"position":[2,0,2.2]}
//{"rotation":[0,-1.8,3.469446951953614e-18]}

//second
//{"position":[-0.6,-0.7999999999999994,4.2]}
//{"rotation":[0,1.0400000000000011,3.469446951953614e-18]}

//third
//{"position":[0.49999999999999994,-0.7999999999999994,4.299999999999999]}
//{"rotation":[0,-1.64,0]}

const ModelComponent = () => {
  const gltf = useGLTF("/test2.glb");
  const modelRef: any = useRef(null);
  const { camera } = useThree();
  // const { position, rotation } = useControls("Model", {
  //   position: { value: [2, 0, 1.7], step: 0.1 },
  //   rotation: { value: [0, -1.45, 0], step: 0.01 },
  // });

  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const t1 = gsap.timeline();
    let scrollDirection = 1;

    // // Animation for the first section
    t1.to(modelRef?.current?.position, {
      x: -0.6,
      y: -0.84,
      z: 4.2,
      duration: 1,
      onStart: () => {
        gsap.to(modelRef?.current?.rotation, {
          y: 1.04,
          scrollTrigger: {
            trigger: ".trigger",
            start: "top top",
            end: "center center",
            scrub: true,
          },
        });
      },
    }).to(modelRef?.current?.position, {
      x: 0.5,
      y: -0.8,
      z: 4.3,
      duration: 1,
      onStart: () => {
        gsap.to(modelRef?.current?.rotation, {
          y: -1.64,
          scrollTrigger: {
            trigger: ".trigger",
            start: "center center",
            end: "bottom botom",
            scrub: true,
          },
        });
      },
    });

    ScrollTrigger.create({
      animation: t1,
      trigger: ".trigger",
      start: "top top",
      end: "+=6000px", // Adjust this value to control the end of the first section
      scrub: true,
      onUpdate: (self) => {
        if (self.direction > 0) {
          scrollDirection = 1;
        } else {
          scrollDirection = -1;
        }
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
        position={[2, 0, 2.2]}
        rotation={[0, -Math.PI / 2, 0]}
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
      ></section>
    </div>
  );
};

export default Model;
