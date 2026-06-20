import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import constantApi from "../../constantApi";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function UserRole() {
  const [modules, setModules] = useState([]);
  const [sub_modules, setSub_Modules] = useState([]);
  const [function_master, setFunction_master] = useState([]);
  const [filteredSubModules, setFilteredSubModules] = useState({});
  const [checkboxState, setCheckboxState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [actionMaster, setActionMaster] = useState([]);
  const [functionActionMap, setFunctionActionMap] = useState([]);
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [roleChanged, setRoleChanged] = useState(false);
  const [noRecords, setNoRecords] = useState(false);

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/role_master/list`)
      .then((res) => {
        const roleOptions = res.data.data.map((role) => ({
          value: role.role_id,
          label: role.role_name,
        }));
        setRoles(roleOptions);
      })
      .catch((err) => console.error("Error fetching roles:", err));

    axios
      .get(`${constantApi.baseUrl}/module_master/list`)
      .then((res) => {
        setModules(res.data.data);
        console.log("module master data is", res.data.data);
      })
      .catch((err) => console.error("Error fetching modules:", err));

    axios
      .get(`${constantApi.baseUrl}/sub_module_master/list`)
      .then((res) => {
        const subModules = res.data.data;
        setSub_Modules(subModules);
        const filtered = {};
        subModules.forEach((subModule) => {
          if (!filtered[subModule.module_id]) {
            filtered[subModule.module_id] = [];
          }
          filtered[subModule.module_id].push(subModule);
        });
        setFilteredSubModules(filtered);
      })
      .catch((err) => console.error("Error fetching submodules:", err));

    axios
      .get(`${constantApi.baseUrl}/function_master/list`)
      .then((res) => {
        const functions = res.data.data;
        setFunction_master(functions);
        const initialState = {};
        functions.forEach((func) => {
          initialState[func.function_master_id] = {};
        });
        setCheckboxState(initialState);
      })
      .catch((err) => console.error("Error fetching function master:", err));

    axios
      .get(`${constantApi.baseUrl}/action_master/list`)
      .then((res) => setActionMaster(res.data.data))
      .catch((err) => console.error("Error fetching action master:", err));

    axios
      .get(`${constantApi.baseUrl}/function_action_master_map/list`)
      .then((res) => setFunctionActionMap(res.data.data))
      .catch((err) =>
        console.error("Error fetching function-action mapping:", err)
      );
  }, []);

  useEffect(() => {
    if (selectedRoles) {
      const roleId = selectedRoles.value;
      const url = `${constantApi.baseUrl}/user_group/permissions/${roleId}`;

      axios
        .get(url)
        .then((res) => {
          if (res.data.data.length === 0) {
            setNoRecords(true);
          } else {
            setExistingPermissions(res.data.data);
            const updatedCheckboxState = { ...checkboxState };

            if (roleChanged) {
              res.data.data.forEach((permission) => {
                const { function_master_id, action_id } = permission;
                const actionName = actionMaster.find(
                  (action) => action.action_id === action_id
                )?.action_name;

                if (actionName) {
                  updatedCheckboxState[function_master_id] = {
                    ...updatedCheckboxState[function_master_id],
                    [actionName]: 1,
                  };
                }
              });
              setCheckboxState(updatedCheckboxState);
              setRoleChanged(false);
            }
            setNoRecords(false);
          }
        })
        .catch((err) =>
          console.error("Error fetching existing permissions:", err)
        );
    }
  }, [selectedRoles, actionMaster, roleChanged]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = modules.filter((moduleData) => {
    const subModules = filteredSubModules[moduleData.module_id] || [];

    // Check if any field in module, sub-module, function, or action matches search query
    return (
      moduleData.module_name.toLowerCase().includes(searchQuery) ||
      subModules.some((subModule) => {
        return (
          subModule.sub_module_name.toLowerCase().includes(searchQuery) ||
          function_master.some((func) => {
            return (
              func.sub_module_id === subModule.sub_module_id &&
              func.function_master_name.toLowerCase().includes(searchQuery) &&
              functionActionMap.some((map) => {
                return (
                  map.function_master_id === func.function_master_id &&
                  actionMaster.some((action) => {
                    return (
                      action.action_id === map.action_id &&
                      action.action_name.toLowerCase().includes(searchQuery)
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  });

  const filteredFunctionsAndActions = function_master.filter((func) => {
    return (
      func.function_master_name.toLowerCase().includes(searchQuery) ||
      functionActionMap.some((map) => {
        return (
          map.function_master_id === func.function_master_id &&
          actionMaster.some((action) => {
            return (
              action.action_id === map.action_id &&
              action.action_name.toLowerCase().includes(searchQuery)
            );
          })
        );
      })
    );
  });

  const handleActionChange = (functionId, action) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [functionId]: {
        ...prevState[functionId],
        [action]: prevState[functionId]?.[action] === 1 ? 0 : 1,
      },
    }));
  };

  // const handleRoleChange = (selectedOption) => {
  //   setSelectedRoles(selectedOption || null);
  //   setRoleChanged(true);
  // };

  const handleRoleChange = (selectedOption) => {
    setSelectedRoles(selectedOption || null);
    setRoleChanged(true);

    // Reset checkbox state
    const newCheckboxState = {};

    // Assuming userGroupData has permissions for each role
    if (selectedOption) {
      const selectedRoleId = selectedOption.value;

      const rolePermissions = modules.filter(
        (item) => item.role_id === selectedRoleId
      );

      rolePermissions.forEach((item) => {
        const functionId = item.function_master_id;
        const actionName = item.action_name;

        if (!newCheckboxState[functionId]) {
          newCheckboxState[functionId] = {};
        }

        newCheckboxState[functionId][actionName] = 1;
      });
    }

    setCheckboxState(newCheckboxState);
  };

  const handleSubmit = () => {
    const finalData = [];

    modules.forEach((moduleData) => {
      const subModules = filteredSubModules[moduleData.module_id] || [];

      subModules.forEach((subModuleData) => {
        const functions = function_master.filter(
          (func) => func.sub_module_id === subModuleData.sub_module_id
        );

        functions.forEach((func) => {
          const actionsForFunction = functionActionMap
            .filter((map) => map.function_master_id === func.function_master_id)
            .map((map) => map.action_id);

          const actions = actionMaster
            .filter((action) => actionsForFunction.includes(action.action_id))
            .reduce((acc, action) => {
              const actionValue =
                checkboxState[func.function_master_id]?.[action.action_name] ||
                0;

              if (actionValue === 1) {
                acc.push(action.action_id);
              }
              return acc;
            }, []);

          actions.forEach((actionId) => {
            if (
              !existingPermissions.some(
                (permission) =>
                  permission.role_id === selectedRoles.value &&
                  permission.action_id === actionId
              )
            ) {
              finalData.push({
                module_id: moduleData.module_id,
                sub_module_id: subModuleData.sub_module_id,
                function_master_id: func.function_master_id,
                role_id: selectedRoles.value,
                action_id: actionId,
              });
            }
          });
        });
      });
    });

    if (finalData.length > 0) {
      console.log("finalData", finalData);

      axios
        .post(
          `${constantApi.baseUrl}/user_group/bulk`,
          { data: finalData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Data submitted successfully:", res.data);
          alert("Data submitted successfully!");
        })
        .catch((err) => {
          console.error("Data submission failed:", err);
          alert("Data failed. Please check.");
        });
    } else {
      alert("No actions selected. Please select at least one action.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          {" "}
          <h6 className="text-2xl font-semibold mb-6">
            Assign Roles, Permissions and Actions to User Groups
          </h6>
          <div className="mb-6 flex space-x-6">
            <div className="w-1/3 ">
              <label htmlFor="roles" className="block text-sm font-medium mb-2">
                Role
              </label>
              <CreatableSelect
                id="roles"
                options={roles}
                value={selectedRoles}
                onChange={handleRoleChange}
                className="w-full text-sm"
                classNamePrefix="select"
                placeholder="Select Role "
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "2px", // Match the search box height
                    padding: "0px 0px", // Add consistent padding
                  }),
                }}
              />
            </div>

            <div className="w-1/3">
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-2"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                className="w-full p-2 text-sm border rounded-lg"
                placeholder="Search across table..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          {noRecords && (
            <div className="bg-yellow-200 text-yellow-700 p-3 rounded-md mb-4">
              No records exist for the selected role.
            </div>
          )}
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-200 text-sm text-gray-600 sticky top-0">
              <tr>
                <th className="px-3 py-1 border">Module</th>
                <th className="px-3 py-1 border">Sub Module</th>
                <th className="px-3 py-1 border">Function</th>
                <th className="px-3 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredData.map((moduleData, index) => {
                const subModules = (
                  filteredSubModules[moduleData.module_id] || []
                ).filter((subModuleData) =>
                  subModuleData.sub_module_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                );
                return subModules.map((subModuleData, subIndex) => {
                  const filteredFunctions = filteredFunctionsAndActions.filter(
                    (func) => func.sub_module_id === subModuleData.sub_module_id
                  );
                  return filteredFunctions.map((func, funcIndex) => {
                    const actionsForFunction = functionActionMap
                      .filter(
                        (map) =>
                          map.function_master_id === func.function_master_id
                      )
                      .map((map) => map.action_id);

                    return (
                      <tr
                        key={`${index}-${subIndex}-${funcIndex}`}
                        className="hover:bg-gray-50"
                      >
                        {funcIndex === 0 && (
                          <td
                            rowSpan={filteredFunctions.length}
                            className="px-3 py-1 border bg-blue-100"
                          >
                            {moduleData.module_name}
                          </td>
                        )}
                        {funcIndex === 0 && (
                          <td
                            rowSpan={filteredFunctions.length}
                            className="px-3 py-1 border bg-green-100"
                          >
                            {subModuleData.sub_module_name}
                          </td>
                        )}
                        <td className="px-3 py-1 border bg-yellow-100">
                          {func.function_master_name}
                        </td>
                        <td className="px-3 py-1 border">
                          {actionMaster
                            .filter((action) =>
                              actionsForFunction.includes(action.action_id)
                            )
                            .filter((action) =>
                              action.action_name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((action) => (
                              <label
                                key={action.action_id}
                                className="inline-flex items-center mr-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    checkboxState[func.function_master_id]?.[
                                      action.action_name
                                    ] === 1
                                  }
                                  onChange={() =>
                                    handleActionChange(
                                      func.function_master_id,
                                      action.action_name
                                    )
                                  }
                                  className="mr-2"
                                />
                                {action.action_name}
                              </label>
                            ))}
                        </td>
                      </tr>
                    );
                  });
                });
              })}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserRole;
