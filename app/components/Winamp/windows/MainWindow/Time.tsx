import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

function digitClassName(digit: number): string {
  return `digit digit-${digit}`;
}

export default function Time() {
  const { playbackInfo } = useAudioPlayer();
  const { currentTime } = playbackInfo;

  const totalSeconds = Math.floor(currentTime);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minuteFirstDigit = Math.floor(minutes / 10) % 10;
  const minuteSecondDigit = minutes % 10;
  const secondFirstDigit = Math.floor(seconds / 10);
  const secondSecondDigit = seconds % 10;

  return (
    <div id="time">
      <div id="minus-sign" />
      <div id="minute-first-digit" className={digitClassName(minuteFirstDigit)}>
        {minuteFirstDigit}
      </div>
      <div
        id="minute-second-digit"
        className={digitClassName(minuteSecondDigit)}
      >
        {minuteSecondDigit}
      </div>
      <div id="second-first-digit" className={digitClassName(secondFirstDigit)}>
        {secondFirstDigit}
      </div>
      <div
        id="second-second-digit"
        className={digitClassName(secondSecondDigit)}
      >
        {secondSecondDigit}
      </div>
    </div>
  );
}
