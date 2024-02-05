import { defineStore } from "pinia";

import { socket } from "@/socket";
import { useUserStore } from "./user";

type ExternalUrls = {
  spotify: string;
};

type Artist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type Image = {
  height: number;
  url: string;
  width: number;
};

type Album = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date?: string;
  release_date_precision?: string;
  total_tracks?: number;
  type: string;
  uri: string;
};

type Track = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

type Item = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

type SearchResults = {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

type Player = {
  username: string;
  nickname: string;
  role: string;
  isReady: boolean;
  points: number;
};

type Message = {
  username: string;
  nickname: string;
  message: string;
  info: string;
};

async function navTo(path: string) {
  await navigateTo(path);
}

export const useLobbyStore = defineStore("lobby", {
  state: (): {
    lobbyid: string;
    ready: boolean;
    currentScreen: string;
    gameHasStarted: boolean;
    iAmOwner: boolean;
    playerlist: Player[];
    maxPlayers: number;
    minPlayers: number;
    guessingTime: number;
    gamemode: string;
    kicked_by: string;
    round: number;
    maxRounds: number;
    artistMessages: Message[];
    songMessages: Message[];
    selectorUsername: string;
    selectorNickname: string;
    songId: string;
    gameEnd: Record<string, unknown>;
    lastSongName: string;
    lastSongArtists: string;
    lastSongAlbumCover: string;
    searchQuery: string;
    mySongHasBeenSelected: boolean;
    searchResults: SearchResults | null;
    device_id: string;
    myTurn: boolean;
  } => ({
    lobbyid: "",
    ready: false,
    currentScreen: "viewsettings",
    gameHasStarted: false,
    iAmOwner: false,
    playerlist: [
      {
        username: "default",
        nickname: "default",
        role: "",
        isReady: false,
        points: 0,
      },
    ],
    maxPlayers: 0,
    minPlayers: 0,
    guessingTime: 0,
    gamemode: "classic",
    kicked_by: "",
    round: 0,
    maxRounds: 10,
    artistMessages: [],
    songMessages: [],
    selectorUsername: "",
    selectorNickname: "",
    songId: "",
    gameEnd: {},
    lastSongName: "",
    lastSongArtists: "",
    lastSongAlbumCover: "",
    searchQuery: "",
    mySongHasBeenSelected: false,
    searchResults: null,
    device_id: "",
    myTurn: false,
  }),

  actions: {
    setDeviceId(device_id: string) {
      this.device_id = device_id;
    },
    setLobbyid(lobbyid: string) {
      this.lobbyid = lobbyid;
    },
    createLobby() {
      socket.emit("createLobby", (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.lobbyid = response.lobby_id;
          navTo("/lobby");
        }
      });
    },
    joinLobby() {
      if (this.lobbyid !== "") {
        const lobbyExsists = socket.emit("lobbyExists", (response: any) => {
          if (response.error) {
            console.log(response.error);
            return false;
          } else {
            return response.exsists;
          }
        });
        if (lobbyExsists) {
          socket.emit(
            "joinLobby",
            { lobby_id: this.lobbyid },
            (response: any) => {
              if (response.error) {
                console.log(response.error);
                return;
              } else {
                navTo("/lobby");
              }
            }
          );
        }
      }
    },
    leaveLobby() {
      if (this.lobbyid !== "") {
        socket.emit("leaveLobby", (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          } else {
            navTo("/");
          }
        });
      }
    },
    setReady(ready: boolean) {
      socket.emit("ready", { ready: ready }, (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.ready = ready;
          if (response.status) {
            const toast = useToast();
            toast.add({ title: response.status });
          }
        }
      });
    },
    changeRules(key: string, value: any) {
      socket.emit("changeRules", { key, value }, (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        }
      });
    },
    kickPlayer(username: string) {
      socket.emit("kickPlayer", { player_name: username }, (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          const toast = useToast();
          toast.add({ title: "Kicked @" + username + "!" });
        }
      });
    },
    sendArtistMessage(message: string) {
      socket.emit(
        "artistGuess",
        { guess: message },
        (response: any) => {
          if (response.error) {
            if (response.error !== "already_guessed") {
              console.log(response.error);
              return;
            }
          }
        }
      );
    },
    sendSongMessage(message: string) {
      socket.emit(
        "songGuess",
        { guess: message },
        (response: any) => {
          if (response.error) {
            if (response.error !== "already_guessed") {
              console.log(response.error);
              return;
            }
          }
        }
      );
    },
    sendSelectedSong(song_id: string) {
      socket.emit(
        "selectedSong",
        { song_id: song_id, song_start: 0 },
        (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          }
        }
      );
    },
    sendSetInactive() {
      socket.emit("setInactive");
    },
    setGameMode(gamemode: string) {
      if (gamemode === "classic") {
        socket.emit("setGameMode", { gameMode: "classic" }, (response: any) => {
          if (response.error) {
            console.log(response.error);
            return -1;
          }
        });
      } else if (gamemode === "local") {
        socket.emit("setGameMode", { gameMode: "oneRoom" }, (response: any) => {
          if (response.error) {
            console.log(response.error);
            return -1;
          } else if (response.status === "not_ready") {
            const toast = useToast();
            toast.add({ title: "You are now unready!" });
          }
        });
      }
    },
    handleLobbyInfo(data: any) {
      if (data.type === "playerList") {
        this.playerlist = data.data;
        for (const player of data.data) {
          if (player.username === useUserStore().username) {
            if (player.role === "owner") {
              this.iAmOwner = true;
            }
            if (player.isReady) {
              this.ready = true;
            } else {
              this.ready = false;
            }
          }
        }
      } else if (data.type === "rules") {
        data.data.forEach((rule: any) => {
          switch (rule.key) {
            case "max_players":
              this.maxPlayers = parseInt(rule.value);
              break;
            case "min_players":
              this.minPlayers = parseInt(rule.value);
              break;
            case "rounds":
              this.maxRounds = parseInt(rule.value);
              break;
            case "guessing_time":
              this.guessingTime = parseInt(rule.value);
              break;
            default:
              break;
          }
        });
      } else if (data.type === "gamemode") {
        if (data.data.name === "Classic") {
          this.gamemode = "classic";
        } else if (data.data.name === "OneRoom") {
          this.gamemode = "local";
        } else {
          this.gamemode = "error";
        }
      } else if (data.type === "kicked") {
        this.kicked_by = data.data.player_name;
      } else if (data.type === "round") {
        this.round = data.data.round;
      } else if (data.type === "gameStart") {
        this.gameHasStarted = true;
      }
    },
    handleArtistMessage(data: any) {
      this.artistMessages.push(data);
    },
    handleSongMessage(data: any) {
      this.songMessages.push(data);
    },
    handleYourTurn() {
      this.currentScreen = "selectsong";
      this.myTurn = true;
    },
    handleIsSelecting(data: any) {
      this.selectorUsername = data.username;
      this.selectorNickname = data.nickname;
      this.currentScreen = "isselecting";
    },
    handleSelectedSong(data: any) {
      const userStore = useUserStore();
      this.songId = data.song_id;
      this.currentScreen = "chat";
      const url =
        "https://api.spotify.com/v1/me/player/play?device_id=" + this.device_id;
      const headers = {
        Authorization: "Bearer " + userStore.getSpotifyToken(),
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({
        uris: [
          "spotify:track:" + data.song_id,
          "spotify:track:" + data.song_id,
        ],
        position_ms: 0,
      });

      fetch(url, {
        method: "PUT",
        headers: headers,
        body: body,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    },
    handleTurnEnd(data: any) {
      const userStore = useUserStore();
      this.songId = data.song_id;
      this.lastSongAlbumCover = data.album_cover;
      this.lastSongName = data.song_name;
      this.lastSongArtists = data.artists_names;
      this.songMessages = [];
      this.artistMessages = [];
      this.currentScreen = "between";
      this.myTurn = false;
      const url =
        "https://api.spotify.com/v1/me/player/pause?device_id=" +
        this.device_id;
      const headers = {
        Authorization: "Bearer " + userStore.getSpotifyToken(),
        "Content-Type": "application/json",
      };

      fetch(url, {
        method: "PUT",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    },
    handleGameEnd(data: any) {
      this.gameEnd = data;
      this.currentScreen = "end";
    },
    setSearchResults(data: any) {
      this.searchResults = data;
    },
    changeVolume(volume: number) {
      const userStore = useUserStore();
      const url =
        "https://api.spotify.com/v1/me/player/volume?volume_percent=" +
        volume +
        "&device_id=" +
        this.device_id;
      const headers = {
        Authorization: "Bearer " + userStore.getSpotifyToken(),
        "Content-Type": "application/json",
      };

      fetch(url, {
        method: "PUT",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    },
  },
});
