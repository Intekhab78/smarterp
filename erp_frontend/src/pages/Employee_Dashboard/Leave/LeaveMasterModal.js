export default function LeaveMasterModal({
    form,
    setForm,
    onClose,
    onSave,
    editingLeave,
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[480px] rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-semibold text-sm">
                        {editingLeave ? "Edit Leave Type" : "Add Leave Type"}
                    </h3>
                    <button className="text-sm" onClick={onClose}>✕</button>
                </div>

                <div className="p-3 space-y-2 text-xs">
                    {/* Leave Type */}
                    <input
                        type="text"
                        placeholder="Leave Type"
                        className="w-full border px-2 py-1 rounded text-xs h-8 placeholder:text-xs"
                        value={form.leaveType}
                        onChange={(e) =>
                            setForm({ ...form, leaveType: e.target.value })
                        }
                    />

                    {/* Annual Limit */}
                    <input
                        type="number"
                        placeholder="Annual Limit"
                        className="w-full border px-2 py-1 rounded text-xs h-8 placeholder:text-xs"
                        value={form.annualLimit}
                        onChange={(e) =>
                            setForm({ ...form, annualLimit: e.target.value })
                        }
                    />

                    {/* Max Consecutive Days */}
                    <input
                        type="number"
                        placeholder="Max Consecutive Days"
                        className="w-full border px-2 py-1 rounded text-xs h-8 placeholder:text-xs"
                        value={form.maxDays}
                        onChange={(e) =>
                            setForm({ ...form, maxDays: e.target.value })
                        }
                    />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-1.5 text-xs">
                            <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={form.carryForward}
                                onChange={(e) =>
                                    setForm({ ...form, carryForward: e.target.checked })
                                }
                            />
                            Carry Forward
                        </label>

                        <label className="flex items-center gap-1.5 text-xs">
                            <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={form.halfDayAllowed}
                                onChange={(e) =>
                                    setForm({ ...form, halfDayAllowed: e.target.checked })
                                }
                            />
                            Half Day Allowed
                        </label>

                        <label className="flex items-center gap-1.5 text-xs">
                            <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={form.requiresApproval}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        requiresApproval: e.target.checked,
                                    })
                                }
                            />
                            Requires Approval
                        </label>

                        <label className="flex items-center gap-1.5 text-xs">
                            <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={form.attachmentRequired}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        attachmentRequired: e.target.checked,
                                    })
                                }
                            />
                            Attachment Required
                        </label>
                    </div>

                    {/* Status */}
                    <select
                        className="w-full border px-2 py-1 rounded text-xs h-8"
                        value={form.status}
                        onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                        }
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={onClose}
                            className="border px-3 py-1 text-xs rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onSave}
                            className="bg-purple-600 text-white px-3 py-1 text-xs rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
