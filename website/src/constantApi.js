// const constantApi = {
//    baseUrl: "http://192.168.29.183:5610/api",
//   imageUrl: "http://localhost:5610",
//   baseUrl: "https://api.jtserp.cloud/api",
//   imageUrl: "https://api.jtserp.cloud/uploads",

// };

// export default constantApi;
const localBaseUrl = "http://localhost:5621/api";
const localImageUrl = "http://localhost:5621/uploads";

const onlineBaseUrl = "https://smartapi.jtsonline.shop/api";
const onlineImageUrl = "https://smartapi.jtsonline.shop/uploads";

const constantApi = {
  baseUrl: onlineBaseUrl,
  imageUrl: onlineImageUrl,
};

// Check if local backend is running
const checkLocalBackend = async () => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 500); // 500ms timeout is plenty for localhost

    await fetch("http://localhost:5621/", {
      method: "GET",
      signal: controller.signal,
      mode: "no-cors", // Bypass CORS blocks during ping
    });

    clearTimeout(id);
    constantApi.baseUrl = localBaseUrl;
    constantApi.imageUrl = localImageUrl;
    console.log("🔌 Local backend detected! Connected to localhost:5621.");
  } catch (err) {
    console.log("🌐 Local backend not running. Connected to online backend.");
  }
};

await checkLocalBackend();

export default constantApi;
// pass  276403
