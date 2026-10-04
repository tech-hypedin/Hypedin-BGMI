'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Music plays ONLY when the user presses this button — no autoplay,
  // no triggering on unrelated page clicks.
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      v.muted = true;
      setIsPlaying(false);
    } else {
      v.muted = false;
      v.volume = 1.0;
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden audio source (video element used for broad codec support) */}
      <video
        ref={videoRef}
        src="/audio/bgmi-theme.mp3"
        loop
        playsInline
        muted
        preload="none"
        className="hidden"
      />

      {/* Speaker toggle — the only thing that starts the music */}
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Mute music' : 'Play music'}
        title={isPlaying ? 'Mute music' : 'Play music'}
        className="fixed bottom-5 right-5 z-50 w-11 h-11 flex items-center justify-center bg-primary text-black border border-primary/60 hover:bg-[#ffb24d] transition-colors"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
}
