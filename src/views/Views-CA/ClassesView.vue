<template>
  <div class="container">
    <NavVue>Gerenciar Turmas</NavVue>
    <section class="main_section">
      <TabelaVue
        :tipoTabela="tipoTabela"
        :headersTabela="headersTabela"
        :bodyTabela="bodyTabela"
        :create="create"
        :icone="icone"
        :searchIcon="true"
        @redirectPage="goToMoreInfoPage"
        @openEditModal="openEditModal"
        @openAddModal="openAddModal"
        @delete="deleteClass"
      >
      </TabelaVue>

      <ModalVue
        v-if="editModalActive"
        tipoModal="Editar Turma"
        :edit="true"
        @conclude="updateClass"
        @close="closeModal"
      >
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
              v-model="objectReq[valor.value]"
            />
          </label>

          <label for="">
            Disciplinas
            <select v-model="objectReq.subject">
              <option
                v-for="(subject, index) in subjects"
                :key="index"
                :value="subject._id"
              >
                {{ subject.name }}
              </option>
            </select>
          </label>
        </template>
      </ModalVue>

      <ModalVue
        v-if="addModalActive"
        tipoModal="Criar Turma"
        @conclude="createClasses"
        @close="closeModal"
      >
        <template #inputs>
          <label
            v-for="(header, index) in headersModal"
            :key="index"
            :for="header.value"
          >
            {{ header.label }}
            <input
              :id="header.value"
              type="text"
              v-model="objectReq[header.value]"
              required
            />
          </label>

          <label for="subjectSelect">
            Disciplina
            <select id="subjectSelect" v-model="objectReq['subject']" required>
              <option
                v-for="(subject, index) in subjects"
                :key="index"
                :value="subject._id"
              >
                {{ subject.name }}
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
import ModalVue from "../../components/ModalVue.vue";
import TabelaVue from "../../components/TabelaVue.vue";
import ClassesReqApi from "../../req/api/ClassesReqApi";
import SubjectsReqApi from "../../req/api/SubjectsReqApi";


