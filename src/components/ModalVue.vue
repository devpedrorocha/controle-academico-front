<template>
  <div class="modal-container" @click="clickForaModal">
    <section class="container_main">
      <h1 class="titulo">{{ tipoModal }}</h1>
      <form v-if="edit" @submit.prevent="conclude" class="dados">
        <slot name="inputs"></slot>
        <slot v-if="select && isAdmin" name="selects"></slot>

        <div class="buttons">
          <slot name="btn_enrolled" id="btn_enrolled"></slot>
          <button class="cancel_btn button" type="button" @click="close">
            CANCELAR
          </button>
          <button class="confirm_btn button" type="submit">CONCLUIR</button>
        </div>
      </form>

      <form v-else class="dados" @submit.prevent="conclude">
        <slot name="inputs"></slot>
        <div class="buttons">
          <button class="cancel_btn button" type="button" @click="close">
            CANCELAR
          </button>
          <button class="confirm_btn button" type="submit">CONCLUIR</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import localforage from "localforage";

export default {
  data() {
    return {
      isAdmin: null,
    };
  },
  props: {
    select: Boolean,
    headersModal: Array,
    tipoModal: String,
    edit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickForaModal({ target, currentTarget }) {
      if (target === currentTarget) this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    conclude() {
      this.$emit("conclude");
    },
  },
  computed: {},
  async created() {
    this.isAdmin = await localforage.getItem("admin");    
  },
};
</script>

<style scoped>
.cancel_btn {
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  cursor: pointer;
}
.cancel_btn:hover {
  background-color: rgb(238, 238, 238);
}
.modal-container {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container_main {
  background: #fff;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-height: auto;
  padding: 2rem 4rem;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.dados {
  box-sizing: border-box;
  flex-direction: column;
}

.buttons {
  display: flex;
  justify-content: end;
  gap: 1rem;
  margin-top: 1.5rem;
}
#btn_enrolled {
  color: black;
}
</style>