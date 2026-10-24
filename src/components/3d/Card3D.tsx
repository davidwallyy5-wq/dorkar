import React, { useRef, useState } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees of tilt
  scaleOnHover?: number;
  glareOpacity?: number;
  glareColor?: string;
  onClick?: () => void;
  id?: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 10,
  scaleOnHover = 1.02,
  glareOpacity = 0.25,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Invert X for natural tilt
    const rX = mouseY * -maxTilt * 2;
    const rY = mouseX * maxTilt * 2;

    setRotateX(rX);
    setRotateY(rY);

    // Glare position in %
    const glareX = ((e.clientX - rect.left) / width) * 100;
    const glareY = ((e.clientY - rect.top) / height) * 100;
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out preserve-3d cursor-pointer select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        willChange: 'transform',
      }}
    >
      {/* 3D Content Container */}
      <div className="w-full h-full preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>

      {/* Dynamic 3D Glare / Light Reflection Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden transition-opacity duration-300 z-30"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glareColor} 0%, transparent 80%)`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};
