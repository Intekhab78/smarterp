import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import constantApi from "constantApi";

const StoreClient = () => {
  console.log("🚀 StoreClient render");

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [currentAdId, setCurrentAdId] = useState(null);
  const [status, setStatus] = useState("idle");

  /* =========================
     SOCKET CONNECTION
  ========================= */
  useEffect(() => {
    console.log("🔌 Connecting socket to:", constantApi.addUrl);
    const socket = io(constantApi.addUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
      socket.emit("register-store", "ReactStore-001");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET CONNECT ERROR:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ SOCKET DISCONNECTED:", reason);
    });

    // socket.on("PLAY_AD", (data) => {
    //   console.log("🎬 PLAY_AD RECEIVED >>>", data);

    //   if (!data?.videoUrl) {
    //     console.error("❌ PLAY_AD missing videoUrl");
    //     return;
    //   }

    //   setVideoUrl(data.videoUrl);
    //   setCurrentAdId(data.adId);
    //   setStatus("loading");
    // });

    socket.on("PLAY_AD", (data) => {
      if (!data?.videoUrl) return;

      setVideoUrl(data.videoUrl);
      setCurrentAdId(data.adId);
      setStatus("loading");

      if (videoRef.current) {
        const video = videoRef.current;

        video.src = data.videoUrl;
        video.muted = true;
        video.load();

        video.onloadedmetadata = () => {
          const now = Date.now();
          const offsetSeconds = (now - data.startAt) / 1000;

          // If video duration is known, loop offset accordingly
          const seekTime = video.duration
            ? offsetSeconds % video.duration
            : offsetSeconds;

          video.currentTime = seekTime;

          video
            .play()
            .then(() => {
              setStatus("playing");
              socketRef.current.emit("AD_VIEW_START", { adId: data.adId });
            })
            .catch((err) => {
              console.error("Video play failed:", err);
              setStatus("autoplay-blocked");
            });
        };
      }
    });

    socket.on("STOP_AD", () => {
      console.log("⛔ STOP_AD RECEIVED");

      if (currentAdId) {
        socket.emit("AD_VIEW_STOP");
      }

      setVideoUrl("");
      setCurrentAdId(null);
      setStatus("idle");

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    });

    return () => {
      console.log("🧹 Cleaning socket");
      socket.disconnect();
    };
  }, []);

  /* =========================
     VIDEO PLAYBACK
  ========================= */
  useEffect(() => {
    if (!videoUrl) {
      console.log("ℹ️ videoUrl empty, skipping play");
      return;
    }

    if (!videoRef.current) {
      console.error("❌ videoRef is NULL");
      return;
    }

    console.log("📺 Attempting to play video:", videoUrl);

    const video = videoRef.current;

    video.src = videoUrl;
    video.muted = true;
    video.load();

    video
      .play()
      .then(() => {
        console.log("▶️ VIDEO PLAYING SUCCESS");

        setStatus("playing");

        socketRef.current.emit("AD_VIEW_START", {
          adId: currentAdId,
        });

        console.log("📡 AD_VIEW_START emitted:", currentAdId);
      })
      .catch((err) => {
        console.error("❌ VIDEO PLAY FAILED:", err);
        setStatus("autoplay-blocked");
      });
  }, [videoUrl, currentAdId]);

  //Loader
  const VideoLoader = () => {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
          <p className="text-sm tracking-wide text-gray-300">
            Loading advertisement…
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      {videoUrl ? (
        // <video
        //   ref={videoRef}
        //   className="w-full h-full object-contain"
        //   muted
        //   autoPlay
        //   loop
        //   playsInline
        //   preload="auto"
        // >
        //   <source src={videoUrl} type="video/mp4" />
        // </video>
        <div className="relative w-full h-full">
          {status === "loading" && <VideoLoader />}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Bottom Advertisement Banner */}

          {/* Bottom Advertisement Banner */}
          <div className="absolute bottom-4 left-0 w-full overflow-hidden bg-black/50 py-1">
            <div className="whitespace-nowrap text-white text-lg font-semibold animate-marquee-right-to-left">
              Welcome to JTS Middle East — Your Trusted Partner for Digital
              Signage, Advertising & Media Solutions
            </div>
          </div>

          {/* Inline CSS for marquee */}
          {/* Inline CSS for marquee */}
          <style>
            {`
    @keyframes marquee-right-to-left {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee-right-to-left {
      display: inline-block;
      animation: marquee-right-to-left 15s linear infinite;
    }
  `}
          </style>
        </div>
      ) : (
        <div className="text-center text-white space-y-4 animate-pulse">
          <h1 className="text-3xl font-semibold">
            Multi-Location Video Management System
          </h1>

          <p className="text-sm text-gray-400">
            Developed by{" "}
            <span className="text-gray-300">www.jtstechnologies.in</span>
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            <span>Waiting for advertisement…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreClient;
