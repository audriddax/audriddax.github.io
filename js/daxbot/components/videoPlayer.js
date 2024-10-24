import { html } from "htm/preact";
import { useContext } from "preact/hooks";
import VideoContext from "daxbot/contexts/videoContext";

const VideoPlayer = () => {
  const context = useContext(VideoContext);

  if (context.nowPlaying.value?.video.url === undefined) {
    return html`\u00A0`;
  }

  const onEnded = () => {
    if (context.autoPlay.value) {
      context.playNextClip();
    }
  };

  return html`<video class="w-100" src="${context.nowPlaying.value.video.url}" controls autoplay onended=${onEnded} onerror=${onEnded}></video>`;
};

export default VideoPlayer;
