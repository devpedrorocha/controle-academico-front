<template>
  <section>
    <div class="secao_titulo_principal">
      <!-- INICIO CABEÇALHO DA TABELA -->
      <div class="cabecalho_tabela">
        <font-awesome-icon :icon="icone" class="icone_view" />
        <h1 class="titulo_principal">{{ tipoTabela }}</h1>
      </div>
      <div v-if="create" class="secao_botao">
        <button class="button" id="botao_adicionar" @click="openAddModal">
          Criar
        </button>
      </div>
    </div>
    <!-- FINAL CABEÇALHO TABELA -->
    <!-- INICIO TABELA -->
    <div>
      <table class="tabela">
        <thead>
          <tr class="cabecalho">
            <th v-for="(header, index) in headersTabela" :key="header + index">
              {{ header.label }}
            </th>
            <th v-if="searchIcon">Acessar mais informações</th>
            <th v-if="isAdmin">Excluir</th>
            <th v-if="isAdmin || editHeader">Editar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in bodyTabela" :key="index" class="datas">
            <td
              v-for="(header, index) in headersTabela"
              :key="index"
              class="data"
            >
              <span v-if="item[header.value] || item[header.value] == 0">
                {{ item[header.value] }}
              </span>
              <span v-else>-</span>
            </td>
            <td v-if="searchIcon" class="linha_icone">
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                class="icone"
                @click="redirectPage(item._id)"
              />
            </td>

            <td v-if="isAdmin" class="linha_icone">
              <font-awesome-icon
                @click="deleteItem(item)"
                icon="fa-solid fa-trash"
                class="icone"
              />
            </td>
            <td v-if="isAdmin || item.edit  || edit" class="linha_icone">
              <font-awesome-icon
                @click="openEditModal(item._id)"
                icon="fa-solid fa-pen"
                class="icone"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- FINAL TABELA -->
    <!-- INICIO SLOTS MODAL -->
  </section>
</template>

<script lang="ts">
import localforage from "localforage";
import { inject, onBeforeMount } from "vue";
import ModalVue from "../components/ModalVue.vue";

export default {
  name: "TabelaVue",
  setup() {
    const {edit} = inject('edit')
    return {
      edit, 
    }
  },
  data() {
    return {
      isAdmin: null,
      editHeader: null,
      editClass: null
    };
  },
  props: {
    tipoTabela: String,
    create: Boolean,
    headersTabela: Array,
    bodyTabela: Array,
    user: Boolean,
    icone: String,
    searchIcon: Boolean,
  },
  components: {
    ModalVue,
  },
  methods: {
    openAddModal() {
      this.$emit("openAddModal");
    },
    openEditModal(id) {
      this.$emit("openEditModal", id);
    },
    redirectPage(id) {
      this.$emit("redirectPage", id);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
  },
  async created() {
    this.isAdmin = await localforage.getItem("admin");
    this.editHeader = await localforage.getItem("edit");
    
  },
  async updated(){
    this.editHeader = await localforage.getItem("edit");
  }
};
</script>

<style scoped>
section {
  width: 100%;
}
.secao_titulo_principal {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  gap: 700px;
  align-items: center;
  padding: 1rem;
  width: 100%;
}

.icone_view {
  font-size: 2rem;
  margin-right: 1rem;
}

.cabecalho_tabela {
  display: flex;
  align-items: center;
}

.secao_botao {
  width: 50px;
}

#botao_adicionar {
}

.titulo_principal {
  font-size: 2.2rem;
}

.tabela {
  width: 80%;
  height: 70vh;
}

.data {
  text-align: center;
}

.linha_icone {
  text-align: center;
  padding: 0;
}

.icone {
  color: #322f49;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0.6rem;
}

.icone:hover {
  transform: scale(1.4);
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  padding: 1rem;
  border-radius: 6px;
}

.cabecalho {
  color: #fff;
  background: #000000;
  width: 100%;
}

th {
  padding: 1rem 1rem;
}

td {
  padding: 1rem;
  min-height: 3px;
}

tr:nth-child(even) {
  /* background: cyan; */
}
</style>