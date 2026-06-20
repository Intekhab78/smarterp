import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../constantApi";

const Items = () => {
  const [items, setItems] = useState([]);
  const BASE_URL = constantApi.baseUrl;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/item/list`)
      .then((response) => {
        console.log("resposne is form Itemlist--", response);

        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);
  const baseUrl = "http://localhost:6600/uploads/items/";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Item List</h2>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={`${baseUrl}/${item.image}`} // Adjust the path based on your backend file serving
              alt={item.item_name}
              className="w-32 h-32 object-cover mb-3 rounded"
            />
            <h3 className="text-lg font-semibold">{item.item_name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-green-600 font-bold">₹{item.price}</p>
            <p className="text-sm text-gray-500">Stock: {item.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
