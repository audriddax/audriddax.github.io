import { html } from "htm/preact";
import { useContext } from "preact/hooks";4
import VideoContext from "daxbot/contexts/videoContext";

const Background = () => {
  const { login } = useContext(VideoContext);

  switch (login.value) {
    case "strippin":
      return html`
        <link rel="stylesheet" href="css/daxbot/strippin.css" />
        <div class="background row position-absolute vh-100 w-100 top-0">
          <div class="col-9">
            <div class="d-flex justify-content-center align-items-center" style="height: 85%;">
              <div class="ratio ratio-1x1 rounded-circle logo" style="width: 40%;">
                <img class="rounded-circle" src="strippin.png" />
              </div>
            </div>
          </div>
        </div>
        <div class="position-absolute bottom-0" style="font-size: 64pt; font-family: 'Sixtyfour Convergence'; z-index: -1;">
          LISTENING FOR CLIPS
        </div>
      `;
    case "audriddax":
    case "kyle":
      return html`
        <link rel="stylesheet" href="css/daxbot/kyle.css" />
        <video class="background min-vh-100 min-vw-100 position-fixed top-0 left-0" autoplay muted loop>
          <source src="/Kyle_Wallpaper_Animation.mp4" type="video/mp4" />
        </video>
      `;
    default:
      return html`
        <div class="background position-absolute background vw-100 vh-100 d-flex align-items-center justify-content-center">
          <div class="loading"></div>
        </div>
      `;
  }
};

export default Background;
