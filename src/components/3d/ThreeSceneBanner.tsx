import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneBannerProps {
  titlePrimary: string;
  titleSecondary: string;
  subtitle: string;
  tag?: string;
}

export const ThreeSceneBanner: React.FC<ThreeSceneBannerProps> = ({
  titlePrimary,
  titleSecondary,
  subtitle,
  tag = '৩ডি রিয়েল-টাইম কভারেজ',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xE6F0FA, 0.04);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc69a45, 3.0);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x0284c7, 2.8, 12);
    cyanLight.position.set(-3, 2, 2);
    scene.add(cyanLight);

    const group = new THREE.Group();
    scene.add(group);

    // 1. 3D Digital City Grid Terrain
    const gridHelper = new THREE.GridHelper(20, 30, 0xc69a45, 0xa0c4e2);
    gridHelper.position.y = -1.2;
    group.add(gridHelper);

    // 2. Glowing Concentric Route Rings
    const ringGeo = new THREE.RingGeometry(2.5, 2.6, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc69a45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.18;
    group.add(ringMesh);

    // 3. 3D City Nodes / Tower Pillars
    const nodeCount = 18;
    const nodeGeo = new THREE.BoxGeometry(0.35, 1.6, 0.35);
    const nodeMat = new THREE.MeshPhysicalMaterial({
      color: 0x3874a6,
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 0.8,
      emissive: 0x1b4468,
      emissiveIntensity: 0.2,
    });

    const nodesGroup = new THREE.Group();
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.2 + (i % 3) * 0.8;
      mesh.position.set(
        Math.cos(angle) * radius,
        -0.4 + (i % 4) * 0.3,
        Math.sin(angle) * radius
      );
      mesh.scale.y = 0.5 + (i % 3) * 0.7;

      // Glowing Beacon Head on top of each node
      const beaconGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xc69a45 : 0x0284c7,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.85;
      mesh.add(beacon);

      nodesGroup.add(mesh);
    }
    group.add(nodesGroup);

    // 4. Central 3D Waypoint Compass Pin
    const centerPinGroup = new THREE.Group();
    centerPinGroup.position.set(0, 0.4, 0);
    group.add(centerPinGroup);

    const pinHeadGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const pinHeadMat = new THREE.MeshPhysicalMaterial({
      color: 0xc69a45,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      emissive: 0x825816,
      emissiveIntensity: 0.4,
    });
    const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
    centerPinGroup.add(pinHead);

    const pinRingGeo = new THREE.TorusGeometry(0.85, 0.03, 16, 48);
    const pinRingMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const pinRing = new THREE.Mesh(pinRingGeo, pinRingMat);
    pinRing.rotation.x = Math.PI / 3;
    centerPinGroup.add(pinRing);

    // 5. Courier Laser Flight Path
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI * 2;
      curvePoints.push(
        new THREE.Vector3(Math.cos(t) * 3, Math.sin(t * 3) * 0.4 + 0.3, Math.sin(t) * 3)
      );
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.025, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.7,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tubeMesh);

    // Courier moving pod on the curve
    const courierGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const courierMat = new THREE.MeshBasicMaterial({ color: 0xc69a45 });
    const courier = new THREE.Mesh(courierGeo, courierMat);
    group.add(courier);

    // 6. Floating Digital Dust Particles
    const pCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = Math.random() * 4 - 1;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      group.rotation.y = t * 0.12 + mX * 0.4;
      group.rotation.x = 0.2 - mY * 0.25;

      centerPinGroup.position.y = 0.4 + Math.sin(t * 2) * 0.12;
      centerPinGroup.rotation.y = t * 0.8;
      pinRing.rotation.z = t * 1.5;

      // Courier position along curve
      const progress = (t * 0.18) % 1;
      const point = curve.getPointAt(progress);
      courier.position.copy(point);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative h-[70vh] sm:h-[80vh] min-h-[520px] w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#F0F7FF] via-[#E6F0FA] to-[#DCEDF9] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white transition-colors duration-300">
      {/* 3D WebGL Canvas Background */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#DCEDF9]/70 via-transparent to-[#F0F7FF]/70 dark:from-[#061522] dark:via-[#061522]/30 dark:to-[#061522] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(220,237,249,0.5)_85%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#061522_85%)] pointer-events-none" />

      {/* Centered Typography Floating in 3D */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4 sm:space-y-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#0B2233]/85 backdrop-blur-md border border-sky-300 dark:border-[#C69A45]/40 text-[#0284c7] dark:text-[#C69A45] text-xs font-bold uppercase tracking-widest pointer-events-auto shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#0284c7] dark:bg-[#C69A45] animate-ping" />
          <span>{tag}</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.12] font-serif drop-shadow-sm">
          {titlePrimary} <br />
          <span className="text-[#0284c7] dark:text-[#C69A45]">{titleSecondary}</span>
        </h2>

        <p className="text-base sm:text-2xl font-light text-slate-700 dark:text-[#E8E0D2]/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          {subtitle}
        </p>

        <div className="pt-2">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#0284c7] to-transparent mx-auto" />
        </div>
      </div>
    </section>
  );
};
