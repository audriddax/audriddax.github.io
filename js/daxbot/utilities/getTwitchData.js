import { None, Some } from "daxbot/utilities/option";
import "daxbot/types/types.d";

const gqlClientId = [119, 117, 121, 122, 113, 67, 68, 119, 132, 63, 122, 111, 132, 66, 110, 126, 115, 123, 64, 121, 130, 66, 131, 119, 117, 65, 116, 61, 119, 123].map(x => String.fromCharCode(x - 12)).join("");

/**
 *
 * @param {string} clipUrl
 * @returns {IOption<string>}
 */
const extractClipId = (clipUrl) => {
  const match = clipUrl.match(/clip[\/=](?<clipId>[^&\?\/]*)/i) ?? clipUrl.match(/\.tv\/(?<clipId>[^\?\/]*)/i);

  const clipId = match?.groups?.clipId;

  return clipId ? Some.of(clipId) : None.of();
};

/**
 *
 * @param {string} clipId
 * @returns {IOption<IClip>}
 */
const queryTwitch = async (clipId) => {
  const responseMessage = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Client-Id": gqlClientId,
    },
    body: JSON.stringify([
      {
        operationName: "VideoAccessToken_Clip",
        variables: { slug: clipId },
        extensions: { persistedQuery: { version: 1, sha256Hash: "36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11" } },
      },
      {
        operationName: "ClipsBroadcasterInfo",
        variables: { slug: clipId },
        extensions: { persistedQuery: { version: 1, sha256Hash: "ce258d9536360736605b42db697b3636e750fdb14ff0a7da8c7225bdc2c07e8a" } },
      },
      {
        operationName: "ClipsTitle",
        variables: { slug: clipId },
        extensions: { persistedQuery: { version: 1, sha256Hash: "f6cca7f2fdfbfc2cecea0c88452500dae569191e58a265f97711f8f2a838f5b4" } },
      },
      {
        operationName: "ClipsChatCard",
        variables: { slug: clipId },
        extensions: { persistedQuery: { version: 1, sha256Hash: "94c1c7d97d860722a5b7ef3c3b3de3783b37fc32d69bcccc8ea0cda372cf1f01" } },
      },
    ]),
  });

  if (!responseMessage.ok) {
    return None.of();
  }

  const data = await responseMessage.json();

  const access = data.find(x => x?.extensions?.operationName === "VideoAccessToken_Clip");
  const broadcaster = data.find(x => x?.extensions?.operationName === "ClipsBroadcasterInfo");
  const title = data.find(x => x?.extensions?.operationName === "ClipsTitle");
  const created = data.find(x => x?.extensions?.operationName === "ClipsChatCard");

  const videoUrl = access.data.clip.videoQualities[0].sourceURL;

  const thumbnailv1Pattern = /https:\/\/production\.assets\.clips\.twitchcdn\.net\/(?<id>.*-offset-\d+).*.mp4/;
  const thumbnailV2Pattern = /https:\/\/production\.assets\.clips\.twitchcdn\.net\/v2\/media\/(?<id>.*)\/video\.mp4/;

  const isV2Clip = thumbnailV2Pattern.test(videoUrl);

  const thumbnailId = videoUrl.match(isV2Clip ? thumbnailV2Pattern : thumbnailv1Pattern)?.groups?.id;
  const thumbnailRoot = isV2Clip ? "https://static-cdn.jtvnw.net/twitch-clips-thumbnails-prod" : "https://production.assets.clips.twitchcdn.net";
  const thumbnailSeparator = isV2Clip ? "/" : "-";

  const thumbnailLocation = `${thumbnailRoot}/${thumbnailId}${thumbnailSeparator}preview.jpg`;

  /** @type {IClip} */
  const clip = {
    id: clipId,
    video: {
      url: `${access.data.clip.videoQualities[0].sourceURL}?sig=${access.data.clip.playbackAccessToken.signature}&token=${encodeURIComponent(access.data.clip.playbackAccessToken.value)}`,
    },
    thumbnail: {
      url: thumbnailLocation,
    },
    title: title.data.clip.title,
    subtitle: `${broadcaster.data.clip.broadcaster.displayName} playing ${broadcaster.data.clip.game.displayName}`,
    createdDate: new Date(created.data.clip.createdAt),
  };

  return Some.of(clip);
};

/**
 *
 * @param {string} clipUrl
 * @returns {Promise<IOption<IClip>>}
 */
const getTwitchData = async (clipUrl) => {
  const clipId = extractClipId(clipUrl);

  try {
    return await clipId.match(
      queryTwitch,
      () => None.of()
    );
  } catch (e) {
    console.error(e);

    return None.of();
  }
};

export default getTwitchData;