export default {
  name: "ClassesView",
  components: {
    NavVue,
    TabelaVue,
    ModalVue,
  },
  data() {
    return {
      create: true,
      icone: "fa-solid fa-chalkboard-teacher",
      editModalActive: false,
      addModalActive: false,
      actualClassGroup: null,
      actualSubject: null,
      tipoTabela: "Turmas",
      queryIdSubject: this.$route.query.idSubject,
      objectReq: {
        name: null,
        vacancy: null,
        dateStart: null,
        dateEnd: null,
        subject: null,
      },
      classes: [],
      subjects: [],
      bodyTabela: [],
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Vagas", value: "vacancy" },
        { label: "Início Aulas", value: "dateStart" },
        { label: "Final Aulas", value: "dateEnd" },
        {
          label: "Disciplina",
          value: "subject",
        },
      ],
      headersModal: [
        { label: "Nome", value: "name" },
        { label: "Vagas", value: "vacancy" },
        { label: "Início Aulas", value: "dateStart" },
        { label: "Final Aulas", value: "dateEnd" },
      ],
    };
  },
  methods: {
    openEditModal(id) {
      this.editModalActive = true;
      this.actualClassGroup = this.classes.find((element) => element._id == id);

      let formatStartDate = new Date(this.actualClassGroup.dateStart);
      let formatEndDate = new Date(this.actualClassGroup.dateEnd);

      this.objectReq.name = this.actualClassGroup.name;
      this.objectReq.vacancy = this.actualClassGroup.vacancy;
      this.objectReq.dateStart = formatStartDate.toLocaleDateString("pt-BR");
      this.objectReq.dateEnd = formatEndDate.toLocaleDateString("pt-BR");
      this.objectReq.subject = this.actualClassGroup.subject._id;
    },
    openAddModal() {
      this.addModalActive = true;
    },
    closeModal() {
      if (this.addModalActive) {
        this.addModalActive = false;
        this.objectReq = {
          name: null,
          vacancy: null,
          dateStart: null,
          dateEnd: null,
          subject: null,
        };
      } else {
        this.editModalActive = false;
        this.objectReq = {
          name: null,
          vacancy: null,
          dateStart: null,
          dateEnd: null,
          subject: null,
        };
      }
    },
    async readSubjects() {
      let req = await SubjectsReqApi.readSubjects();
      this.subjects = req.data.data;
    },
    async createClasses() {
      this.formatDateBrToUs();
      this.objectReq.vacancy = parseInt(this.objectReq.vacancy);

      let req = await ClassesReqApi.createClasses(this.objectReq);

      if (req.status == 201) {
        this.addModalActive = false;
        alert("Turma criada com sucesso!");
      } else {
        alert(req);
      }
    },
    async readClasses() {
      let req = await ClassesReqApi.readClasses();
      this.classes = req.data.data;
    },
    async updateClass() {
      this.formatDateBrToUs();

      let req = await ClassesReqApi.updateClasses(
        this.actualClassGroup._id,
        this.objectReq
      );
      if (req.status == 204) {
        alert("Alteração realizada com sucesso!");
        this.editModalActive = false;
      }
    },
    formatDateBrToUs() {
      let [day, month, year] = this.objectReq.dateStart.split("/");
      let [dayEnd, monthEnd, yearEnd] = this.objectReq.dateEnd.split("/");

      let startDate = new Date(+year, +month - 1, +day);
      let endDate = new Date(+yearEnd, +monthEnd - 1, +dayEnd);

      let dateStartUnformated = startDate.toLocaleDateString("en-US");
      let dateEndUnformated = endDate.toLocaleDateString("en-US");

      let dateStartFormated = dateStartUnformated.replaceAll("/", "-");
      let dateEndFormated = dateEndUnformated.replaceAll("/", "-");

      this.objectReq.dateStart = dateStartFormated;
      this.objectReq.dateEnd = dateEndFormated;
    },
    async deleteClass(classGroup) {
      let res = confirm(
        `Deseja realmente DELETAR o usuário: ${classGroup.name}?`
      );
      if (res === true) {
        let req = await ClassesReqApi.deleteClasses(classGroup._id);

        if (req.status == 204) {
          let indexDeleteClass = this.classes.findIndex(
            (element) => element._id == classGroup._id
          );
          this.bodyTabela.splice(indexDeleteClass, 1);
          alert("Turma excluída com sucesso!");
        }
      }
    },
    goToMoreInfoPage(id) {
      this.$router.push({
        name: "enrolleds",
        query: { idClassGroup: id },
      });
    },
  },
  async created() {
    if (this.queryIdSubject) {
      await this.readClasses();
      await this.readSubjects();

      this.actualSubject = this.subjects.find(
        (element) => element._id == this.queryIdSubject
      );

      let ListClassesInSubject = this.actualSubject.classes;

      this.bodyTabela = ListClassesInSubject.map((object) => {
        let formatStartDate = new Date(object.dateStart);
        let formatEndDate = new Date(object.dateEnd);

        const newObject = {
          _id: object._id,
          name: object.name,
          vacancy: object.vacancy,
          dateStart: formatStartDate.toLocaleDateString("pt-BR"),
          dateEnd: formatEndDate.toLocaleDateString("pt-BR"),
          subject: object.subject.name,
        };
        return newObject;
      });
      this.tipoTabela = `Turmas da Disciplina :  ${this.actualSubject.name}`;
      this.create = false;
    } else {
      await this.readClasses();
      await this.readSubjects();

      this.bodyTabela = this.classes.map((object) => {
        let formatStartDate = new Date(object.dateStart);
        let formatEndDate = new Date(object.dateEnd);

        const newObject = {
          _id: object._id,
          name: object.name,
          vacancy: object.vacancy,
          dateStart: formatStartDate.toLocaleDateString("pt-BR"),
          dateEnd: formatEndDate.toLocaleDateString("pt-BR"),
          subject: object.subject.name,
        };

        return newObject;
      });
    }
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
</style>