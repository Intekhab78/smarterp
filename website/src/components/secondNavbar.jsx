import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import { useNavigate } from "react-router-dom";

const CategoryNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${constantApi.baseUrl}/item_department/filtered_list_by_key`,
        { website_key: "e_com" }
      );

      console.log("item_department response:", res.data);

      if (Array.isArray(res.data?.data)) {
        setCategories(res.data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Category API error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (constantApi.baseUrl) fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/shop-by-category/${id}`);
  };

  return (
    <div className="fixed w-full border-b bg-gray-700 z-50">
      <div className="relative max-w-7xl mx-auto px-4">
        <ul className="flex items-center space-x-4 text-[10px] font-normal text-white py-2">

          {loading && (
            <li className="text-gray-300">Loading...</li>
          )}

          {!loading && categories.length === 0 && (
            <li className="text-red-300">No categories</li>
          )}

          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="relative cursor-pointer hover:text-red-500 transition group"
            >
              <span>{cat.itemdeptname?.trim()}</span>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 hidden group-hover:block"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryNavbar;
