import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import { useAuth } from "../CartContext/AuthContext";

function Login() {
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { fetchUser } = useAuth(); // ✅ FIX

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/customer/customer_login`,
        { login_id, password },
        { withCredentials: true }, // 🔥 REQUIRED
      );

      if (response.status === 200) {
        await fetchUser(); // 🔥 refresh navbar
        console.log("res is ----------", response.data);
        const customerDetails = response.data.customer || response.data;
        console.log("Full Customer Details:", customerDetails);
        localStorage.setItem(
          "customerDetails",
          JSON.stringify(customerDetails),
        );

        // alert("You are logged in successfully");
        // const searchParams = new URLSearchParams(location.search);
        // const redirect = searchParams.get("redirect") || "/";
        // navigate(redirect);
        const redirect = location.state?.from || "/";
        navigate(redirect, { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
          <p className="text-gray-600 mb-6 text-sm">Welcome Back, Customer!</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-2">
              <div>
                <label className="text-gray-600 mb-2 block">Email</label>
                <input
                  type="text"
                  value={login_id}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="block w-full border border-gray-300 px-4 py-3 rounded"
                  placeholder="youremail@domain.com"
                />
              </div>

              <div>
                <label className="text-gray-600 mb-2 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full border border-gray-300 px-4 py-3 rounded"
                  placeholder="*******"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="block w-full py-2 text-center text-white bg-primary border border-primary rounded"
              >
                Login
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-gray-600">
            <button
              onClick={() => navigate("/reset")}
              className="text-primary underline"
            >
              Forgot Password?
            </button>
          </p>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/userregistration" className="text-primary">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
