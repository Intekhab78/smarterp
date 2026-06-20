import React, { useState, useEffect } from "react";
import { AiOutlineDoubleRight, AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteOutline, MdSettings } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import Pagination from "../Pagination";
import constantApi from "../../constantApi";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const Role_Masters = () => {
  const [roleMaster, setRoleMaster] = useState([]);
  const [popoverId, setPopoverId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/role_master/list`)
      .then((res) => setRoleMaster(res.data.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleActivity = (id) => setPopoverId(popoverId === id ? null : id);
  const handleEditActivity = (id) => {
    const role = roleMaster.find((data) => data.role_id === id);
    navigate("/edit_role_master", { state: { role } });
  };
  const handleViewActivity = (id) => {
    navigate(`/view_role_master/${id}`);
  };

  const deleteRole = (id) => {
    axios
      .delete(`${constantApi.baseUrl}/role_master/${id}`)
      .then(() =>
        setRoleMaster((prev) => prev.filter((data) => data.role_id !== id))
      )
      .catch((err) => alert("Failed to delete the module."));
  };

  const filteredModules = roleMaster.filter((data) =>
    data.role_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
        <header className=" mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <AiOutlineDoubleRight
                className="text-gray-600 text-xl cursor-pointer"
                onClick={() => navigate(-1)}
                title="Back"
              />
              <MdSettings className="text-blue-600 text-3xl" />
              <h1 className="text-xl font-semibold text-gray-700">
                Role Master
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/add_role_master">
                <button className="bg-blue-600 text-white py-2 px-4 text-sm rounded-lg hover:bg-blue-700 transition">
                  + New
                </button>
              </Link>
              <div className="relative">
                <GiHamburgerMenu
                  className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900"
                  onClick={() => setPopoverId((prev) => !prev)}
                />
                {popoverId && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-200 z-10">
                    <ul>
                      <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        Import
                      </li>
                      <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        Export
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-end">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64 px-3 py-2 text-sm border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by Name"
            />
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-4">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="p-4">Role Name</th>
                <th className="p-4">Role ID</th>
                <th className="p-4">Description</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((data) => (
                <tr key={data.module_id} className="border-b">
                  <td className="p-4 leading-tight">{data.role_name}</td>
                  <td className="p-4 leading-tight">{data.role_id}</td>
                  <td className="p-4 leading-tight">{data.role_description}</td>
                  <td className="p-4 flex gap-2 leading-tight">
                    <BiSolidEdit
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEditActivity(data.role_id)}
                      title="Edit"
                    />
                    <MdDeleteOutline
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => deleteRole(data.role_id)}
                      title="Delete"
                    />
                    <AiOutlineEye
                      className="text-green-600 cursor-pointer hover:text-green-800"
                      onClick={() => handleViewActivity(data.role_id)}
                      title="View"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <Pagination /> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Role_Masters;
