import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import constantApi from "../constantApi";

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const ImageUrl = `${constantApi.imageUrl}/catImage`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // ✅ Skip API if offline
        if (!navigator.onLine) {
          console.warn("Offline - skipping categories fetch");
          return;
        }

        setLoading(true);

        const res = await axios.post(
          `${constantApi.baseUrl}/item_department/filtered_list_by_key`,
          { website_key: "e_com" },
          { timeout: 5000 } // ✅ prevent hanging request
        );
        setCategories(Array.isArray(res.data.data) ? res.data.data : []);
        console.log("Categories API response:");
        console.table(res.data.data);
      } catch (error) {
        // ✅ Silent fail
        console.warn("Categories load failed:", error.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/shop-by-category/${id}`);
  };

  // ✅ Nothing to show → hide entire section
  if (loading || !categories.length) return null;

  return (
    <div className="w-full px-12 pb-8">
      <section className="container pt-4 pb-6">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="
                group relative aspect-[4/2]
                rounded-xl overflow-hidden
                shadow-md cursor-pointer border border-gray-200
                hover:shadow-lg transition-all duration-300
              "
            >
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <img
                  src={`${ImageUrl}/${category.image}`}
                  alt={category.itemdeptname}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = "none")} // ✅ hide broken image
                />
              </div>

              <p
                className="
                  absolute top-2 left-2
                  text-white text-sm font-semibold
                  bg-black/60 px-2 py-1 rounded-md
                "
              >
                {category.itemdeptname}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Categories;
