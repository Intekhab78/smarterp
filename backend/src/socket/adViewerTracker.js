const adViewers = new Map();
// socketId => { adId, connectedAt }

const setupAdViewerTracking = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Store/Admin connected:", socket.id);

    // ✅ STORE STARTS PLAYING AD
    socket.on("AD_VIEW_START", ({ adId }) => {
      if (!adId) return;

      console.log("▶️ AD_VIEW_START", socket.id, adId);

      adViewers.set(socket.id, {
        adId,
        connectedAt: Date.now(),
      });

      emitStats(io);
    });

    // ✅ STORE STOPS AD
    socket.on("AD_VIEW_STOP", () => {
      console.log("⏹ AD_VIEW_STOP", socket.id);
      adViewers.delete(socket.id);
      emitStats(io);
    });

    // ✅ SOCKET CLOSED (TAB CLOSED / REFRESH)
    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      adViewers.delete(socket.id);
      emitStats(io);
    });

    // ✅ ADMIN DASHBOARD
    socket.on("JOIN_ADMIN", () => {
      console.log("🛠 Admin joined");
      socket.join("ADMIN");
      emitStats(io);
    });
  });
};

const emitStats = (io) => {
  const stats = {};

  for (const { adId } of adViewers.values()) {
    stats[adId] = (stats[adId] || 0) + 1;
  }

  console.log("📊 Emitting stats:", stats);

  io.to("ADMIN").emit("AD_VIEWER_STATS", stats);
};

module.exports = { setupAdViewerTracking };
