import React, { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../CartContext/AuthContext";

const UserRegistration = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    address_line_1: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    dob: "", // new
    gender: "", // new
    created_by: "admin",
    updated_by: "admin",
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  // ---------------------- COUNTRY/STATE/CITY ----------------------
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("+91");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Fetch countries + phone codes
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
      .then((res) => {
        const sorted = res.data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
            phoneCode: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ""),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleCountryChange = async (e) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name === countryName);
    setSelectedCountry(countryName);
    setCountryCode(country ? country.phoneCode : "");
    setFormData({ ...formData, country: countryName });
    setSelectedState("");
    setCities([]);
    setStates([]);

    if (!countryName) return;

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: countryName },
      );
      setStates(res.data.data.states.map((s) => s.name));
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setFormData({ ...formData, state: stateName });
    setCities([]);

    if (!stateName) return;

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: selectedCountry, state: stateName },
      );
      setCities(res.data.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  // ---------------------- HANDLE CHANGE ----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setBackendError("");
  };

  // ---------------------- VALIDATION ----------------------
  const validate = () => {
    let temp = {};
    if (!formData.first_name.trim()) temp.first_name = "First name is required";
    if (!formData.email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      temp.email = "Invalid email format";
    if (!formData.password) temp.password = "Password is required";
    else if (formData.password.length < 6)
      temp.password = "Password must be at least 6 characters";
    if (!formData.phone_number) temp.phone_number = "Phone number is required";
    else if (!/^\d{7,15}$/.test(formData.phone_number))
      temp.phone_number = "Phone number must be between 7–15 digits";
    if (!formData.postal_code) {
      temp.postal_code = "Postal code is required";
    } else if (!/^\d{4,10}$/.test(formData.postal_code)) {
      temp.postal_code = "Postal code must be 4–10 digits";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBackendError("");
    setErrors({});

    if (!validate()) return;

    const finalData = {
      ...formData,
      phone_number: `${countryCode}${formData.phone_number}`,
    };

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/customer/online_cust_reg_login`,
        finalData,
        { withCredentials: true }, // 🔥 REQUIRED
      );

      // ❌ API says email / phone already exists
      if (response.data?.success === false) {
        const message = response.data.message?.toLowerCase();
        let fieldErrors = {};

        if (message?.includes("email")) {
          fieldErrors.email = "Email already exists";
        }

        if (message?.includes("phone")) {
          fieldErrors.phone_number = "Phone number already exists";
        }

        // fallback (unknown backend message)
        if (Object.keys(fieldErrors).length === 0) {
          setBackendError(response.data.message);
          return;
        }

        setErrors(fieldErrors);
        return;
      }

      // ✅ SUCCESS
      // const { token, customer } = response.data;
      // localStorage.setItem("token", token);
      // localStorage.setItem("customerDetails", JSON.stringify(customer));

      await fetchUser(); // 🔥 SYNC AUTH STATE
      alert("User registered & logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);

      const message = error.response?.data?.message?.toLowerCase();
      let fieldErrors = {};

      if (message?.includes("email")) {
        fieldErrors.email = "Email already exists";
      }

      if (message?.includes("phone")) {
        fieldErrors.phone_number = "Phone number already exists";
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setBackendError("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex justify-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl px-8 py-10 rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header with Illustration */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 #ED1C48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A7.978 7.978 0 0112 15c2.21 0 4.21.896 5.879 2.356M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 uppercase mb-2">
            Create an Account
          </h2>

          <p className="text-gray-500 text-sm">
            Register as a new customer and start your journey with us
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FIRST + LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.first_name && (
                <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
            </div>
          </div>

          {/* DOB + GENDER */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.dob && (
                <p className="text-red-600 text-xs mt-1">{errors.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* EMAIL + PASSWORD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
              {/* {backendError?.toLowerCase().includes("email") && (
                <p className="text-red-600 text-xs mt-1">{backendError}</p>
              )} */}
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* COUNTRY + STATE + CITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black text-sm mb-1">State</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
                disabled={!selectedCountry || states.length === 0}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PHONE CODE + PHONE NUMBER + ADDRESS */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-6 flex flex-col">
              <label className="block text-black text-sm mb-1">City</label>
              <select
                value={formData.city}
                onChange={handleCityChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
                disabled={!selectedState || cities.length === 0}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-2 flex flex-col">
              <label className="text-black text-sm mb-1">Code</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-2 py-2 text-sm border rounded-md"
              >
                {countries.map((c) => (
                  <option key={`${c.code}-${c.phoneCode}`} value={c.phoneCode}>
                    {c.phoneCode} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-12 md:col-span-4 flex flex-col">
              <label className="text-black text-sm mb-1">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                maxLength={10}
                pattern="[0-9]{10}"
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder="Enter phone number"
              />
              {errors.phone_number && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
          </div>
          {/* ADDRESS */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-4 flex flex-col">
              <label className="block text-black text-sm mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                maxLength={10}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />

              {errors.postal_code && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
            <div className="col-span-12 md:col-span-8 flex flex-col">
              <label className="block text-black text-sm mb-1">Address</label>
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
                placeholder="House / Street / Area"
              />
              {errors.address_line_1 && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.address_line_1}
                </p>
              )}
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="w-full flex justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  first_name: "",
                  last_name: "",
                  email: "",
                  password: "",
                  phone_number: "",
                  address_line_1: "",
                  city: "",
                  postal_code: "",
                  dob: "",
                  gender: "",
                })
              }
              className="w-28 py-2 !bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm"
            >
              Reset
            </button>

            <button
              type="submit"
              className="w-40 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
            >
              Register
            </button>
          </div>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?
          <Link to="/login" className="text-primary ml-1">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
