const { Server } = require("socket.io");

const adViewers = {}; // { adId: count }

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /* ================= STORE ================= */
    socket.on("register-store", (storeId) => {
      socket.storeId = storeId;
      socket.join("ALL_STORES");
      console.log("🏬 Store registered:", storeId);
    });

    socket.on("AD_VIEW_START", ({ adId }) => {
      socket.currentAdId = adId;

      adViewers[adId] = (adViewers[adId] || 0) + 1;

      io.to("ADMINS").emit("AD_VIEWER_STATS", adViewers);
      console.log("▶️ AD_VIEW_START", adViewers);
    });

    socket.on("AD_VIEW_STOP", () => {
      const adId = socket.currentAdId;

      if (adId && adViewers[adId]) {
        adViewers[adId]--;
        if (adViewers[adId] <= 0) delete adViewers[adId];
      }

      socket.currentAdId = null;
      io.to("ADMINS").emit("AD_VIEWER_STATS", adViewers);
      console.log("⏹ AD_VIEW_STOP", adViewers);
    });

    /* ================= ADMIN ================= */
    socket.on("JOIN_ADMIN", () => {
      socket.join("ADMINS");
      socket.emit("AD_VIEWER_STATS", adViewers);
      console.log("🧑‍💼 Admin joined");
    });

    socket.on("disconnect", () => {
      if (socket.currentAdId && adViewers[socket.currentAdId]) {
        adViewers[socket.currentAdId]--;
        if (adViewers[socket.currentAdId] <= 0) {
          delete adViewers[socket.currentAdId];
        }
        io.to("ADMINS").emit("AD_VIEWER_STATS", adViewers);
      }
      console.log("❌ Disconnected:", socket.id);
    });
  });

  return io;
};
