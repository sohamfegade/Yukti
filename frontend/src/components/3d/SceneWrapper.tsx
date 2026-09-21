import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';

interface SceneWrapperProps {
  children: React.ReactNode;
  controls?: boolean;
}

const SceneWrapper: React.FC<SceneWrapperProps> = ({ children, controls = false }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-slate-950">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <color attach="background" args={['#020617']} /> {/* slate-950 */}
        <fog attach="fog" args={['#020617', 5, 25]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 5]} intensity={1.5} color="#e2e8f0" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
        
        {children}
        
        {controls && (
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            minDistance={2}
            maxDistance={20}
            maxPolarAngle={Math.PI / 1.5} // Don't let them go fully under the floor
          />
        )}
      </Canvas>
    </div>
  );
};

export default SceneWrapper;
