<template>
  <div class="container">
    <NavVue> Gerenciar Papéis </NavVue>
    <section class="main_section">
      <TabelaVue
        :data="roles"
        :headersTabela="headersTabela"
        :bodyTabela="bodyTabela"
        :populateArray="true"
        :icone="icone"
        :create="create"
        tipoTabela="Papéis"
        @openEditModal="openEditModal"
        @openAddModal="openAddModal"
        @delete="deleteRole"
      />
      <ModalVue
        v-if="editActive"
        tipoModal="Editar Papel"
        @close="closeModal"
        @conclude="addOrDeleteActionsInRole"
      >
        <template #inputs>
          <nav class="inputs_container">
            <!-- <div>
              <label class="label_nome">
                {{ headersTabela[0].label }}
              </label>
              <input
                type="text"
                v-model="roleInfo[headersTabela[0].value]"
              />
            </div> -->
            <h3>Ações:</h3>
            <div class="checkbox_container">
              <div 
                class="input_checkbox"
                v-for="(acao, index) in acoes" :key="index"
              >
                <input
                  type="checkbox"
                  :id="acao.name"
                  :value="acao.name"
                  v-model="markedActionsModel"
                />
                <label :for="acao.name">
                  {{ acao.name }}
                </label>
              </div>
            </div>
            {{ markedActionsModel }}
          </nav>
        </template>
      </ModalVue>

      <ModalVue 
        v-if="createActive"
        tipoModal="Criar Papel"
        @close="closeModal"
        @conclude="createRole"
      >
        <template #inputs>
          <nav class="inputs_container">
            <div>
              <label class="label_nome">Nome</label>
              <input 
                type="text"
                v-model="newRoleName"
              />
            </div>
            <h3>Ações:</h3>
            <div class="checkbox_container">
              <div 
                class="input_checkbox"
                v-for="(acao, index) in acoes" :key="index"
              >
                <input
                  type="checkbox"
                  :id="acao.name"
                  :value="acao.name"
                  v-model="markedActionsModel"
                />
                <label :for="acao.name">
                  {{ acao.name }}
                </label>
              </div>
            </div>
          </nav>
        </template>
      </ModalVue>
    </section>
  </div>
</template>

<script lang="ts">
import NavVue from "../../components/NavVue.vue";
import TabelaVue from "../../components/TabelaVue.vue";
import ModalVue from "../../components/ModalVue.vue";
import RolesApi from "../../req/api/RolesReqApi";

export default {
  name: "RolesView",

  data() {
    return {
      roles: [],
      bodyTabela: [],
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Ações", value: "actions" },
      ],
      roleInfo: {},
      icone: "fa-solid fa-id-badge",
      create: true,
      editActive: false,
      createActive: false,

      markedActionsModel: [],
      roleActions: [],
      newRoleName: "",
    };
  },

  components: { NavVue, TabelaVue, ModalVue },

  computed: {
    acoes() {
      return this.$store.state.acoes
    }
  },

  methods: {
    async readRoles() {
      let req = await RolesApi.readRoles();
      this.roles = req.data.data;
    },

    async deleteRole(role) {
      try {
        const req = await RolesApi.deleteRole(role._id);
        if (req.status === 204) {
          const index = this.bodyTabela.indexOf(role);
          this.bodyTabela.splice(index, 1);
        }
      } catch (error) {
        console.log(error)
      }
    },

    async createRole() {
      try {
        let acoesSelecionadas = [];
        let actionsId = [];

        for(let i = 0; i < this.markedActionsModel.length; i++){
          acoesSelecionadas.push(this.acoes.find(acao => acao.name === this.markedActionsModel[i]))
        };
        acoesSelecionadas.map(acao => actionsId.push(acao._id));

        await RolesApi.createRole(this.newRoleName, actionsId);
        location.reload();

      } catch (error) {
        console.log(error)
      }
    },

    async addOrDeleteActionsInRole() {
      try {
        const roleId = this.roleInfo._id;
        
        // atribuir as ações não marcadas a variável uncheckedActions:
        let uncheckedActions = this.roleActions.filter(acao => this.markedActionsModel.includes(acao) === false);
        
        // requisição de remover ações do papel:
        for(let i = 0; i < uncheckedActions.length; i++){
          await RolesApi.deleteActionsInRole(roleId, uncheckedActions[i])
        };

        // atribuir as ações marcadas que serão adicionadas a variável markedActions:
        let markedActions = this.markedActionsModel.filter(acao => this.roleActions.includes(acao) === false);

        // requisição de acionar ações no papel:
        for(let i = 0; i < markedActions.length; i++){
          await RolesApi.addActionsInRole(roleId, markedActions[i]);
        };

        location.reload();

      } catch (error) {
        console.log(error);
      };
    },

    openEditModal(role) {
      this.roleInfo = this.roles.find( element => element._id === role);

      // checar quais ações esse papel já possui e marcar os respectivos checkboxs:
      for(let i = 0; i < this.roleInfo.actions.length; i++){
        this.roleActions.push(this.roleInfo.actions[i].name)
      }
      this.markedActionsModel = this.roleActions
      
      this.editActive = true;
    },

    openAddModal() {
      this.createActive = true;
    },

    closeModal() {
      this.roleActions = [];
      this.markedActionsModel = [];
      this.newRoleName = ""

      this.editActive = false;
      this.createActive = false;
    },
  },

  async created() {
    await this.readRoles();
    await this.$store.dispatch('listarAcoes');

    this.bodyTabela = this.roles.map((object) => {
      let actionsNames = [];
      for (let i= 0; i < object.actions.length; i++){
        actionsNames.push(object.actions[i].name)
      };
      const newObject = {
        _id: object._id,
        name: object.name,
        actions: actionsNames,
      };
      return newObject;
    });
  },
};
</script>

<style scoped>

.label_nome {
 display: block;
}

.inputs_container h3 {
  margin: 1rem 0;
  text-align: center;
}

.checkbox_container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem
}

.input_checkbox {
  display: flex;
  align-items: center;
  gap: .3rem;
}

</style>