import { useEffect, useState } from "react";
import axios from "axios";


const ShippingAddressList = ({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  open,
  onClose,
  onSave,
  newAddress,
  onChange,
}) => {
  const [errors, setErrors] = useState({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => {
        const list = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(list);
      })
      .catch((err) => console.error("Country error:", err));
  }, []);
  const handleCountryChange = async (e) => {
    const country = e.target.value;

    onChange({
      target: { name: "country", value: country },
    });

    onChange({ target: { name: "state", value: "" } });
    onChange({ target: { name: "city", value: "" } });

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
      console.error("State error:", err);
    }
  };
  const handleStateChange = async (e) => {
    const state = e.target.value;

    onChange({
      target: { name: "state", value: state },
    });

    onChange({ target: { name: "city", value: "" } });

    setCities([]);

    if (!state || !newAddress.country) return;

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: newAddress.country, state }
      );
      setCities(res.data.data);
    } catch (err) {
      console.error("City error:", err);
    }
  };
  useEffect(() => {
    if (newAddress.country) {
      (async () => {
        try {
          const s = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/states",
            { country: newAddress.country }
          );
          const stateList = s.data.data.states.map((x) => x.name);
          setStates(stateList);

          if (newAddress.state) {
            const c = await axios.post(
              "https://countriesnow.space/api/v0.1/countries/state/cities",
              { country: newAddress.country, state: newAddress.state }
            );
            setCities(c.data.data);
          }
        } catch (err) {
          console.error("Auto load error:", err);
        }
      })();
    }
  }, [open]);
  const validate = () => {
    const newErrors = {};

    if (!newAddress.full_name?.trim())
      newErrors.full_name = "Full name is required";

    if (!newAddress.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(newAddress.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }

    if (!newAddress.address_line1?.trim())
      newErrors.address_line1 = "Address line 1 is required";

    if (!newAddress.country)
      newErrors.country = "Country is required";

    if (!newAddress.state)
      newErrors.state = "State is required";

    if (!newAddress.city)
      newErrors.city = "City is required";

    if (!newAddress.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(newAddress.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      {/* Address List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-3 sm:p-4">
        <h2 className="text-sm sm:text-base font-semibold mb-3">
          Shipping Address
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelect(address.id)}
              className={`border rounded-lg p-3 cursor-pointer transition
                ${selectedId === address.id
                  ? "border-blue-500 ring-1 ring-blue-400"
                  : "hover:border-gray-300"
                }`}
            >
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={selectedId === address.id}
                  readOnly
                  className="mt-1 accent-blue-500"
                />

                <div className="text-xs sm:text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">
                    {address.full_name}
                  </p>
                  <p>{address.phone_number}</p>

                  {address.alternate_phone_number && (
                    <p>{address.alternate_phone_number}</p>
                  )}

                  <p>
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>

                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {address.country}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Address */}
          <div
            onClick={onAddNew}
            className="border rounded-lg p-3 flex flex-col 
                       justify-center items-center cursor-pointer
                       hover:border-blue-500 transition"
          >
            <div className="text-2xl text-blue-600">+</div>
            <p className="text-xs sm:text-sm mt-1">Add New Address</p>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto
                 rounded-xl px-4 py-5"
          >
            <h3 className="text-base sm:text-lg font-semibold text-center mb-4">
              Add New Address
            </h3>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  value={newAddress.full_name}
                  onChange={onChange}
                  className="w-full h-9 px-3 rounded-md border text-sm"
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
                  name="phone_number"
                  value={newAddress.phone_number}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    onChange({ target: { name: "phone_number", value: val } });

                    if (/^\d{10}$/.test(val)) {
                      setErrors((prev) => ({ ...prev, phone_number: "" }));
                    }
                  }}
                  className="w-full h-9 px-3 rounded-md border text-sm"
                />

                {errors.phone_number && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phone_number}</p>
                )}

              </div>

              {/* Alt Phone */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Alternate Phone
                </label>
                <input
                  name="alternate_phone_number"
                  value={newAddress.alternate_phone_number}
                  onChange={onChange}
                  className="w-full h-9 px-3 rounded-md border text-sm"
                />
              </div>
              {/* Address 1 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Address Line 1
                </label>
                <input
                  name="address_line1"
                  value={newAddress.address_line1}
                  onChange={onChange}
                  className="w-full h-9 px-3 rounded-md border text-xs"
                />
                {errors.address_line1 && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.address_line1}</p>
                )}

              </div>

              {/* Address 2 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Address Line 2
                </label>
                <input
                  name="address_line2"
                  value={newAddress.address_line2}
                  onChange={onChange}
                  placeholder="Area, Locality, Landmark (optional)"
                  className="w-full h-9 px-3 rounded-md border text-xs placeholder:text-gray-400"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Country
                </label>

                <select
                  value={newAddress.country}
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
                  value={newAddress.state}
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
                  value={newAddress.city}
                  onChange={(e) =>
                    onChange({ target: { name: "city", value: e.target.value } })
                  }
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
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Pincode
                </label>
                <input
                  name="pincode"
                  value={newAddress.pincode}
                  maxLength={6}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    onChange({ target: { name: "pincode", value: val } });

                    if (/^\d{6}$/.test(val)) {
                      setErrors((prev) => ({ ...prev, pincode: "" }));
                    }
                  }}
                  className="w-full h-9 px-3 rounded-md border text-sm"
                />

                {errors.pincode && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>
                )}

              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  if (validate()) {
                    onSave();
                  }
                }}
                className="flex-1 h-9 text-sm !bg-blue-600 text-white rounded-md"
              >
                Save
              </button>

              <button
                onClick={onClose}
                className="flex-1 h-9 text-sm !bg-gray-200 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ShippingAddressList;
