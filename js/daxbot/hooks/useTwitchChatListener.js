import { useState, useContext, useEffect } from "preact/hooks";
import processChatMessage from "daxbot/utilities/processChatMessage";
import VideoContext from "daxbot/contexts/videoContext";

const wsClientId = [118, 127, 60, 122, 60, 115, 66, 65, 66, 112, 116, 65, 114, 125, 131, 117, 132, 61, 127, 115, 62, 122, 109, 110, 122, 118, 132, 125, 128, 69].map(x => String.fromCharCode(x - 12)).join("");

const useTwitchAuthentication = () => {
    const keys = window.location.hash.replace(/^#/, "")
      .split("&")
      .filter(x => x.trim().length !== 0)
      .map(x => x.split("="))
      .reduce((acc, x) => {
        acc[x[0]] = x[1];

        return acc;
      }, {});
    window.location.hash = "";

    const [accessToken] = useState(keys?.access_token);

    if (accessToken === undefined) {
        const clientId = wsClientId;
        const scopes = ["chat:read"].map(x => encodeURIComponent(x)).join("+");
        const state = self.crypto.randomUUID();
        const redirectUrl = "https://audriddax.github.io/demo";

        window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes}&state=${state}`;
    }

    return accessToken;
};

const useTwitchChatListener = () => {
  const context = useContext(VideoContext);
  const accessToken = useTwitchAuthentication();

  useEffect(() => {
    if (accessToken === undefined) {
      return;
    }

    const username = "DaxBot";

    const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    const channels = ["audriddax", "kyle"].map(x => `#${x}`).join(",");

    const onOpen = e => {
      socket.send(`PASS oauth:${accessToken}`);
      socket.send(`NICK ${username}`);
    };

    const onMessage = async (e) => {
      const welcomePattern = /^:tmi\.twitch\.tv 001/;
      const pingPattern = /^PING/;

      if (welcomePattern.test(e.data)) {
        socket.send(`JOIN ${channels}`);

        return;
      } else if (pingPattern.test(e.data)) {
        socket.send(e.data.replace("PING", "PONG"));

        return;
      }

      const clips = await processChatMessage(e.data);

      for (const clip of clips) {
        context.addClipToQueue({ ...clip});
      }
    };

    socket.addEventListener("open", onOpen);

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
    };
  }, [accessToken]);
};

export default useTwitchChatListener;