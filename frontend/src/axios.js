// import axios from "axios";

// const token = localStorage.getItem("token");
// const instance = axios.create({
//   baseURL: "http://192.168.3.110/msfa-livedata/public/api/",
// });
// //{ baseURL: 'http://festivalappapi.cph4.ch:5000/' }
// instance.defaults.headers.common["Content-Type"] =
//   "application/x-www-form-urlencoded";

// instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// // instance.defaults.headers.common['Content-Type'] = 'application/json';
// // instance.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

// export default instance;

// // const baseURL = "http://localhost:5610/api/";
// const baseURL = "https://api.jtserp.cloud/api/";
// export const axios_get = async (is_token = false, endPoint, params = "") => {
//   let auth_headers = "";

//   if (is_token) {
//     const token = localStorage.getItem("token");
//     auth_headers = { Authorization: `${token}` };
//   }
//   // let headers = {
//   //   "Content-Type": "application/json",
//   //   "Access-Control-Allow-Origin": "*",
//   //   ...auth_headers,
//   // };

//   let headers = {
//     "Content-Type": "application/json",
//     ...auth_headers,
//   };

//   try {
//     const instance = await axios.get(baseURL + endPoint, { headers: headers });
//     let response = instance.data ? instance.data : {};
//     return response;
//   } catch (error) {
//     return error?.response?.data;
//   }
// };

// export const axios_post = async (is_token = false, endPoint, params = {}) => {
//   // const token = localStorage.getItem('token');
//   let auth_headers = "";
//   if (is_token) {
//     const token = localStorage.getItem("token");
//     auth_headers = { Authorization: `${token}` };
//   }
//   let headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     ...auth_headers,
//   };
//   try {
//     const instance = await axios.post(baseURL + endPoint, params, {
//       headers: headers,
//     });
//     let response = instance.data ? instance.data : {};
//     return response;
//   } catch (error) {
//     return error?.response?.data;
//   }
// };

// export const axios_post_image = async (
//   is_token = false,
//   endPoint,
//   params = {}
// ) => {
//   // const token = localStorage.getItem('token');
//   let auth_headers = "";
//   if (is_token) {
//     const token = localStorage.getItem("token");
//     auth_headers = { Authorization: `${token}` };
//   }
//   let headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//     "Access-Control-Allow-Origin": "*",
//     ...auth_headers,
//   };
//   try {
//     const instance = await axios.post(baseURL + endPoint, params, {
//       headers: headers,
//     });
//     let response = instance.data ? instance.data : {};
//     return response;
//   } catch (error) {
//     return error?.response?.data;
//   }
// };

////////////////////////////////////////////////////////
// import axios from "axios";

// /**
//  * ==============================
//  * AXIOS BASE CONFIG
//  * ==============================
//  */
// // const baseURL = "https://api.jtserp.cloud/api";
// const baseURL = "http://localhost:5610/api";

// /**
//  * ==============================
//  * DEFAULT AXIOS INSTANCE
//  * (For direct axios usage)
//  * ==============================
//  */
// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically if exists
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token; // or `Bearer ${token}` if backend needs it
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /**
//  * ==============================
//  * GET REQUEST
//  * ==============================
//  */
// export const axios_get = async (is_token = false, endPoint = "") => {
//   try {
//     const headers = {};

//     if (is_token) {
//       const token = localStorage.getItem("token");
//       if (token) headers.Authorization = token;
//     }

//     const res = await axiosInstance.get(endPoint, { headers });
//     return res.data;
//   } catch (error) {
//     console.error("AXIOS GET ERROR:", error?.response || error);
//     return error?.response?.data || null;
//   }
// };

// /**
//  * ==============================
//  * POST REQUEST
//  * ==============================
//  */
// export const axios_post = async (
//   is_token = false,
//   endPoint = "",
//   params = {}
// ) => {
//   try {
//     const headers = {};

//     if (is_token) {
//       const token = localStorage.getItem("token");
//       if (token) headers.Authorization = token;
//     }

//     const res = await axiosInstance.post(endPoint, params, { headers });
//     return res.data;
//   } catch (error) {
//     console.error("AXIOS POST ERROR:", error?.response || error);
//     return error?.response?.data || null;
//   }
// };

// /**
//  * ==============================
//  * POST IMAGE / FILE UPLOAD
//  * ==============================
//  */
// export const axios_post_image = async (
//   is_token = false,
//   endPoint = "",
//   params
// ) => {
//   try {
//     const headers = {
//       "Content-Type": "multipart/form-data",
//     };

//     if (is_token) {
//       const token = localStorage.getItem("token");
//       if (token) headers.Authorization = token;
//     }

//     const res = await axiosInstance.post(endPoint, params, { headers });
//     return res.data;
//   } catch (error) {
//     console.error("AXIOS IMAGE ERROR:", error?.response || error);
//     return error?.response?.data || null;
//   }
// };

// /**
//  * ==============================
//  * DEFAULT EXPORT (VERY IMPORTANT)
//  * ==============================
//  */
// export default axiosInstance;

import axios from "axios";

/**
 * ==============================
 * AXIOS BASE CONFIG
 * ==============================
 */
//const baseURL = "https://api.jtserp.cloud/api";
// const baseURL = "https://api.islamicbookzone.com/api";
// const baseURL = "http://localhost:5610/api";
const baseURL = "https://smartapi.jtsonline.shop/api";
/**
 * ==============================
 * AXIOS INSTANCE
 * ==============================
 * ❌ DO NOT set Content-Type here
 * Axios will handle it per request
 */
const axiosInstance = axios.create({
  baseURL,
});

/**
 * ==============================
 * REQUEST INTERCEPTOR
 * ==============================
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token; // or `Bearer ${token}`
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * ==============================
 * GET REQUEST
 * ==============================
 */
export const axios_get = async (is_token = false, endPoint = "") => {
  try {
    const headers = {};

    if (is_token) {
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = token;
    }

    const res = await axiosInstance.get(endPoint, { headers });
    return res.data;
  } catch (error) {
    console.error("AXIOS GET ERROR:", error?.response || error);
    return error?.response?.data || null;
  }
};

/**
 * ==============================
 * POST (JSON DATA)
 * ==============================
 */
export const axios_post = async (
  is_token = false,
  endPoint = "",
  params = {},
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (is_token) {
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = token;
    }

    const res = await axiosInstance.post(endPoint, params, { headers });
    return res.data;
  } catch (error) {
    console.error("AXIOS POST ERROR:", error?.response || error);
    return error?.response?.data || null;
  }
};

/**
 * ==============================
 * POST IMAGE / FILE UPLOAD
 * ==============================
 * ✔ params MUST be FormData
 * ❌ Do NOT set Content-Type
 */
export const axios_post_image = async (
  is_token = false,
  endPoint = "",
  params,
) => {
  try {
    const headers = {};

    if (is_token) {
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = token;
    }

    const res = await axiosInstance.post(endPoint, params, { headers });
    return res.data;
  } catch (error) {
    console.error("AXIOS IMAGE ERROR:", error?.response || error);
    return error?.response?.data || null;
  }
};

/**
 * ==============================
 * DEFAULT EXPORT
 * ==============================
 */
export default axiosInstance;
