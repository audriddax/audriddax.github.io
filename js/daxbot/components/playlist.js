import { html } from "htm/preact";
import { useState, useContext } from "preact/hooks";
import Clip from "daxbot/components/clip";
import ScrollBar from "daxbot/components/scrollBar";
import VideoContext from "daxbot/contexts/videoContext";

const Playlist = () => {
  const context = useContext(VideoContext);

  const [scrollPosition, setScrollPosition] = useState(0);
  const queuePosition = context.nowPlayingIndex.value;

  const position = !context.autoScroll.value ? scrollPosition : queuePosition;

  const onWheel = ({ deltaY }) => {
    setScrollPosition((oldValue) => {
      const modifier = (deltaY < 0) ? Math.min(deltaY / 100, -1) : Math.max(deltaY / 100, 1);
      const upperLimit = context.queue.value.length - 1;

      const lowerLimit = 0;

      console.log(Math.min(upperLimit, Math.max(lowerLimit, (oldValue + modifier))));
      return Math.min(upperLimit, Math.max(lowerLimit, (oldValue + modifier)));
    });
    context.autoScroll.value = false;
  }

  const toggleAutoPlay = () => {
    context.autoPlay.value = !context.autoPlay.value;
  };

  const toggleAutoScroll = () => {
    context.autoScroll.value = !context.autoScroll.value;
  };

  return html`
    <div class="col-3 vh-100 text-center p-0 overflow-hidden">
      <div class="d-flex h-100 w-100">
        <div class="flex-fill" onWheel=${onWheel}>
          <div class="row">
            <div class="col-6">
              <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" role="switch" id="autoPlay" onClick=${toggleAutoPlay} checked=${context.autoPlay.value} />
                <label class="form-check-label" for="autoPlay">Auto Play</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" role="switch" id="autoScroll" onClick=${toggleAutoScroll} checked=${context.autoScroll.value} />
                <label class="form-check-label" for="autoScroll">Auto Scroll</label>
              </div>
            </div>
          </div>
          <div style="overflow-y: hidden">
              ${context.queue.value.slice(position, position + 20).map((x) => html`
                <${Clip} clip=${x} />`
              )}
          </div>
        </div>
        <${ScrollBar} currentStep=${position} maximumSteps=${context.queue.value.length} />
      </div>
    </div>
  `;
};

export default Playlist;
