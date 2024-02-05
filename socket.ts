import { reactive } from "vue";
import { io } from "socket.io-client";
const config = useRuntimeConfig();
const serverurl = config.public.serverURL;
export const state = reactive({
  connected: false,
});

export const socket = io(serverurl as string);

socket.on("connect", () => {
  console.log("CONNECTED SOCKET");
  state.connected = true;
});

socket.on("disconnect", () => {
  console.log("DISCONNECTED SOCKET");
  state.connected = false;
});