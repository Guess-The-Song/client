import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useLobbyStore } from "@/stores/lobby";
import { useUserStore } from "@/stores/user";

export const useConnectionStore = defineStore("connection", {
  state: () => ({
    isConnected: false,
  }),

  actions: {
    bindEvents() {
      socket.on("connect", () => {
        this.isConnected = true;
      });

      socket.on("disconnect", () => {
        this.isConnected = false;
      });

      socket.on("lobbyInfo", (data) => {
        useLobbyStore().handleLobbyInfo(data);
      });

      socket.on("artistMessage", (data) => {
        useLobbyStore().handleArtistMessage(data);
        return true;
      });

      socket.on("songMessage", (data) => {
        useLobbyStore().handleSongMessage(data);
      });

      socket.on("yourTurn", (data) => {
        useLobbyStore().handleYourTurn();
      });

      socket.on("isSelecting", (data) => {
        useLobbyStore().handleIsSelecting(data);
      });

      socket.on("selectedSong", (data) => {
        useLobbyStore().handleSelectedSong(data);
      });

      socket.on("turnEnd", (data) => {
        useLobbyStore().handleTurnEnd(data);
      });

      socket.on("gameEnd", (data) => {
        useLobbyStore().handleGameEnd(data);
      });

      socket.on("friendUpdate", (data) => {
        useUserStore().handleFriendUpdate(data);
      });
    },

    connect() {
      socket.connect();
    },
  },
});
