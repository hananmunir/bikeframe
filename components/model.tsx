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
        if (mesh.name === "BASE_PLATE_1") {
          material.roughness = 1;
        }
      }

      // console.log(mesh.name);
      // Shadows
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  console.log(gltf.scene);
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

  // camera.position.set(position[0], position[1], position[2]);
  // camera.rotation.set(rotation[0], rotation[1], rotation[2]);
  // if (modelRef.current)
  //   camera.lookAt(
  //     modelRef?.current?.position.x,
  //     0.4,
  //     modelRef?.current?.position.z
  //   );

  let progress = 0;
  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const t1 = gsap.timeline();

    t1.to(camera.position, {
      x: 0,
      y: 2.4,
      // z: -3.8,
      z: -3.3,
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
        y: 3,
        // z: -4.8,
        z: -5.3,
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
        y: 3.3,
        // z: -8,
        z: -8.5,
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
        // if (material) {
        //   material.transparent = true;
        //   if (progress > 0.8 && material.opacity <= 1) {
        //     material.opacity = 1 - (progress - 0.8) * 5;
        //   }
        if (material) {
          material.transparent = true;

          if (progress > 0.98) {
            material.opacity = 0;
          } else if (progress < 0.8) {
            material.opacity = 1;
          } else {
            material.opacity = 1 - (progress - 0.8) * 5;
          }
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
      position={[0, 0, -6]}
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

const Model = () => {
  return (
    <div className=" w-[80vw] h-auto relative bg-black">
      <div className="fixed right-0 w-[100%] z-[30] h-screen overflow-x-hidden bg-black">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 25,
          }}
          shadows
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 20, 0]} intensity={1} castShadow />
          <Environment preset="warehouse" />

          <Suspense fallback={null}>
            <ModelComponent />
          </Suspense>
        </Canvas>
      </div>

      <section
        className="trigger"
        data-scroll-section
        style={{ height: "1000vh" }}
      >
        <div style={{ height: "33%" }} className="trigger1"></div>
        <div style={{ height: "33%" }} className="trigger2"></div>
        <div style={{ height: "33%" }} className="trigger3"></div>
      </section>
    </div>
  );
};

export default Model;
