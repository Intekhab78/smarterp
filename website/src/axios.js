import axios from "axios";

// const baseURL = "http://localhost:5610/api";
// const baseURL = "https://api.jtserp.cloud/api/";
// const baseURL = "https://api.islamicbookzone.com/api";
const baseURL = "https://smartapi.jtsonline.shop/api";

export const axios_get = async (is_token = false, endPoint, params = "") => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (is_token) {
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios.get(baseURL + endPoint, { headers });
        return response.data;
    } catch (error) {
        console.error("GET ERROR:", error);
        return error?.response?.data;
    }
};

export const axios_post = async (is_token = false, endPoint, params = {}) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (is_token) {
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios.post(baseURL + endPoint, params, { headers });
        return response.data;
    } catch (error) {
        console.error("POST ERROR:", error);
        return error?.response?.data;
    }
};
