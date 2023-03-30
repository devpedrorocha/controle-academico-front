<template>
  <div class="container">
    <div class="section">
      <TabelaVue
        :tipoTabela="tipoTabela"
        :headersTabela="headersTabela"
        :bodyTabela="bodyTabela"
        :searchIcon="true"
        @openEditModal="goToMoreInfoPageEdit"
        @redirectPage="goToMoreInfoPage"
        :icone="icone"
        :user="true"
      >
      </TabelaVue>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, provide, ref } from "vue";
import EnrolledReqApi from "../req/api/EnrolledReqApi";
import LocalForage from "localforage";
import TabelaVue from "../components/TabelaVue.vue";
import ClassesReqApi from "../req/api/ClassesReqApi";
import SubjectsReqApi from "../req/api/SubjectsReqApi";
import localforage from "localforage";

export default defineComponent({
  name: "userSubjects",
  components: { TabelaVue },
  setup() {
    const {edit, mudarEditParaFalse, mudarEditParaTrue} = inject('edit')
    return {
      edit, 
      mudarEditParaFalse,
      mudarEditParaTrue
    }
  },
  data() {
    return {
      actualUser: null, 
      classes: [],
      subjects: [],
      bodyTabela: [],
      enrolleds: [],
      tipoTabela: "Turmas",
      icone: "fa-solid fa-chalkboard-teacher",
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Início Aulas", value: "dateStart" },
        { label: "Final Aulas", value: "dateEnd" },
        {
          label: "Disciplina",
          value: "subject",
        },
      ],
    };
  },
  methods: {
    goToMoreInfoPage(id) {
      this.$router.push({
        name: "enrolleds",
        query: { idClassGroup: id },
      });

      localforage.setItem("edit", false);
    },
    goToMoreInfoPageEdit(id) {
      this.mudarEditParaTrue()
      this.$router.push({
        name: "enrolleds",
        query: { idClassGroup: id},
         
      });
    },
    async readClasses() {
      let req = await ClassesReqApi.readClasses();
      this.classes = req.data.data;
    },
    async readSubjects() {
      let req = await SubjectsReqApi.readSubjects();
      this.subjects = req.data.data;
    },
    async readEnrolleds() {
      let req = await EnrolledReqApi.readEnrolleds();
      this.enrolleds = req.data.data;
    },
  },
  async created() {
    this.mudarEditParaFalse()
    await this.readClasses();
    await this.readSubjects();
    await this.readEnrolleds();

    this.actualUser = await LocalForage.getItem("username")
    this.tipoTabela = `Turmas do ${this.actualUser}`
    let userEnrolleds = await LocalForage.getItem("register");

    this.bodyTabela = userEnrolleds.map((object) => {
      let ehProf = false;
      if (object.role.name == "Professor") {
        ehProf = true;
        LocalForage.setItem("edit", true);
      } else {
        ehProf = false;
      }

      let formatStartDate = new Date(object.classGroup.dateStart);
      let formatEndDate = new Date(object.classGroup.dateEnd);

      const newObject = {
        _id: object.classGroup._id,
        name: object.classGroup.name,
        vacancy: object.classGroup.vacancy,
        dateStart: formatStartDate.toLocaleDateString("pt-BR"),
        dateEnd: formatEndDate.toLocaleDateString("pt-BR"),
        subject: object.classGroup.subject.name,
        edit: ehProf,
      };

      return newObject;
    });
  },
});
</script>

<style scoped>
h1 {
  color: #000000;
}

.container-home {
  text-align: center;
  padding-top: 5rem;
}

.opcoes {
  display: flex;
  justify-content: center;
  align-items: center;
}

.div_titulo {
  text-align: center;
  margin: 1rem;
}

.secoes {
  display: grid;
  grid-template: 1fr;
  gap: 3rem;
}

img {
  width: 60%;
}
</style>