<script lang="ts" setup>
import { useLobbyStore } from "@/stores/lobby";
import { useUserStore } from "@/stores/user";
import axios from "axios";
const lobbyStore = useLobbyStore();
const userStore = useUserStore();

const {
  lobbyid,
  ready,
  currentScreen,
  gameHasStarted,
  iAmOwner,
  playerlist,
  maxPlayers,
  minPlayers,
  guessingTime,
  gamemode,
  kicked_by,
  round,
  maxRounds,
  artistMessages,
  songMessages,
  selectorUsername,
  selectorNickname,
  songId,
  gameEnd,
  lastSongName,
  lastSongArtists,
  lastSongAlbumCover,
  searchResults,
  myTurn,
} = storeToRefs(lobbyStore);

const {
  isLoggedIn,
  isTempuser,
  nickname,
  username,
  product,
  spotify_access_token,
  playlistId,
} = storeToRefs(userStore);

userStore.setSpotifyToken();

let myGamemode = gamemode;
let myMaxPlayers = maxPlayers;
let myMinPlayers = minPlayers;
let myMaxRounds = maxRounds;
let myGuessingTime = guessingTime;
let songGuess = ref("");
let artistGuess = ref("");

let searchQuery = "";

const gamemodes = ["classic", "local"];
const selectedGamemode = ref(gamemodes[0]);

function readyUp() {
  lobbyStore.setReady(true);
}

function readyDown() {
  lobbyStore.setReady(false);
}

function leaveLobby() {
  lobbyStore.leaveLobby();
  lobbyStore.$reset();
}

function searchSong(sq: string) {
  userStore.setSpotifyToken();
  axios
    .get(`https://api.spotify.com/v1/search?q=${sq}&type=track`, {
      headers: {
        Authorization: `Bearer ${spotify_access_token.value}`,
      },
    })
    .then((response: any) => {
      lobbyStore.setSearchResults(response.data.tracks.items);
    })
    .catch((error: any) => {
      console.log(error);
    });
}

function handleSelectSong(id: string) {
  lobbyStore.sendSelectedSong(id);
  lobbyStore.setSearchResults([]);
}

const volume = ref(50);
function changeVol() {
  lobbyStore.changeVolume(volume.value);
}

function sendSongMessage() {
  lobbyStore.sendSongMessage(songGuess.value);
  songGuess = ref("");
}

function sendArtistMessage() {
  lobbyStore.sendArtistMessage(artistGuess.value);
  artistGuess = ref("");
}
</script>

<script lang="ts">
///  <reference types="@types/spotify-web-playback-sdk"/>

const userStore = useUserStore();
const lobbyStore = useLobbyStore();

const { spotify_access_token } = storeToRefs(userStore);

const player = ref<Spotify.Player>();
const deviceId = ref<string>();

