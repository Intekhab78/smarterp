import { useState } from "react";

const ImageZoom = ({ src, alt }) => {
  const [bgPos, setBgPos] = useState("50% 50%");

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setBgPos(`${x}% ${y}%`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setBgPos("50% 50%")}
      className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "180%",
        backgroundPosition: bgPos,
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-[75%] h-[240px] object-contain mx-auto mt-20 block pointer-events-none"
      />
    </div>
  );
};

export default ImageZoom;
