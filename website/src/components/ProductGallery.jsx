import { useSwipeable } from "react-swipeable";
import { useState, useMemo, useEffect } from "react";

export default function ProductGallery({ product, baseUrl }) {

    /* ---------------- IMAGES ---------------- */
    const images1 = useMemo(() => {
        const rawImages = [
            // product?.item_image,
            product?.images?.[0]?.main_image,
            product?.images?.[0]?.front_image,
            product?.images?.[0]?.left_image,
            product?.images?.[0]?.right_image,
            product?.images?.[0]?.back_image,
        ];

        return rawImages
            .filter((img) => typeof img === "string" && img.trim() !== "")
            .map((img) =>
                img.startsWith("data:") ? img : `${baseUrl}${img}`
            );
    }, [product, baseUrl]);

    /* ---------------- IMAGES ---------------- */
    const images = useMemo(() => {
        const primaryImage =
            product?.images?.[0]?.main_image || product?.item_image;

        const rawImages = [
            primaryImage,
            product?.images?.[0]?.front_image,
            product?.images?.[0]?.left_image,
            product?.images?.[0]?.right_image,
            product?.images?.[0]?.back_image,
        ];

        return rawImages
            .filter((img) => typeof img === "string" && img.trim() !== "")
            .map((img) =>
                img.startsWith("data:") ? img : `${baseUrl}${img}`
            );
    }, [product, baseUrl]);


    /* ---------------- STATES ---------------- */
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [fullscreen, setFullscreen] = useState(false);
    const [modalZoom, setModalZoom] = useState(1);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [moved, setMoved] = useState(false);


    /* ---------------- ESC CLOSE ---------------- */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setFullscreen(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);
    const toggleZoom = () => {
        setModalZoom((z) => (z === 1 ? 2 : 1));
        if (modalZoom > 1) {
            setOffset({ x: 0, y: 0 }); // reset pan when zooming out
        }
    };
    const clampOffset = (value, limit) => {
        return Math.max(-limit, Math.min(limit, value));
    };

    /* ---------------- SWIPE ---------------- */
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (fullscreen || modalZoom > 1) return;
            setActiveIndex((i) => (i + 1) % images.length);
        },
        onSwipedRight: () => {
            if (fullscreen || modalZoom > 1) return;
            setActiveIndex((i) => (i - 1 + images.length) % images.length);
        },
        trackMouse: true,
    });


    if (!images.length) return null;

    return (
        <div className="flex flex-col items-center">

            {/* ================= MAIN IMAGE ================= */}
            <div
                {...swipeHandlers}
                className="relative w-[230px] max-h-[450px] rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in"
                onClick={() => {
                    setModalZoom(1);
                    setOffset({ x: 0, y: 0 });
                    setFullscreen(true);
                }}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setPos({ x, y });
                }}
            >
                <img
                    src={images[activeIndex]}
                    alt="Product"
                    className="max-w-full max-h-[450px] object-contain transition-transform duration-200"
                    style={{
                        transform: zoom ? "scale(1.5)" : "scale(1)",
                        transformOrigin: `${pos.x}% ${pos.y}%`,
                    }}
                />

                {!zoom && (
                    <div
                    // className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded"
                    >
                    </div>
                )}
            </div>


            {/* ================= THUMBNAILS ================= */}
            <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`
        w-[64px] h-[64px] rounded-lg cursor-pointer
        border flex items-center justify-center overflow-hidden
        transition-all
        ${index === activeIndex
                                ? "ring-2 ring-red-500 scale-105 border-red-400"
                                : "opacity-70 hover:opacity-100"
                            }
      `}
                    >
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* ================= FULLSCREEN MODAL ================= */}
            {fullscreen && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
                    onClick={() => setFullscreen(false)}
                >
                    <div
                        className="bg-white rounded-xl w-[95vw] h-[92vh] flex gap-4 p-4 relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >


                        {/* ❌ CLOSE */}
                        <button
                            onClick={() => setFullscreen(false)}
                            className="absolute top-3 left-4 text-3xl text-red-600 hover:text-black z-20"
                        >
                            ✕
                        </button>

                        {/* 🖼️ BIG IMAGE */}
                        <div
                            className={`flex-1 flex items-center justify-center overflow-hidden 
  ${modalZoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                            style={{ touchAction: "none" }}

                            onMouseDown={(e) => {
                                if (modalZoom <= 1) return;
                                setDragging(true);
                                setMoved(false);

                                setStart({
                                    x: e.clientX - offset.x,
                                    y: e.clientY - offset.y,
                                });
                            }}

                            onMouseMove={(e) => {
                                if (!dragging) return;

                                const container = e.currentTarget.getBoundingClientRect();

                                const maxX = ((modalZoom - 1) * container.width) / 2;
                                const maxY = ((modalZoom - 1) * container.height) / 2;

                                const nextX = e.clientX - start.x;
                                const nextY = e.clientY - start.y;

                                setMoved(true);

                                setOffset({
                                    x: clampOffset(nextX, maxX),
                                    y: clampOffset(nextY, maxY),
                                });
                            }}

                            onMouseUp={() => {
                                setDragging(false);
                            }}

                            onMouseLeave={() => {
                                setDragging(false);
                            }}

                            onClick={() => {
                                if (moved) return;     // ✅ do NOT zoom if user dragged
                                toggleZoom();         // ✅ only zoom on real click
                            }}

                            onWheel={(e) => {
                                e.preventDefault();
                                if (e.deltaY < 0) {
                                    setModalZoom((z) => Math.min(z + 0.15, 4));
                                } else {
                                    setModalZoom((z) => Math.max(z - 0.15, 1));
                                    if (modalZoom <= 1.2) setOffset({ x: 0, y: 0 });
                                }
                            }}
                        >

                            <img
                                src={images[activeIndex]}
                                draggable={false}
                                className="h-full max-h-[85vh] w-auto object-contain transition-transform duration-100"
                                style={{
                                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${modalZoom})`,
                                }}
                            />
                        </div>

                        {/* 🔍 ZOOM BUTTON COLUMN (AMAZON STYLE) */}
                        <div className="flex flex-col gap-3 items-center justify-center w-[60px]">

                            <button
                                onClick={() => setModalZoom((z) => Math.min(z + 0.2, 4))}
                                className="w-10 h-10 rounded-full border bg-white shadow hover:bg-gray-100 text-xl font-bold"
                            >
                                +
                            </button>

                            <button
                                onClick={() => setModalZoom((z) => Math.max(z - 0.2, 1))}
                                className="w-10 h-10 rounded-full border bg-white shadow hover:bg-gray-100 text-xl font-bold"
                            >
                                −
                            </button>

                        </div>

                        {/* 👉 RIGHT THUMBNAILS */}
                        <div className="w-[180px] h-full max-h-[85vh] flex flex-col border-l">

                            {/* 🏷️ PRODUCT NAME */}
                            <div className="px-3 py-2 border-b bg-white sticky top-0 z-10">
                                <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                                    {product?.item_name}
                                </p>
                            </div>

                            {/* 📷 THUMBNAILS LIST */}
                            <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-2">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-full h-[80px] object-contain bg-white rounded cursor-pointer border p-1 transition
          ${index === activeIndex
                                                ? "ring-2 ring-red-500"
                                                : "opacity-70 hover:opacity-100"
                                            }`}
                                    />
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
