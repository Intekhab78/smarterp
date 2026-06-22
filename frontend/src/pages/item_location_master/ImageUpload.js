import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";

const ImageUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState({
    main_image: null,
    left_image: null,
    right_image: null,
    front_image: null,
    back_image: null,
  });

  const [preview, setPreview] = useState({});

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_location_master/details`,
        { uuid: id },
      );

      if (res.data?.status) {
        const data = res.data.data;
        setItemDetails(data);

        if (data.images?.length) {
          const img = data.images[0];

          setPreview({
            main_image: img.main_image
              ? `${constantApi.imageUrl}/itemsImage/${img.main_image}`
              : null,
            left_image: img.left_image
              ? `${constantApi.imageUrl}/itemsImage/${img.left_image}`
              : null,
            right_image: img.right_image
              ? `${constantApi.imageUrl}/itemsImage/${img.right_image}`
              : null,
            front_image: img.front_image
              ? `${constantApi.imageUrl}/itemsImage/${img.front_image}`
              : null,
            back_image: img.back_image
              ? `${constantApi.imageUrl}/itemsImage/${img.back_image}`
              : null,
          });
        }
      }
    } catch {
      alert("Failed to load item details");
    }
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    setImages((p) => ({ ...p, [name]: files[0] }));
    setPreview((p) => ({
      ...p,
      [name]: URL.createObjectURL(files[0]),
    }));
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    if (!preview.main_image && !images.main_image) {
      alert("Main image is required");
      return;
    }

    const formData = new FormData();

    removedImages.forEach((k) => formData.append("remove_images[]", k));

    if (itemDetails?.images?.length) {
      formData.append("item_image_id", itemDetails.images[0].item_image_id);
    }

    Object.keys(images).forEach((k) => {
      if (images[k]) formData.append(k, images[k]);
    });

    try {
      setLoading(true);
      await axios.post(
        `${constantApi.baseUrl}/item_loc_master_img/item_loc_image`,
        formData,
      );
      alert("Images saved successfully");
      fetchItemDetails();
      setRemovedImages([]);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasExistingImages = itemDetails?.images?.length > 0;

    const hasFinalMainImage = images.main_image || preview.main_image;

    if (!hasFinalMainImage) {
      alert("Main image is required");
      return;
    }

    const formData = new FormData();

    formData.append(
      "item_image_id",
      hasExistingImages ? itemDetails.images[0].item_image_id : itemDetails.id,
    );

    removedImages.forEach((k) => formData.append("remove_images[]", k));

    Object.keys(images).forEach((k) => {
      if (images[k]) formData.append(k, images[k]);
    });

    const url = hasExistingImages
      ? `${constantApi.baseUrl}/item_loc_master_img/update`
      : `${constantApi.baseUrl}/item_loc_master_img/create`;

    try {
      setLoading(true);
      await axios.post(url, formData);
      alert("Images saved successfully");
      fetchItemDetails();
      setRemovedImages([]);
      navigate("/itemlocationmaster");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (key) => {
    setPreview((prev) => ({ ...prev, [key]: null }));
    setImages((prev) => ({ ...prev, [key]: null }));

    setRemovedImages((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const fields = [
    { key: "main_image", label: "Main Image" },
    { key: "left_image", label: "Left View" },
    { key: "right_image", label: "Right View" },
    { key: "front_image", label: "Front View" },
    { key: "back_image", label: "Back View" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="max-w-5xl mx-auto bg-white p-6 mt-4 rounded-xl border">
        <button
          onClick={() => navigate(-1)}
          className="text-xs mb-4 border px-3 py-1 rounded"
        >
          ← Back
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(({ key, label }) => (
              <div key={key} className="border p-3 rounded">
                <p className="text-xs mb-2">{label}</p>

                <label className="h-32 border-dashed border flex items-center justify-center cursor-pointer">
                  {preview[key] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={preview[key]}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(key)}
                        className="absolute top-1 right-1 text-sm bg-black text-white rounded-full px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Click to upload
                    </span>
                  )}

                  <input
                    type="file"
                    name={key}
                    onChange={handleChange}
                    hidden
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-2 py-1 text-sm  rounded"
            >
              {loading ? "Saving..." : "Save Images"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ImageUpload;
