'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function AbstractShapes() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshPhysicalMaterial 
            color="#f43f5e" 
            roughness={0.1} 
            metalness={0.8} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[2, 1.5, -1]} castShadow receiveShadow>
          <octahedronGeometry args={[0.6]} />
          <meshPhysicalMaterial 
            color="#fbbf24" 
            roughness={0.2} 
            metalness={0.5}
            clearcoat={0.5}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[-1.5, -1.5, 1]} castShadow receiveShadow>
          <icosahedronGeometry args={[0.7]} />
          <meshPhysicalMaterial 
            color="#3b82f6" 
            roughness={0.1} 
            metalness={0.9}
            clearcoat={1}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1}>
        <mesh position={[1.5, -1, 1.5]} castShadow receiveShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial 
            color="#10b981" 
            roughness={0.3} 
            metalness={0.4}
            clearcoat={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3DScene() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <AbstractShapes />
        </PresentationControls>

        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
