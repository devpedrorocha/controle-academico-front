<template>
  <div class="container">
    <NavVue> Gerenciar Disciplinas </NavVue>
    <section class="main_section">
      <TabelaVue tipoTabela="Disciplinas" :headersTabela="headersTabela" :bodyTabela="bodyTabela"
        @openEditModal="editModalTableClick" @delete="deleteSubject" :create="true" @openAddModal="openCreatedModal"
        :searchIcon="true" icone="fa-solid fa-book"
        @redirectPage="goToMoreInfoPage"  
      >

        <template v-slot:icone_view>
          <font-awesome-icon icon="fa-solid fa-book" class="icone_view" />
        </template>
      </TabelaVue>
      <ModalVue 
        v-if="editModalActive" 
        tipoModal="Editar Usuário"
        :edit="true"    
        @conclude="updateSubject"    
        @close="closeModal"
      >
        <template #inputs>
          <label for="nameSubject">
            Nome da Disciplina
            <input type="text" name="" id="nameSubject" v-model="objectReqSubject.name">
          </label>
          <label for="workLoad">
            Carga Horária
            <input type="number" name="" id="workLoad" v-model="objectReqSubject.workLoad">
          </label>
          <label for="menu">
            Ementa
            <textarea id="menu" v-model="objectReqSubject.menu"></textarea>
          </label>
        </template>
      </ModalVue>

      <ModalVue v-if="modalAddActive" tipoModal="Criar Usuário" @conclude="createSubject" @close="closeModal"
      
      >
        <template #inputs>
          <label for="nameSubject">
              Nome da Disciplina
              <input type="text" name="" id="nameSubject" v-model="objectReqSubject.name">
            </label>
            <label for="workLoad">
              Carga Horária
              <input type="number" name="" id="workLoad" v-model="objectReqSubject.workLoad">
            </label>
            <label for="menu">
              Ementa
              <textarea id="menu" v-model="objectReqSubject.menu"></textarea>
            </label>
        </template>
      </ModalVue>
    </section>
  </div>
</template>

<script lang="ts">
import TabelaVue from "../../components/TabelaVue.vue";
import NavVue from "../../components/NavVue.vue";
import Subjects from "../../req/api/SubjectsReqApi";
import ModalVue from "../../components/ModalVue.vue"
import { ClassesContainer } from "../../interfaces/classes";
import { Ref, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { SubjectsContainer } from "../../interfaces/subjects";
import { readSubjectsById, updateSubject, createSubject, deleteSubject } from "../../req/api/SubjectsReqApi"

export interface BodyTabelaSubjectsContainer {
  name: string;
  workLoad: number;
  menu: string;
  classes?: ClassesContainer[];
}

export default {
  name: "SubjectsView",
  setup(props) {
    const objectReqSubject: Ref<BodyTabelaSubjectsContainer> = ref<BodyTabelaSubjectsContainer>() as Ref<BodyTabelaSubjectsContainer>
    const idSubject = ref("")
    const subjectForEdit = ref<SubjectsContainer >()
    const bodyTabela = ref<SubjectsContainer[]>()
    return {
      objectReqSubject,
      idSubject,
      subjectForEdit,
      bodyTabela
    }
  },
  data() {
    return {
      subjects: [],
      headersTabela: [
        { label: "Nome", value: "name" },
        { label: "Carga - Horária", value: "workLoad" },
        { label: "Ementa", value: "menu" },
      ],
      editModalActive: false,
      modalAddActive: false,
      arrayClassesForReq: [],
    };
  },
  components: {
    NavVue,
    TabelaVue,
    ModalVue
  },
  methods: {
    async readSubjects() {
      let req = await Subjects.readSubjects();
      this.subjects = req.data.data;
    },
    async editModalTableClick(idSubjectForEdit: string) {
      this.subjectForEdit = await readSubjectsById(idSubjectForEdit) as SubjectsContainer
      this.editModalActive = true
      this.idSubject = idSubjectForEdit
      this.objectReqSubject = {
        name: this.subjectForEdit.name,
        workLoad: this.subjectForEdit.workLoad,
        menu: this.subjectForEdit.menu
      }
    },
    async updateSubject() {
      await updateSubject(this.idSubject, this.objectReqSubject)
      this.editModalActive = false
      if (this.bodyTabela && this.subjectForEdit && this.objectReqSubject) {
        const indexSubjectEdit = this.bodyTabela.findIndex(subject => subject._id == this.idSubject)
        const newObject: SubjectsContainer = {
          _id: this.subjectForEdit._id,
          classes: this.subjectForEdit.classes,
          ...this.objectReqSubject
        }
        this.bodyTabela.splice(indexSubjectEdit, 1, newObject)
      }

    },
    async createSubject(){
      const objetoReq = await createSubject(this.objectReqSubject) as SubjectsContainer
      this.bodyTabela?.push(objetoReq)
      this.editModalActive = false
      this.modalAddActive = false
    },
    closeModal() {
      this.editModalActive = false
      this.modalAddActive = false
    },
    openCreatedModal() {
      this.modalAddActive = true
      this.objectReqSubject = {
        name:"",
        workLoad: 0,
        menu:"",
        classes:[]
      }
    },
    async deleteSubject(subjectToDelete: SubjectsContainer) {
      await deleteSubject(subjectToDelete._id)
      const indexSubjectToDelete = this.bodyTabela?.findIndex(subject => subject._id == subjectToDelete._id)!
      this.bodyTabela?.splice(indexSubjectToDelete, 1)
    },
    goToMoreInfoPage(idSubjectToMoreInfos: string) {
      this.$router.push({
        name: "classes",
        query: {
          idSubject: idSubjectToMoreInfos
        }
      })
    }
  },
  async created() {
    await this.readSubjects();
    this.bodyTabela = this.subjects.map((object: SubjectsContainer) => {
      const newObject: SubjectsContainer = {
        _id: object._id,
        name: object.name,
        workLoad: object.workLoad,
        menu: object.menu,
        classes: object.classes.map((classe): ClassesContainer => { return classe }),
      };

      return newObject;
    });
  },
};
</script>

<style scoped>
label {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#menu {
  width: 510px;
  height: 200px;
  resize: none;
}
</style>