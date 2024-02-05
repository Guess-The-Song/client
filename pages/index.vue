<script lang="ts" setup>
const { x, y } = useMouse();
const title = ref(false);
const items = [
  {
    label: "About",
    icon: "i-heroicons-information-circle",
    content:
      "Embark on a musical journey with our song-identification challenge. In each round, the active player chooses a song from Spotify, while other participants strive to identify both the song and its artists.The game offers a varied selection of tracks, testing participants music knowledge and recognition skills. Engage in this competitive yet straightforward experience, where accuracy and speed determine success. Step into the world of musical deduction and see if you have what it takes to triumph in this intriguing game of knowledge.",
  },
  {
    label: "Disclaimer",
    icon: "i-heroicons-exclamation-circle",
    content:
      "To enhance your experience, we utilize a single functional cookie, allowing you to stay logged in effortlessly. We may store and access data as displayed on the Spotify login screen, prioritizing the utmost privacy and security. Your control matters - in the future, we plan to enable users to host their own server using a Docker-compose file. We are dedicated to preserving your privacy.",
  },
];

function onChangeTabs(index: any) {
  const item = items[index];
}

function hoverTitle() {
  title.value = !title.value;
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-evenly px-4 w-full h-full relative overflow-x-hidden"
  >
    <div
      class="absolute bg-primary rounded-full pointer-events-none opacity-50 blur-3xl hidden md:block"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
        width: '100px',
        height: '100px',
        transform: title
          ? 'scale(1.5) translate(-30%, -70%)'
          : 'scale(1) translate(-50%, -110%)',
        transition: 'transform 300ms',
      }"
    />
    <h1
      class="text-3xl md:text-6xl xl:text-9xl opacity-85 select-none hidden md:block"
      @mouseenter="hoverTitle"
      @mouseleave="hoverTitle"
    >
      Guess The Song
    </h1>
    <h1 class="text-center text-7xl opacity-75 select-none md:hidden">
      Guess <br />The <br />Song
    </h1>
    <div class="md:w-1/2 mb-16 opacity-75 h-1/4">
      <UTabs :items="items" @change="onChangeTabs" />
    </div>
  </div>
</template>
