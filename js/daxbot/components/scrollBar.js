import { html } from "htm/preact";

const ScrollBar = ({ currentStep, maximumSteps }) => {
  const pillPaddingHeight = 8;
  const totalHeight = window.innerHeight;

  const halfPillHeight = Math.max(pillPaddingHeight, totalHeight / (maximumSteps + 1));
  const pillHeight = halfPillHeight * 2;

  const scrollableHeight = totalHeight - pillHeight;

  const stepHeight = scrollableHeight / (maximumSteps - 1);

  const position = stepHeight * currentStep;

  return html`
    <div class="rounded" style="width: 10px; background-color: var(--theme-scrollbar-background);">
      <div class="rounded" style="height: ${pillHeight}px; background-color: var(--theme-scrollbar-pill); width: 10px; border-radius: 10px; position: absolute; top: ${position}px;">
      </div>
    </div>
  `;
};

export default ScrollBar;
