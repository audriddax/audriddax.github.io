import { render } from "preact";
import { html } from "htm/preact";
import VideoPlayer from "daxbot/components/videoPlayer";
import Playlist from "daxbot/components/playlist";
import VideoContext, { createAppState } from "daxbot/contexts/videoContext";
import useTwitchChatListener from "daxbot/hooks/useTwitchChatListener";
import Status from "daxbot/components/status";

const App = () => {
  useTwitchChatListener();

  return html`
    <div class="container" style="max-width: 100%;">
      <div class="row position-absolute vh-100 w-100 top-0">
        <div class="col-9">
          <div class="d-flex justify-content-center align-items-center" style="height: 85%;">
            <div class="ratio ratio-1x1 rounded-circle logo" style="width: 40%;">
              <img class="rounded-circle" src="strippin.png" />
            </div>
          </div>
        </div>
      </div>
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
