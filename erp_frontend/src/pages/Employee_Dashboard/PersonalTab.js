// PersonalTab.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../../constantApi";

export default function PersonalTab({
  employee,
  setEmployee,
  goToNextTab = () => {},
}) {
  const [personalData, setPersonalData] = useState({
    email: "",
    phone: "",
    bank: "",
    emergencyContact: "",
    emergencyPhone: "",
    permitNo: "",
    permitExpiry: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    distance: "",
    certificate: "",
    fieldOfStudy: "",
    legalName: "",
    birthday: "",
    birthPlace: "",
    gender: "",
    nationality: "",
    idNo: "",
    ssn: "",
    passport: "",
    maritalStatus: "",
    dependents: "",
    familyType: "",
    fatherTitle: "",
    fatherName: "",
    motherTitle: "",
    motherName: "",
    familyMembers: [],
  });

  // ---------------------- COUNTRY / STATE / CITY ----------------------
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
      .then((res) => {
        const sorted = res.data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
            phoneCode: c.idd?.root
              ? c.idd.root + (c.idd.suffixes?.[0] || "")
              : "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(sorted);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);
  const handleCountryChange = async (e) => {
    const countryName = e.target.value;

    setSelectedCountry(countryName);
    setSelectedState("");
    setStates([]);
    setCities([]);

    setPersonalData((prev) => ({
      ...prev,
      country: countryName,
      state: "",
      city: "",
    }));

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
    setCities([]);

    setPersonalData((prev) => ({
      ...prev,
      state: stateName,
      city: "",
    }));

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!employee?.emp_id) {
        alert("❌ Employee ID missing. Please create employee first.");
        return;
      }

      // Prepare plain JSON payload
      const payload = {
        emp_id: employee.emp_id, // ✅ this will be parsed by backend
        ...personalData, // ✅ spread all personalData fields
      };
      console.log("🚀 Sending payload:", payload);
      const res = await axios.post(
        `${constantApi.baseUrl}/personal/create`,
        payload,
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("✅ Personal details saved:", res.data);
      alert("✅ Personal info saved successfully!");
      if (typeof setEmployee === "function") {
        setEmployee((prev) => ({ ...prev, personal_details: res.data.data }));
      }
      goToNextTab();
    } catch (err) {
      console.error(
        "❌ Failed to save personal info:",
        err.response?.data || err.message,
      );
      alert("❌ Failed to save personal info!");
    }
  };

  const handleDelete = async () => {
    if (!employee?.emp_id) return alert("❌ Employee ID missing.");

    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete this personal information?",
      )
    )
      return;

    try {
      const res = await axios.delete(
        `${constantApi.baseUrl}/personal/delete/${employee.emp_id}`,
      );
      console.log("✅ Personal details deleted:", res.data);
      alert("✅ Personal details deleted successfully.");

      // Clear UI data
      setPersonalData({
        email: "",
        phone: "",
        bank: "",
        emergencyContact: "",
        emergencyPhone: "",
        permitNo: "",
        permitExpiry: "",
        address: "",
        distance: "",
        certificate: "",
        fieldOfStudy: "",
        legalName: "",
        birthday: "",
        birthPlace: "",
        gender: "",
        nationality: "",
        idNo: "",
        ssn: "",
        passport: "",
        maritalStatus: "",
        dependents: "",
      });

      setEmployee((prev) => ({ ...prev, personal_details: null }));
    } catch (err) {
      console.error(
        "❌ Failed to delete personal info:",
        err.response?.data || err.message,
      );
      // alert("❌ Failed to delete personal info!");
    }
  };
  // Dynamic family members array

  // Add new member
  const addFamilyMember = () => {
    setPersonalData((prev) => ({
      ...prev,
      familyMembers: [
        ...(prev.familyMembers || []),
        { relationship: "", name: "" },
      ],
    }));
  };

  // Update member details
  const handleFamilyChange = (index, key, value) => {
    setPersonalData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.map((m, i) =>
        i === index ? { ...m, [key]: value } : m,
      ),
    }));
  };

  // Remove member
  const removeFamilyMember = (index) => {
    setPersonalData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (employee?.personal_details) {
      const d = employee.personal_details;

      setPersonalData({
        ...d,
        birthday: d.birthday ? d.birthday.split("T")[0] : "",
        permitExpiry: d.permitExpiry ? d.permitExpiry.split("T")[0] : "",
        familyMembers: (d.familyMembers || []).map((m) => ({
          relationship: m.relation, // ✅ map correctly
          name: m.fullName, // ✅ map correctly
        })),
      });
    }
  }, [employee]);

  const handleChangeFile = (field, file) => {
    setPersonalData((prev) => ({ ...prev, [field]: file }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Private Contact */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Private Contact & Bank Details
        </h4>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            value={personalData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2"
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            value={personalData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded px-3 py-2"
          />

          {/* Bank Account */}
          <input
            type="text"
            name="bank"
            value={personalData.bank}
            onChange={handleChange}
            placeholder="Bank Account"
            className="border rounded px-3 py-2"
          />

          {/* Bank Name */}
          <input
            type="text"
            name="bankName"
            value={personalData.bankName || ""}
            onChange={handleChange}
            placeholder="Bank Name"
            className="border rounded px-3 py-2"
          />

          {/* IFSC / IBAN */}
          <input
            type="text"
            name="ifsc"
            value={personalData.ifsc || ""}
            onChange={handleChange}
            placeholder="IFSC / IBAN"
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Emergency Contact
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="emergencyContact"
            value={personalData.emergencyContact}
            onChange={handleChange}
            placeholder="Contact"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="emergencyPhone"
            value={personalData.emergencyPhone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Work Permit */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Work Permit
        </h4>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input
            type="text"
            name="permitNo"
            value={personalData.permitNo}
            onChange={handleChange}
            placeholder="Permit No"
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            name="permitExpiry"
            value={personalData.permitExpiry}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="file"
            // onChange={handlePermitUpload}
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Location */}

      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Location
        </h4>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Address Line 1 */}
          <input
            type="text"
            name="addressLine1"
            value={personalData.addressLine1}
            onChange={handleChange}
            placeholder="House No, Street Name"
            className="border rounded px-3 py-2 col-span-2"
          />

          {/* Address Line 2 */}
          <input
            type="text"
            name="addressLine2"
            value={personalData.addressLine2}
            onChange={handleChange}
            placeholder="Area / Landmark"
            className="border rounded px-3 py-2 col-span-2"
          />

          {/* Country */}
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Country</option>
            {countries.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={handleStateChange}
            disabled={!states.length}
            className="border rounded px-3 py-2"
          >
            <option value="">Select State</option>
            {states.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            name="city"
            value={personalData.city}
            onChange={handleChange}
            disabled={!cities.length}
            className="border rounded px-3 py-2"
          >
            <option value="">Select City</option>
            {cities.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Pincode */}
          <input
            type="text"
            name="pincode"
            value={personalData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border rounded px-3 py-2"
          />

          {/* Distance */}
          <input
            type="number"
            name="distance"
            value={personalData.distance}
            onChange={handleChange}
            placeholder="Home–Work Distance (km)"
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Education */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Education
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="certificate"
            value={personalData.certificate}
            onChange={handleChange}
            placeholder="Certificate Level"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="fieldOfStudy"
            value={personalData.fieldOfStudy}
            onChange={handleChange}
            placeholder="Field of Study"
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Birth Information */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Birth Information
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="legalName"
            value={personalData.legalName}
            onChange={handleChange}
            placeholder="Legal Name"
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            name="birthday"
            value={personalData.birthday}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="birthPlace"
            value={personalData.birthPlace}
            onChange={handleChange}
            placeholder="Place of Birth"
            className="border rounded px-3 py-2"
          />
          <select
            name="gender"
            value={personalData.gender}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </section>

      {/* Citizenship */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Citizenship
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="nationality"
            value={personalData.nationality}
            onChange={handleChange}
            placeholder="Nationality"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="idNo"
            value={personalData.idNo}
            onChange={handleChange}
            placeholder="Identification No"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="ssn"
            value={personalData.ssn}
            onChange={handleChange}
            placeholder="SSN No"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="passport"
            value={personalData.passport}
            onChange={handleChange}
            placeholder="Passport No"
            className="border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Family */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Family
        </h4>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Marital Status */}
          <select
            name="maritalStatus"
            value={personalData.maritalStatus}
            onChange={(e) => {
              handleChange(e);
              // Reset dynamic family members array if not married
              if (e.target.value !== "Married") {
                setPersonalData((prev) => ({
                  ...prev,
                  familyMembers: [],
                }));
              }
            }}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Marital Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>

          {/* Dependent Children */}
          <input
            type="number"
            name="dependents"
            value={personalData.dependents}
            onChange={handleChange}
            placeholder="Dependent Children"
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Father + Mother Fields (Always Show in one row) */}
        <div className="flex gap-4 mt-4">
          {/* Father */}
          <div className="flex gap-2 flex-1">
            <select
              name="fatherTitle"
              value={personalData.fatherTitle}
              onChange={handleChange}
              className="border rounded px-2 py-2 w-24"
            >
              <option value="">Title</option>
              <option>Mr</option>
              <option>Dr</option>
            </select>

            <input
              type="text"
              name="fatherName"
              value={personalData.fatherName}
              onChange={handleChange}
              placeholder="Father Name"
              className="border rounded px-3 py-2 flex-1"
            />
          </div>

          {/* Mother */}
          <div className="flex gap-2 flex-1">
            <select
              name="motherTitle"
              value={personalData.motherTitle}
              onChange={handleChange}
              className="border rounded px-2 py-2 w-24"
            >
              <option value="">Title</option>
              <option>Mrs</option>
              <option>Ms</option>
              <option>Dr</option>
            </select>

            <input
              type="text"
              name="motherName"
              value={personalData.motherName}
              onChange={handleChange}
              placeholder="Mother Name"
              className="border rounded px-3 py-2 flex-1"
            />
          </div>
        </div>

        {/* Dynamic Family Members (Only if Married) */}
        {personalData.maritalStatus === "Married" && (
          <div className="mt-4">
            {/* <h5 className="font-semibold mb-2">Add Family Members</h5> */}

            {personalData.familyMembers.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                {/* Relationship */}
                <select
                  value={member.relationship}
                  onChange={(e) =>
                    handleFamilyChange(index, "relationship", e.target.value)
                  }
                  className="border rounded px-2 py-2 w-32"
                >
                  <option value="">Select</option>
                  <option>Wife</option>
                  <option>Son</option>
                  <option>Daughter</option>
                </select>

                {/* Name */}
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleFamilyChange(index, "name", e.target.value)
                  }
                  placeholder="Full Name"
                  className="border rounded px-3 py-2 flex-1"
                />

                {/* Certificate / Document Upload */}
                {/* <input
                  type="file"
                  onChange={(e) =>
                    handleFamilyChange(index, "file", e.target.files[0])
                  }
                  className="border rounded px-3 py-2 w-48"
                /> */}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add New Family Member Button */}
            <button
              type="button"
              onClick={addFamilyMember}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              + Add Member
            </button>
          </div>
        )}
      </section>

      {/* Save and Delete Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleDelete}
          className="px-8 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90"
        >
          🗑️ Delete
        </button>

        <button
          onClick={handleSave}
          className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90"
        >
          💾 Save & Next
        </button>
      </div>
    </div>
  );
}
