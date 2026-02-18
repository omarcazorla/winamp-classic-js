import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export default function MonoStereo() {
  const { playbackInfo } = useAudioPlayer();
  // Streaming services always output stereo
  const isStereo = playbackInfo.isPlaying;

  return (
    <div className="mono-stereo">
      <div id="mono" />
      <div id="stereo" className={isStereo ? "selected" : ""} />
    </div>
  );
}
