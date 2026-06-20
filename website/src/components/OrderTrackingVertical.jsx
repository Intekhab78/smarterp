import { CheckCircle, Clock, PauseCircle, XCircle } from "lucide-react";

const TRACKING_FLOW = [
    "order placed",
    "order confirmed",
    "ready to ship",
    "out for delivery",
    "delivered",
    "cancelled",
];

const normalize = (str) =>
    String(str || "").toLowerCase().trim().replace(/[_\s]+/g, " ");

const StepIcon = ({ step }) => {
    if (step.isCancelled) return <XCircle size={14} />;
    if (step.isHold) return <PauseCircle size={14} />;
    if (step.isCompleted) return <CheckCircle size={12} />;
    if (step.isActive) return <Clock size={12} />;
    return <div className="w-3 h-3 rounded-full bg-gray-400" />;
};

export default function OrderTrackingVertical({ currentOrderStatus, statusList }) {
    if (!Array.isArray(statusList) || statusList.length === 0) {
        return <p className="text-xs text-gray-400 mt-2">Tracking unavailable</p>;
    }

    /* ✅ current status */
    const currentStatusObj =
        statusList.find((s) => Number(s.id) === Number(currentOrderStatus)) ||
        statusList.find((s) => Number(s.status_order) === Number(currentOrderStatus));

    const currentStatusName = normalize(currentStatusObj?.status_name);

    const isHold = currentStatusName === "hold";
    const isCancelled =
        currentStatusName === "cancelled" || currentStatusName === "canceled";

    /* ✅ base steps */
    let steps = statusList
        .filter((s) => TRACKING_FLOW.includes(normalize(s.status_name)))
        .slice()
        .sort((a, b) => Number(a.status_order) - Number(b.status_order))
        .map((s) => ({
            id: Number(s.id),
            label: s.status_name,
            normalized: normalize(s.status_name),
        }));

    /* ✅ insert HOLD only when active */
    if (isHold) {
        const holdStep = {
            id: currentStatusObj?.id || 999,
            label: "Hold",
            normalized: "hold",
            isHold: true,
        };

        const insertAfter = steps.findIndex(
            (s) => s.normalized === "order confirmed"
        );

        if (insertAfter >= 0) steps.splice(insertAfter + 1, 0, holdStep);
        else steps.push(holdStep);
    }

    /* ✅ if CANCELLED → stop after cancelled */
    if (isCancelled) {
        const cancelIndex = steps.findIndex((s) => s.normalized === "cancelled");
        if (cancelIndex >= 0) {
            steps = steps.slice(0, cancelIndex + 1);
        }
    }

    /* ✅ active index */
    const activeIndex = steps.findIndex(
        (s) => s.normalized === currentStatusName
    );

    const finalSteps = steps.map((s, idx) => ({
        ...s,
        isHold: s.normalized === "hold",
        isCancelled: isCancelled && idx === activeIndex,
        isCompleted: !isCancelled && idx < activeIndex,
        isActive: idx === activeIndex,
    }));

    return (
        <div className="relative pl-6">
            {/* vertical line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gray-200" />

            <ul className="space-y-6">
                {finalSteps.map((step) => (
                    <li key={step.id || step.label} className="relative flex items-start gap-3">
                        {/* dot */}
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10
                ${step.isCancelled
                                    ? "bg-red-500 text-white"
                                    : step.isHold
                                        ? "bg-yellow-400 text-white"
                                        : step.isCompleted
                                            ? "bg-green-500 text-white"
                                            : step.isActive
                                                ? "bg-yellow-400 text-white animate-pulse"
                                                : "bg-gray-200 text-gray-400"
                                }`}
                        >
                            <StepIcon step={step} />
                        </div>

                        {/* label */}
                        <div className="pb-2">
                            <div className="text-sm font-medium text-gray-800">
                                {step.label}
                            </div>

                            {step.isCancelled && (
                                <div className="text-xs text-red-600 mt-0.5">Cancelled</div>
                            )}

                            {step.isHold && (
                                <div className="text-xs text-yellow-700 mt-0.5">On Hold</div>
                            )}

                            {step.isCompleted && !step.isHold && !step.isCancelled && (
                                <div className="text-xs text-green-600 mt-0.5">Completed</div>
                            )}

                            {step.isActive && !step.isHold && !step.isCancelled && (
                                <div className="text-xs text-yellow-600 mt-0.5">In Progress</div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
