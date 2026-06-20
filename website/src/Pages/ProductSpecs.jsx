// import React from "react";
import React, { useRef } from "react";

// department id → department name
const DEPARTMENT_MAP = {
    26: "QURAN BOX",
    25: "BOOK",
    24: "TASBIH",
    23: "ATTAR",
    22: "TOPI",
    21: "PRAYER MAT",
};

const PRODUCT_SPECS = {
    /* ---------------- BOOK (UNCHANGED) ---------------- */
    // BOOK: (p) => [
    //     { label: "Pages", value: p.volume ? `${parseInt(p.volume)}` : null, icon: "📘" },
    //     { label: "Language", value: p.itemdesc4 || null, icon: "🌐" },
    //     { label: "Publisher", value: p.itemdesc3 || null, icon: "🏢" },
    //     {
    //         label: "Publication date",
    //         value: p.itmdt2
    //             ? new Date(p.itmdt2).toLocaleDateString("en-IN", {
    //                 year: "numeric",
    //                 month: "long",
    //                 day: "numeric",
    //             })
    //             : null,
    //         icon: "📅",
    //     },
    //     { label: "Dimensions", value: p.note3 || null, icon: "📐" },
    // ],
    /* ---------------- BOOK (UPDATED with AUTHOR) ---------------- */
    BOOK: (p) => [
        { label: "Author", value: p.itemdesclong || null, icon: "✍️" }, // ✅ NEW FIELD

        { label: "Pages", value: p.note1 ? `${parseInt(p.note1)}` : null, icon: "📘" },
        { label: "Language", value: p.itemdesc4 || null, icon: "🌐" },
        { label: "Publisher", value: p.itemdesc3 || null, icon: "🏢" },
        {
            label: "Publication date",
            value: p.itmdt2
                ? new Date(p.itmdt2).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : null,
            icon: "📅",
        },
        { label: "Dimensions", value: p.note3 || null, icon: "📐" },
    ],

    /* ---------------- QURAN BOX ---------------- */
    "QURAN BOX": (p) => [
        { label: "Capacity", value: p.volume || null, icon: "📦" },
        { label: "Material", value: p.itemdesc3 || null, icon: "🪵" },
        { label: "Finish Type", value: p.itemdesc4 || null, icon: "✨" },
        { label: "Box Type", value: p.note2 || null, icon: "🗃️" },
    ],

    /* ---------------- TASBIH ---------------- */
    TASBIH: (p) => [
        { label: "Bead Count", value: p.volume || null, icon: "🔢" },
        { label: "Material", value: p.itemdesc3 || null, icon: "🪵" },
        { label: "Design Type", value: p.itemdesc4 || null, icon: "🎨" },
        { label: "String Type", value: p.note2 || null, icon: "🧵" },
    ],

    /* ---------------- ATTAR ---------------- */
    ATTAR: (p) => [
        { label: "Bottle Size", value: p.volume || null, icon: "🧴" },
        { label: "Blend Type", value: p.itemdesc3 || null, icon: "🧪" },
        { label: "Fragrance Notes", value: p.itemdesc4 || null, icon: "🌸" },
        { label: "Longevity", value: p.note2 || null, icon: "⏳" },
    ],

    /* ---------------- TOPI ---------------- */
    TOPI: (p) => [
        { label: "Pack Quantity", value: p.volume || null, icon: "📦" },
        { label: "Fabric Type", value: p.itemdesc3 || null, icon: "🧵" },
        { label: "Style Type", value: p.itemdesc4 || null, icon: "✨" },
        { label: "Fit Type", value: p.note2 || null, icon: "👒" },
    ],

    /* ---------------- PRAYER MAT ---------------- */
    "PRAYER MAT": (p) => [
        { label: "Thickness / Size", value: p.volume || null, icon: "📏" },
        { label: "Material", value: p.itemdesc3 || null, icon: "🧶" },
        { label: "Pattern Type", value: p.itemdesc4 || null, icon: "🪡" },
        { label: "Foldable", value: p.note2 || null, icon: "🎒" },
    ],
};


const ProductSpecs = ({ product }) => {
    if (!product) return null;
    const safeCheck = (val) => {
        if (val === null || val === undefined) return false;

        // convert everything to clean string
        const clean = String(val).trim().toLowerCase();

        if (
            clean === "" ||
            clean === "null" ||
            clean === "none" ||
            clean === "undefined" ||
            clean === "0" ||
            clean === "0.00" ||
            clean === "nan"
        ) {
            return false;
        }

        return true;
    };


    const deptId = Number(product.departname);
    const deptName = DEPARTMENT_MAP[deptId];

    console.log("Dept ID:", deptId);
    console.log("Dept Name:", deptName);

    const specBuilder = PRODUCT_SPECS[deptName];

    if (!specBuilder) return null;

    const seen = new Set();

    const specs = specBuilder(product).filter((s) => {
        if (!safeCheck(s.value)) return false;

        const normalized = String(s.value).toLowerCase().trim();
        if (seen.has(normalized)) return false; // hide duplicate value

        seen.add(normalized);
        return true;
    });
    if (specs.length === 0) return null;

    const gridCols = `grid-cols-${Math.min(specs.length, 5)}`;
    const scrollRef = useRef(null);

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
    };

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" });
    };

    return (
        <>
            {/* WRAPPER */}
            <div className="relative">

                {/* GRID AREA — 3 ITEMS PER ROW */}
                <div
                    className="
          grid grid-cols-3 gap-6
          my-6 border-t-2 border-gray-300 pt-6
        "
                >
                    {specs.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="text-sm font-semibold text-gray-900">
                                {item.label}
                            </span>

                            <div className="text-2xl mb-1">
                                {item.icon}
                            </div>

                            <span className="font-semibold text-xs
                             ">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );

};

export default ProductSpecs;
