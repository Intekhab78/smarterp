// import React, { useState } from "react";
// import LeaveMasterModal from "./LeaveMasterModal";

// const initialLeaveMaster = [
//     {
//         id: 1,
//         leaveType: "Casual Leave",
//         annualLimit: 8,
//         carryForward: true,
//         halfDayAllowed: true,
//         requiresApproval: true,
//         status: "Active",
//     },
//     {
//         id: 2,
//         leaveType: "Sick Leave",
//         annualLimit: 10,
//         carryForward: false,
//         halfDayAllowed: true,
//         requiresApproval: true,
//         status: "Active",
//     },
//     {
//         id: 3,
//         leaveType: "Earned Leave / Paid Leave",
//         annualLimit: 15,
//         carryForward: true,
//         halfDayAllowed: false,
//         requiresApproval: true,
//         status: "Active",
//     },
//     {
//         id: 4,
//         leaveType: "Work From Home",
//         annualLimit: 5,
//         carryForward: false,
//         halfDayAllowed: true,
//         requiresApproval: false,
//         status: "Active",
//     },
//     {
//         id: 5,
//         leaveType: "Maternity Leave",
//         annualLimit: 180,
//         carryForward: false,
//         halfDayAllowed: false,
//         requiresApproval: true,
//         status: "Active",
//     },
// ];

// export default function LeaveMaster() {
//     const [leaves, setLeaves] = useState(initialLeaveMaster);
//     const [openModal, setOpenModal] = useState(false);
//     const [editingLeave, setEditingLeave] = useState(null);
//     const [search, setSearch] = useState("");

//     const emptyForm = {
//         leaveType: "",
//         annualLimit: "",
//         carryForward: false,
//         halfDayAllowed: false,
//         requiresApproval: true,
//         status: "Active",
//     };

//     const [form, setForm] = useState(emptyForm);

//     const handleOpenAdd = () => {
//         setEditingLeave(null);
//         setForm(emptyForm);
//         setOpenModal(true);
//     };

//     const handleOpenEdit = (leave) => {
//         setEditingLeave(leave);
//         setForm(leave);
//         setOpenModal(true);
//     };

//     const handleSave = () => {
//         if (!form.leaveType || !form.annualLimit) {
//             alert("Leave Type and Annual Limit are required");
//             return;
//         }

//         if (editingLeave) {
//             setLeaves((prev) =>
//                 prev.map((l) =>
//                     l.id === editingLeave.id ? { ...form, id: l.id } : l
//                 )
//             );
//         } else {
//             setLeaves((prev) => [
//                 ...prev,
//                 { ...form, id: prev.length + 1 },
//             ]);
//         }

//         setOpenModal(false);
//     };

//     const toggleStatus = (id) => {
//         setLeaves((prev) =>
//             prev.map((l) =>
//                 l.id === id
//                     ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" }
//                     : l
//             )
//         );
//     };

//     const filteredLeaves = leaves.filter((l) =>
//         l.leaveType.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="bg-white border rounded-lg shadow-sm">
//             {/* HEADER */}
//             <div className="flex justify-between items-center p-4 border-b">
//                 <h3 className="font-semibold text-lg">Leave Master</h3>

//                 <div className="flex gap-2">
//                     <input
//                         type="text"
//                         placeholder="Search leave type..."
//                         className="border px-3 py-1 rounded"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />

//                     <button
//                         onClick={handleOpenAdd}
//                         className="bg-purple-600 text-white px-4 py-1 rounded"
//                     >
//                         + Add Leave Type
//                     </button>
//                 </div>
//             </div>

//             {/* TABLE */}
//             <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th className="p-3 text-left">Leave Type</th>
//                         <th className="p-3 text-center">Annual Limit</th>
//                         <th className="p-3 text-center">Carry Forward</th>
//                         <th className="p-3 text-center">Half Day</th>
//                         <th className="p-3 text-center">Approval</th>
//                         <th className="p-3 text-center">Status</th>
//                         <th className="p-3 text-center">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredLeaves.map((l) => (
//                         <tr key={l.id} className="border-t hover:bg-gray-50">
//                             <td className="p-3">{l.leaveType}</td>
//                             <td className="p-3 text-center">{l.annualLimit}</td>
//                             <td className="p-3 text-center">
//                                 {l.carryForward ? "Yes" : "No"}
//                             </td>
//                             <td className="p-3 text-center">
//                                 {l.halfDayAllowed ? "Yes" : "No"}
//                             </td>
//                             <td className="p-3 text-center">
//                                 {l.requiresApproval ? "Yes" : "No"}
//                             </td>
//                             <td className="p-3 text-center">
//                                 <span
//                                     className={`px-2 py-1 rounded text-xs ${l.status === "Active"
//                                         ? "text-green-600 bg-green-100"
//                                         : "text-red-600 bg-red-100"
//                                         }`}
//                                 >
//                                     {l.status}
//                                 </span>
//                             </td>
//                             <td className="p-3 flex justify-center gap-2">
//                                 <button
//                                     onClick={() => handleOpenEdit(l)}
//                                     className="px-2 py-1 border rounded"
//                                 >
//                                     Edit
//                                 </button>

