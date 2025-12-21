'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    vec2 mouse = u_mouse / u_resolution;

    float dist = distance(st, mouse);
    float wave = sin(dist * 10.0 - u_time * 2.0) * 0.1;

    vec3 color1 = vec3(0.8, 0.5, 1.0); // purple/pink
    vec3 color2 = vec3(0.5, 1.0, 0.8); // mint green
    vec3 color3 = vec3(0.4, 0.8, 1.0); // light blue
    vec3 color4 = vec3(1.0, 0.9, 0.5); // soft yellow

    float mix1 = sin(u_time + st.x * 3.0) * 0.5 + 0.5;
    float mix2 = cos(u_time + st.y * 3.0) * 0.5 + 0.5;

    vec3 color = mix(color1, color2, mix1);
    color = mix(color, color3, mix2);
    color = mix(color, color4, sin(u_time * 0.5 + st.x * st.y * 5.0) * 0.5 + 0.5);

    color += wave;

    gl_FragColor = vec4(color, 0.3);
  }
`;

function FluidPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0, 0) },
    u_resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), [viewport]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.u_time.value = state.clock.elapsedTime;
      uniforms.u_mouse.value.set(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FluidPlane />
      </Canvas>
    </div>
  );
}