// src/components/ProductsList.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductsList({ products, getBestDiscount }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {products.map((item) => {
        const best = getBestDiscount(item.price_list_items);

        return (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.04 }}
            className="border rounded-xl shadow p-3 bg-white"
          >
            <Link to={`/product/${item.id}`}>
              <img
                src={item.image_url}
                alt={item.item_name}
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2 className="text-sm font-semibold mt-2">
                {item.item_name}
              </h2>

              <p className="text-xs text-gray-500">UPC: {item.item_upc}</p>

              {best ? (
                <p className="text-green-600 font-bold mt-1">
                  ₹{best.price}{" "}
                  <span className="text-xs">({best.code})</span>
                </p>
              ) : (
                <p className="text-black font-bold mt-1">
                  ₹{item.itemprice}
                </p>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
