import { useEffect, useState } from "react";
import { axios_get, axios_post } from "../../axios"; // adjust path
import { getCompanyAndLocationId } from "../../utils/comp_loc_id"; // adjust path if needed
import axios from "axios";
import constantApi from "constantApi";
import { ToastMassage } from "../../toast";

export default function AddNewItem({ open, onClose, user_data }) {
  const [companyData, setCompanyData] = useState({
    user_comp_id: null,
    user_loc_id: null,
  });
  useEffect(() => {
    const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();

    const compId = Number(cashier_comp_id);
    const locId = Number(cashier_loc_id);

    setCompanyData({
      user_comp_id: compId > 0 ? compId : null,
      user_loc_id: locId > 0 ? locId : null,
    });
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_comp_id: companyData.user_comp_id,
      user_loc_id: companyData.user_loc_id,
    }));
  }, [companyData.user_comp_id, companyData.user_loc_id]);

  /* ------------------ FORM DATA ------------------ */

  useEffect(() => {
    if (companyData.user_comp_id && companyData.user_loc_id) {
      setFormData((prev) => ({
        ...prev,
        user_comp_id: companyData.user_comp_id,
        user_loc_id: companyData.user_loc_id,
      }));
    }
  }, [companyData]);
  const [selectedGST, setSelectedGST] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "" }

  const [formData, setFormData] = useState({
    organisation_id: 1,
    itemcatname: 11,
    barcode: "",
    itemdesc: "",
    itemdesclong: "",
    itemdesc3: "",
    itemdesc4: "",
    itemupc: "",
    stock: "",
    itemref: "",
    itmuom: "",
    stylecode: "",
    batch_no: 0,
    colorname: "",
    sizename: "",
    departname: "",
    familyname: "",
    subfamliy: "",
    brandname: "",
    company_id: "",
    location_id: "",
    user_comp_id: null,
    user_loc_id: null,
    hsncode: "",
    itemcost: "",
    itemprice: 0,
    itemlanprice: 0,
    minstklvl: 10,
    maxstklvl: 10,
    itmstkmgmt: "Managed",
    itmwweight: "",
    itmwpurunit: "",
    itmwsalesunit: "",
    itmtax1code: "",
    itmtax2code: "",
    itmtax3code: "",
    itmcostingmet: "FIFO - First in first out",
    suppliername: "",
    itmexpiry: "",
    note1: "",
    note2: "",
    note3: "",
    itmdt1: "",
    itmdt2: "",
    status: "1",
    createddt: "",
    item_image: null, // ✅ ADD THIS
  });

  /* ------------------ DROPDOWN DATA ------------------ */
  const [itemCategories, setItemCategories] = useState([]);
  const [itemDepart, setItemDepart] = useState([]);
  const [itemSupplier, setItemSupplier] = useState([]);
  const [tax1, setTax1] = useState([]);
  const [uom, setUom] = useState([]);
  const [sizename, setSizename] = useState([]);
  const [colorname, setColorname] = useState([]);
  const [brandname, setBrandname] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [itemfamily, setItemFamliy] = useState([]);
  const [itemSubfamily, setItemSubFamliy] = useState([]);

  if (!open) return null;

  useEffect(() => {
    fetchCategories();
    fetchDepart();
    fetchSupplier();
    fetchTax1();
    fetchUom();
    fetchCompanyList();
    fetchColor();
    fetchSize();
    fetchBrand();
    // fetchFamily()
    // fetchSubFamily()
  }, []);

  const fetchCategories = async () => {
    const res = await axios_get(true, "item_category/dropdown-list");
    const categories = res?.data || [];
    setItemCategories(categories);
    // 🔒 FIX FG
    const fgCategory = categories.find((c) => c.itemcatname === 11);
    if (fgCategory) {
      setFormData((prev) => ({
        ...prev,
        itemcatname: fgCategory.id, // "FG"
      }));
    }
  };

  const fetchDepart = async () => {
    const res = await axios_get(true, "item_department/dropdown-list");
    const departments = res?.data || [];

    setItemDepart(departments);

    // 🔒 FIX DEPARTMENT = BOOK
    const fixedDept = departments.find((d) => d.itemdeptname === "BOOK");

    if (fixedDept) {
      setFormData((prev) => ({
        ...prev,
        departname: fixedDept.id, // ✅ store ID
      }));

      fetchFamily(fixedDept.id); // ✅ load families
    }
  };

  const fetchSupplier = async () => {
    const res = await axios_post(true, "vendor/list");
    setItemSupplier(res?.data?.records || []);
  };

  const fetchTax1 = async () => {
    const res = await axios_get(true, "tax_master/dropdown-list");
    setTax1(res?.data || []);
  };

  const fetchUom = async () => {
    const res = await axios_get(true, "item_uom/dropdown-list");
    setUom(res?.data || []);
  };
  const fetchColor = async () => {
    const res = await axios_get(true, "item_color/dropdown-list");
    setColorname(res?.data || []);
    console.log("fetchColor----------", res.data);
  };
  const fetchSize = async () => {
    const res = await axios_get(true, "size_master/dropdown-list");
    setSizename(res?.data || []);
    console.log("fetchSize----------", res.data);
  };
  const fetchBrand = async () => {
    const res = await axios_get(true, "brand/dropdown-list");
    setBrandname(res?.data || []);
    console.log("brand----------", res.data);
  };

  const fetchCompanyList = async () => {
    const res = await axios_post(true, "company/com_list");
    console.log("compnay is dis -----------", res);

    const mainCompanies =
      res?.data?.filter((c) => c.is_main_comp === "yes") || [];
    setCompanies(mainCompanies);
    const fixedCompany = mainCompanies.find((c) => c.id == "20");
    if (fixedCompany) {
      setFormData((prev) => ({
        ...prev,
        company_id: fixedCompany.id, // 👈 store ID
      }));
      fetchLocationList(fixedCompany.id);
    }
  };

  const fetchLocationList = async (company_id) => {
    const res = await axios_post(true, "location/loc_list", { company_id });
    const locs = res?.data || [];
    setLocations(locs);
    // 🔒 FIX LOCATION (New Delhi)
    const fixedLocation = locs.find((l) => l.locname === "New Delhi");
    if (fixedLocation) {
      setFormData((prev) => ({
        ...prev,
        location_id: fixedLocation.id, // 👈 store ID
      }));
    }
  };

  const fetchFamily = async (departId) => {
    if (!departId) return; // 🔒 safety

    try {
      const response = await axios_post(true, "family_master/by_id_list", {
        id: departId,
      });

      const families = response?.data || [];
      setItemFamliy(families);

      // ✅ select Islamic Books from API response
      const selectedFamily = families.find(
        (f) => f.itemfamname?.trim() === "Islamic Books",
      );
      if (selectedFamily) {
        setFormData((prev) => ({
          ...prev,
          familyname: selectedFamily.id,
        }));

        fetchSubFamily(selectedFamily.id); // ✅ load sub-family

        // (optional) load sub-family
        // fetchSubFamily(selectedFamily.id);
      }
    } catch (error) {
      console.error("Error fetching family:", error);
    }
  };

  const fetchSubFamily = async (itemfamcode) => {
    if (!itemfamcode) return; // 🔒 safety

    try {
      const response = await axios_post(
        true,
        "sub_family_master/by_id_list",
        { id: itemfamcode }, // ✅ correct key
      );

      const subFamilies = response?.data || [];
      setItemSubFamliy(subFamilies);

      // auto-pick first
      if (subFamilies.length > 0) {
        setFormData((prev) => ({
          ...prev,
          // subfamliy: subFamilies[0].subfamliy,
          subfamliy: subFamilies[0].id,
        }));
      }
    } catch (error) {
      console.error("Error fetching sub-family:", error);
    }
  };

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "company_id") {
      fetchLocationList(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      item_image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          payload.append(key, formData[key]);
        }
      });

      const res = await axios.post(
        `${constantApi.baseUrl}/item_location_master/create-with-location`,
        payload,
      );

      // ✅ SUCCESS
      setMessage({
        type: "success",
        text: res?.data?.message || "Item saved successfully",
      });
      ToastMassage(res?.data?.message || "Item saved successfully", "success");

      // ✅ CLOSE MODAL + REFRESH POS1
      setTimeout(() => {
        onClose(true); // 👈 PASS FLAG
      }, 800);
    } catch (error) {
      // ❌ ERROR HANDLING
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save item";
      ToastMassage(errMsg, "error");
      setMessage({
        type: "error",
        text: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ms-8 mt-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-3xl rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Add New Item</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-3 gap-4  text-xs"
          >
            {/* Company Nmae */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Company
              </label>

              <select
                name="company_id"
                value={formData.company_id} // 👈 fixed value
                onChange={handleChange}
                disabled // 🔒 cannot change
                className="border p-2 bg-gray-100 cursor-not-allowed"
              >
                <option value="">Company</option>

                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.compdesc}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Location */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Location
              </label>

              <select
                name="location_id"
                value={formData.location_id} // 👈 fixed value
                onChange={handleChange}
                disabled // 🔒 cannot change
                className="border p-2 bg-gray-100 cursor-not-allowed"
              >
                <option value="">Location</option>

                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.locname}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Department */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Category
              </label>

              <select
                name="departname"
                value={formData.departname}
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData((prev) => ({
                    ...prev,
                    departname: value,
                    familyname: "", // reset family
                    subfamliy: "", // reset sub family
                  }));

                  fetchFamily(value); // load families
                }}
                className="border p-2"
              >
                <option value="">Select Category</option>
                {itemDepart.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.itemdeptname}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Family () */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Sub Category
              </label>

              <select
                name="familyname"
                value={formData.familyname}
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData((prev) => ({
                    ...prev,
                    familyname: value,
                    subfamliy: "", // reset subfamily
                  }));

                  fetchSubFamily(value); // load sub family
                }}
                className="border p-2"
              >
                <option value="">Select Sub Category</option>
                {itemfamily.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.itemfamname}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Child Sub Category
              </label>

              <select
                value={formData.subfamliy || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subfamliy: e.target.value,
                  }))
                }
                className="border p-2 rounded text-gray-700"
              >
                <option value="">Select Sub Category</option>

                {itemSubfamily.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.itemsfamname}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Sub Family () */}

            {/* Item Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Item Description
              </label>

              <input
                name="itemdesc"
                // placeholder="Item Name"
                onChange={handleChange}
                className="border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Item Cost
              </label>

              <input
                name="itemcost"
                value={formData.itemcost}
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">MRP</label>

              <input
                name="itemprice"
                // placeholder="UPC"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/*   Stock */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Avl Stock
              </label>

              <input
                name="stock"
                // placeholder="UPC"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/*   Stock */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                UPC/Barcode/ISBN
              </label>

              <input
                name="itemupc"
                // placeholder="UPC"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/* itemcost */}
            {/* UOM */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Unit Of Measurement
              </label>
              <select
                name="itmuom"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select</option>
                {uom.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.uomname}
                  </option>
                ))}
              </select>
            </div>

            {/* Tax */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">GST</label>

              <select
                name="itmtax1code"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select</option>
                {tax1.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.taxname}
                  </option>
                ))}
              </select>
            </div>

            {/*   Author */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Author/Long Desc
              </label>
              <input
                name="itemdesclong"
                onChange={handleChange}
                className="border p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Publisher/ Desc 3
              </label>
              <input
                name="itemdesc3"
                onChange={handleChange}
                className="border p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Publication Date
              </label>
              <input
                type="date"
                name="itmdt2"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Language/Desc 4
              </label>
              <input
                name="itemdesc4"
                onChange={handleChange}
                className="border p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                pages/Note 1
              </label>
              <input
                name="note1"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/* Size */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Size</label>
              <select
                name="sizename"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select</option>
                {sizename.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.itemsizename}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Color</label>
              <select
                name="colorname"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select</option>
                {colorname.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.itemcolname}
                  </option>
                ))}
              </select>
            </div>
            {/* Brand */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Brand</label>
              <select
                name="brandname"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select</option>
                {brandname.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.brandname}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Weight
              </label>
              <input
                name="itmwweight"
                onChange={handleChange}
                className="border p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Dimension/Note 3
              </label>
              <input
                name="note3"
                onChange={handleChange}
                className="border p-2"
              />
            </div>

            {/* Supplier */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Supplier
              </label>
              <select
                name="suppliername"
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Supplier</option>
                {itemSupplier.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstname}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (Fixed Active) */}
            {/* <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Status
              </label>

              <div className="border p-2 bg-green-100 text-green-700 font-semibold rounded cursor-not-allowed">
                Active
              </div>
            </div> */}

            {/* Image */}
            <input
              type="file"
              name="item_image" // 🔥 REQUIRED
              accept="image/*"
              onChange={handleImageChange}
              className="col-span-2 border p-2"
            />

            {formData.item_image && (
              <img
                src={URL.createObjectURL(formData.item_image)}
                alt="Preview"
                className="h-24 w-24 object-cover border rounded"
              />
            )}

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200"
              >
                Cancel
              </button>
              {/* <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white"
              >
                Save Item
              </button> */}
              <button
                type="submit"
                disabled={
                  Number(companyData.user_comp_id) <= 0 ||
                  Number(companyData.user_loc_id) <= 0
                }
                className="px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
