import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Step3DCanvasProps {
  stepIndex: number; // 0: List/Cart, 1: Store/Quality, 2: Doorstep/Fast
}

export const Step3DCanvas: React.FC<Step3DCanvasProps> = ({ stepIndex }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x20354b, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc69a45, 3.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);

    if (stepIndex === 0) {
      // Step 1: 3D Shopping Cart & Order Note Pad
      const cartMat = new THREE.MeshPhysicalMaterial({
        color: 0xc69a45,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.8,
      });

      // Basket Wireframe/Torus
      const torusGeo = new THREE.TorusGeometry(0.8, 0.08, 16, 32);
      const torus = new THREE.Mesh(torusGeo, cartMat);
      group.add(torus);

      const centerBallGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const centerBall = new THREE.Mesh(centerBallGeo, cartMat);
      group.add(centerBall);

      // Orbiting particles
      const ringGeo = new THREE.RingGeometry(1.2, 1.25, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4895d9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);
    } else if (stepIndex === 1) {
      // Step 2: 3D Verified Store Shield & Quality Diamond
      const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x14344d,
        metalness: 0.6,
        roughness: 0.15,
        clearcoat: 1.0,
      });
      const goldMat = new THREE.MeshPhysicalMaterial({
        color: 0xc69a45,
        metalness: 0.9,
        roughness: 0.1,
      });

      const octaGeo = new THREE.OctahedronGeometry(0.9, 0);
      const octa = new THREE.Mesh(octaGeo, shieldMat);
      group.add(octa);

      const innerTorusGeo = new THREE.TorusGeometry(0.55, 0.06, 16, 32);
      const innerTorus = new THREE.Mesh(innerTorusGeo, goldMat);
      group.add(innerTorus);
    } else {
      // Step 3: 3D Delivery Rocket/Compass Fast Arrow
      const arrowMat = new THREE.MeshPhysicalMaterial({
        color: 0xc69a45,
        metalness: 0.85,
        roughness: 0.15,
        clearcoat: 1.0,
      });

      const coneGeo = new THREE.ConeGeometry(0.65, 1.4, 32);
      const cone = new THREE.Mesh(coneGeo, arrowMat);
      cone.rotation.z = -Math.PI / 4;
      group.add(cone);

      const ringGeo = new THREE.TorusGeometry(1.0, 0.04, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x64d2ff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      group.add(ring);
    }

    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.8;
      group.rotation.x = Math.sin(t * 0.6) * 0.2;
      group.position.y = Math.sin(t * 1.5) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [stepIndex]);

  return <div ref={mountRef} className="w-full h-32 sm:h-36 overflow-hidden pointer-events-none" />;
};
