import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "module1", label: "Module 1" },
  { value: "module2", label: "Module 2" },
  { value: "module3", label: "Module 3" },
  { value: "module4", label: "Module 4" },
];

const Test = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div className="w-64">
      <Select
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select Modules..."
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
};

export default Test;
