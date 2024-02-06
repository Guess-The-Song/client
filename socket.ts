import { reactive } from "vue";
import { io } from "socket.io-client";

const config = useNuxtApp().$config;
const server = config.serverUrl as string;

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
