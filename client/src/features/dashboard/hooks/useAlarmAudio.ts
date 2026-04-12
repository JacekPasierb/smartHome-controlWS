import {useEffect, useRef, useState} from "react";

export function useAlarmAudio(triggered: boolean) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevTriggeredRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/alarm.wav");
    audioRef.current.loop = false;
    audioRef.current.volume = 0.6;
  }, []);

  useEffect(() => {
    const wasTriggered = prevTriggeredRef.current;

    if (soundEnabled && !wasTriggered && triggered) {
      audioRef.current?.play().catch(() => {});
    }

    prevTriggeredRef.current = triggered;
  }, [triggered, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const playTest = () => {
    audioRef.current?.play().catch(() => {});
  };

  return {
    soundEnabled,
    toggleSound,
    playTest,
  };
}
