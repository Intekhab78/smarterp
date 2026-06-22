const db = require("../models");
const VideoAdvertiesment = db.VideoAdvertiesment;

let currentAd = null;

const playTestAd = (req, res) => {
  const io = req.app.get("io");

  currentAd = {
    // videoUrl: "http://localhost:5610/ads/test.mp4",
    // videoUrl: "https://api.jtserp.cloud/ads/test.mp4",
    startAt: Date.now(),
    loop: true,
  };

  console.log("📢 Broadcasting PLAY_AD", currentAd);

  io.to("ALL_STORES").emit("PLAY_AD", currentAd);

  res.json({
    success: true,
    message: "Test ad started on all stores",
  });
};

const stopAd = async (req, res) => {
  const io = req.app.get("io");

  await VideoAdvertiesment.update(
    { is_running: false, status: "stopped" },
    { where: { is_running: true } }
  );

  io.to("ALL_STORES").emit("STOP_AD");

  res.json({ success: true, message: "Ad stopped" });
};

const playAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.get("io");

    // stop previous running ads
    await VideoAdvertiesment.update(
      { is_running: false, status: "paused" },
      { where: { is_running: true } }
    );

    // activate selected ad
    const ad = await VideoAdvertiesment.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    await ad.update({
      is_running: true,
      status: "active",
    });
    const cleanPath = ad.video_path
      .replace(/^\/+/, "") // remove leading slashes
      .replace(/^public\//, ""); // remove "public/"

    const payload = {
      adId: ad.id, // ✅ ADD THIS
      videoUrl: `${process.env.LIVE_URL.replace(/\/+$/, "")}/${cleanPath}`,
      startAt: Date.now(),
      loop: true,
    };

    io.to("ALL_STORES").emit("PLAY_AD", payload);

    res.json({
      success: true,
      message: "Advertisement started",
      data: payload,
    });
  } catch (error) {
    console.error("Play Ad Error:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { playTestAd, stopAd, currentAd, playAdById };
