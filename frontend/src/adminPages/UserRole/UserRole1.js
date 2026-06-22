// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import constantApi from "../../constantApi";

// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// const UserRole = () => {
//   const [modules, setModules] = useState([]);
//   const [sub_modules, setSub_Modules] = useState([]);
//   const [function_master, setFunction_master] = useState([]);
//   const [filteredSubModules, setFilteredSubModules] = useState({});
//   const [activeSubModuleId, setActiveSubModuleId] = useState(null);
//   const [filteredFunctions, setFilteredFunctions] = useState([]);
//   // useEffect(() => {
//   //   axios
//   //     .get(`${constantApi.baseUrl}/module_master/list`)
//   //     .then((res) => setModules(res.data.data))
//   //     .catch((err) => console.error("Error fetching modules:", err));
//   // }, []);

//   // useEffect(() => {
//   //   axios
//   //     .get(`${constantApi.baseUrl}/sub_module_master/list`)
//   //     .then((res) => {
//   //       const subModules = res.data.data;
//   //       setSub_Modules(subModules);

//   //       // Pre-filter submodules for each module
//   //       const filtered = {};
//   //       subModules.forEach((subModule) => {
//   //         if (!filtered[subModule.module_id]) {
//   //           filtered[subModule.module_id] = [];
//   //         }
//   //         filtered[subModule.module_id].push(subModule);
//   //       });
//   //       setFilteredSubModules(filtered);
//   //     })
//   //     .catch((err) => console.error("Error fetching submodules:", err));
//   // }, []);

//   useEffect(() => {
//     axios
//       .get(`${constantApi.baseUrl}/function_master/list`)
//       .then((res) => {
//         setFunction_master(res.data.data);
//         console.log("response from function master ", res);
//       })
//       .catch((err) => console.error("Error fetching function master:", err));
//   }, []);
//   const data = [
//     {
//       documentType: "Leave Allocation",
//       roles: [
//         {
//           role: "HR Manager",
//           level: 0,
//           permissions: {
//             read: true,
//             write: true,
//             create: true,
//             delete: true,
//             submit: true,
//             cancel: true,
//             amend: true,
//             print: true,
//             email: true,
//             import: false,
//             export: false,
//             report: true,
//             share: true,
//             setUserPermissions: false,
//           },
//         },
//         {
//           role: "HR User",
//           level: 0,
//           permissions: {
//             read: true,
//             write: true,
//             create: true,
//             delete: true,
//             submit: true,
//             cancel: true,
//             amend: true,
//             print: true,
//             email: true,
//             import: false,
//             export: false,
//             report: true,
//             share: true,
//             setUserPermissions: false,
//           },
//         },
//       ],
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <div className="p-6 bg-gray-100">
//         <h1 className="text-2xl font-bold mb-4">Role Permissions Manager</h1>
//         <div className="bg-white p-4 rounded shadow">
//           <div className="flex gap-4 mb-4">
//             <button className="px-4 py-2 bg-blue-500 text-white rounded">
//               Leave Allocation
//             </button>
//             <select className="px-4 py-2 border rounded">
//               <option>Select Role...</option>
//               {data.map((item, index) =>
//                 item.roles.map((role, idx) => (
//                   <option key={`${index}-${idx}`}>{role.role}</option>
//                 ))
//               )}
//             </select>
//           </div>

//           <table className="w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-300 p-2">Document Type</th>
//                 <th className="border border-gray-300 p-2">Role</th>
//                 <th className="border border-gray-300 p-2">Level</th>
//                 <th className="border border-gray-300 p-2">Permissions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) =>
//                 item.roles.map((role, idx) => (
//                   <tr key={`${index}-${idx}`} className="hover:bg-gray-100">
//                     <td className="border border-gray-300 p-2">
//                       {item.documentType}
//                     </td>
//                     <td className="border border-gray-300 p-2">{role.role}</td>
//                     <td className="border border-gray-300 p-2">{role.level}</td>
//                     <td className="border border-gray-300 p-2">
//                       <div className="grid grid-cols-4 gap-2">
//                         {Object.entries(role.permissions).map(
//                           ([key, value]) => (
//                             <div key={key} className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={value}
//                                 className="mr-2"
//                                 readOnly
//                               />
//                               <label className="text-sm">{key}</label>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default UserRole;
