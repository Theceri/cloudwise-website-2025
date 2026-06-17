'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Soft round sprite for points */
function makeDotTexture() {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function fibonacciSphere(count, radius) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const jitter = 0.82 + Math.random() * 0.3;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r,
        y,
        Math.sin(theta) * r
      ).multiplyScalar(radius * jitter)
    );
  }
  return pts;
}

function Cloud({ count = 1100, radius = 2.6 }) {
  const points = useRef();
  const lines = useRef();
  const group = useRef();
  const dotTex = useMemo(() => makeDotTexture(), []);

  const { positions, colors, linePositions } = useMemo(() => {
    const verts = fibonacciSphere(count, radius);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ember = new THREE.Color('#FF3F1A');
    const ice = new THREE.Color('#97D6DF');
    const white = new THREE.Color('#ffffff');

    verts.forEach((v, i) => {
      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
      // blend color by vertical position + a little randomness
      const t = (v.y / radius + 1) / 2;
      const base = ice.clone().lerp(ember, 1 - t);
      base.lerp(white, Math.random() * 0.25);
      col[i * 3] = base.r;
      col[i * 3 + 1] = base.g;
      col[i * 3 + 2] = base.b;
    });

    // Precompute a sparse set of connection lines between nearby points
    const segs = [];
    const maxLinks = 520;
    let made = 0;
    for (let i = 0; i < count && made < maxLinks; i += 3) {
      const a = verts[i];
      for (let j = i + 1; j < Math.min(i + 26, count); j++) {
        if (made >= maxLinks) break;
        const b = verts[j];
        if (a.distanceTo(b) < radius * 0.42) {
          segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
          made++;
        }
      }
    }
    return { positions: pos, colors: col, linePositions: new Float32Array(segs) };
  }, [count, radius]);

  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    // gentle parallax toward pointer
    const targetX = pointer.y * 0.25;
    const targetY = group.current.rotation.y; // keep spin
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.position.x += (pointer.x * 0.35 - group.current.position.x) * 0.04;
    if (points.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
      points.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          map={dotTex}
          vertexColors
          transparent
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          opacity={0.95}
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#97D6DF"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {/* faint inner structure */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.96, 1]} />
        <meshBasicMaterial color="#FF3F1A" wireframe transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

export default function CloudField({ density = 1 }) {
  const count = Math.round(1100 * density);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Cloud count={count} />
    </Canvas>
  );
}
