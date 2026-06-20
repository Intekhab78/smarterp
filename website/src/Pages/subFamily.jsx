// import React from "react";
// import React, { useState } from "react";
// import React, { useState } from "react";
// import { Range } from "react-range";
// import { useState } from "react";
// import { Range } from "react-range";

import { useState } from "react";
import { Range } from "react-range";

const Breadcrumb = () => {
  return (
    <nav className="text-sm text-gray-600 my-2 mx-auto pl-8 w-full">
              <ol className="flex items-center align-centre space-x-2 w-full">
                <li className="hover:text-red-500">
                  <a
                    href="#"
                    className="  hover:text-red-500 transition-colors duration-200"
                  >
                    Quran Box
                  </a>
                </li>

                <li className="text-gray-400">›</li>

                <li className="hover:text-red-500">
                  <a href="#" className="hover:text-red-500 transition-colors duration-200 ">
                    Islamic Books
                  </a>
                </li>

                <li className="text-gray-400">›</li>

                <li className="hover:text-red-500">
                  <a href="#" className="  hover:text-red-500 transition-colors duration-200">
                    Quran
                  </a>
                </li>
              </ol>
            </nav>
  );
};

export default Breadcrumb;




// dynamic
// import React from "react";

// const Breadcrumb = ({ items }) => {
//   return (
//     <nav className="text-sm text-gray-600 my-3">
//       <ol className="flex items-center flex-wrap gap-1">
//         {items.map((item, index) => (
//           <React.Fragment key={index}>
//             {index !== items.length - 1 ? (
//               <li>
//                 <a href={item.link} className="hover:underline text-gray-700">
//                   {item.label}
//                 </a>
//               </li>
//             ) : (
//               <li className="text-gray-900 font-medium">{item.label}</li>
//             )}
//             {index !== items.length - 1 && (
//               <span className="text-gray-400 mx-1">›</span>
//             )}
//           </React.Fragment>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;




// const Breadcrumb = () => {
//   return (
//     <nav className="text-sm text-gray-600 my-2">
//       <ol className="flex items-center space-x-2">
        
//         <li>
//           <a href="#" className="hover:underline text-gray-700">
//             Books
//           </a>
//         </li>

//         <li className="text-gray-400">›</li>

//         <li>
//           <a href="#" className="hover:underline text-gray-700">
//             Teen & Young Adult
//           </a>
//         </li>

//         <li className="text-gray-400">›</li>

//         <li>
//           <a href="#" className="hover:underline text-gray-700">
//             Literature & Fiction
//           </a>
//         </li>

//         <li className="text-gray-400">›</li>

//         <li className="text-gray-800 font-medium">
//           Classic Fiction
//         </li>

//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;

// import React from "react";

// const Breadcrumb = ({ items }) => {
//   return (
//     <nav className="text-sm text-gray-600 my-3">
//       <ol className="flex items-center flex-wrap gap-1">
//         {items.map((item, index) => (
//           <React.Fragment key={index}>
            
//             {/* if NOT last item → make clickable */}
//             {index !== items.length - 1 ? (
//               <li>
//                 <a
//                   href={item.link}
//                   className="hover:underline text-gray-700"
//                 >
//                   {item.label}
//                 </a>
//               </li>
//             ) : (
//               /* Last breadcrumb (active) */
//               <li className="text-gray-900 font-medium">
//                 {item.label}
//               </li>
//             )}

//             {/* Add separator for all except last */}
//             {index !== items.length - 1 && (
//               <span className="text-gray-400 mx-1">›</span>
//             )}
//           </React.Fragment>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;

