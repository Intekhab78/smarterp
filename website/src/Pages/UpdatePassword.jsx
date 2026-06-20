import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import Swal from "sweetalert2";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function UpdatePassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const getStrength = () => {
        if (password.length < 6) return "Weak";
        if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
        return "Medium";
    };

    const strength = getStrength();

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!password || !confirmPassword) {
            setMessage("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${constantApi.baseUrl}/customer/customer_pass_update`,
                {
                    loginId: email,
                    password,
                }
            );

            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    text: "Password updated successfully",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                });

                navigate("/login");
            }
        } catch (error) {
            setMessage(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-1">
                    Update Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Secure your account with a new password
                </p>

                {message && (
                    <p className="text-sm text-red-500 text-center mb-4">{message}</p>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">

                    {/* EMAIL */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                            type="email"
                            value={email || ""}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>
                    {/* NEW PASSWORD */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full pl-12 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* STRENGTH */}
                    {password && (
                        <p
                            className={`text-sm ${strength === "Weak"
                                    ? "text-red-500"
                                    : strength === "Medium"
                                        ? "text-yellow-500"
                                        : "text-green-600"
                                }`}
                        >
                            Password strength: <b>{strength}</b>
                        </p>
                    )}

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full pl-12 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