//                                 <button
//                                     onClick={() => toggleStatus(l.id)}
//                                     className="px-2 py-1 border rounded text-red-600"
//                                 >
//                                     {l.status === "Active" ? "Disable" : "Enable"}
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* SEPARATE MODAL COMPONENT */}
//             {openModal && (
//                 <LeaveMasterModal
//                     form={form}
//                     setForm={setForm}
//                     onClose={() => setOpenModal(false)}
//                     onSave={handleSave}
//                     editingLeave={editingLeave}
//                 />
//             )}
//         </div>
//     );
// }


import React, { useState } from "react";
import LeaveMasterModal from "./LeaveMasterModal";

const initialLeaveMaster = [
    {
        id: 1,
        leaveType: "Casual Leave",
        annualLimit: 8,
        carryForward: true,
        halfDayAllowed: true,
        requiresApproval: true,
        maxDays: 3,
        attachmentRequired: false,
        status: "Active",
    },
    {
        id: 2,
        leaveType: "Sick Leave",
        annualLimit: 10,
        carryForward: false,
        halfDayAllowed: true,
        requiresApproval: true,
        maxDays: 5,
        attachmentRequired: true,
        status: "Active",
    },
    {
        id: 3,
        leaveType: "Earned Leave / Paid Leave",
        annualLimit: 15,
        carryForward: true,
        halfDayAllowed: false,
        requiresApproval: true,
        maxDays: 10,
        attachmentRequired: false,
        status: "Active",
    },
    {
        id: 4,
        leaveType: "Work From Home",
        annualLimit: 5,
        carryForward: false,
        halfDayAllowed: true,
        requiresApproval: false,
        maxDays: 2,
        attachmentRequired: false,
        status: "Active",
    },
    {
        id: 5,
        leaveType: "Maternity Leave",
        annualLimit: 180,
        carryForward: false,
        halfDayAllowed: false,
        requiresApproval: true,
        maxDays: 180,
        attachmentRequired: true,
        status: "Active",
    },
];

export default function LeaveMaster() {
    const [leaves, setLeaves] = useState(initialLeaveMaster);
    const [openModal, setOpenModal] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null);
    const [search, setSearch] = useState("");

    const emptyForm = {
        leaveType: "",
        annualLimit: "",
        carryForward: false,
        halfDayAllowed: false,
        requiresApproval: true,
        maxDays: "",
        attachmentRequired: false,
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);

    const handleOpenAdd = () => {
        setEditingLeave(null);
        setForm(emptyForm);
        setOpenModal(true);
    };

    const handleOpenEdit = (leave) => {
        setEditingLeave(leave);
        setForm(leave);
        setOpenModal(true);
    };

    const handleSave = () => {
        if (!form.leaveType || !form.annualLimit) {
            alert("Leave Type and Annual Limit are required");
            return;
        }

        if (editingLeave) {
            setLeaves((prev) =>
                prev.map((l) =>
                    l.id === editingLeave.id ? { ...form, id: l.id } : l
                )
            );
        } else {
            setLeaves((prev) => [
                ...prev,
                { ...form, id: prev.length + 1 },
            ]);
        }

        setOpenModal(false);
    };

    const toggleStatus = (id) => {
        setLeaves((prev) =>
            prev.map((l) =>
                l.id === id
                    ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" }
                    : l
            )
        );
    };

    const filteredLeaves = leaves.filter((l) =>
        l.leaveType.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white border rounded-lg shadow-sm">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-lg">Leave Master</h3>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search leave type..."
                        className="border px-2 text-sm py-1 rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        onClick={handleOpenAdd}
                        className="bg-purple-600 text-white px-2 py-1 text-sm rounded"
                    >
                        + Add Leave Type
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-left">Leave Type</th>
                        <th className="p-3 text-center">Annual Limit</th>
                        <th className="p-3 text-center">Carry Forward</th>
                        <th className="p-3 text-center">Half Day</th>
                        <th className="p-3 text-center">Approval</th>
                        <th className="p-3 text-center">Max Days</th>
                        <th className="p-3 text-center">Attachment</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaves.map((l) => (
                        <tr key={l.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{l.leaveType}</td>
                            <td className="p-3 text-center">{l.annualLimit}</td>
                            <td className="p-3 text-center">
                                {l.carryForward ? "Yes" : "No"}
                            </td>
                            <td className="p-3 text-center">
                                {l.halfDayAllowed ? "Yes" : "No"}
                            </td>
                            <td className="p-3 text-center">
                                {l.requiresApproval ? "Yes" : "No"}
                            </td>
                            <td className="p-3 text-center">{l.maxDays}</td>
                            <td className="p-3 text-center">
                                {l.attachmentRequired ? "Yes" : "No"}
                            </td>
                            <td className="p-3 text-center">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${l.status === "Active"
                                        ? "text-green-600 bg-green-100"
                                        : "text-red-600 bg-red-100"
                                        }`}
                                >
                                    {l.status}
                                </span>
                            </td>
                            <td className="p-3 flex justify-center gap-2">
                                <button
                                    onClick={() => handleOpenEdit(l)}
                                    className="px-2 py-1 border rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => toggleStatus(l.id)}
                                    className="px-2 py-1 border rounded text-red-600"
                                >
                                    {l.status === "Active" ? "Disable" : "Enable"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* SEPARATE MODAL COMPONENT */}
            {openModal && (
                <LeaveMasterModal
                    form={form}
                    setForm={setForm}
                    onClose={() => setOpenModal(false)}
                    onSave={handleSave}
                    editingLeave={editingLeave}
                />
            )}
        </div>
    );
}
