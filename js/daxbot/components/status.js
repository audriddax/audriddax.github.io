import { html } from "htm/preact";
import VideoContext from "daxbot/contexts/videoContext";
import { useContext } from "preact/hooks";

const Status = () => {
  const { login, statusMessage } = useContext(VideoContext);

  switch (login) {
    case "strippin":
      return html`
        <div class="position-absolute bottom-0" style="font-size: 64pt; font-family: 'Sixtyfour Convergence'; z-index: -1;">
          ${statusMessage}
        </div>
      `;
    default:
      return;
  }

  return html`
  `;
}

export default Status;
