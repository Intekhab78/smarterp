// import { useState } from "react";
// import LeaveDashboard from "./LeaveDashboard";
// import LeaveTable from "./LeaveTable";
// import ApplyLeaveModal from "./ApplyLeaveModal";

// function NewLeavePage({ employee, emp_id, userRole, emp_email }) {
//     // 🔑 modal state
//     const [openApplyModal, setOpenApplyModal] = useState(false);

//     return (
//         <div className="space-y-6">
//             {/* 1️⃣ Leave summary dashboard */}
//             <LeaveDashboard />

//             {/* 2️⃣ Leave table */}
//             <LeaveTable onApply={() => setOpenApplyModal(true)} />

//             {/* 3️⃣ Apply leave modal */}
//             <ApplyLeaveModal
//                 open={openApplyModal}
//                 onClose={() => setOpenApplyModal(false)}
//             />
//         </div>
//     );
// }

// export default NewLeavePage;


import { useState } from "react";
import LeaveDashboard from "./LeaveDashboard";
import LeaveTable from "./LeaveTable";
import ApplyLeaveModal from "./ApplyLeaveModal";
import ManagerLeaveDashboard from "./Manager/ManagerLeaveDashboard";
import ManagerLeaveTable from "./Manager/ManagerLeaveTable";

function NewLeavePage({ employee, emp_id, userRole, emp_email }) {
    const [openApplyModal, setOpenApplyModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* ================= EMPLOYEE LEAVE SECTION ================= */}
            <div>
                <h2 className="text-lg font-semibold">Employee Leave</h2>
                <LeaveDashboard />
                <LeaveTable onApply={() => setOpenApplyModal(true)} />
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-300" />

            {/* ================= MANAGER APPROVAL SECTION ================= */}
            {/* {userRole === 2 && ( */}
            <div>
                <h2 className="text-lg font-semibold">Manager Approval</h2>
                <ManagerLeaveDashboard />
                <ManagerLeaveTable />
            </div>
            {/* // )} */}

            {/* Apply Leave Modal */}
            <ApplyLeaveModal
                open={openApplyModal}
                onClose={() => setOpenApplyModal(false)}
            />
        </div>
    );
}

export default NewLeavePage;
