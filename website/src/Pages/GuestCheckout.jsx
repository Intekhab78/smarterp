import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import constantApi from "../constantApi";
import { useCart } from "../CartContext/CartContext";
import { useAuth } from "../CartContext/AuthContext";

export default function GuestCheckout() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { fetchUser } = useAuth();

  const safeCart = cart?.length
    ? cart
    : JSON.parse(localStorage.getItem("cart")) || [];

  const [guest, setGuest] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("+91");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // ---------------- FETCH COUNTRIES ----------------
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
      .then((res) => {
        const list = res.data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
            phoneCode: c.idd?.root
              ? c.idd.root + (c.idd.suffixes?.[0] || "")
              : "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(() => { });
  }, []);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setGuest((prev) => ({ ...prev, [name]: value }));

    // clear error while typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setGuest({ ...guest, country });
    setSelectedState("");
    setStates([]);
    setCities([]);

    const found = countries.find((c) => c.name === country);
    setCountryCode(found?.phoneCode || "");

    if (!country) return;

    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      { country },
    );
    setStates(res.data.data.states.map((s) => s.name));
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setGuest({ ...guest, state });
    setCities([]);

    if (!state) return;

    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country: selectedCountry, state },
    );
    setCities(res.data.data);
  };

  const handleCityChange = (e) => {
    setGuest((prev) => ({ ...prev, city: e.target.value }));

    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };


  // ---------------- VALIDATION ----------------
  const validateGuest = () => {
    let temp = {};

    if (!guest.full_name.trim()) temp.full_name = "Full name is required";

    if (!guest.email.trim()) temp.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email))
      temp.email = "Enter valid email";

    if (!guest.phone_number) temp.phone_number = "Phone number required";
    else if (!/^[0-9]{10}$/.test(guest.phone_number))
      temp.phone_number = "Enter 10 digit number";

    if (!guest.country) temp.country = "Select country";
    if (!guest.state) temp.state = "Select state";
    if (!guest.city) temp.city = "Select city";

    if (!guest.address.trim()) temp.address = "Address required";

    if (!guest.postal_code.trim()) temp.postal_code = "Postal code required";
    else if (!/^[0-9]{4,10}$/.test(guest.postal_code))
      temp.postal_code = "Invalid postal code";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ---------------- SUBMIT (AUTO REGISTER + LOGIN) ----------------
  const continueToPayment = async (e) => {
    e.preventDefault();

    if (!validateGuest()) {
      return;
    }

    setLoading(true);

    try {
      const [first_name, ...rest] = guest.full_name.trim().split(" ");
      const last_name = rest.join(" ") || "";
      const password = Math.floor(100000 + Math.random() * 900000).toString();

      const payload = {
        first_name,
        last_name,
        email: guest.email.trim().toLowerCase(),
        password,
        phone_number: `${countryCode}${guest.phone_number}`,
        address_line_1: guest.address.trim(),
        city: guest.city,
        state: guest.state,
        country: selectedCountry,
        postal_code: guest.postal_code,
        created_by: "guest",
        updated_by: "guest",
      };

      const res = await axios.post(
        `${constantApi.baseUrl}/customer/online_cust_reg_login`,
        payload,
        { withCredentials: true },
      );

      // even if email/phone exists, backend usually logs user in
      await fetchUser();

      Swal.fire({
        icon: "success",
        title: "Checkout details saved",
        timer: 1200,
        showConfirmButton: false,
      });

      // navigate("/cart", { replace: true });
      navigate("/checkout", { replace: true });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Checkout failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <div className="flex justify-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl px-8 py-10 rounded-2xl border border-gray-200 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 uppercase mb-2">
            Guest Checkout
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your details to proceed with payment
          </p>
        </div>

        <form onSubmit={continueToPayment} className="space-y-4">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={guest.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.full_name && (
                <p className="text-red-600 text-xs mt-1">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={guest.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Country & State */}
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
              {errors.country && (
                <p className="text-red-600 text-xs mt-1">{errors.country}</p>
              )}
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
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* City, Phone & Address */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-6 flex flex-col">
              <label className="block text-black text-sm mb-1">City</label>
              <select
                value={guest.city}
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
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">{errors.city}</p>
              )}
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
                    {c.phoneCode}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-12 md:col-span-4 flex flex-col">
              <label className="text-black text-sm mb-1">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={guest.phone_number}
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

          {/* Address & Postal Code */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-8 flex flex-col">
              <label className="block text-black text-sm mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={guest.address}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border rounded-md"
                placeholder="House / Street / Area"
              />
              {errors.address && (
                <p className="text-red-600 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col">
              <label className="block text-black text-sm mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={guest.postal_code}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
              {errors.postal_code && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-40 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
