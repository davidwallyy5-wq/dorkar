import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA SETUP
    const scene = new THREE.Scene();
    // Subtle atmospheric fog matching champagne / light cream background
    scene.fog = new THREE.FogExp2(0xFFF7E8, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 7.5);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 2.4);
    scene.add(ambientLight);

    // Primary Warm Golden Key Light
    const keyLight = new THREE.DirectionalLight(0xc69a45, 3.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Secondary Cool Blue Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    // Dynamic Cursor Reactive Point Light
    const cursorLight = new THREE.PointLight(0xc69a45, 3, 10);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // 4. HIERARCHY ROOT GROUP (Reacts to cursor tilt & floating)
    const heroWorldGroup = new THREE.Group();
    scene.add(heroWorldGroup);

    // ─── A. 3D LUXURY DELIVERY PACKAGE ───
    const boxGroup = new THREE.Group();
    heroWorldGroup.add(boxGroup);

    // Main Box Body - Warm Premium Stylized Box
    const boxGeo = new THREE.BoxGeometry(1.9, 1.5, 1.9);
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: 0x0F273B,
      roughness: 0.25,
      metalness: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxGroup.add(boxMesh);

    // Gold Ribbon Horiz
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xc69a45,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x543e15,
      emissiveIntensity: 0.2,
    });
    const ribbonHGeo = new THREE.BoxGeometry(1.92, 0.25, 1.92);
    const ribbonH = new THREE.Mesh(ribbonHGeo, ribbonMat);
    boxGroup.add(ribbonH);

    // Gold Ribbon Vert
    const ribbonVGeo = new THREE.BoxGeometry(0.25, 1.52, 1.92);
    const ribbonV = new THREE.Mesh(ribbonVGeo, ribbonMat);
    boxGroup.add(ribbonV);

    // Gold Ribbon Cross
    const ribbonCGeo = new THREE.BoxGeometry(1.92, 1.52, 0.25);
    const ribbonC = new THREE.Mesh(ribbonCGeo, ribbonMat);
    boxGroup.add(ribbonC);

    // Top Golden Seal / Knot
    const sealGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
    const sealMesh = new THREE.Mesh(sealGeo, ribbonMat);
    sealMesh.position.y = 0.78;
    boxGroup.add(sealMesh);

    // Glowing Inner Brand Emblem
    const emblemGeo = new THREE.TorusGeometry(0.22, 0.04, 16, 32);
    const emblemMat = new THREE.MeshBasicMaterial({ color: 0xffe6a3 });
    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.y = 0.83;
    boxGroup.add(emblemMesh);

    // ─── B. 3D FLOATING LOCATION PIN (HOVERING ABOVE) ───
    const pinGroup = new THREE.Group();
    pinGroup.position.set(1.4, 1.8, 0.5);
    heroWorldGroup.add(pinGroup);

    // Pin Head (Sphere)
    const pinHeadGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const pinMat = new THREE.MeshPhysicalMaterial({
      color: 0xc69a45,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      emissive: 0x6e4e16,
      emissiveIntensity: 0.3,
    });
    const pinHead = new THREE.Mesh(pinHeadGeo, pinMat);
    pinHead.position.y = 0.5;
    pinGroup.add(pinHead);

    // Pin Cone Tip
    const pinConeGeo = new THREE.ConeGeometry(0.4, 0.7, 32);
    const pinCone = new THREE.Mesh(pinConeGeo, pinMat);
    pinCone.rotation.x = Math.PI;
    pinCone.position.y = 0.15;
    pinGroup.add(pinCone);

    // Inner glowing sphere inside pin
    const pinCoreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pinCoreMat = new THREE.MeshBasicMaterial({ color: 0xfff7d6 });
    const pinCore = new THREE.Mesh(pinCoreGeo, pinCoreMat);
    pinCore.position.y = 0.5;
    pinGroup.add(pinCore);

    // ─── C. 3D HOLOGRAPHIC RADAR RINGS & ORBITS ───
    const radarGroup = new THREE.Group();
    radarGroup.position.set(0, -1.1, 0);
    heroWorldGroup.add(radarGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xc69a45,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ringGeo1 = new THREE.RingGeometry(1.8, 2.4, 32);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    radarGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x4895d9,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const ringGeo2 = new THREE.RingGeometry(2.8, 3.4, 48);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    radarGroup.add(ring2);

    // Floating Compass Waypoint Ring around Box
    const orbitalRingGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 64);
    const orbitalRingMat = new THREE.MeshBasicMaterial({
      color: 0xc69a45,
      transparent: true,
      opacity: 0.45,
    });
    const orbitalRing = new THREE.Mesh(orbitalRingGeo, orbitalRingMat);
    orbitalRing.rotation.x = 1.1;
    heroWorldGroup.add(orbitalRing);

    // ─── D. 3D FLOATING COMPASS & DELIVERY GLYPHS ───
    const satelliteGroup = new THREE.Group();
    satelliteGroup.position.set(-1.8, 1.2, -0.6);
    heroWorldGroup.add(satelliteGroup);

    // Floating Capsule / Fast Scooter Pod Indicator
    const podGeo = new THREE.CapsuleGeometry(0.22, 0.6, 16, 32);
    const podMat = new THREE.MeshPhysicalMaterial({
      color: 0x173a5a,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.8,
    });
    const podMesh = new THREE.Mesh(podGeo, podMat);
    podMesh.rotation.z = Math.PI / 4;
    satelliteGroup.add(podMesh);

    // Pod glowing headlight
    const podLightGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const podLightMat = new THREE.MeshBasicMaterial({ color: 0x64d2ff });
    const podLight = new THREE.Mesh(podLightGeo, podLightMat);
    podLight.position.set(0.3, 0.3, 0);
    satelliteGroup.add(podLight);

    // ─── E. 3D GOLDEN STARDUST / ATMOSPHERIC PARTICLES ───
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 14;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;
      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material
    const particleMat = new THREE.PointsMaterial({
      color: 0xc69a45,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. CURSOR EVENT LISTENERS (SMOOTH PARALLAX)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      isInteractingRef.current = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      isInteractingRef.current = false;
    };

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.targetX = x * 0.7;
        mouseRef.current.targetY = y * 0.7;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. ANIMATION LOOP
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerping for cursor reaction
      const lerpFactor = 0.05;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpFactor;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Rotate and tilt the main Hero 3D world group
      heroWorldGroup.rotation.y = mX * 0.65 + Math.sin(elapsedTime * 0.4) * 0.15;
      heroWorldGroup.rotation.x = -mY * 0.45 + Math.cos(elapsedTime * 0.3) * 0.08;
      heroWorldGroup.position.x = mX * 0.6;
      heroWorldGroup.position.y = mY * 0.3 + Math.sin(elapsedTime * 1.2) * 0.12;

      // Update Cursor Dynamic Light
      cursorLight.position.x = mX * 4;
      cursorLight.position.y = mY * 3;

      // Floating Package Hovering Physics
      boxGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
      boxGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;

      // Pin floating & bouncing
      pinGroup.position.y = 1.8 + Math.sin(elapsedTime * 2.2) * 0.15;
      pinGroup.rotation.y = elapsedTime * 1.2;

      // Radar Ring Animations
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.25;
      orbitalRing.rotation.z = elapsedTime * 0.3;

      // Satellite Pod Orbital Rotation
      satelliteGroup.position.x = Math.sin(elapsedTime * 0.8) * 2.2;
      satelliteGroup.position.z = Math.cos(elapsedTime * 0.8) * 1.5;
      satelliteGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.8) * 0.25;
      satelliteGroup.rotation.y = -elapsedTime * 0.8;

      // Particle Floating Physics
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      ribbonMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-1 overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    />
  );
};
