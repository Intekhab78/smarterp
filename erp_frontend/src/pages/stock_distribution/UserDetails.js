import { useEffect, useState } from "react";

function UserDetails() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_detail = JSON.parse(localStorage.getItem("user_data"));
    setUser(user_detail);
    console.log("user_detail---", user_detail);
  }, []);

  if (!user) {
    return (
      <p className="text-sm text-gray-500 mt-4 text-center">
        Loading user data...
      </p>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-8 bg-gray-100 rounded-md shadow border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-300 bg-white rounded-t-md">
        <h3 className="text-sm font-medium text-gray-700">User Information</h3>
      </div>
      <div className="px-4 py-4 text-sm text-gray-700 bg-white space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Name</span>
          <span>
            {user.firstname} {user.lastname}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Mobile</span>
          <span>{user.mobile}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">User ID</span>
          <span>{user.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Role ID</span>
          <span>{user.role_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Company ID</span>
          <span>{user.company_id || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Location ID</span>
          <span>{user.location_id || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Login Type</span>
          <span>{user.login_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span>{user.status === 1 ? "Active" : "Inactive"}</span>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
