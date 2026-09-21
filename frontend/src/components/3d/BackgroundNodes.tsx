import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const BackgroundNodes: React.FC = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group}>
      {[...Array(20)].map((_, i) => (
        <Sphere 
          key={i} 
          args={[0.2, 16, 16]} 
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10 - 5
          ]}
        >
          <MeshDistortMaterial 
            color="#3b82f6" 
            attach="material" 
            distort={0.4} 
            speed={2} 
            transparent 
            opacity={0.6}
            wireframe
          />
        </Sphere>
      ))}
    </group>
  );
};

export default BackgroundNodes;
