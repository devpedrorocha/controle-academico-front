<template>
  <div class="container">
    <NavVue> Gerenciar Ações </NavVue>
    <section class="main_section">
      <TabelaVue
        tipoTabela="Ações"
        :bodyTabela="bodyTabela"
        :headersTabela="headersTabela"
        @openEditModal="openEditModal"
        @openAddModal="openAddModal"
        @delete="deleteAction"
        :create="true"
        :icone="icone"
      >
        
      </TabelaVue>

      <ModalVue
        v-if="editActive"
        @close="closeModal"
        @conclude="updateAction"
        :edit="true"
        :headersModal="headersModal"
      >
        <template #inputs>
          <div>
            <label class="label_nome">
              {{ headersTabela[0].label }}
            </label>
            <input
              type="text"
              for="header.value"
              v-model="objetoReq[headersTabela[0].value]"
            />
          </div>
          <label>{{ headersTabela[1].label }}</label>
          <input
            type="text"
            for="header.value"
            v-model="objetoReq[headersTabela[1].value]"
          />
        </template>
      </ModalVue>

      <ModalVue
        v-if="createActive"
        @conclude="createAction"
        @close="closeModal"
      >
        <template #inputs>
          <div class="actionName">
            <label for="">{{ headersTabela[0].label }}</label>
            <input type="text" for="header.value" v-model="actualAction" />
          </div>
          <div class="actionMethods">
            <label for="">{{ headersTabela[1].label }}</label>
            <input type="text" for="header.value" v-model="metodoModel" />
            <button type="button" @click="addMethod">Adicionar Método</button>
            <p style="margin-left: 53%">
              {{ newMethods }}
            </p>
          </div>
        </template>
      </ModalVue>
    </section>
  </div>
</template>

<script lang="ts">
import NavVue from "../../components/NavVue.vue";
import TabelaVue from "../../components/TabelaVue.vue";
import Actions from "../../req/api/ActionsReqApi";
import ModalVue from "../../components/ModalVue.vue";


export default {
  name: "ActionsView",
  components: {
    NavVue,
    TabelaVue,
    ModalVue,
  },
  data() {
    return {
      actions: [],
      bodyTabela: [],
      methodsMarkedModel: [],
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Métodos", value: "methods" },
      ],
      headersModal: [
        { label: "Nome", value: "name" },
        { label: "Métodos", value: "methods" },
      ],
      objetoReq: [],
      editActive: false,
      createActive: false,
      actualAction: "",
      icone: "fa-solid fa-crosshairs",
      metodoModel: "",
      newMethods: [],
      roleMethods: [],
    };
  },
  methods: {
    // ler ações
    async readActions() {
      let req = await Actions.readActions();
      this.actions = req.data.data;
    },

    // abrir modal de criar
    openAddModal() {
      this.createActive = true;
    },

    // criar ação
    async createAction() {
      try {
        let req = await Actions.createAction(
          this.actualAction,
          this.newMethods
        );

        if (req.status === 201) {
          alert("Ação criada com sucesso!");
          this.createActive = false;
          location.reload();
        }
      } catch (error) {
        alert(error);
      }
    },

    // adicionar método
    addMethod() {
      this.newMethods.push(this.metodoModel);
      this.metodoModel = "";
    },

    async addOrDeleteMethodsInRole() {
      try {
        const methodId = this.actualAction._id;
        console.log(methodId);

        // atribuir métodos não marcados à variável uncheckedMethods:
        let uncheckedMethods = this.roleMethods.filter(
          (method) => this.methodsMarkedModel.includes(method) === false
        );

        // requisição de remover métodos da ação:
        for (let i = 0; i < uncheckedMethods.length; i++) {
          await Actions.deleteMethodInActions(methodId, uncheckedMethods[i]);
        }

        // atribuir os métodos marcados que serão adicionadas a variável markedMethods:
        let markedMethods = this.methodsMarkedModel.filter(
          (method) => this.roleMethods.includes(method) === false
        );

        // requisição de acionar métodos na ação:
        for (let i = 0; i < markedMethods.length; i++) {
          await Actions.addMethodInActions(methodId, markedMethods[i]);
        }

        location.reload();
      } catch (error) {
        console.log(error);
      }
    },

    // abrir modal de edição
    openEditModal(id) {
      this.editActive = true;
      this.actualAction = this.actions.find((element) => element._id == id);

      this.objetoReq = { ...this.actualAction };

      delete this.objectReq._id;
    },

    // atualizar ação
    async updateAction() {
      try {
        let req = await Actions.updateActions(this.objetoReq);

        if (req.status === 204) {
          this.editActive = false;
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },

    // deletar ação
    async deleteAction(item) {
      console.log(item);

      let alert = confirm("Tem certeza disso?");
      if (alert) {
        const req = await Actions.deleteActions(item._id);
        if (req.status === 204) {
          const posicaoAction = this.actions.findIndex(
            (actualAction) => actualAction._id === item._id
          );
          this.actions.splice(posicaoAction, 1);
          location.reload();
        }
      }
    },

    // fechar modais de edição e criação
    closeModal() {
      this.editActive = false;
      this.createActive = false;
      this.objetoReq = {};
    },
  },

  async created() {
    await this.readActions();

    this.bodyTabela = this.actions.map((object) => {
      const newObject = {
        _id: object._id,
        name: object.name,
        methods: object.methods,
      };

      return newObject;
    });
  },
};
</script>

<style>
</style>