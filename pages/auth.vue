<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";

const userStore = useUserStore();

let code: string | null = null;
let state: string | null = null;

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  code = urlParams.get("code");
  state = urlParams.get("state");

  if (code && state) {
    userStore.authenticateUser(code, state);
  } else {
    console.log("no code or state");
    await navigateTo("/");
  }
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-evenly w-full h-full text-center"
  >
    <h1
      class="text-3xl md:text-6xl xl:text-9xl opacity-75 select-none text-center"
    >
      Authenticating <br />Please wait
    </h1>
  </div>
</template>
