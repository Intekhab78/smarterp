import { CheckCircle, Clock, PauseCircle } from "lucide-react";

const TRACKING_FLOW = [
    "order placed",
    "order confirmed",
    "ready to ship",
    "out for delivery",
    "delivered",
];

const StepIcon = ({ status, isHold }) => {
    if (isHold) return <PauseCircle size={14} />;
    if (status === "completed") return <CheckCircle size={12} />;
    if (status === "active") return <Clock size={12} />;
    return <div className="w-3 h-3 rounded-full bg-gray-400" />;
};

export default function OrderTrackingHorizontal({ currentOrderStatus, statusList }) {
    const normalize = (str) =>
        String(str || "")
            .toLowerCase()
            .trim()
            .replace(/[_\s]+/g, " ");

    if (!Array.isArray(statusList) || statusList.length === 0) {
        return <p className="text-xs text-gray-400 mt-2">Tracking unavailable</p>;
    }

    /* ✅ current status */
    const currentStatusObj =
        statusList.find((s) => Number(s.id) === Number(currentOrderStatus)) ||
        statusList.find((s) => Number(s.status_order) === Number(currentOrderStatus));

    const currentStatusName = normalize(
        currentStatusObj?.status_name || currentOrderStatus
    );

    const isHold = currentStatusName === "hold";

    /* ✅ base flow (never include hold/cancelled) */
    let sortedSteps = statusList
        .filter((s) => TRACKING_FLOW.includes(normalize(s.status_name)))
        .slice()
        .sort((a, b) => Number(a.status_order) - Number(b.status_order))
        .map((s) => ({
            id: Number(s.id),
            label: s.status_name,
            order: Number(s.status_order),
            normalized: normalize(s.status_name),
        }));

    /* ✅ insert HOLD only when current status is HOLD */
    if (isHold) {
        const holdStep = {
            id: currentStatusObj?.id || 999,
            label: "Hold",
            order: currentStatusObj?.status_order || 0,
            normalized: "hold",
            isHold: true,
        };

        // insert after "order confirmed" (or wherever you want)
        const insertAfter = sortedSteps.findIndex(
            (s) => s.normalized === "order confirmed"
        );

        if (insertAfter >= 0) {
            sortedSteps.splice(insertAfter + 1, 0, holdStep);
        } else {
            sortedSteps.push(holdStep);
        }
    }

    /* ✅ active step */
    const currentStepIndex = sortedSteps.findIndex(
        (step) => step.normalized === currentStatusName
    );

    const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

    const isDeliveredStep =
        sortedSteps[activeIndex]?.normalized === "delivered";

    return (
        <div className="flex items-center gap-2 mt-2 relative">
            {sortedSteps.map((step, index) => {
                const isCompleted = isDeliveredStep || index < activeIndex;
                const isActive = !isDeliveredStep && index === activeIndex;

                const stepStatus = isCompleted
                    ? "completed"
                    : isActive
                        ? "active"
                        : "pending";

                return (
                    <div key={step.id} className="flex-1 relative flex flex-col items-center">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10
                ${step.isHold
                                    ? "bg-yellow-400 text-white"
                                    : isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                            ? "bg-yellow-400 text-white animate-pulse"
                                            : "bg-gray-200 text-gray-400"
                                }`}
                        >
                            <StepIcon status={stepStatus} isHold={step.isHold} />
                        </div>

                        <p className="text-[10px] mt-1 text-center text-gray-700">
                            {step.label}
                        </p>

                        {index !== sortedSteps.length - 1 && (
                            <div
                                className="absolute top-1/2 left-1/2 w-full h-[2px] -translate-y-1/2"
                                style={{
                                    backgroundColor:
                                        isCompleted || step.isHold ? "#22c55e" : "#d1d5db",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
