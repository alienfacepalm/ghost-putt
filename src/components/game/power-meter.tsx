import React, { useState, useEffect } from 'react';

interface PowerMeterProps {
  onPowerSelected: (power: number) => void;
  isActive: boolean;
}

export function PowerMeter({ onPowerSelected, isActive }: PowerMeterProps) {
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPower(0);
      setIsCharging(false);
      return;
    }

    let animationFrame: number;
    let startTime: number;

    const charge = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newPower = Math.min((elapsed / 2000) * 100, 100); // 2 seconds to max
      setPower(newPower);

      if (newPower < 100) {
        animationFrame = requestAnimationFrame(charge);
      }
    };

    if (isCharging) {
      animationFrame = requestAnimationFrame(charge);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, isCharging]);

  const handleMouseDown = () => {
    if (isActive) {
      setIsCharging(true);
      setPower(0);
    }
  };

  const handleMouseUp = () => {
    if (isCharging) {
      setIsCharging(false);
      onPowerSelected(power / 100);
      setPower(0);
    }
  };

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-2">Power</div>
      <div
        className="h-8 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
          style={{ width: `${power}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
          {Math.round(power)}%
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {isCharging ? 'Hold to charge, release to shoot' : 'Click and hold to charge power'}
      </p>
    </div>
  );
}

