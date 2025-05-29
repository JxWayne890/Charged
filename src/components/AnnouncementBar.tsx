
import { useState, useEffect } from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-2 px-4 text-center text-sm font-medium relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"></div>
      
      {/* Lightning bolt pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transform skew-x-12 animate-glow"></div>
      </div>
      
      <div className="container mx-auto flex justify-center items-center relative z-10">
        <span className="text-primary font-bold tracking-wide electric-lime-glow animate-glow">
          ⚡ FREE SHIPPING ON ORDERS $55+ ⚡
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
