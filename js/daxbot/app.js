import { render } from "preact";
import { html } from "htm/preact";
import VideoPlayer from "daxbot/components/videoPlayer";
import Playlist from "daxbot/components/playlist";
import VideoContext, { createAppState } from "daxbot/contexts/videoContext";
import useTwitchChatListener from "daxbot/hooks/useTwitchChatListener";

const App = () => {
  useTwitchChatListener();

  return html`
    <div class="container" style="max-width: 100%;">
      <div class="row">
        <div class="col-9 vh-100 player" style="display: flex; justify-content: center;">
          <${VideoPlayer} />
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
