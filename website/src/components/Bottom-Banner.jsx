import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../constantApi";

export default function BottomBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBottomBanners = async () => {
            try {
                // ✅ Skip API if offline
                if (!navigator.onLine) {
                    console.warn("Offline - skipping bottom banner fetch");
                    return;
                }

                setLoading(true);

                const res = await axios.get(
                    `${constantApi.baseUrl}/ecomBanner/list`,
                    { timeout: 5000 } // ✅ prevent long wait
                );

                const bottomBanners = (res.data?.data || [])
                    .filter(
                        (b) =>
                            b.status === 1 &&
                            b.banner_position === "BOTTOM"
                    )
                    .map((b) => ({
                        id: b.id,
                        image: b.banner_image
                            ? `${constantApi.imageUrl}/Website_Banner/${b.banner_image}`
                            : "", // ✅ no crash
                        title: b.banner_title || "",
                        text: b.banner_sub_title || "",
                    }));

                setBanners(bottomBanners);
            } catch (error) {
                // ✅ Silent fail — no popup for users
                console.warn("Bottom banner load failed:", error.message);
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBottomBanners();
    }, []);

    // ✅ Nothing to show → render nothing
    if (loading || !banners.length) return null;

    return (
        <div className="w-full mb-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="relative overflow-hidden rounded-lg shadow-md"
                    >
                        <img
                            src={banner.image}
                            alt={banner.title || "banner"}
                            className="w-full h-[200px] md:h-[280px] object-cover"
                            onError={(e) => (e.target.style.display = "none")} // ✅ hide broken image
                        />

                        {(banner.title || banner.text) && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 text-white">
                                <h3 className="text-xl font-semibold">
                                    {banner.title}
                                </h3>
                                <p className="text-sm mt-1">
                                    {banner.text}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
