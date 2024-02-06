import { reactive } from "vue";
import { io } from "socket.io-client";

//const appConfig = useAppConfig();
//const server = appConfig.serverUrl as string;
const server = "http://localhost:3000";

export const state = reactive({
  connected: false,
});

export const socket = io(server);

socket.on("connect", () => {
  console.log("CONNECTED SOCKET");
  state.connected = true;
});

socket.on("disconnect", () => {
  console.log("DISCONNECTED SOCKET");
  state.connected = false;
});
