// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      clientID:
        process.env.NUXT_PUBLIC_CLIENT_ID || "5b562fe7d96648f9ab6d2c72fbb7a06a", // NUXT_PUBLIC_CLIENT_ID
      redirectURI:
        process.env.NUXT_PUBLIC_REDIRECT_URI || "https://gts.thaemisch.com/auth", // NUXT_PUBLIC_REDIRECT_URI
      serverURL:
        process.env.NUXT_PUBLIC_SERVER_URL || "https://gts.thaemisch.com:3000", // NUXT_PUBLIC_SERVER_URL
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
