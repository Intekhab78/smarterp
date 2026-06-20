import axios from "axios";
import constantApi from "./constantApi";

export const axios_get = async (is_token = false, endPoint, params = "") => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (is_token) {
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios.get(constantApi.baseUrl + endPoint, { headers });
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
        const response = await axios.post(constantApi.baseUrl + endPoint, params, { headers });
        return response.data;
    } catch (error) {
        console.error("POST ERROR:", error);
        return error?.response?.data;
    }
};
