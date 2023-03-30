<template>
  <div id="app">
    <HeaderVue></HeaderVue>
    <main id="main">
      <Transition>
        <router-view></router-view>
      </Transition>
    </main>
    <FooterVue></FooterVue>
  </div>
</template>

<script lang="ts">
import HeaderVue from "./components/HeaderVue.vue";
import FooterVue from "./components/FooterVue.vue";
import { provide } from "vue";
import { computed, ref } from "@vue/reactivity";
export default {
  setup() {
    const edit = ref(false)
    function mudarEditParaTrue() {
      edit.value = true
    }
    function mudarEditParaFalse() {
      edit.value = false
    }
    provide('edit', {edit, mudarEditParaFalse, mudarEditParaTrue})
    return {
      edit,
      mudarEditParaFalse,
      mudarEditParaTrue
    }
  },
  components: {
    HeaderVue,
    FooterVue,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Oswald&family=Poppins:wght@300;400&display=swap");


body,
ul,
li,
h1,
h2,
p {
  margin: 0px;
  padding: 0px;
}

ul {
  list-style: none;
}

body {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  color: #000000;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main_section {
  width: 75%;
}

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: #f4f5f7;
}

#main {
  flex: 1;
  min-height: 100%;
}

a {
  text-decoration: none;
  color: #000000;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.6s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.button {
  border: none;
  border-radius: 10px;
  color: #ffff;
  background-color: #000;
  font-weight: bold;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;;
  padding: 8px 40px;
  cursor: pointer;
}
.button:hover{
  background-color: rgb(36, 36, 36);
}
</style>