export default {
  mounted() {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: "Guess The Song v2",
        getOAuthToken: (cb) => {
          cb(spotify_access_token.value);
        },
        volume: 0.5,
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        lobbyStore.setDeviceId(device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      player.connect();
    };
  },
  watch: {
    songMessages: function (val) {
      const songChat = document.getElementById("songChat");
      if (songChat) {
        songChat.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    },
    artistMessages: function (val) {
      const artistChat = document.getElementById("artistChat");
      if (artistChat) {
        artistChat.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    },
  },
};
</script>

<template>
  <div
    class="flex flex-col md:grid md:grid-cols-8 md:grid-rows-6 p-4 w-full h-full overflow-y-scroll md:overflow-hidden"
  >
    <div class="col-span-2 row-span-full w-full h-full p-2">
      <div
        class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-between"
      >
        <div
          class="flex flex-row justify-between items-center px-4 py-5 sm:p-6"
        >
          <div class="text-left flex flex-col">
            <h1>Lobby</h1>
            <h1
              class="mt-1 blur-sm hover:blur-none hover:scale-150 hover:translate-x-3 duration-300"
            >
              ID: {{ lobbyid }}
            </h1>
          </div>
          <div class="text-right flex flex-col">
            <h1>Round</h1>
            <h1 class="mt-1">{{ round }} | {{ maxRounds }}</h1>
          </div>
        </div>
        <UDivider class="my-2" />
        <div
          class="w-full h-full flex flex-col justify-between px-4 py-5 sm:px-6 overflow-y-scroll"
        >
          <ul>
            <li v-for="(player, index) in playerlist" :key="index">
              <div
                class="flex flex-row justify-between border border-gray-800 rounded-lg p-4 mb-4"
              >
                <div class="flex flex-row items-center w-1/6">
                  <UIcon
                    v-if="!player.isReady && !gameHasStarted"
                    name="i-heroicons-x-mark"
                    class="mr-1"
                  />
                  <UIcon
                    v-if="player.isReady && !gameHasStarted"
                    name="i-heroicons-check"
                    class="mr-1"
                  />
                  <UIcon
                    v-if="player.role === 'owner'"
                    name="i-heroicons-wrench"
                    class="ml-1"
                  />
                  <UIcon
                    v-if="player.role !== 'owner'"
                    name="i-heroicons-user"
                    class="ml-1"
                  />
                </div>
                <div class="flex flex-col items-center justify-evenly">
                  <div
                    v-if="
                      player.nickname === '' ||
                      player.nickname === null ||
                      player.nickname === undefined ||
                      player.nickname === player.username
                    "
                    class="flex flex-col items-center justify-evenly"
                  >
                    <h1>@{{ player.username }}</h1>
                  </div>
                  <div class="flex flex-col items-center justify-evenly" v-else>
                    <h1>{{ player.nickname }}</h1>
                    <h1 class="text-xs opacity-75">@{{ player.username }}</h1>
                  </div>
                </div>
                <div class="flex flex-row items-center justify-end w-1/6">
                  <h1>{{ player.points }}</h1>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <UDivider class="my-2" />
        <div class="flex flex-col items-center px-4 py-4 sm:px-6 h-fit">
          <UButton
            v-if="!ready && !gameHasStarted"
            @click="readyUp"
            class="mb-2"
            color="primary"
            variant="solid"
            size="xl"
            icon="i-heroicons-check"
            block
            trailing
          >
            Ready
          </UButton>
          <UButton
            v-else-if="!gameHasStarted"
            @click="readyDown"
            class="mb-2"
            color="yellow"
            variant="solid"
            size="xl"
            icon="i-heroicons-x-mark"
            block
            trailing
          >
            Unready
          </UButton>
          <UButton
            class="mb-2 hidden"
            color="primary"
            variant="outline"
            size="xl"
            icon="i-heroicons-share"
            block
            trailing
          >
            Share Lobby
          </UButton>
          <UButton
            @click="leaveLobby"
            color="orange"
            variant="outline"
            size="xl"
            icon="i-heroicons-no-symbol"
            block
            trailing
          >
            Leave Lobby
          </UButton>
        </div>
      </div>
    </div>

    <div class="col-span-6 row-span-5 w-full h-full p-2">
      <div
        v-if="currentScreen === 'between'"
        class="flex flex-row h-full w-full"
      >
        <div
          class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-center items-center"
        >
          <div class="flex flex-col items-center">
            <img :src="lastSongAlbumCover" class="w-1/2" />
            <h1 class="text-4xl mt-4">{{ lastSongName }}</h1>
            <h1 class="text-2xl mt-4">{{ lastSongArtists }}</h1>
          </div>
        </div>
      </div>
      <div
        v-else-if="currentScreen === 'chat'"
        class="flex flex-row h-full w-full"
      >
        <div class="w-full h-full mr-2">
          <div
            class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-between"
          >
            <div
              id="songChat"
              class="w-full h-full flex flex-col justify-between px-4 py-5 sm:px-6 overflow-y-scroll"
            >
              <div class="overflow-y-scroll max-h-full m-4 select-none">
                <div
                  v-for="(message, index) in songMessages"
                  :key="index"
                  :class="[
                    'p-1 my-1',
                    message.username === null && message.info === 'close'
                      ? 'bg-orange-400 text-gray-950 rounded-lg p-1 my-1'
                      : '',
                    message.username === null &&
                    message.info === 'already_guessed'
                      ? 'bg-yellow-400 opacity-50 text-gray-950 rounded-lg p-1 my-1'
                      : '',
                    message.username === null &&
                    message.info !== 'close' &&
                    message.info !== 'already_guessed'
                      ? 'bg-primary text-gray-950 rounded-lg p-1 my-1'
                      : '',
                  ]"
                >
                  <div>
                    <h2 v-if="message.username === null">
                      <strong>Server: </strong>
                      {{ message.message }}
                    </h2>
                    <h2 v-else>
                      <strong :title="message.nickname ? message.username : ''">
                        {{
                          message.nickname
                            ? message.nickname
                            : message.username
                        }}:
                      </strong>
                      {{ message.message }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <UDivider class="my-2" v-if="!myTurn" />
            <div
              v-if="!myTurn"
              class="flex flex-col items-center px-2 py-2 h-fit"
            >
              <UInput
                @keyup.enter="sendSongMessage()"
                v-model="songGuess"
                class="w-full"
                size="xl"
                color="primary"
                variant="outline"
                icon="i-heroicons-chat-bubble-oval-left"
                placeholder="Guess the song ..."
              />
            </div>
          </div>
        </div>
        <div class="w-full h-full ml-2">
          <div
            class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-between"
          >
            <div
              id="artistChat"
              class="w-full h-full flex flex-col justify-between px-4 py-5 sm:px-6 overflow-y-scroll"
            >
              <div class="overflow-y-scroll max-h-full m-4 select-none">
                <div
                  v-for="(message, index) in artistMessages"
                  :key="index"
                  :class="[
                    'p-1 my-1',
                    message.username === null && message.info === 'close'
                      ? 'bg-orange-400 text-gray-950 rounded-lg p-1 my-1'
                      : '',
                    message.username === null &&
                    message.info === 'already_guessed'
                      ? 'bg-yellow-400 opacity-50 text-gray-950 rounded-lg p-1 my-1'
                      : '',
                    message.username === null &&
                    message.info !== 'close' &&
                    message.info !== 'already_guessed'
                      ? 'bg-primary text-gray-950 rounded-lg p-1 my-1'
                      : '',
                  ]"
                >
                  <div>
                    <h2 v-if="message.username === null">
                      <strong>Server: </strong>
                      {{ message.message }}
                    </h2>
                    <h2 v-else>
                      <strong :title="message.nickname ? message.username : ''">
                        {{
                          message.nickname
                            ? message.nickname
                            : message.username
                        }}:
                      </strong>
                      {{ message.message }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <UDivider class="my-2" v-if="!myTurn" />
            <div
              v-if="!myTurn"
              class="flex flex-col items-center px-2 py-2 h-fit"
            >
              <UInput
                @keyup.enter="sendArtistMessage()"
                v-model="artistGuess"
                class="w-full"
                size="xl"
                color="primary"
                variant="outline"
                icon="i-heroicons-chat-bubble-oval-left"
                placeholder="Guess the artists ..."
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="currentScreen === 'viewsettings'"
        class="flex flex-row h-full w-full"
      >
        <div
          v-if="iAmOwner"
          class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-evenly items-center"
        >
          <div class="flex flex-col items-center w-full">
            <div>
              <div class="flex flex-row items-center justify-between w-full">
                <h1 class="mr-2">Gamemode:</h1>
                <USelectMenu
                  @change="lobbyStore.setGameMode(myGamemode)"
                  v-model="myGamemode"
                  :options="gamemodes"
                  size="xl"
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Max. Players:</h1>
                <UInput
                  @change="lobbyStore.changeRules('max_players', myMaxPlayers)"
                  v-model="myMaxPlayers"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Min. Players:</h1>
                <UInput
                  @change="lobbyStore.changeRules('min_players', myMinPlayers)"
                  v-model="myMinPlayers"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Rounds:</h1>
                <UInput
                  @change="lobbyStore.changeRules('rounds', myMaxRounds)"
                  v-model="myMaxRounds"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Guessing Time:</h1>
                <UInput
                  @change="
                    lobbyStore.changeRules('guessing_time', myGuessingTime)
                  "
                  v-model="myGuessingTime"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-evenly items-center"
        >
          <div class="flex flex-col items-center w-full">
            <div>
              <div class="flex flex-row items-center justify-between w-full">
                <h1 class="mr-2">Gamemode:</h1>
                <USelectMenu
                  @change="lobbyStore.setGameMode(myGamemode)"
                  v-model="myGamemode"
                  :options="gamemodes"
                  size="xl"
                  disabled
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Max. Players:</h1>
                <UInput
                  @change="lobbyStore.changeRules('max_players', myMaxPlayers)"
                  v-model="myMaxPlayers"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                  disabled
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Min. Players:</h1>
                <UInput
                  @change="lobbyStore.changeRules('min_players', myMinPlayers)"
                  v-model="myMinPlayers"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                  disabled
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Rounds:</h1>
                <UInput
                  @change="lobbyStore.changeRules('rounds', myMaxRounds)"
                  v-model="myMaxRounds"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                  disabled
                />
              </div>
              <UDivider class="my-2" />
              <div class="flex flex-row items-center justify-between w-full">
                <h1>Guessing Time:</h1>
                <UInput
                  @change="
                    lobbyStore.changeRules('guessing_time', myGuessingTime)
                  "
                  v-model="myGuessingTime"
                  class="w-1/4"
                  color="primary"
                  variant="outline"
                  placeholder="Number"
                  type="number"
                  size="xl"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="currentScreen === 'selectsong'"
        class="flex flex-row h-full w-full"
      >
        <UCard class="w-full h-full overflow-y-scroll">
          <template #header>
            <UButtonGroup size="xl" orientation="horizontal">
              <UInput
                @keyup.enter="searchSong(searchQuery)"
                color="primary"
                variant="outline"
                v-model="searchQuery"
                placeholder="Search for a song"
                size="xl"
              />
              <UButton
                @click="searchSong(searchQuery)"
                icon="i-heroicons-chevron-right"
                color="primary"
                size="xl"
              />
            </UButtonGroup>
          </template>
          <ul>
            <li v-for="(track, index) in searchResults" :key="index">
              <div
                class="flex flex-row justify-between border border-gray-800 rounded-lg p-4 mb-4"
              >
                <div class="flex flex-row items-center w-1/12 hidden md:block">
                  <img :src="track.album.images[0].url" class="" />
                </div>
                <div class="flex flex-col items-center justify-evenly">
                  <div class="flex flex-col items-center justify-evenly">
                    <h1>{{ track.name }}</h1>
                    <h1 class="text-xs opacity-75">
                      {{ track.artists[0].name }}
                    </h1>
                  </div>
                </div>
                <div class="flex flex-row items-center justify-end w-fit">
                  <UButton
                    @click="handleSelectSong(track.id)"
                    color="primary"
                    variant="solid"
                    size="xl"
                    icon="i-heroicons-check"
                    block
                    trailing
                  >
                    Select
                  </UButton>
                </div>
              </div>
            </li>
          </ul>
        </UCard>
      </div>
      <div
        v-else-if="currentScreen === 'isselecting'"
        class="flex flex-row h-full w-full"
      >
        <div
          class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-center items-center"
        >
          @{{ selectorUsername }} is selecting a song!
        </div>
      </div>
      <div
        v-else-if="currentScreen === 'end'"
        class="flex flex-row h-full w-full"
      >
        <div
          class="w-full h-full border border-gray-800 rounded-lg flex flex-col justify-center items-center"
        >
          end
        </div>
      </div>
    </div>

    <div class="col-span-6 row-span-1 w-full h-full p-2">
      <div
        v-if="currentScreen === 'chat'"
        class="border border-gray-800 rounded-lg p-4 w-full h-full flex flex-row items-center text-center"
      >
        <div v-if="!isTempuser" class="w-full flex flex-row items-center">
          <UIcon name="i-heroicons-speaker-x-mark" class="mr-4" />
          <URange @change="changeVol" v-model="volume" name="range" />
          <UIcon name="i-heroicons-speaker-wave" class="ml-4" />
        </div>
        <h1 v-else class="w-full">
          As a temporary user, you are not able to listen to the song currently
          playing.
        </h1>
      </div>
      <div
        v-else
        class="border border-gray-800 rounded-lg p-4 w-full h-full flex flex-row items-center text-center"
      >
        <h1 class="w-full">Waiting for song to play.</h1>
      </div>
    </div>
  </div>
</template>
