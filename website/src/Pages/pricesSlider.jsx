import React from "react";
import { Range } from "react-range";

const PriceSlider = ({ priceRange, setPriceRange, min, max }) => {
  if (!priceRange || min == null || max == null) return null;

  const step = 10;

  // Safety: clamp values to min/max and align to step
  const clampedRange = [
    Math.max(min, Math.min(max, Math.round(priceRange[0] / step) * step)),
    Math.max(min, Math.min(max, Math.round(priceRange[1] / step) * step)),
  ];

  return (
    <div className="w-full px-2">
      <h3 className="text-sm text-gray-800 font-bold mb-2">Price</h3>
      <p className="text-gray-700 mb-3">
        ₹{clampedRange[0].toLocaleString()} – ₹{clampedRange[1].toLocaleString()}
      </p>

      <Range
        step={step}
        min={min}
        max={max}
        values={clampedRange}
        onChange={(values) => setPriceRange(values)}
        renderTrack={({ props, children }) => (
          <div {...props} className="w-[70%] h-1 bg-blue-300 rounded-md">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-md"
          />
        )}
      />
    </div>
  );
};

export default PriceSlider;
