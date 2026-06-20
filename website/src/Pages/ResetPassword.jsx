// import { useState } from "react";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Mail } from "lucide-react";
import axios from "axios";
import constantApi from "../constantApi";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const RESET_COOLDOWN = 2 * 60 * 1000; // 2 minutes
  const RESET_COOLDOWN = 120; // seconds

  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    const lastSent = localStorage.getItem(`reset_sent_${email}`);
    if (!lastSent) return;

    const elapsed = Math.floor((Date.now() - Number(lastSent)) / 1000);
    const remaining = RESET_COOLDOWN - elapsed;

    if (remaining > 0) {
      setCooldown(remaining);
    }
  }, [email]);
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    // 🔒 Cooldown check
    const lastSent = localStorage.getItem(`reset_sent_${email}`);
    const now = Date.now();

    if (lastSent) {
      const elapsed = Math.floor((now - Number(lastSent)) / 1000);
      const remaining = RESET_COOLDOWN - elapsed;

      if (remaining > 0) {
        setCooldown(remaining);
        setError(`Please wait ${remaining} seconds before requesting again.`);
        return;
      }
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${constantApi.baseUrl}/customer/list`
      );

      // ✅ SAFELY extract array
      let customers = [];

      if (Array.isArray(res?.data)) {
        customers = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        customers = res.data.data;
      } else if (Array.isArray(res?.data?.customers)) {
        customers = res.data.customers;
      }

      // 🔍 Email check
      const emailExists = customers.some(
        (customer) =>
          customer?.email?.toLowerCase() === email.toLowerCase()
      );

      if (!emailExists) {
        setError("Email does not exist.");
        return;
      }

      const resetLink = `${window.location.origin}/update-password?email=${email}`;

      await emailjs.send(
        "service_fgrw39t",
        "template_d6un3xq",
        {
          email,
          link: resetLink,
        },
        "QK37d7TWxJs7X3J5x"
      );
      localStorage.setItem(`reset_sent_${email}`, now.toString());
      setCooldown(RESET_COOLDOWN);
      setMessage("Reset link sent to your email");


      setMessage("Reset link sent to your email");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a password reset link
        </p>

        {message && (
          <p className="text-sm text-green-600 text-center mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Checking..."
              : cooldown > 0
                ? `Resend in ${String(Math.floor(cooldown / 60)).padStart(2, "0")}:${String(cooldown % 60).padStart(2, "0")}`
                : "Send Reset Link"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
