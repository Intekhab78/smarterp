import LeaveMasterDashboard from "./LeaveMasterDashboard";
import LeaveMaster from "./LeaveMaster";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
export default function LeaveMasterPage() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="space-y-8">
                {/* TOP DASHBOARD (separate component) */}
                <LeaveMasterDashboard />

                {/* LEAVE MASTER TABLE + MODAL (separate component) */}
                <LeaveMaster />
            </div>
        </DashboardLayout>

    );
}
