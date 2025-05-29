
import { useState, useEffect } from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-black text-white py-2 px-4 text-center text-sm font-medium">
      <div className="container mx-auto flex justify-center items-center">
        <span className="text-primary">FREE SHIPPING ON ORDERS $55+</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
