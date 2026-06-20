import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import { useNavigate } from "react-router-dom";

import books from "/assets/images/quick/cap.png";
import Itra from "/assets/images/quick/tasbi.png";
import QBox from "/assets/images/quick/prayer-mat.png";
import topi from "/assets/images/quick/open-book.png";
import PMat from "/assets/images/quick/box.png";
import tasbih from "/assets/images/quick/perfume-spray.png";

function Adds() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [middleBanner, setMiddleBanner] = useState(null);

  const image = [PMat, topi, Itra, tasbih, books, QBox];

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    axios
      .post(`${constantApi.baseUrl}/item_department/filtered_list_by_key`, {
        website_key: "e_com",
      })
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) =>
        console.error("Error fetching categories:", err)
      );
  }, []);

  /* ================= FETCH MIDDLE BANNER ================= */
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/ecomBanner/list`)
      .then((res) => {
        const banner = res.data?.data?.find(
          (b) => b.banner_position === "MIDDLE" && b.status === 1
        );

        if (banner) {
          setMiddleBanner({
            image: `${constantApi.imageUrl}/Website_Banner/${banner.banner_image}`,
            title: banner.banner_title,
            text: banner.banner_sub_title,
          });
        }
      })
      .catch((err) =>
        console.error("Banner fetch error:", err)
      );
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/shop-by-category/${id}`);
  };

  return (
    <section>
      {/* ================= DYNAMIC MIDDLE BANNER ================= */}
      {middleBanner && (
        <div
          className="
            relative
            w-[98%]
            mx-auto
            mb-10
            bg-cover
            bg-center
            bg-no-repeat
            h-[260px]
            sm:h-[320px]
            md:h-[380px]
            lg:h-[420px]
          "
          style={{
            backgroundImage: `url(${middleBanner.image})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text */}
          <div className="relative h-full flex justify-end items-center pr-20">
            <div className="text-right text-white max-w-3xl">
              {middleBanner.title && (
                <h1 className="text-3xl font-black mb-4 leading-tight">
                  {middleBanner.title}
                </h1>
              )}
              {middleBanner.text && (
                <p className="text-lg">
                  {middleBanner.text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= QUICK LINKS (UNCHANGED) ================= */}
      <section className="quick-links px-6 pb-8 mb-6">
        <h2 className="text-3xl px-5 font-bold mb-6 text-left">
          Quick Links
        </h2>

        <div className="flex gap-6 items-center flex-wrap justify-center">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ y: -4 }}
              className="
  bg-gray-100
  rounded-xl
  w-[calc(50%-12px)] sm:w-[196px]   /* ✅ force 2 per row */
  h-[180px]
  text-center
  text-[#222]
  p-5
  shadow-md
  transition-all
  duration-150
  hover:bg-red-500
  hover:text-white
  cursor-pointer
"

            >
              <div className="h-[80px] flex items-center justify-center mb-3">
                <img
                  src={image[index % image.length]}
                  alt={category.itemdeptname}
                  className="max-h-full"
                />
              </div>

              <p className="font-bold text-xl">
                {category.itemdeptname}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </section>
  );
}

export default Adds;
