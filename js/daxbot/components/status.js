import { html } from "htm/preact";
import VideoContext from "daxbot/contexts/videoContext";
import { useContext } from "preact/hooks";

const Status = () => {
  const { statusMessage } = useContext(VideoContext);

  return html`
    <div class="position-absolute bottom-0" style="font-size: 64pt; font-family: 'Sixtyfour Convergence'; z-index: -1;">
      ${statusMessage}
    </div>
  `;
}

export default Status;
