import { createContext } from "preact";
import { signal, computed } from "@preact/signals";
import processChatMessage from "daxbot/utilities/processChatMessage";

const VideoContext = createContext({});

const testClips = [
  "https://www.twitch.tv/travpiper/clip/BraveFaintPlumberDuDudu-u2s2wTGIn3AUMCRd",
  "https://clips.twitch.tv/embed?clip=SpunkyUnsightlySandstormMVGame-qqcXrjjPirKtugpz&parent=www.example.com",
  "https://clips.twitch.tv/embed?clip=InventivePuzzledBeefKappaWealth-VqfHHyvseiAU1AbG",
  "https://www.twitch.tv/kameu/clip/MotionlessStylishGooseSuperVinlin-CaqiBuzg9RADZfL3",
  "https://clips.twitch.tv/WittyCallousGiraffeRalpherZ-oVfiP2kHCILj8-ne?asdaasas",
  "https://www.twitch.tv/thebigmeech/clip/EnchantingSincereMarjoramDuDudu-b7SekqPD9tIIUKc5",
  "https://clips.twitch.tv/ImportantBlightedSardineSoBayed-UCIYtPVtgP77OAVD",
  "https://www.twitch.tv/25daves/clip/PerfectPleasantWheelHumbleLife-DT33MHH03OviArmI",
  "https://clips.twitch.tv/HonorableShyCheetahShazBotstix-e-6e3v7u-F7Tx7JN?from=HasRoot",
  "https://www.twitch.tv/4head/clip/EnchantingSourScorpionBrainSlug-U-cLTNbMsFc3ZXQU",
  "https://www.twitch.tv/zpapz/clip/DelightfulIronicDinosaurKeyboardCat-4NKbZ3rxcUC2sGLu",
  "https://www.twitch.tv/kyle/clip/AliveStupidCheddarCurseLit-B-KXYnMFl6Z4bR3S/",
  "https://clips.twitch.tv/TsundereHumbleBadgerTwitchRaid-JGtcADTs6RJ_zTSB",
  "https://clips.twitch.tv/ChillyPrettiestYamOneHand-dKmqvf_Rpur_ES0l",
  "https://clips.twitch.tv/FaintPluckyShrewPanicBasket-JGRzxJt0_hdrB-xL",
  "https://www.twitch.tv/kyle/clip/PeppySpeedyEndiveTwitchRaid-MOuNwJxvbiymN2Zy",
  "https://clips.twitch.tv/CalmGenerousCucumberBuddhaBar-4hTHaabZ8ZZ4RpAZ",
];

const createAppState = async () => {
  const clips = [];
  // for (const clip of testClips) {
  //   const data = await processChatMessage(clip);
  //   clips.push(...data);
  // }

  const autoPlay = signal(true);
  const autoScroll = signal(true);
  const nowPlaying = signal(undefined);
  const queue = signal(clips);
  const nowPlayingIndex = computed(() => {
    const currentIndex = queue.value.indexOf(queue.value.find(x => x.id === nowPlaying.value?.id));

    return Math.min(queue.value.length - 1, Math.max(0, currentIndex));
  });
  const playableQueue = computed(() => queue.value.filter(x => !x.isDeleted));

  const playClip = (clip) => {
    if (clip?.id !== nowPlaying.value?.id) {
      nowPlaying.value = {...clip};
    }
  };

  const addClipToQueue = ({ id, title, subtitle, thumbnail, video, submittedByUsername, createdDate }) => {
    const existingClip = queue.value.find(x => x.id === id);

    if (existingClip === undefined) {
      queue.value = [...queue.value, {
        id: id,
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        video: video,
        submitters: [
          { username: submittedByUsername, submitCount: 1 }
        ],
        createdDate: createdDate,
        isDeleted: false,
      }];
    } else {
      const existingSubmitter = existingClip.submitters.find(x => x.username === submittedByUsername);

      if (existingSubmitter === undefined) {
        existingClip.submitters.push({ username: submittedByUsername, submitCount: 1 });
      } else {
        ++existingSubmitter.submitCount;
      }

      queue.value = [...queue.value];
    }
  };

  return {
    autoPlay,
    autoScroll,
    nowPlaying,
    queue: playableQueue,
    nowPlayingIndex,
    playClip,
    addClipToQueue,
    playNextClip: () => {
      const nextClipIndex = Math.min(queue.value.length - 1, nowPlayingIndex.value + 1);

      playClip(queue.value.at(nextClipIndex));
    }
  };
};

export default VideoContext;

export { createAppState };
