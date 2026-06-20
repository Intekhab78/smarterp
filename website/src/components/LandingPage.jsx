import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import BottomBanner from "./Bottom-Banner";
import Adds from "./Adds";
import Categories from "./Categories";
import Features from "./Features";
import NewArrivals from "./NewArrivals";
import Products from "./Products";


function LandingPage() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [sectionItems, setSectionItems] = useState({});

  const placeholderImage =
    "https://via.placeholder.com/1200x600?text=No+Banner";

  /* ================= FETCH TOP BANNERS ================= */
  // inside LandingPage component
  const newArrivalSection = sections.find(
    (s) => s.section_type === "new"
  );

  const newArrivalProducts =
    newArrivalSection ? sectionItems[newArrivalSection.id] || [] : [];


  const recommendedSection = sections.find(
    (s) => s.section_type === "recommended"
  );

  const recommendedProducts =
    recommendedSection ? sectionItems[recommendedSection.id] || [] : [];


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // ✅ If offline, skip API
        if (!navigator.onLine) {
          console.warn("User offline - skipping banner fetch");
          setSlides([]);
          return;
        }

        setPageLoading(true);

        const res = await axios.get(
          `${constantApi.baseUrl}/ecomBanner/list`,
          { timeout: 5000 }   // ✅ prevent long waiting
        );

        const topBanners = (res.data?.data || [])
          .filter(
            (b) =>
              b.status === 1 &&
              b.banner_position === "TOP"
          )
          .map((b) => ({
            id: b.id,
            image: b.banner_image
              ? `${constantApi.imageUrl}/Website_Banner/${b.banner_image}`
              : placeholderImage,
            title: b.banner_title || "",
            text: b.banner_sub_title || "",
          }));

        setSlides(topBanners);
        setIndex(0);
        setFade(true);

      } catch (err) {
        // ✅ Silent fail — no popup for users
        console.warn("Banner load failed:", err.message);
        setSlides([]);
      } finally {
        setPageLoading(false);
      }
    };

    fetchBanners();
  }, []);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);


  const fetchSections = async () => {
    const res = await axios.get(
      `${constantApi.baseUrl}/ecom-home-section/list`,
      { params: { company_id: 21, location_id: 20 } }
    );
    setSections(res.data.data || []);
  };
  const fetchSectionItems = async (sectionId, limit) => {
    const res = await axios.get(
      `${constantApi.baseUrl}/ecom-home-section-item/list`,
      { params: { ecom_home_section_id: sectionId } }
    );

    const products = (res.data.data || [])
      .map(row => row.item)
      .slice(0, limit);

    setSectionItems(prev => ({
      ...prev,
      [sectionId]: products
    }));
  };
  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    sections.forEach(section => {
      fetchSectionItems(section.id, section.limit_count);
    });
  }, [sections]);

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex gap-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    );
  }



  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      {/* ================= HERO SLIDER ================= */}
      {slides.length > 0 && (
        <div className="relative w-full h-[68vh] overflow-hidden -mt-4">
          {/* Background */}
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url(${slides[index].image})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 z-[1]" />

          {/* Text */}
          <div className="relative z-10 h-full flex items-center justify-end pr-20">
            <div className="text-right max-w-3xl text-white">
              {slides[index].title && (
                <h1 className="text-3xl font-semibold mb-4">
                  {slides[index].title}
                </h1>
              )}
              {slides[index].text && (
                <p className="text-lg">{slides[index].text}</p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ================= OTHER SECTIONS ================= */}
      <Features />
      <Categories />
      <NewArrivals products={newArrivalProducts} />
      <Adds />
      <Products
        title="RECOMMENDED FOR YOU"
        products={recommendedProducts}
      />
      <BottomBanner />

    </>
  );
}

export default LandingPage;
