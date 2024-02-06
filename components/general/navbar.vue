<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useLobbyStore } from "@/stores/lobby";
import cryptoRandomString from "crypto-random-string";

const appConfig = useAppConfig();
const clientid = appConfig.clientId;
const redirecturi = appConfig.redirectUri;

const userStore = useUserStore();
const lobbyStore = useLobbyStore();

const {
  isLoggedIn,
  isTempuser,
  nickname,
  username,
  product,
  spotify_access_token,
  playlistId,
} = storeToRefs(userStore);

let mynickname = "";
let myusername = "";

function handleCreateTempUser() {
  userStore.requestUser(mynickname);
}

const isOpenSettings = ref(false);
const isOpenFriends = ref(false);
const isOpenPlay = ref(false);
const isOpenLogin = ref(false);
const isOpenDeleteAccount = ref(false);

function handleSpotifyLogin() {
  const CLIENT_ID = clientid;
  const REDIRECT_URI = redirecturi;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPES = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-library-read",
    "user-library-modify",
    "playlist-modify-public",
    "playlist-modify-private",
  ];

  let storedState = "";
  let spotify_url = "";

  if (typeof window !== "undefined") {
    storedState = cryptoRandomString({ length: 16, type: "url-safe" });
    localStorage.setItem("storedState", storedState);
  }

  if (storedState !== "") {
    spotify_url = `${AUTH_ENDPOINT}?&response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES.join(
      "%20"
    )}&state=${storedState}&redirect_uri=${REDIRECT_URI}`;
  }

  navigateTo(spotify_url, { external: true });
}

function handleTempuserLogin() {
  userStore.setTempuser();
}
let lobbyid = "";
function joinLobby() {
  isOpenPlay.value = false;
  lobbyStore.setLobbyid(lobbyid);
  lobbyStore.joinLobby();
}
</script>

