import { render } from "preact";
import { html } from "htm/preact";
import VideoPlayer from "daxbot/components/videoPlayer";
import Playlist from "daxbot/components/playlist";
import VideoContext, { createAppState } from "daxbot/contexts/videoContext";
import useTwitchChatListener from "daxbot/hooks/useTwitchChatListener";
import { useContext } from "preact/hooks";

const Status = () => {
  const { statusMessage } = useContext(VideoContext);

  return html`
    <div class="position-absolute bottom-0" style="font-size: 64pt; font-family: 'Sixtyfour Convergence';">
      ${statusMessage}
    </div>
  `;
}

const App = () => {
  useTwitchChatListener();

  return html`
    <div class="container" style="max-width: 100%;">
      <div class="row">
        <div class="col-9 vh-100 player" style="display: flex; justify-content: center;">
          <${VideoPlayer} />
          <${Status} />
        </div>
        <${Playlist} />
      </div>
    </div>
  `;
};

render(
  html`<${VideoContext.Provider} value=${await createAppState()}><${App} /><//>`,
  document.querySelector("main")
);
