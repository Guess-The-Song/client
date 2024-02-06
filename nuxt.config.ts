// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      clientId: "", // can be overridden by NUXT_PUBLIC_CLIENT_ID environment variable
      redirectUri: "", // can be overridden by NUXT_PUBLIC_REDIRECT_URI environment variable
      serverUrl: "", // can be overridden by NUXT_PUBLIC_SERVER_URL environment variable
    },
  },
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
    pageTransition: { name: "page", mode: "out-in" },
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
