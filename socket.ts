import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

export const socket = io("https://gts.thaemisch.com:3000");

socket.on("connect", () => {
  console.log("CONNECTED SOCKET");
  state.connected = true;
});

socket.on("disconnect", () => {
  console.log("DISCONNECTED SOCKET");
  state.connected = false;
});