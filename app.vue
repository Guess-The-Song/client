<script lang="ts" setup>
import { socket } from "@/socket";
socket.off();
import { useConnectionStore } from "@/stores/connection";
import { useUserStore } from "@/stores/user";
import { watch } from "vue";

const connectionStore = useConnectionStore();
const { isConnected } = storeToRefs(connectionStore);

connectionStore.bindEvents();

watch(isConnected, (newVal) => {
  if (newVal) {
    const userStore = useUserStore();
    const token = useCookie("token");
    const auth_token: string = token.value?.toString() || "";
    userStore.cookieAuth(auth_token);
  }
});
</script>

<template>
  <div class="flex flex-col w-full h-screen">
    <GeneralNavbar />
    <NuxtPage class="overflow-y-scroll" />
    <UNotifications />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
