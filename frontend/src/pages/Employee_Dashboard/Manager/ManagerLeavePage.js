import ManagerLeaveDashboard from "./ManagerLeaveDashboard";
import ManagerLeaveTable from "./ManagerLeaveTable";

function ManagerLeavePage({ userRole }) {
    // Safety check
    // if (userRole !== 2) {
    //     return (
    //         <div className="text-center text-red-600 p-6">
    //             You are not authorized to view this page.
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6">
            {/* Top dashboard */}
            <ManagerLeaveDashboard />

            {/* Approval table */}
            <ManagerLeaveTable />
        </div>
    );
}

export default ManagerLeavePage;
