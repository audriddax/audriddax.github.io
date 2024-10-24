import { None, Some } from "daxbot/utilities/option";
import "daxbot/types/types.d";


/**
 *
 * @param {string} clipUrl
 * @returns {string}
 */
const extractClipId = (clipLocation) => {
  var url = new URL(clipLocation);
  var pathId = url.pathname.split('/').filter(x => x !== '').reverse()[0];

  return pathId;
};

/**
 *
 * @param {string} clipUrl
 * @returns {Promise<IOption<IClip>>}
 */
const getRipvodData = async (clipUrl) => {
  try {
    const result = await fetch(
      'https://videoscraper-eww75nh35a-uc.a.run.app',
      {
        "method": "POST",
        "body": JSON.stringify({"ClipLocation": clipUrl}),
        "headers": { "content-type": "application/json" }
      }
    );

    if (!result.ok) {
      return None.of();
    }

    const data = await result.json();

    /** @type {IClip} */
    const clip = {
      id: extractRipvodVideoId(clipUrl),
      title: data.title,
      subtitle: data.subtitle,
      thumbnail: {
        url: data.thumbnailLocation,
      },
      video: {
        url: data.videoLocation,
      },
      createdDate: new Date(data.createdDate),
    };

    return Some.of(clip);;
  } catch (e) {
    console.error(e);

    return None.of();
  }
};

export default getRipvodData;
