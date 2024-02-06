import { reactive } from "vue";
import { io } from "socket.io-client";
import config from "@/assets/config.json";

export const state = reactive({
  connected: false,
});

export const socket = io(config.serverUrl);

socket.on("connect", () => {
  console.log("CONNECTED SOCKET");
  state.connected = true;
});

socket.on("disconnect", () => {
  console.log("DISCONNECTED SOCKET");
  state.connected = false;
});
