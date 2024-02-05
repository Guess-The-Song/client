import { defineStore } from "pinia";
import { socket } from "@/socket";

async function navTo(path: string) {
  await navigateTo(path);
}

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    isTempuser: false,
    nickname: "",
    username: "",
    product: "",
    spotify_access_token: "",
    playlistId: "",
  }),

  actions: {
    getSpotifyToken() {
      return this.spotify_access_token;
    },
    setLoggedIn() {
      this.isLoggedIn = true;
    },
    setTempuser() {
      this.isTempuser = true;
    },
    setNickname(nickname: string) {
      this.nickname = nickname;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setProduct(product: string) {
      this.product = product;
    },
    requestUser(nickname: string) {
      socket.emit("createTmpUser", { name: nickname }, (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.setTempuser();
          this.setNickname(nickname);
          this.setUsername(response.username);
          this.setLoggedIn();
          navTo("/");
        }
      });
    },
    authenticateUser(code: string, state: string) {
      const storedState = localStorage.getItem("storedState");
      socket.emit(
        "authorizationCode",
        {
          code: code,
          state: state,
          storedState: storedState,
        },
        (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          }
          localStorage.removeItem("storedState");

          if (response.spotify_exists) {
            this.setUsername(response.username);
            if (response.nickname !== null) {
              this.setNickname(response.nickname);
            }
            this.setProduct(response.product);

            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);

            const token = useCookie("token", { expires: expireDate });
            token.value = response.token;

            this.setLoggedIn();
            navTo("/");
          } else {
            this.setProduct(response.product);
            navTo("/register");
          }
        }
      );
    },
    registerUser(un: string, nn: string) {
      socket.emit(
        "register",
        { username: un, nickname: nn },
        (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          } else {
            this.username = un;
            this.nickname = nn;
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);

            const token = useCookie("token", { expires: expireDate });
            token.value = response.token;

            this.setLoggedIn();
            navTo("/");
          }
        }
      );
    },
    cookieAuth(auth_token: string) {
      socket.emit("auth", { token: auth_token }, (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.setLoggedIn();
          this.setNickname(response.nickname);
          this.setUsername(response.username);
          this.setProduct(response.product);

          const toast = useToast();
          toast.add({ title: "Successfully logged in!" });
        }
      });
    },
    setSpotifyToken() {
      socket.emit("getAccessToken", (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.spotify_access_token = response.access_token;
        }
      });
    },

    fetchPlaylistId() {
      socket.emit("getPlaylistId", (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          this.playlistId = response.playlist_id;
        }
      });
    },
    setPlaylistId() {
      console.log("setPlaylistId"); //TODO: implement setPlaylistId
    },
    handleFriendUpdate(data: any) {
      console.log("handleFriendUpdate"); //TODO: implement handleFriendUpdate
    },
    changeUsername(newUsername: string) {
      socket.emit(
        "changeUsername",
        { username: newUsername },
        (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          } else {
            this.setUsername(newUsername);
            const toast = useToast();
            toast.add({ title: "Successfully changed username!" });
          }
        }
      );
    },
    changeNickname(newNickname: string) {
      socket.emit(
        "changeNickname",
        { nickname: newNickname },
        (response: any) => {
          if (response.error) {
            console.log(response.error);
            return;
          } else {
            this.setNickname(newNickname);
            const toast = useToast();
            toast.add({ title: "Successfully changed nickname!" });
          }
        }
      );
    },
    deleteAccount() {
      socket.emit("removeAccount", (response: any) => {
        if (response.error) {
          console.log(response.error);
          return;
        } else {
          const toast = useToast();
          toast.add({ title: "Successfully deleted account!" });
          navTo("/");
        }
      });
    },
  },
});
