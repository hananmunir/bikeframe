import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { useControls } from "leva";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ModelComponent = () => {
  const gltf = useGLTF("/test2.glb");
  const modelRef = useRef(null);
  const { position, rotation } = useControls("Model", {
    position: { value: [0, 0, 0], step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.1 },
  });

  useEffect(() => {
    if (!modelRef.current) {
      return;
    }

    const t1 = gsap.timeline({});
    const scrollDirection = { value: 0 };
    const { position, rotation } = modelRef.current;

    t1.to(position, {
      z: 22,
      x: 0,
      y: 0,
      onStart: () => {
        gsap.to(rotation, {
          y: 10,
          x: 0,
          z: 0,
          duration: 1,
        });
      },
      duration: 1,
    });

    ScrollTrigger.create({
      animation: t1,
      trigger: "#trigger",
      start: "top top",
      end: `+=4000`, // Adjust this value to control the total distance of the scroll animation
      scrub: 2,

      pin: true,
      anticipatePin: true as any,
      // Check direction of scroll
      onUpdate: (self) => {
        scrollDirection.value = self.direction;
      },
    });
  }, [modelRef.current]);

  return (
    <mesh ref={modelRef}>
      <primitive
        object={gltf.scene}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </mesh>
  );
};

const Model = () => {
  return (
    <>
      <div className="h-screen w-[80vw] z-30 relative bg-black">
        <div className="fixed w-screen h-screen top-0 overflow-x-hidden  bg-black">
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Environment preset="city" />
            <PresentationControls>
              <group position={[0, -1, 0]}>
                <Suspense fallback={null}>
                  <ModelComponent />
                </Suspense>
              </group>
            </PresentationControls>
          </Canvas>
        </div>
      </div>
      <section
        className="trigger"
        data-scroll-section
        style={{ height: "50vh" }}
      ></section>
    </>
  );
};

export default Model;
