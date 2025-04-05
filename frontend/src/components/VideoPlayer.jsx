import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  Lock,
  X,
  Maximize,
  Minimize,
} from "lucide-react";

const VideoPlayer = ({
  url,
  locked = false,
  playing = false,
  onPlayToggle,
  onProgress,
  onDuration,
  onEnded,
  onPrev,
  onNext,
  progress = 0,
  duration = 0,
  defaultVisible = false,
  thumbnail = "",
  qualities = [{ label: "HD", url: url }],
  onSeek,
}) => {
  const [visible, setVisible] = useState(defaultVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]);
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSeek = (e) => {
    if (!playerRef.current || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTo = pos * duration;

    playerRef.current.seekTo(pos);
    if (onSeek) onSeek(seekTo);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      wrapperRef.current?.requestFullscreen?.().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const playerWrapper = wrapperRef.current;
    if (playerWrapper) {
      playerWrapper.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      if (playerWrapper) {
        playerWrapper.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          onPlayToggle();
          break;
        case "ArrowLeft":
          playerRef.current?.seekTo(Math.max(0, progress * duration - 5));
          break;
        case "ArrowRight":
          playerRef.current?.seekTo(
            Math.min(duration, progress * duration + 5)
          );
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, progress, duration]);

  if (!visible) {
    return (
      <div
        className="bg-black aspect-video relative cursor-pointer"
        onClick={() => setVisible(true)}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center text-white">
            <Play className="w-12 h-12 mx-auto mb-4" />
            <p>Click to load video player</p>
          </div>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white bg-black bg-opacity-50">
        <Lock className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-medium mb-2">This lesson is locked</h3>
        <p className="text-gray-300 mb-4">
          Complete previous lessons to unlock
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-black relative ${
        isFullscreen ? "fixed inset-0 z-50" : "aspect-video"
      }`}
      ref={wrapperRef}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        controls={false}
        width="100%"
        height="100%"
        onReady={() => setIsLoading(false)}
        onStart={() => setIsLoading(true)}
        onBuffer={() => setIsLoading(true)}
        onBufferEnd={() => setIsLoading(false)}
        onProgress={onProgress}
        onDuration={onDuration}
        onEnded={onEnded}
        config={{
          youtube: {
            playerVars: { showinfo: 1 },
          },
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <button
            onClick={onPlayToggle}
            className="p-2 hover:bg-white/20 rounded-full"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 mx-4 flex items-center">
            <span className="text-xs w-12">
              {formatTime(progress * duration)}
            </span>
            <div
              className="flex-1 bg-gray-500/50 rounded-full h-1.5 mx-2 relative cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs w-12">{formatTime(duration)}</span>
          </div>

          <div className="flex space-x-2">
            {qualities.length > 1 && (
              <select
                className="bg-black/50 text-white text-xs rounded px-2 py-1"
                value={selectedQuality.label}
                onChange={(e) =>
                  setSelectedQuality(
                    qualities.find((q) => q.label === e.target.value)
                  )
                }
              >
                {qualities.map((quality) => (
                  <option key={quality.label} value={quality.label}>
                    {quality.label}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => navigateLesson("prev")}
              className="p-2 hover:bg-white/20 rounded-full"
              aria-label="Previous lesson"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateLesson("next")}
              className="p-2 hover:bg-white/20 rounded-full"
              aria-label="Next lesson"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Back to thumbnail button */}
      {!isFullscreen && (
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
