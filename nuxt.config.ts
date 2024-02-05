// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Guess The Song",
      script: [
        {
          src: "https://sdk.scdn.co/spotify-player.js",
          crossorigin: "anonymous",
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  colorMode: {
    preference: "dark",
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
});
