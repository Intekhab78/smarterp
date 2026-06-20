
const ProfileSection = ({
  customer,
  loadingCustomer,
  cancelEditProfile,   // ✅ ADD THIS
  isEditing,
  isLoading,
  profileForm,
  underlineInput,
  startEditProfile,
  updateProfile,
  handleProfileChange,

  BounceLoader,
}) => {
  return (
    <div className="shadow rounded bg-white p-4 hover:shadow-lg transition">
      <form action=""
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile()
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800 text-base md:text-lg">Personal Profile</h3>

          <div className="flex gap-2 ">

            {/* UPDATE BUTTON (no submit) */}
            {!isEditing && (
              <button
                type="button"
                onClick={startEditProfile}
                disabled={isLoading}
                className="px-3 py-1
  text-xs lg:px-4! lg:py-2!
  sm:px-4 sm:py-2
  sm:text-xs
  rounded-md
  text-white
  !bg-blue-600"
              >
                Update Profile
              </button>
            )}

            {/* SAVE BUTTON (submit only) */}
            {isEditing && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-1 rounded-md text-white text-sm !bg-green-600"
              >
                {isLoading ? "Please wait..." : "Save"}
              </button>
            )}

            {/* CANCEL BUTTON */}
            {isEditing && (
              <button
                type="button"
                onClick={cancelEditProfile}
                disabled={isLoading}
                className="px-3 py-1 rounded-md text-sm !bg-gray-700 text-white"
              >
                Cancel
              </button>
            )}

          </div>

        </div>


        {/* Body */}
        {loadingCustomer ? (
          <BounceLoader />
        ) : customer ? (
          <div className="space-y-3 text-sm">
            {/* Row 1 */}
            <div className="flex gap-2 flex-wrap">
              <Field label="Email" className="flex-1">
                <p>{customer.email}</p>
              </Field>

              <Field label="First Name" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.first_name}</p>
                )}
              </Field>
            </div>

            {/* Row 2 */}
            <div className="flex gap-3 flex-wrap">
              <Field label="Last Name" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.last_name || "-"}</p>
                )}
              </Field>

              <Field label="Phone" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.phone || "-"}</p>
                )}
              </Field>
            </div>

            {/* Row 3 */}

            <div className="flex gap-3 flex-wrap">
              {/* <Field label="DOB" className="flex-1"> {isEditing ? ( <input type="date" name="dob" value={profileForm.dob} onChange={handleProfileChange} style={underlineInput} className="text-gray-500 w-full py-1" max={new Date().toISOString().split("T")[0]} /> ) : ( <p>{customer.dob || "-"}</p> )} </Field> */}

              <Field label="DOB" className="flex-1">
                <p>{customer.dob || "-"}</p>
              </Field>

              <Field label="Gender" className="flex-1">
                <p>{customer.gender || "-"}</p>
              </Field>
            </div>

            {/* Row 4 */}
            <div className="flex gap-3 flex-wrap">
              <Field label="Address" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="billing_address"
                    value={profileForm.billing_address}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                    placeholder="Enter billing address"
                  />
                ) : (
                  <p>{customer.billing_address || "-"}</p>
                )}
              </Field>

              <Field label="City" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.city || "-"}</p>
                )}
              </Field>
            </div>

            {/* Row 5 */}
            <div className="flex gap-3 flex-wrap">
              <Field label="State" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="state"
                    value={profileForm.state}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.state || "-"}</p>
                )}
              </Field>

              <Field label="Country" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    type="text"
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                    placeholder="Country"
                  />
                ) : (
                  <p>{customer.country || "-"}</p>
                )}
              </Field>
            </div>

            {/* Row 6 */}
            <div className="flex gap-3 flex-wrap">
              <Field label="Zipcode" className="flex-1">
                {isEditing ? (
                  <input
                    required
                    pattern="[0-9]{6}"
                    title="Enter 6 digit ZIP code"
                    type="text"
                    name="zipcode"
                    value={profileForm.zipcode}
                    onChange={handleProfileChange}
                    style={underlineInput}
                    className="text-gray-500 w-full py-1"
                  />
                ) : (
                  <p>{customer.zipcode || "-"}</p>
                )}
              </Field>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-sm">Failed to load customer details.</p>
        )}
      </form>
    </div>
  );
};

export default ProfileSection;

/* Small helper */
const Field = ({ label, children, className = "" }) => (
  <div className={`mb-1 ${className}`}>
    <p className="text-gray-700 font-semibold text-sm mb-1">{label}:</p>
    {children}
  </div>
);
