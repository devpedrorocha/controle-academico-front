<template>
  <div class="container-login">
    <LoginVue></LoginVue>
  </div>
</template>

<script lang="ts">
import LoginVue from '../components/LoginVue.vue';
export default {
    components: { LoginVue }
}
</script>

<style>

.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

</style>