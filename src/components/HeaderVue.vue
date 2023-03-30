<template>
  <header>
    <nav class="navegacao">
      <div class="img-home">
        <router-link to="/admin" class="logo">
          <img src="../assets/logo-udesc.jpg" alt="Logo UDESC" />
        </router-link>
      </div>
      <div>
        <p class="logout" v-show="loginStatus" @click="Desloga">SAIR</p>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import LocalForage from "localforage";
import User from "../req/api/UserReqApi.js";
import store from "../store/index";

export default {
  name: "HeaderVue",
  data() {
    return {
      visibilidadeSair: false,
      user: "",
    };
  },
  methods: {
    async User() {
      let name = await LocalForage.getItem("username");
      this.user = name as string;
    },
    async Desloga() {
      try {
        store.commit("LOGOUT");
        this.goRoute("login");
        await User.Logout();
      } catch (e) {
        alert(e);
      }
    },
    goRoute(name: string) {
      this.$router.push({ name: name });
    },
  },
  computed: {
    loginStatus() {
      return store.state.logged;
    },
  },
  created() {
    this.User();
  },
};
</script>

<style scoped>
.logo img {
  width: 130px;
  margin-right: 35rem;
}
.navegacao {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.img-home {
  max-width: 30%;
}

header {
  padding: 0px 2rem;
  background-color: #000000;
}

h1 {
  color: #fff;
  margin-right: 28rem;
}

p {
  color: #fff;
  padding: 0px 20px;
  text-decoration: none;
  font-size: 1.25rem;
}

.logout{
  border-bottom: 2px solid transparent;
  border-top: 2px solid transparent;
}

.logout:hover {
  cursor: pointer;
  border-bottom: 2px solid #fff;
}
</style>