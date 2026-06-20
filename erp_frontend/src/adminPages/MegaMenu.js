import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { routes, routesUser, routesPOS } from "../routes";
import functionRouteMap from "../functionRouteMap";

function MegaMenu() {
  const [modules, setModules] = useState([]);
  const [sub_modules, setSub_Modules] = useState([]);
  const [function_master, setFunction_master] = useState([]);
  const [filteredSubModules, setFilteredSubModules] = useState({});
  const [activeSubModuleId, setActiveSubModuleId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const user_data = JSON.parse(localStorage.getItem("user_data"));
  const userGroupData = user_data?.user_group || [];
  const userType = localStorage.getItem("usertype");

  // 🧭 Pick correct routes array
  // const currentRoutes =
  //   userType === "1" ? routes : userType === "2" ? routesUser : routesPOS;

  // ✅ Adjust keys to match your backend (camelCase or snake_case)
  const isModuleIdInUserGroup = (id) =>
    userGroupData?.some((i) => i.module_id === id || i.moduleId === id);

  const isSubModuleIdInUserGroup = (id) =>
    userGroupData?.some((i) => i.sub_module_id === id || i.subModuleId === id);

  const isFunctionIdInUserGroup = (id) =>
    userGroupData?.some(
      (i) => i.function_master_id === id || i.functionMasterId === id
    );

  const handleExpandAll = () => setExpanded((prev) => !prev);
  const handleModuleViewActivity = (id) =>
    navigate(`/view_module_master/${id}`);
  const handleSubModuleViewActivity = (id) =>
    navigate(`/view_sub_module_master/${id}`);

  // 🧭 Correct route selection by user type
  const handleFunctionViewActivity = (functionName) => {
    const mapped =
      functionRouteMap[functionName.trim()] ||
      functionName.toLowerCase().trim();

    const routeObj = currentRoutes.find(
      (r) => r?.name?.toLowerCase() === mapped
    );

    if (routeObj?.route) {
      navigate(routeObj.route);
    } else {
      console.warn("No route found for:", functionName);
    }
  };

  useEffect(() => {
    console.log("User Data:", user_data);
    console.log("User Type:", userType);
    console.log("User Group Data:", userGroupData);

    axios
      .get(`${constantApi.baseUrl}/module_master/list`)
      .then((res) => setModules(res.data.data))
      .catch(console.error);

    axios
      .get(`${constantApi.baseUrl}/sub_module_master/list`)
      .then((res) => {
        const subs = res.data.data;
        setSub_Modules(subs);
        const grouped = subs.reduce((acc, sub) => {
          acc[sub.module_id] = acc[sub.module_id] || [];
          acc[sub.module_id].push(sub);
          return acc;
        }, {});
        setFilteredSubModules(grouped);
      })
      .catch(console.error);

    axios
      .get(`${constantApi.baseUrl}/function_master/list`)
      .then((res) => setFunction_master(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <nav className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-lg h-screen overflow-y-auto font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
          System Modules
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 w-60 border border-gray-300 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <button
            onClick={handleExpandAll}
            className="p-2 bg-white border rounded-full shadow-sm hover:bg-blue-50 transition"
            title={expanded ? "Collapse All" : "Expand All"}
          >
            {expanded ? <BiCollapse size={18} /> : <BiExpand size={18} />}
          </button>
        </div>
      </header>

      {/* Modules */}
      <div className="space-y-5">
        {modules
          .filter((m) => userType === "1" || isModuleIdInUserGroup(m.module_id))
          .map((moduleData, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition duration-300"
            >
              {/* Module Header */}
              <div
                className="flex justify-between items-center cursor-pointer border-b pb-2 mb-3"
                onClick={() => handleModuleViewActivity(moduleData.module_id)}
              >
                <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <AiOutlineEye size={18} className="text-blue-500" />
                  {moduleData.module_name}
                </h2>
              </div>

              {/* Submodules */}
              <div className="grid md:grid-cols-4 gap-3">
                {filteredSubModules[moduleData.module_id]
                  ?.filter(
                    (s) =>
                      (userType === "1" ||
                        isSubModuleIdInUserGroup(s.sub_module_id)) &&
                      s.sub_module_name.toLowerCase().includes(searchTerm)
                  )
                  .map((sub, j) => (
                    <div
                      key={j}
                      className="bg-gray-50 border rounded-lg p-3 hover:bg-blue-50 transition"
                    >
                      <button
                        onClick={() =>
                          setActiveSubModuleId(
                            activeSubModuleId === sub.sub_module_id
                              ? null
                              : sub.sub_module_id
                          )
                        }
                        className="w-full flex justify-between items-center text-sm font-medium text-gray-800"
                      >
                        {sub.sub_module_name}
                        {activeSubModuleId === sub.sub_module_id || expanded ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </button>

                      {/* Functions */}
                      <AnimatePresence>
                        {(activeSubModuleId === sub.sub_module_id ||
                          expanded) && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 space-y-1 pl-3 border-l border-gray-200"
                          >
                            {function_master
                              .filter(
                                (f) =>
                                  f.sub_module_id === sub.sub_module_id &&
                                  (userType === "1" ||
                                    isFunctionIdInUserGroup(
                                      f.function_master_id
                                    ))
                              )
                              .map((func, k) => (
                                <li
                                  key={k}
                                  onClick={() =>
                                    handleFunctionViewActivity(
                                      func.function_master_name
                                    )
                                  }
                                  className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer transition"
                                >
                                  • {func.function_master_name}
                                </li>
                              ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </nav>
  );
}

export default MegaMenu;
