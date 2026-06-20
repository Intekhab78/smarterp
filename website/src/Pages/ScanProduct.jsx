import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
    addToCart,
    increaseQty,
    decreaseQty,
} from "../redux/cartSlice";
import api from "../api";
import QRScanner from "../components/QRScanner";
import { useNavigate } from "react-router-dom";
import constantApi from "../constantApi";
// import useHideTawk from "../hooks/useHideTawk";
import POSPageFooter from "../components/POSPageFooter";

export default function ScanProduct() {
    // useHideTawk();


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const [allProducts, setAllProducts] = useState([]);
    const [scannedProduct, setScannedProduct] = useState(null);
    const baseUrl = `${constantApi.imageUrl}/itemsImage/`;

    const [loading, setLoading] = useState(false);
    const lastScanRef = useRef("");
    const listRef = useRef();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const productId = params.get("product");
    const [productMap, setProductMap] = useState({});

    // 🔥 POS BEEP SOUND (no file needed)
    const playBeep = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = "square"; // retail POS sound
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.08);
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await api.post(
                    `/item_location_master/filter_list_by_stock_price`,
                    null,
                    {
                        params: {
                            company_id: 21,
                            location_id: 20,
                            page: 1,
                            limit: 5000,
                        },
                    }
                );
                // console.log("resposne si==========", res.data.data);


                setAllProducts(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        const map = {};

        allProducts.forEach((p) => {
            if (p.itemupc) {
                const key = String(p.itemupc).replace(/\s/g, "");
                map[key] = p;
            }
        });

        setProductMap(map);
    }, [allProducts]);

    // ⭐ Auto scroll to latest item
    useEffect(() => {
        listRef.current?.scrollTo({
            left: listRef.current.scrollWidth,
            behavior: "smooth",
        });
    }, [cart]);


    const handleScan = (code) => {
        if (!code) return;

        // 🔥 WAIT until products ready
        if (!allProducts.length) {
            console.warn("Products not loaded yet");
            return;
        }

        let value =
            typeof code === "object"
                ? code.text || code.rawValue || code.data || ""
                : code;

        const cleanCode = String(value)
            .replace(/[^0-9A-Za-z]/g, "")
            .trim();

        console.log("Map size:", Object.keys(productMap).length);

        if (cleanCode === lastScanRef.current) return;
        lastScanRef.current = cleanCode;
        setTimeout(() => {
            lastScanRef.current = "";
        }, 800);

        let foundProduct = productMap[cleanCode];

        if (!foundProduct) {
            foundProduct = allProducts.find(
                (p) =>
                    String(p.itemupc) === cleanCode ||
                    String(p.item_barcode) === cleanCode ||
                    String(p.item_code) === cleanCode
            );
        }

        console.log("Found:", foundProduct);

        if (!foundProduct) {
            // 🔥 error sound (optional)
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
            return;
        }

        setScannedProduct(foundProduct);
        // 🔥 success feedback
        playBeep();
        navigator.vibrate?.(100);

        dispatch(
            addToCart({
                _id: String(foundProduct.itemupc),
                id: foundProduct.id,

                name: foundProduct.item_name,

                // ✅ correct price
                price: Number(foundProduct.itemprice || 0),
                tax_percent: Number(foundProduct?.tax_master_1?.taxcal || 0),

                // ✅ correct image
                image: foundProduct.item_image
                    ? `${baseUrl}${foundProduct.item_image}`
                    : "/placeholder.png",

                // ✅ UPC
                upc: foundProduct.itemupc,
            })
        );

    };


    useEffect(() => {
        console.log("All UPC list:");
        console.table(allProducts.map(p => ({
            itemupc: p.itemupc,
            item_barcode: p.item_barcode,
            item_code: p.item_code
        })));
    }, [allProducts]);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );
    const totalQty = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );
    useEffect(() => {
        const loadQRProduct = async () => {
            try {
                if (!productId) return;

                const res = await api.get(`/products/${productId}`);

                dispatch(addToCart(res.data));

                // retail vibration feedback
                navigator.vibrate?.(100);
            } catch (err) {
                console.error("QR product error", err);
            }
        };

        loadQRProduct();
    }, [productId, dispatch]);

    const handleContinue = () => {
        if (!cart.length) {
            alert("Scan at least one product");
            return;
        }

        navigate("/payment-test", {
            state: {
                company_id: 21,
                location_id: 20,
                pos_mode: true,
                walkin_customer: true,
                store_name: "POS Store",
                currency: "INR",
            },
        });
    };


    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden pb-1">
            {/* 🔥 10% TOP MARGIN */}

            {/* 🔥 30% SCANNER */}
            <div className="h-[30%] bg-black relative overflow-hidden">
                {!allProducts.length ? (
                    <div className="text-white text-center mt-10">
                        Loading products...
                    </div>
                ) : (
                    // <QRScanner onScan={handleScan} />
                    <input
                        type="text"
                        placeholder="Scan or enter barcode..."
                        className="w-full max-w-md px-4 py-3 rounded-lg text-black outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                                handleScan(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />

                )}

                {/* Scanner overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-white w-3/4 h-[45%] rounded-lg" />
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <p className="text-white text-sm">Scanning...</p>
                    </div>
                )}
            </div>
            <div className="h-[3%] bg-white" />

            {/* 🔥 40% ITEM SECTION (UNCHANGED DESIGN) */}
            <div className="h-[50%] flex flex-col bg-white">

                {/* 🛒 PRODUCT STRIP */}
                <div
                    ref={listRef}
                    className="flex-[3] overflow-x-auto overflow-y-hidden px-2"
                >
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 mt-3 w-full">
                            Scan products...
                        </p>
                    ) : (
                        <div className="flex gap-3 h-full py-2">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="min-w-[33%]  rounded-xl shadow-sm flex flex-col p-2 justify-between"
                                >
                                    {/* IMAGE AREA */}
                                    <div className="h-[55%] w-full flex items-center justify-center bg-white rounded-lg border">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="max-w-full max-h-full object-contain p-2"
                                        />
                                    </div>

                                    {/* PRODUCT INFO */}
                                    <div className="text-center -mt-4">
                                        <p className="text-base font-semibold ">
                                            {item.name}
                                        </p>

                                        <p className="text-lg text-green-600 font-bold">
                                            ₹{item.price}
                                        </p>
                                    </div>

                                    {/* LARGE QTY CONTROLLER */}
                                    <div className="flex items-center justify-center gap-3 -mt-7">
                                        <button
                                            onClick={() => dispatch(decreaseQty(item._id))}
                                            className="w-10 h-10 text-xl font-bold !bg-gray-200 rounded-full active:scale-95"
                                        >
                                            −
                                        </button>

                                        <span className="text-xl font-semibold w-8 text-center">
                                            {item.qty}
                                        </span>

                                        <button
                                            onClick={() => dispatch(increaseQty(item._id))}
                                            className="w-10 h-10 text-xl font-bold !bg-green-500 text-white rounded-full active:scale-95"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 🔥 10% BOTTOM MARGIN */}
            <div className="h-[3%] bg-white" />

            {/* 🔥 10% TOTAL SECTION */}
            <div className="h-[6%] border-t px-3 flex items-center justify-between bg-white">
                <div>
                    <p className="text-[20px] font-semibold mb-2 text-gray-500">
                        Items: {totalQty}
                    </p>
                    <p className="font-semibold text-base">
                        Totals: ₹{total}
                    </p>
                </div>

                <button
                    onClick={handleContinue}
                    className="!bg-green-500 text-white px-4 py-2.5 text-sm rounded-md"
                >
                    Continue
                </button>
            </div>
            <POSPageFooter />
        </div>
    );

}