<template>
  <div
    class="flex flex-row justify-between w-full select-none navbar py-3 border-b border-primary"
  >
    <div class="pr-2 md:pl-6 flex flex-row items-center hidden md:block">
      <UButton color="primary" variant="link" to="/" size="md"> gts </UButton>
    </div>

    <div class="flex flex-row items-center justify-center">
      <UButton color="primary" variant="link" to="/" size="md"> Home </UButton>
      <UButton
        v-if="isLoggedIn"
        @click="isOpenPlay = true"
        class="px-2"
        variant="link"
        color="primary"
        size="md"
        label="Play"
      />

      <UTooltip v-else text="Log in to play" trigger="hover"
        ><UButton
          @click="isOpenPlay = true"
          class="px-2"
          variant="link"
          color="primary"
          size="md"
          label="Play"
          disabled
        />
      </UTooltip>

      <UButton color="primary" variant="link" to="/selfhost" size="md">
        Selfhost
      </UButton>

      <UModal v-model="isOpenPlay">
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Play
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpenPlay = false"
              />
            </div>
          </template>

          <div>
            <div @click="isOpenPlay = false">
              <UButton
                @click="lobbyStore.createLobby()"
                class="mb-4"
                icon="i-heroicons-chevron-right"
                size="xl"
                color="primary"
                variant="solid"
                label="Create New Lobby"
                trailing
                block
              />
            </div>

            <UButtonGroup size="xl" orientation="horizontal" class="w-full">
              <UInput
                @keyup.enter="joinLobby"
                v-model="lobbyid"
                class="w-full"
                color="primary"
                variant="outline"
                size="xl"
                placeholder="Enter Lobby Code to Join"
                block
              />
              <div @click="isOpenPlay = false">
                <UButton
                  @click="joinLobby"
                  icon="i-heroicons-chevron-right"
                  color="primary"
                />
              </div>
            </UButtonGroup>
          </div>
        </UCard>
      </UModal>
    </div>

    <div v-if="!isLoggedIn" class="pr-2 md:pr-6 flex flex-row items-center">
      <UButton
        @click="isOpenLogin = true"
        icon="i-heroicons-arrow-right-end-on-rectangle"
        size="sm"
        color="primary"
        variant="outline"
        label="Login"
        trailing
      />

      <UModal v-model="isOpenLogin">
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Login
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpenLogin = false"
              />
            </div>
          </template>

          <div v-if="!isTempuser">
            <UButton
              @click="handleSpotifyLogin"
              class="mb-4"
              size="xl"
              color="primary"
              variant="solid"
              label="Continue with Spotify"
              trailing
              block
            />
            <UButton
              @click="handleTempuserLogin"
              size="xl"
              color="gray"
              variant="solid"
              label="Continue as temporary user"
              trailing
              block
            />
          </div>
          <div v-else>
            <UFormGroup label="Nickname" required>
              <UInput
                @keyup.enter="handleCreateTempUser"
                placeholder="Nickname"
                size="xl"
                icon="i-heroicons-user"
                v-model="mynickname"
              />
            </UFormGroup>
            <UButton
              class="mt-8"
              @click="handleCreateTempUser"
              to="/"
              icon="i-heroicons-chevron-right"
              size="xl"
              color="primary"
              variant="outline"
              label="Save  &  Continue"
              trailing
              block
            />
          </div>
        </UCard>
      </UModal>
    </div>

    <div v-else-if="isTempuser" class="pr-2 md:pr-6 flex flex-row items-center">
      <h1>TempUser</h1>
    </div>

    <div v-else class="pr-2 md:pr-6 flex flex-row items-center">
      <UButton
        @click="isOpenFriends = true"
        class="mr-2"
        icon="i-heroicons-users-solid"
        size="sm"
        color="primary"
        square
        variant="outline"
        disabled
      />

      <UButton
        @click="isOpenSettings = true"
        icon="i-heroicons-cog-6-tooth-solid"
        size="sm"
        color="primary"
        square
        variant="outline"
      />

      <UModal v-model="isOpenSettings">
        <UCard
          :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
              base: 'grow',
            },
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Settings
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpenSettings = false"
              />
            </div>
          </template>

          <div class="h-full flex flex-col items-center justify-center">
            <UFormGroup class="mb-4" label="Username" required>
              <UButtonGroup size="xl" orientation="horizontal" class="w-full">
                <UInput
                  @keyup.enter="userStore.changeUsername(myusername)"
                  v-model="myusername"
                  placeholder="username"
                  icon="i-heroicons-user"
                />
                <UButton
                  @click="userStore.changeUsername(myusername)"
                  icon="i-heroicons-chevron-right"
                  color="primary"
                />
              </UButtonGroup>
            </UFormGroup>
            <UFormGroup class="mb-14" label="Nickname">
              <UButtonGroup size="xl" orientation="horizontal" class="w-full">
                <UInput
                  @keyup.enter="userStore.changeNickname(mynickname)"
                  v-model="mynickname"
                  placeholder="nickname"
                  icon="i-heroicons-user"
                />
                <UButton
                  @click="userStore.changeNickname(mynickname)"
                  icon="i-heroicons-chevron-right"
                  color="primary"
                />
              </UButtonGroup>
            </UFormGroup>
            <UButton @click="isOpenDeleteAccount = true" color="orange"
              >Delete Account</UButton
            >
            <UModal v-model="isOpenDeleteAccount">
              <UCard
                :ui="{
                  ring: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
              >
                <template #header>
                  <h1>Are you sure you want to delete your account?</h1>
                </template>
                <div class="p-4">
                  <UButton
                    @click="userStore.deleteAccount()"
                    class="mb-4"
                    color="orange"
                    size="xl"
                    block
                    >Yes, delete my account</UButton
                  >
                  <UButton
                    @click="isOpenDeleteAccount = false"
                    color="primary"
                    variant="outline"
                    size="xl"
                    block
                    >No, take me back!</UButton
                  >
                </div>
              </UCard>
            </UModal>
          </div>
        </UCard>
      </UModal>

      <UModal v-model="isOpenFriends" fullscreen>
        <UCard
          :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
              base: 'grow',
            },
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Friends
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpenFriends = false"
              />
            </div>
          </template>

          <div class="h-full">Will be implemented later!</div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<style scoped></style>
