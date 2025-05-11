
import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

const AnnouncementBar = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-black text-white py-2 px-4 text-center text-sm font-medium">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-1 md:space-y-0 md:space-x-6">
        <span className="text-primary">FREE SHIPPING ON ORDERS $50+</span>
        <div className="flex items-center">
          <span className="mr-2">FLASH SALE ENDS IN:</span>
          <div className="flex items-center space-x-1 font-roboto-mono">
            <div className="timer bg-primary/20 px-1.5 py-0.5 rounded">
              {String(timeLeft.days).padStart(2, '0')}d
            </div>
            <span>:</span>
            <div className="timer bg-primary/20 px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span>:</span>
            <div className="timer bg-primary/20 px-1.5 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span>:</span>
            <div className="timer bg-primary/20 px-1.5 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
