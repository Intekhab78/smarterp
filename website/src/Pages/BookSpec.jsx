// import React from "react";

// const BookSpecs = ({ product }) => {
//   if (!product) return null;

//   // Helper: remove empty/null/undefined/"null"/"undefined"
//   const safeCheck = (val) =>
//     val !== null && val !== undefined && val !== "" && val !== "null" && val !== "undefined";

//   const specs = [
//     {
//       label: "Print length",
// value: product.volume ? `${parseInt(product.volume)} pages` : null,
//       icon: (
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="2" width="18" height="20" rx="2" />
//           <line x1="7" y1="6" x2="17" y2="6" />
//           <line x1="7" y1="10" x2="17" y2="10" />
//           <line x1="7" y1="14" x2="12" y2="14" />
//         </svg>
//       ),
//     },
//     {
//       label: "Language",
//       value: product.itemdesc4,
//       icon: (
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M2 12h20" />
//           <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//         </svg>
//       ),
//     },
//     {
//       label: "Publisher",
//       value: product.itemdesc3,
//       icon: (
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M3 21h18" />
//           <path d="M6 21V8l6-3 6 3v13" />
//           <rect x="9" y="13" width="6" height="8" rx="1" />
//         </svg>
//       ),
//     },
//     {
//       label: "Publication date",
//       value: product.itmdt2

//         ? new Date(product.itmdt2
//         ).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//         : null,
//       icon: (
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="4" width="18" height="18" rx="2" />
//           <line x1="16" y1="2" x2="16" y2="6" />
//           <line x1="8" y1="2" x2="8" y2="6" />
//           <line x1="3" y1="10" x2="21" y2="10" />
//         </svg>
//       ),
//     },
//     {
//       label: "Dimensions",
//       value: product.note3,
//       icon: (
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="3" width="18" height="18" rx="2" />
//           <path d="M3 9h18" />
//           <path d="M9 3v18" />
//         </svg>
//       ),
//     },
//   ];

//   const filteredSpecs = specs.filter(spec => safeCheck(spec.value));

//   if (filteredSpecs.length === 0) return null;

//   const gridCols = `grid-cols-${Math.min(filteredSpecs.length, 5)}`;

//   return (
//     <div className={`grid ${gridCols} gap-8 my-6 border-t-2 border-gray-300 pt-6`}>
//       {filteredSpecs.map((item, index) => (
//         <div key={index} className="flex flex-col items-center text-center">
//           <span className="text-sm text-gray-500">{item.label}</span>
//           <div className="text-gray-700 mb-2">{item.icon}</div>
//           <span className="font-semibold text-gray-900">{item.value}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BookSpecs;
const ProductSpecs = ({ product }) => {
  if (!product) return null;

  const safeCheck = (val) =>
    val !== null && val !== undefined && val !== "" && val !== "null" && val !== "undefined";

  const deptId = Number(product.departname);
  const deptName = DEPARTMENT_MAP[deptId];

  const specBuilder = PRODUCT_SPECS[deptName];

  if (!specBuilder) return null; // no config found

  const specs = specBuilder(product).filter((s) => safeCheck(s.value));

  if (specs.length === 0) return null;

  const gridCols = `grid-cols-${Math.min(specs.length, 5)}`;

  return (
    <div className={`grid ${gridCols} gap-8 my-6 border-t-2 border-gray-300 pt-6`}>
      {specs.map((item, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <span className="text-sm text-gray-500">{item.label}</span>
          <div className="text-2xl mb-1">{item.icon}</div>
          <span className="font-semibold text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecs;
