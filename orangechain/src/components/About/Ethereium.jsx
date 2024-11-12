import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer } from 'three';
function Ethereium() {
    const { scene, animations } = useGLTF('/asserts/ethereum.glb');
    const mixerRef = useRef();
    const [mixer, setMixer] = useState(null);
  
    // This hook updates the animation mixer on each frame
    useFrame((state, delta) => {
      if (mixer) {
        mixer.update(delta); // Update animations
      }
    });
  
    // Set up the animation mixer for controlling animations
    useEffect(() => {
      if (animations && animations.length) {
        const _mixer = new AnimationMixer(scene); // Create mixer
        animations.forEach((clip) => {
          _mixer.clipAction(clip).play(); // Play animations
        });
        setMixer(_mixer);
      }
      return () => mixer && mixer.stopAllAction(); // Cleanup
    }, [animations, scene]);
  return (
    <primitive object={scene} scale={[2,2,2]} />
  )
}

export default Ethereium
