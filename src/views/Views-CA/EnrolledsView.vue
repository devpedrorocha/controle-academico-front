<template>
  <div class="container">
    <NavVue> Gerenciar Matrículas </NavVue>
    <section class="main_section">
      <TabelaVue
        :tipoTabela="tipoTabela"
        :headersTabela="headersTabela"
        :bodyTabela="bodyTabela"
        :icone="icone"
        :professorEdit="queryProfessor"
        @openEditModal="openEditModal"
        @openAddModal="openAddModal"
        @delete="deleteEnrolled"
      />

      <ModalVue
        v-if="editModalActive"
        tipoModal="Editar Matrícula"
        :headersModal="headersModal"
        :edit="true"
        :select="true"
        @concludeEdit="updateEnrolled"
        @close="closeModal"
      >
        <template #inputs>
          <h1>Usuário da Matrícula {{ this.actualEnrolled.idUser.name }}</h1>
          <label
            v-for="(valor, key) in headersModal"
            :key="key"
            :for="valor.value"
          >
            {{ valor.label }}
            <input
              type="text"
              :id="valor.value"
              v-model="objectReq[valor.value]"
            />
          </label>
        </template>
      <template #selects>
          <label for="classes" v-if="!queryProfessor">
            Turma
            <select id="classes" v-model="objectReq.classGroup">
              <option
                v-for="(item, index) in classes"
                :value="item._id"
                :key="index"
              >
                {{ item.name }}
              </option>
            </select>
          </label>

          <label for="roles" v-if="!queryProfessor">
            Papel do Usuário
            <select id="roles" v-model="objectReq.role">
              <option
                v-for="(item, index) in roles"
                :value="item._id"
                :key="index"
              >
                {{ item.name }}
              </option>
            </select>
          </label>
        </template>
      </ModalVue>
    </section>
  </div>
</template>

<script lang="ts">
import NavVue from "../../components/NavVue.vue";
import TabelaVue from "../../components/TabelaVue.vue";
import Enrolled from "../../req/api/EnrolledReqApi";
import ModalVue from "../../components/ModalVue.vue";
import Classes from "../../req/api/ClassesReqApi";
import Roles from "../../req/api/RolesReqApi";

export default {
  name: "EnrolledsView",
  components: {
    NavVue,
    TabelaVue,
    ModalVue,
  },
  data() {
    return {
      queryIdClassGroup: this.$route.query.idClassGroup,
      queryProfessor: this.$route.query.professor,
      enrolledsInClassGroup: null,
      actualClassGroup: null,
      tipoTabela: "Matrículas",
      objectReq: {
        idUser: null,
        role: null,
        classGroup: null,
        finalGrade: null,
        frequency: null,
      },
      icone: "fa-solid fa-scroll",
      editModalActive: false,
      addModalActive: false,
      modelEnrolledToCreate: {},
      actualEnrolled: {},
      enrolleds: [],
      classes: [],
      roles: [],
      headersTabela: [
        { label: "Usuário", value: "idUser" },
        { label: "Papel", value: "role" },
        { label: "Turma", value: "classGroup" },
        { label: "Nota Final", value: "finalGrade" },
        { label: "Frequência", value: "frequency" },
      ],
      bodyTabela: [],
      headersModal: [
        { label: "Nota Final", value: "finalGrade" },
        { label: "Frequência", value: "frequency" },
      ],
    };
  },
  watch: {},
  methods: {
    async updateEnrolled() {
      let req = await Enrolled.updateEnrolleds(
        this.actualEnrolled._id,
        this.objectReq
      );

      if (req.status == 204) {
        alert("Alteração realizada com sucesso!");
        this.editModalActive = false;
        //Sem necessidade de atualizar na array
      }
    },
    closeModal() {
      this.addModalActive
        ? (this.addModalActive = false)
        : (this.editModalActive = false);
    },
    openEditModal(id) {
      this.editModalActive = true;

      this.actualEnrolled = this.enrolleds.find((element) => element._id == id);

      this.objectReq.idUser = this.actualEnrolled.idUser._id;
      this.objectReq.role = this.actualEnrolled.role._id;
      this.objectReq.classGroup = this.actualEnrolled.classGroup._id;
      this.objectReq.finalGrade = this.actualEnrolled.finalGrade;
      this.objectReq.frequency = this.actualEnrolled.frequency;
    },
    openAddModal() {
      this.addModalActive = true;
      this.modelEnrolledToCreate = {
        idUser: null,
        role: null,
        classGroup: null,
        finalGrade: null,
        frequency: null,
      };
    },
    async readEnrolleds() {
      let req = await Enrolled.readEnrolleds();
      this.enrolleds = req.data.data;
    },
    async deleteEnrolled(enrolled) {
      let res = confirm(
        `Deseja realmente DELETAR a matrícula de: ${enrolled.idUser}?`
      );
      if (res === true) {
        let req = await Enrolled.deleteEnrolleds(enrolled._id);

        if (req.status === 204) {
          let posicaoEnrolled = this.enrolleds.findIndex(
            (actualEnrolled) => actualEnrolled._id === enrolled._id
          );
          this.enrolleds.splice(posicaoEnrolled, 1);
          alert("Matrícula deletada com sucesso!");
        }
      }
    },
  },
  async created() {
    if (this.queryIdClassGroup) {
      await this.readEnrolleds();

      let reqClasses = await Classes.readClasses();
      this.classes = reqClasses.data.data;

      this.actualClassGroup = this.classes.find(
        (element) => element._id == this.queryIdClassGroup
      );

      let ListIdEnrolledsInClass = this.actualClassGroup;
      ListIdEnrolledsInClass = this.actualClassGroup.enrolled;

      this.enrolledsInClassGroup = ListIdEnrolledsInClass.map((id) => {
        const enrolledObject = this.enrolleds.find(
          (element) => element._id == id
        );
        return enrolledObject;
      });

      this.bodyTabela = this.enrolledsInClassGroup.map((object) => {
        const newObject = {
          _id: object._id,
          idUser: object.idUser.name,
          role: object.role.name,
          classGroup: object.classGroup.name,
          finalGrade: object.finalGrade,
          frequency: object.frequency,
          edit: null
        };
        return newObject;
      });
      this.tipoTabela = `Matrículas da Turma :  ${this.actualClassGroup.name}`;
    } else {
      await this.readEnrolleds();

      this.bodyTabela = this.enrolleds.map((object) => {
        const newObject = {
          _id: object._id,
          idUser: object.idUser.name,
          role: object.role.name,
          classGroup: object.classGroup.name,
          finalGrade: object.finalGrade,
          frequency: object.frequency,
        };
        return newObject;
      });

      let reqRoles = await Roles.readRoles();
      let reqClasses = await Classes.readClasses();

      this.classes = reqClasses.data.data;
      this.roles = reqRoles.data.data;
    }
  },
};
</script >

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
</style>