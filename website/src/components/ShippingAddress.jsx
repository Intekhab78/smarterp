import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import LocationPickerMap from "./LocationPickerMap";
import { useAuth } from "../CartContext/AuthContext";

export default function ShippingAddresses({
  embedded = false,
  addresses = [],
  refreshAddresses,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // <-- THIS LINE IS MISSING
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";

    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }

    if (!form.address_line1.trim())
      newErrors.address_line1 = "Address line 1 is required";

    if (!form.country) newErrors.country = "Country is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.city) newErrors.city = "City is required";

    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);

    // 🔥 AUTO SCROLL TO FIRST ERROR
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    if (showModal) {
      (async () => {
        try {
          const coords = await getUserLocation();
          setLat(coords.latitude);
          setLng(coords.longitude);

          const address = await getAddressFromCoordinates(
            coords.latitude,
            coords.longitude
          );
          if (address) {
            setForm((prev) => ({
              ...prev,
              address_line1: address.road || address.suburb || "",
              address_line2: address.neighbourhood || "",
              city:
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                "",
              state: address.state || address.state_district || "",
              country: address.country || "",
              pincode: address.postcode || "",
            }));
          }
        } catch (err) {
          console.warn("Could not get user location:", err);
        }
      })();
    }
  }, [showModal]);
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => {
        const sorted = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch((err) => console.error("Country fetch error:", err));
  }, []);
  const handleCountryChange = async (e) => {
    const country = e.target.value;

    setForm((prev) => ({
      ...prev,
      country,
      state: "",
      city: "",
    }));

    setErrors((prev) => ({ ...prev, country: "", state: "", city: "" }));


    setStates([]);
    setCities([]);

    if (!country) return;

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country }
      );
      setStates(res.data.data.states.map((s) => s.name));
    } catch (err) {
      console.error("State fetch error:", err);
    }
  };
  const handleStateChange = async (e) => {
    const state = e.target.value;

    setForm((prev) => ({
      ...prev,
      state,
      city: "",
    }));

    setErrors((prev) => ({ ...prev, state: "", city: "" }));


    setCities([]);

    if (!state || !form.country) return;

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: form.country, state }
      );
      setCities(res.data.data);
    } catch (err) {
      console.error("City fetch error:", err);
    }
  };

  const [editAddress, setEditAddress] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    alternate_phone_number: "",
    pincode: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    address_type: "Home",
    is_default: false,
  });
  const [loading, setLoading] = useState(false);
  const [showUseLocationButton, setShowUseLocationButton] = useState(false);
  // ---------------- HANDLE FORM CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ---------------- CREATE OR UPDATE ADDRESS ----------------
  const handleSubmit = async () => {
    if (!validate()) return; // ❗ stop here if invalid

    setLoading(true);
    console.log("user data is ", user);

    try {
      if (editAddress) {
        // UPDATE
        await axios.post(
          `${constantApi.baseUrl}/shipping_address/update/${editAddress.id}`,
          form
        );
        console.log("Address updated");
        setShowUseLocationButton(false); // Hide button on edit
      } else {
        // CREATE
        const finalData = {
          ...form,
          customer_id: user.id,
          customer_code: user.customer_code,
          email: user.email,
        };
        await axios.post(
          `${constantApi.baseUrl}/shipping_address/create`,
          finalData
        );
        console.log("Address created");
        setShowUseLocationButton(true); // ✅ Show button after save
      }

      setShowModal(false);
      setEditAddress(null);
      setForm({
        full_name: "",
        phone_number: "",
        alternate_phone_number: "",
        pincode: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "",
        address_type: "Home",
        is_default: false,
      });

      refreshAddresses(); // Refresh addresses in Accounts.jsx
    } catch (err) {
      console.error("Failed:", err);
    }

    setLoading(false);
    setShowUseLocationButton(true); // Show the button after saving
  };

  // ---------------- EDIT ADDRESS ----------------
  const handleEdit = async (addr) => {
    setEditAddress(addr);
    setForm({ ...addr });
    setShowModal(true);

    if (addr.country) {
      try {
        const s = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: addr.country }
        );
        const stateList = s.data.data.states.map((x) => x.name);
        setStates(stateList);

        if (addr.state) {
          const c = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/state/cities",
            { country: addr.country, state: addr.state }
          );
          setCities(c.data.data);
        }
      } catch (err) {
        console.error("Edit load error:", err);
      }
    }
  };


  // ---------------- DELETE ADDRESS ----------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(
        `${constantApi.baseUrl}/shipping_address/delete/${id}`
      );
      console.log("Address deleted");
      refreshAddresses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ---------------- GET USER LOCATION ----------------
  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (err) => reject(err.message),
          {
            enableHighAccuracy: true,
            timeout: 20000, // ⬅️ increased
            maximumAge: 0,
          }
        );
      }
    });

  // ---------------- REVERSE GEOCODE ----------------
  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );

      const data = await res.json();
      const a = data.address || {};

      // ✅ AREA / LOCALITY (Dubai + India friendly)
      const area =
        a.neighbourhood ||
        a.suburb ||
        a.quarter ||
        a.city_district ||
        a.district ||
        a.sublocality ||
        a.residential ||
        "";

      // ✅ CITY
      const city =
        a.city || a.town || a.village || a.municipality || a.county || "";

      // ✅ STATE (Dubai uses "emirate")
      const state = a.state || a.emirate || a.state_district || "";

      // ❌ Dubai usually has NO pincode
      const pincode = a.postcode || "";

      // ✅ ADDRESS LINE 1
      const addressLine1 =
        a.house_number && a.road
          ? `${a.house_number} ${a.road}`
          : a.road || a.building || "";

      return {
        address_line1: addressLine1,
        address_line2: area, // 👈 Area / Locality
        city,
        state,
        country: a.country || "",
        pincode,
      };
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return null;
    }
  };

  const handleSelectAddress = (id) => {
    setSelectedId(id);
    localStorage.setItem("selectedShippingAddressId", id);
  };
  useEffect(() => {
    if (!selectedId && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.is_default);
      if (defaultAddress) setSelectedId(defaultAddress.id);
    }
  }, [addresses, selectedId]);
  // ---------------- FILL FORM USING LOCATION ----------------
  const fillFormWithLocation = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      const address = await getAddressFromCoordinates(latitude, longitude);

      if (!address) return;

      setForm((prev) => ({
        ...prev,
        ...address,
      }));
    } catch (err) {
      console.error("Could not fetch location:", err);
      alert("Location access denied or unavailable");
    }
  };

  const handleLocationChange = async (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    console.log("Latitude:", newLat);
    console.log("Longitude:", newLng);
    const address = await getAddressFromCoordinates(newLat, newLng);
    if (address) {
      setForm((prev) => ({ ...prev, ...address }));
    }
  };

  return (
    <div className={embedded ? "" : "container mx-auto px-4 py-6"}>
      {!embedded && (
        <h2 className="text-2xl font-semibold mb-6">Shipping Addresses</h2>
      )}

      {/* ADDRESS GRID */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        {/* {addresses.length === 0 && (
          <div className="col-span-1 sm:col-span-2 text-center">
            <p className="text-gray-700 font-medium mb-4">
              No shipping address found.
            </p>
          </div>
        )} */}

        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white border rounded-lg shadow p-4 cursor-pointer transition hover:shadow-lg relative ${selectedId === address.id
              ? "border-blue-500 ring-1 ring-blue-400"
              : ""
              }`}
            onClick={() => handleSelectAddress(address.id)}
            style={{ minHeight: "200px" }}
          >
            {/* Checkbox + Info */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                readOnly
                checked={selectedId === address.id}
                className="mt-1 accent-blue-500"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {address.full_name}
                </h3>

                <p className="text-sm text-gray-600">{address.phone_number}</p>

                {address.alternate_phone_number && (
                  <p className="text-sm text-gray-600">
                    {address.alternate_phone_number}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  {address.address_line1}
                  {address.address_line2 && `, ${address.address_line2}`}
                </p>

                <p className="text-sm text-gray-600">
                  {address.city}, {address.state}, {address.pincode},{" "}
                  {address.country}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Type: {address.address_type}
                </p>
              </div>
            </div>

            {/* Edit/Delete Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(address);
                }}
                className="px-3 py-1 !bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address.id);
                }}
                className="px-3 py-1 !bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* ADD NEW ADDRESS CARD */}
        <div
          onClick={() => {
            setEditAddress(null);
            setShowModal(true);
          }}
          className="border rounded-lg shadow p-4 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:shadow-md transition"
          style={{ minHeight: "200px" }}
        >
          <div className="text-3xl text-blue-600 font-bold">+</div>
          <p className="!text-gray-700 mt-2 font-medium">Add New Address</p>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto
                 rounded-xl shadow-xl"
          >
            {/* ===== Header ===== */}
            <div className="px-4 py-3 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-center">
                {editAddress ? "Edit Address" : "Add New Address"}
              </h2>
            </div>

            {/* ===== Form ===== */}
            <div className="px-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">

                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className={`w-full h-9 px-3 rounded-md border text-sm
    ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.full_name && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.full_name}</p>
                  )}

                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setForm((prev) => ({ ...prev, phone_number: val }));

                      if (/^\d{10}$/.test(val)) {
                        setErrors((prev) => ({ ...prev, phone_number: "" }));
                      }
                    }}
                    className={`w-full h-9 px-3 rounded-md border text-sm
    ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
                  />

                  {errors.phone_number && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.phone_number}</p>
                  )}

                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    name="alternate_phone_number"
                    value={form.alternate_phone_number}
                    onChange={handleChange}
                    className="w-full h-9 px-3 rounded-md border text-sm"
                  />
                </div>
                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    className={`w-full h-9 px-3 rounded-md border text-xs
    ${errors.address_line1 ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.address_line1 && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.address_line1}</p>
                  )}

                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    placeholder="Area, Locality, Landmark"
                    className="w-full h-9 px-3 rounded-md border text-xs"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Country
                  </label>

                  <select
                    value={form.country}
                    onChange={handleCountryChange}
                    className={`w-full h-9 px-3 rounded-md border text-xs bg-white
      ${errors.country ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {errors.country && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    State
                  </label>

                  <select
                    value={form.state}
                    onChange={handleStateChange}
                    disabled={!states.length}
                    className={`w-full h-9 px-3 rounded-md border text-xs bg-white disabled:bg-gray-100
      ${errors.state ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {errors.state && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    City
                  </label>

                  <select
                    value={form.city}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, city: e.target.value }));
                      if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                    }}
                    disabled={!cities.length}
                    className={`w-full h-9 px-3 rounded-md border text-xs bg-white disabled:bg-gray-100
      ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {errors.city && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Pincode */}
                {/* Pincode */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    maxLength={6}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setForm((prev) => ({ ...prev, pincode: val }));

                      // ✅ clear error only when valid
                      if (/^\d{6}$/.test(val)) {
                        setErrors((prev) => ({ ...prev, pincode: "" }));
                      }
                    }}
                    className={`w-full h-9 px-3 rounded-md border text-sm
      ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
                  />

                  {errors.pincode && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>
                  )}
                </div>

              </div>

              {/* Default Address */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label className="text-xs text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            {/* ===== Footer ===== */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 py-3 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 h-9 !bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-5 h-9 !bg-blue-600 text-white rounded-md text-sm disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
