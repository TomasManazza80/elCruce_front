import React from 'react';
import logoCruce from '../../pages/images/LOGOCRUCE.png';

export default function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] bg-transparent flex flex-col items-center justify-center min-h-screen pointer-events-none"
    : "flex flex-col items-center justify-center p-10 w-full h-full min-h-[300px] bg-transparent";

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing glow effect behind logo */}
        <div className="absolute inset-0 bg-[#b91c1c] rounded-full blur-[40px] opacity-20 animate-pulse"></div>
        
        {/* Logo with pulsing animation */}
        <img
          src={logoCruce}
          alt="Cargando..."
          className="h-20 md:h-24 w-auto object-contain animate-pulse relative z-10"
        />
      </div>
    </div>
  );
}
