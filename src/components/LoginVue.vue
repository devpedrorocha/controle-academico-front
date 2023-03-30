<template>
  <div class="secao_logar">
    <h1 class="titulo_login">LOGIN</h1>
    <form class="formulario_login" @submit.prevent="LoginUser">
      <input
        class="input_logar"
        type="text"
        placeholder="CPF"
        required
        maxlength="11"
        v-model="cpf"
      />
      <input
        class="input_logar"
        type="password"
        placeholder="Senha"
        required
        v-model="password"
      />
      <button class="botao_acessar" type="submit">ACESSAR</button>
    </form>
  </div>
</template>

<script lang="ts">
import EnrolledReqApi from "../req/api/EnrolledReqApi";
import LocalForage from "localforage";
import User from "../req/api/UserReqApi.js";
import store from "../store/index";

export default {
  name: "LoginVue",
  data() {
    return {
      cpf: "",
      password: "",
      enrolleds: [],
    };
  },
  methods: {
    async LoginUser() {
      try {
        const res = await User.LoginUser(this.cpf, this.password);
        if (res.status === 200) {
          this.readEnrolleds();
          if (res.data.data.name == "admin") {
            await LocalForage.setItem("admin", true);
            store.commit("SET_USER", { data: res.data });
            store.commit("LOGIN");
            this.goRoute("admin");

          } else {
            store.commit("SET_USER", { data: res.data });
            store.commit("LOGIN");
            this.goRoute("user subjects");
          }
        }
      } catch (e) {
        alert(e.response.data);
      }
    },
    async readEnrolleds() {
      let req = await EnrolledReqApi.readEnrolleds();
      this.enrolleds = req.data.data;
    },
    goRoute(name: string) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style>
.secao_logar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 15rem;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  width: 40%;
  height: 40%;
  background: white;
}

.titulo_login {
  margin-bottom: 1.6rem;
}

.formulario_login {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input_logar {
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  display: block;
  border-radius: 0.4rem;
  border: 1px solid;
  width: 70%;
  padding: 0.8rem;
  margin-bottom: 1.2rem;
}

.botao_acessar {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  display: inline;
  width: 74.5%;
  height: 3rem;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: rgb(57, 74, 92);
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.botao_acessar:hover {
  cursor: pointer;
  background-color: rgb(34, 46, 58);
}
</style>