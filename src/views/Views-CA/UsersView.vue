<template>
  <div class="container">
    <NavVue> Gerenciar Usuários </NavVue>

    <section class="main_section">
      <TabelaVue
        tipoTabela="Usuários"
        :headersTabela="headersTabela"
        :bodyTabela="users"
        :create="true"
        :icone="icone"
        @openEditModal="openEditModal"
        @openAddModal="openAddModal"
        @delete="deleteUser"
      />

      <ModalVue
        v-if="editModalActive"
        tipoModal="Editar Usuário"
        :edit="true"
        @conclude="updateUser"
        @close="closeModal"
      >
        <template #btn_enrolled>
          <router-link
            :to="{
              name: 'create enrolled',
              query: {
                idUser: this.actualUser._id,
                name: this.actualUser.name,
              },
            }"
          >
            <button class="button button_enrolled">MATRICULAR</button>
          </router-link>
        </template>
        <template #inputs>
          <label
            v-for="(valor, key) in headersModal"
            :key="key"
            :for="valor.value"
          >
            {{ valor.label }}
            <input
              type="text"
              :id="valor.value"
              v-model="objetoReq[valor.value]"
            />
          </label>
        </template>
      </ModalVue>

      <ModalVue
        v-if="modalAddActive"
        tipoModal="Criar Usuário"
        @conclude="createUser"
        @close="closeModal"
      >
        <template #inputs>
          <label
            v-for="(valor, key) in headersModalCreate"
            :key="key"
            :for="valor.value"
          >
            {{ valor.label }}
            <input
              type="text"
              :id="valor.value"
              v-model="objetoReqCreate[valor.value]"
              required
            />
          </label>
        </template>
      </ModalVue>
    </section>
  </div>
</template>

<script lang="ts">
import User from "../../req/api/UserReqApi.js";
import TabelaVue from "../../components/TabelaVue.vue";
import NavVue from "../../components/NavVue.vue";
import ModalVue from "../../components/ModalVue.vue";

interface UserContainer {
  _id: string;
  cpf: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  telephone: string;
  address: string;
  register: string[];
}

interface HeadersContainer {
  label: string;
  value: keyof UserContainer;
}

export default {
  name: "UsersView",
  data() {
    return {
      objetoReq: {
        name: null,
        surname: null,
        cpf: null,
        email: null,
        telephone: null,
        address: null,
      },
      icone: "fa-solid fa-users",
      objetoReqCreate: {
        name: null,
        surname: null,
        password: null,
        cpf: null,
        email: null,
        telephone: null,
        address: null,
      },
      otherButton: true,
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Sobrenome", value: "surname" },
        { label: "CPF", value: "cpf" },
        { label: "Email", value: "email" },
        { label: "Telefone", value: "telephone" },
        { label: "Endereço", value: "address" },
      ],
      headersModal: [
        { label: "Nome", value: "name" },
        { label: "Sobrenome", value: "surname" },
        { label: "CPF", value: "cpf" },
        { label: "Email", value: "email" },
        { label: "Telefone", value: "telephone" },
        { label: "Endereço", value: "address" },
      ],
      headersModalCreate: [
        { label: "Nome", value: "name" },
        { label: "Sobrenome", value: "surname" },
        { label: "CPF", value: "cpf" },
        { label: "Senha", value: "password" },
        { label: "Email", value: "email" },
        { label: "Telefone", value: "telephone" },
        { label: "Endereço", value: "address" },
      ],
      users: [],
      actualUser: {},
      modelUserToCreate: {},
      modalAddActive: false,
      editModalActive: false,
    };
  },
  methods: {
    closeModal() {
      this.modalAddActive
        ? (this.modalAddActive = false)
        : (this.editModalActive = false);
    },
    openEditModal(id) {
      this.editModalActive = true;
      this.actualUser = this.users.find((element) => element._id == id);
      this.objetoReq = { ...this.actualUser };
      delete this.objetoReq._id;
    },
    openAddModal() {
      this.modalAddActive = true;
    },
    async createUser() {
      try {
        let req = await User.createUsers(this.objetoReqCreate);

        if (req.status === 201) {
          alert("Usuário criado com sucesso!");
          this.users.push(req.data.data);
          this.modalAddActive = false;
        }
      } catch (e) {
        alert(e);
      }
    },
    async readUsers() {
      try {
        let req = await User.readUsers();
        this.users = req.data.data;
      } catch (e) {
        alert(e);
      }
    },
    async updateUser() {
      let req = await User.updateUser(this.actualUser._id, this.objetoReq);

      if (req.status === 204) {
        alert("Alteração realizada com sucesso!");
        this.editModalActive = false;

        let posicaoUser = this.users.findIndex(
          (editUser: UserContainer) => editUser._id === this.actualUser._id
        );
        this.objetoReq._id = this.actualUser._id;
        this.users.splice(posicaoUser, 1, this.objetoReq);
      }
    },
    async deleteUser(user) {
      let res = confirm(
        `Deseja realmente DELETAR o usuário: ${user.name}${user.surname}?`
      );

      if (res === true) {
        let req = await User.deleteUser(user._id);

        if (req.status === 204) {
          let posicaoUser = this.users.findIndex(
            (actualUser) => actualUser._id === user._id
          );
          this.users.splice(posicaoUser, 1);
          alert("Usuário deletado com sucesso!");
        }
      }
    },
  },
  components: {
    TabelaVue,
    NavVue,
    ModalVue,
  },
  created() {
    this.readUsers();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main_section {
  width: 75%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} 
.button_enrolled {
  background-color: #ff0000e4;
  border: 1px solid #000;
}
</style>