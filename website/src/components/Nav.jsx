import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaMapMarkerAlt } from "react-icons/fa";
import logo1 from "../assets/images/logo1.png";
import constantApi from "../constantApi";
import { useCart } from "../CartContext/CartContext";
import { useAuth } from "../CartContext/AuthContext";
import { IoMdReturnRight } from "react-icons/io";
import { AiFillCaretUp } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";


/* ---------------- PRICE HELPERS ---------------- */
const getBaseItemPrice = (product) => {
  const locPrice = parseFloat(
    product?.item_location_master_data?.[0]?.itemprice,
  );
  if (!isNaN(locPrice) && locPrice > 0) return locPrice;

  const rootPrice = parseFloat(product?.itemprice);
  if (!isNaN(rootPrice) && rootPrice > 0) return rootPrice;

  return null;
};

const getBestDiscount = (priceItems) => {
  if (!Array.isArray(priceItems) || priceItems.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validItems = priceItems.filter((item) => {
    if (!item) return false;
    if (item.status !== "active") return false;
    if (!item.priceList || item.priceList.status !== "active") return false;

    const start = item.priceList.start_date
      ? new Date(item.priceList.start_date)
      : null;
    const end = item.priceList.end_date
      ? new Date(item.priceList.end_date)
      : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    if (start && today < start) return false;
    if (end && today > end) return false;

    const price = parseFloat(item.list_price);
    return Number.isFinite(price) && price > 0;
  });

  if (validItems.length === 0) return null;

  return Math.min(...validItems.map((i) => parseFloat(i.list_price)));
};

function Nav() {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const [showCategories, setShowCategories] = useState(false);

  const { user, loading } = useAuth();
  // console.log("user------------", user);
  /* ---------------- STATES ---------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [family, setFamily] = useState([]);
  const [subFamily, setSubFamily] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState({ city: "", postalCode: "" });
  const [availableSubFamilyIds, setAvailableSubFamilyIds] = useState(new Set());

  //   const storedCustomer = JSON.parse(localStorage.getItem("customerDetails"));
  const userName = user?.name || user?.first_name || user?.customer_name;

  /* ---------------- HELPERS ---------------- */
  const hasValidValue = (value) => {
    if (!value) return false;
    const invalidValues = [
      "no brand",
      "n/a",
      "na",
      "none",
      "null",
      "undefined",
      "-",
    ];
    return !invalidValues.includes(String(value).toLowerCase().trim());
  };

  /* ---------------- HANDLERS ---------------- */
  const handleDeptClickAndNavigate = async (dept) => {
    setSelectedDept(dept.id);
    setSelectedFamily(null);
    setSubFamily([]);
    setSidebarOpen(true);

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/family_master/filtered_list_by_key`,
        { website_key: "e_com" },
      );

      let filteredFamilies = res.data.data.filter(
        (fam) => fam.itemdeptname === String(dept.id),
      );

      filteredFamilies = filteredFamilies.filter(
        (v, i, a) => a.findIndex((t) => t.itemfamname === v.itemfamname) === i,
      );

      const promises = filteredFamilies.map((fam) =>
        axios.post(`${constantApi.baseUrl}/sub_family_master/by_id_list`, {
          id: fam.id,
        }),
      );

      const results = await Promise.all(promises);
      const familiesWithSub = filteredFamilies.filter(
        (fam, index) => results[index].data.data?.length > 0,
      );

      setFamily(familiesWithSub);
    } catch (err) {
      console.error("Error fetching families:", err);
    }
  };

  const handleFamilyClickAndNavigate = (fam) => {
    setSelectedFamily(fam.id);
    setSidebarOpen(true);

    axios
      .post(`${constantApi.baseUrl}/sub_family_master/by_id_list`, {
        id: fam.id,
      })
      .then((res) => setSubFamily(res.data.data))
      .catch((err) => console.error("Error fetching sub-families:", err));
  };

  const handleSubFamilyClick = (sub) => {
    navigate(`/itemlist/${sub.id}`);
    setSidebarOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-white hover:text-primary transition";

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    axios
      .post(`${constantApi.baseUrl}/item_location_master/filtered_list`)
      .then((res) => {

        setProducts(res.data.data || []);
        // console.log("jjjjjjjh---------------", res.data)
        const ids = new Set(
          (res.data.data || []).map((p) => Number(p.subfamliy)).filter(Boolean),
        );
        setAvailableSubFamilyIds(ids);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .post(`${constantApi.baseUrl}/item_department/filtered_list_by_key`, {
        website_key: "e_com",
      })
      .then((res) => {
        setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter categories
    const categoryMatches = categories
      .filter((c) => c.itemdeptname?.toLowerCase().includes(query))
      .map((c) => ({ ...c, type: "category" }));

    // Filter products with all checks
    const productMatches = products
      .filter((p) => {
        const price = getBaseItemPrice(p);

        const haystack = `
      ${p.item_name}
      ${p.itemdesc}
      ${p.brand?.brandname}
      ${p.item_color?.itemcolname}
      ${p.size_master?.itemsizename}
      ${price}
    `.toLowerCase();

        // normal text search
        if (haystack.includes(query)) return true;

        // numeric price search like: 100, 500, 999
        const num = Number(query);
        if (!isNaN(num) && price && price <= num) return true;

        return false;
      })

      .filter((p) => {
        // ✅ Only show products with price > 0, stock > 0, and image
        const price = getBaseItemPrice(p);
        const stock = Number(p.remaining_stock || 0);
        const hasImage = p?.item_master_image?.length > 0 || p.item_image;
        return price > 0 && stock > 0 && hasImage;
      })
      .map((p) => {
        const basePrice = getBaseItemPrice(p);
        const tax = parseFloat(p?.tax_master_1?.taxcal) || 0;
        const priceWithTax = basePrice + (basePrice * tax) / 100;

        let discount = getBestDiscount(p?.price_list_items);
        if (discount !== null) discount = discount + (discount * tax) / 100;

        const finalPrice =
          discount && discount < priceWithTax ? discount : priceWithTax;

        return {
          ...p,
          type: "product",
          itemPriceWithTax: Math.round(finalPrice),
          originalPrice: Math.round(priceWithTax),
          offerPrice: discount ? Math.round(discount) : null,
        };
      })
      .slice(0, 20);

    setSearchResults([...categoryMatches, ...productMatches]);
  }, [searchQuery, products, categories]);

  /* ---------------- LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const osmRes = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              format: "json",
              lat: latitude,
              lon: longitude,
              zoom: 18,
              addressdetails: 1,
            },
          },
        );

        const a = osmRes.data.address || {};
        const city = a.city || a.town || a.village || a.state || "";
        const postalCode = a.postcode || "";

        setLocation({ city, postalCode });
      } catch (err) {
        console.error("Location fetch failed", err);
      }
    });
  }, []);

  /* ---------------- RENDER ---------------- */
  return (
    <nav className="bg-gray-800 fixed top-0 left-0 w-full z-50 overflow-visible">
      <div className="w-full h-16 flex items-center gap-3 justify-between px-2 md:px-4">
        {/* LEFT */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link to="/">
            <img src={logo1} alt="Logo" className="w-8 md:w-12" />
          </Link>

          {/* Location (desktop only) */}
          <div className="hidden md:flex items-center gap-2 text-white cursor-pointer">
            <FaMapMarkerAlt className="text-yellow-400 text-lg" />
            <div className="leading-tight">
              <div className="font-medium text-sm">
                {location.city
                  ? `${location.city}, ${location.postalCode}`
                  : "Detecting location..."}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 flex justify-center items-center px-1 min-w-0 max-w-[60%] sm:max-w-none">
          <div className="w-full relative overflow-visible min-w-0">
            <div className="flex w-full rounded overflow-hidden border border-gray-400 bg-white h-[36px] md:h-[38px]">
              {/* ALL BUTTON */}
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileMenuOpen(prev => {
                      const next = !prev;

                      if (next) {
                        setSidebarOpen(true);     // show category box
                        setShowCategories(false); // ❗ only button, not list
                      } else {
                        setSidebarOpen(false);
                        setShowCategories(false);
                      }

                      return next;
                    });
                  }
                  else {
                    setSidebarOpen(prev => !prev);
                  }
                }}

                className="flex-shrink-0 h-full px-4 bg-primary text-white flex items-center gap-2"
              >
                <RxHamburgerMenu />
                <span className="hidden md:inline">All</span>
              </button>


              {/* INPUT */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or categories..."
                className="
    flex-1 h-full min-w-0
    px-4 md:px-5
    text-sm md:text-base
    outline-none text-black bg-white
  "
              />

              {/* SEARCH BTN */}
              <button
                // onClick={handleSearch}
                className="flex-shrink-0 h-full px-4 bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                🔍
              </button>
            </div>

            {/* SEARCH DROPDOWN (UNCHANGED LOGIC) */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded shadow-lg z-[60] max-h-80 overflow-y-auto search-dropdown">

                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.id || item.item_id}
                      onClick={() => {
                        if (item.type === "category") {
                          navigate(`/shop-by-category/${item.id}`);
                        } else {
                          navigate(`/items/${item.id || item.item_id}`);
                        }
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={
                          item.type === "category"
                            ? `${constantApi.imageUrl}/catImage/${item.image}`
                            : `${constantApi.imageUrl}/itemsImage/${item.item_image}`
                        }
                        alt={item.item_name || item.itemdeptname}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; // prevents infinite loop if fallback fails
                          e.target.src = "/assets/images/no image.jpeg"; // fallback image
                        }}
                      />

                      <div>
                        {/* Name */}
                        <p className="text-sm font-medium">
                          {item.item_name || item.itemdeptname}
                        </p>

                        {/* Category tag */}
                        {item.type === "category" && (
                          <p className="text-xs text-gray-600">Category</p>
                        )}

                        {/* Product extra details */}
                        {item.type === "product" && (
                          <div className="text-xs text-gray-600 space-y-0.5">
                            {/* {hasValidValue(item.brand?.brandname) && (
                            <p>Brand: {item.brand.brandname}</p>
                          )}

                          {hasValidValue(item.item_color?.itemcolname) && (
                            <p>Color: {item.item_color.itemcolname}</p>
                          )}

                          {hasValidValue(item.size_master?.itemsizename) && (
                            <p>Size: {item.size_master.itemsizename}</p>
                          )} */}
                            {hasValidValue(item.itemdesclong) && (
                              <p className="text-gray-500 line-clamp-1">
                                {item.itemdesclong}
                              </p>
                            )}

                            {hasValidValue(item.itemdesc3) && (
                              <p className="text-gray-500 line-clamp-1">
                                {item.itemdesc3}
                              </p>
                            )}

                            {/* {hasValidValue(item.itemdesc) && (
                            <p>{item.itemdesc}</p>
                          )} */}

                            {/* {item.itemprice && Number(item.itemprice) > 0 && (
                            <p className="font-semibold text-black">
                              ₹{item.itemprice}
                            </p>
                          )} */}
                            {/* Price display with discount */}
                            {/* {item.itemPriceWithTax ? (
                            item.offerPrice &&
                              item.offerPrice < item.originalPrice ? (
                              <p>
                                <span className="text-green-600 font-bold">
                                  ₹{item.offerPrice}
                                </span>{" "}
                                <span className="line-through text-red-500">
                                  ₹{item.originalPrice}
                                </span>
                              </p>
                            ) : (
                              <p className="font-semibold text-black">
                                ₹{item.originalPrice}
                              </p>
                            )
                          ) : (
                            <p className="text-gray-400 text-xs">
                              Price not available
                            </p>
                          )} */}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    ❌ Item Not Found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center justify-center gap-10 whitespace-nowrap flex-shrink-0">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/contactus" className={navLinkClass}>
            Contact Us
          </NavLink>

          {/* {loading ? null : user ? (
            <NavLink to="/accounts" className={navLinkClass}>
              {userName || "Profile"}
            </NavLink>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )} */}

          {loading ? null : user ? (
            <NavLink to="/accounts" className={navLinkClass}>
              {userName && userName.trim() !== "" ? ` ${userName}` : "Profile"}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-semibold"
                  : "text-white !hover:!text-white"
              }
            >
              Login
            </NavLink>
          )}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center gap-1 relative ${isActive
                ? "text-primary font-semibold"
                : "text-white hover:text-primary"
              }`
            }
          >
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l3 9h10l3-6H6"
                />
                <circle cx="10" cy="20" r="2" />
                <circle cx="18" cy="20" r="2" />
              </svg>

              <span className="absolute -top-3 left-3 text-orange-400 text-[15px] font-extrabold">
                {getCartItemCount()}
              </span>
            </div>

            <span className="text-sm font-semibold">Cart</span>
          </NavLink>
        </div>
        {/* MOBILE RIGHT ACTIONS */}
        <div className="flex md:hidden items-center gap-2 shrink-0 whitespace-nowrap">
          {/* PROFILE OR LOGIN */}
          {loading ? null : user ? (
            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                `flex items-center ${isActive ? "text-primary" : "text-white hover:text-primary"
                }`
              }
              title="Profile"
            >
              {/* Profile Icon */}
              <CgProfile className="text-lg" />
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${navLinkClass({ isActive })} text-xs whitespace-nowrap`
              }
            >
              Login
            </NavLink>
          )}

          {/* CART */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center relative ${isActive
                ? "text-primary font-semibold"
                : "text-white hover:text-primary"
              }`
            }
            title="Cart"
          >
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l3 9h10l3-6H6"
                />
                <circle cx="10" cy="20" r="2" />
                <circle cx="18" cy="20" r="2" />
              </svg>

              <span className="absolute -top-2 left-3 text-orange-400 text-[11px] font-extrabold">
                {getCartItemCount()}
              </span>
            </div>
          </NavLink>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed top-16 left-0 w-full bg-gray-900 text-white z-40 transition-transform duration-300
  ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
        >
          <div className="flex flex-col p-4 space-y-1">

            {/* MAIN LINKS */}
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/shop" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Shop
            </NavLink>

            <NavLink to="/contactus" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </NavLink>

            {/* ===== MOBILE SIDEBAR AFTER CONTACT US ===== */}
            {sidebarOpen && (
              <div className="bg-white text-black rounded-md p-2.5 mt-2">

                {/* TOGGLE HEADER */}
                <button
                  onClick={() => setShowCategories((prev) => !prev)}
                  className="w-full space-y-1 flex justify-between items-center text-sm font-bold text-gray-700"
                >
                  All Categories
                  <span className="text-lg">{showCategories ? <AiFillCaretDown />
                    : <AiFillCaretUp />
                  }</span>
                </button>

                {showCategories && (
                  <ul className="space-y-3 mt-3">

                    {categories.map((cat) => (
                      <li key={cat.id}>

                        {/* DEPARTMENT */}
                        <div
                          onClick={() => handleDeptClickAndNavigate(cat)}
                          className="cursor-pointer text-sm font-semibold hover:text-red-600"
                        >

                          {cat.itemdeptname}
                        </div>

                        {/* FAMILY */}
                        {selectedDept === cat.id && family.length > 0 && (
                          <ul className="ml-3 mt-2 space-y-2 border-l pl-3">
                            {family.map((fam) => (
                              <li key={fam.id}>
                                <div
                                  onClick={() => handleFamilyClickAndNavigate(fam)}
                                  className={`text-sm cursor-pointer px-2 py-1 rounded flex items-center gap-1
    ${selectedFamily === fam.id
                                      ? "bg-gray-100 font-semibold"
                                      : "hover:bg-gray-50"
                                    }`}
                                >
                                  <IoMdReturnRight className="text-gray-500 text-xs" />
                                  {fam.itemfamname}
                                </div>


                                {/* SUB FAMILY */}
                                {selectedFamily === fam.id && subFamily.length > 0 && (
                                  <ul className="ml-3 mt-1 space-y-1 border-l border-dashed pl-3">
                                    {subFamily
                                      .filter((sub) =>
                                        availableSubFamilyIds.has(Number(sub.id))
                                      )
                                      .map((sub) => (
                                        <li
                                          key={sub.id}
                                          onClick={() => {
                                            handleSubFamilyClick(sub);
                                            setMobileMenuOpen(false);
                                          }}
                                          className="text-xs cursor-pointer px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
                                        >
                                          <IoMdReturnRight className="text-gray-400 text-[10px]" />
                                          {sub.itemsfamname}
                                        </li>

                                      ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SIDEBAR (UNCHANGED) */}
      {/* DESKTOP SIDEBAR ONLY */}
      <div
        className={`hidden md:block fixed top-16 left-0 h-full bg-white shadow-xl transition-transform duration-300
${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 px-3 py-3 z-40 overflow-y-auto`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="!text-red-500 text-xs mb-3"
        >
          ✖ Close
        </button>

        <p className="text-xs font-bold mb-2 text-gray-600 uppercase tracking-wide">
          All Categories
        </p>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              {/* ===== DEPARTMENT ===== */}
              <div
                onClick={() => handleDeptClickAndNavigate(cat)}
                className={`cursor-pointer text-[11px] px-2 py-[3px] rounded
            ${selectedDept === cat.id
                    ? "!bg-red-50 !text-red-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-800"
                  }`}
              >
                {cat.itemdeptname}
              </div>

              {/* ===== FAMILY ===== */}
              {selectedDept === cat.id && family.length > 0 && (
                <ul className="ml-2 mt-1 space-y-1 border-l pl-2">
                  {family.map((fam) => (
                    <li key={fam.id}>
                      <div
                        onClick={() => handleFamilyClickAndNavigate(fam)}
                        className={`cursor-pointer text-[10px] px-2 py-[2px] rounded flex items-center gap-1
    ${selectedFamily === fam.id
                            ? "!bg-green-50 !text-green-600 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <IoMdReturnRight className="text-[10px] opacity-70" />
                        {fam.itemfamname}
                      </div>


                      {/* ===== SUB FAMILY ===== */}
                      {selectedFamily === fam.id && subFamily.length > 0 && (
                        <ul className="ml-2 mt-1 space-y-1 border-l border-dashed pl-2">
                          {subFamily
                            .filter((sub) =>
                              availableSubFamilyIds.has(Number(sub.id))
                            )
                            .map((sub) => (
                              <li
                                key={sub.id}
                                onClick={() => handleSubFamilyClick(sub)}
                                className="cursor-pointer text-[9px] px-2 py-[2px] rounded flex items-center gap-1
         !text-gray-600 hover:bg-gray-200 hover:text-black"
                              >
                                <IoMdReturnRight className="text-[9px] opacity-60" />
                                {sub.itemsfamname}
                              </li>

                            ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>


    </nav>
  );
}

export default Nav;
