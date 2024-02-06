export default defineAppConfig({
  serverUrl: process.env.SERVER_URL,
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI,
  ui: {
    primary: "green",
    gray: "cool",
    notifications: {
      position: "top-auto bottom-0",
    },
  },
});
