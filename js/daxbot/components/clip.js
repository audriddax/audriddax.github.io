import { html } from "htm/preact";
import { useState, useContext } from "preact/hooks";
import VideoContext from "daxbot/contexts/videoContext";

const Clip = ({ clip }) => {
  const [hover, setHover] = useState(false);
  const { id, createdDate, title, subtitle, thumbnail, video } = clip;
  const context = useContext(VideoContext);

  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateString = `${monthsOfYear[createdDate.getMonth()]} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;

  const onClick = () => {
    context.playClip(clip);
  };

  const onMouseEnter = () => {
    setHover(true);
  }

  const onMouseLeave = () => {
    setHover(false);
  }

  const containerStyles = {
    "background-color": "var(--theme-clip-queue)"
  };

  const nowPlaying = id === context.nowPlaying.value?.id;

  if (nowPlaying) {
    containerStyles["background-color"] = "var(--theme-clip-watching)";
  } else if (hover) {
    containerStyles["background-color"] = "var(--theme-clip-hover)";
  }

  const renderStyles = (styles) => {
    return Object.keys(styles).map((key) => `${key}: ${styles[key]};`).join(" ");
  };

  return html`
    <div
      class="row p-1 m-1 fs-5 clip position-relative rounded ${hover ? "hover" : ""}"
      onclick=${onClick}
      onMouseEnter=${onMouseEnter}
      onMouseLeave=${onMouseLeave}
      style="${renderStyles(containerStyles)}">
      <div class="col-4 thumbnail" style="background-image: url('${thumbnail.url}');">
      </div>
      <div class="col-8">
        <div>
          <p class="text-truncate"><strong>${title}</strong></p>
          <p class="text-truncate">${subtitle}\u00A0</p>
          <p class="text-truncate fs-6">${dateString}</p>
        </div>
      </div>
    </div>
  `;
};

export default Clip;
