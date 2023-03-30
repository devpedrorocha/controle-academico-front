<template>
  <div class="gerenciador">
    <router-link to="/admin" class="link">Início</router-link>
    <span class="setinha"> > </span>
    <slot class="page_atual"></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "NavVue",
};
</script>

<style scoped>
.gerenciador {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: flex-start;
  width: 100%;
  height: 8vh;
  padding-left: 15rem;
  background: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.link {
  padding: 0.3rem;
  border-bottom: 1px solid black;
}

.setinha {
  padding: 0.8rem;
}
</style>