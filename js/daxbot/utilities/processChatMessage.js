import getTwitchData from "daxbot/utilities/getTwitchData";
import getRipvodData from "daxbot/utilities/getRipvodData";

/**
 *
 * @param {string} message
 * @returns {Promise<IClip[]>}
 */
const processChatMessage = async (message) => {
  const twitchPattern = /https?:\/\/(clips|www).twitch.tv\/[^\s]+/g;
  const ripvodPattern = /https?:\/\/ripvod.com[^\s]+/g;
  const usernamePattern = /^:([^!]+).*/;

  /** @type {string[]} */
  const twitchClips = message.match(twitchPattern) ?? [];
  /** @type {string[]} */
  const ripvodClips = message.match(ripvodPattern) ?? [];
  const username = message.replace(usernamePattern, "$1");

  const clips = [];

  for (const clip of twitchClips) {
    const clipData = await getTwitchData(clip);

    clipData.match((clip) => clips.push({ ...clip, username }));
  }

  for (const clip of ripvodClips) {
    const clipData = await getRipvodData(clip);

    clipData.match((clip) => clips.push({ ...clip, username }));
  }

  return clips;
};

export default processChatMessage;
