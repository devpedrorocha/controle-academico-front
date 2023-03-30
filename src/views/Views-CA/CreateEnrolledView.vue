<template>
  <main>
    <h1>Criando Matrícula - {{ username }}</h1>
    <form @submit.prevent="createEnrolled">
      <label for="role">
        Papel
        <select id="role" v-model="objectReq.role">
          <option v-for="(role, index) in roles" :key="index" :value="role._id">
            {{ role.name }}
          </option>
        </select>
      </label>

      <label for="subject"
        >Disciplina
        <select id="subject" v-model="idSelectedSubject">
          <option
            v-for="(subject, index) in subjects"
            :key="index"
            :value="subject._id"
          >
            {{ subject.name }}
          </option>
        </select>
      </label>

      <label for="classGroup"
        >Turma
        <select id="classGroup" v-model="objectReq.classGroup" :disabled="turmaSelect">
          <option
            v-for="(availableClass, index) in availableClasses"
            :key="index"
            :value="availableClass._id"
          >
            {{ availableClass.name }}
          </option>
        </select>
      </label>

      <label for="finalGrade" class="label_input">
        Nota Final (opcional)
        <input id="finalGrade" type="number" v-model="objectReq.finalGrade" />
      </label>

      <label for="frequency" class="label_input">
        Frequência (opcional)
        <input id="frequency" type="number" v-model="objectReq.frequency" />
      </label>

      <button type="submit" class="button">Criar Matrícula</button>
    </form>
    <div>{{ reqSuccess }}</div>
  </main>
</template>

<script lang="ts">
import SubjectsReqApi from "../../req/api/SubjectsReqApi";
import ClassesReqApi from "../../req/api/ClassesReqApi";
import RolesReqApi from "../../req/api/RolesReqApi";
import EnrolledReqApi from "../../req/api/EnrolledReqApi";

export default {
  data() {
    return {
      username: this.$route.query.name,
      objectReq: {
        idUser: this.$route.query.idUser,
        role: null,
        classGroup: null,
        finalGrade: null,
        frequency: null,
      },
      reqSuccess: null,
      actualSubject: null,
      subjects: [],
      roles: [],
      idSelectedSubject: null,
      availableClasses: null,
      classes: [],
      turmaSelect: true
    };
  },
  watch: {
    idSelectedSubject() {
      this.actualSubject = this.subjects.find(
        (element) => element._id == this.idSelectedSubject
      );
      if(this.actualSubject.classes.length > 0) {
        this.availableClasses = this.actualSubject.classes;
        this.turmaSelect = false
      }

    },
  },
  methods: {
    async createEnrolled() {
      try {
        let req = await EnrolledReqApi.createEnrolled(this.objectReq);
         if( req.response.data === 'Turma sem vagas') {
          this.reqSuccess = "Turma nao possui vagas"
        } 
        else if (req.status == 201) {
          this.reqSuccess = "Matrícula criada com sucesso!";
        } 
        
        else if (req.response.data =="CPF já está nessa turma"){
          this.reqSuccess = "Aluno / CPF já está matriculado nesta turma!";
          this.reqSuccess = "Aluno / CPF já está matriculado nesta turma!";
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  async created() {
    let reqSubjects = await SubjectsReqApi.readSubjects();
    this.subjects = reqSubjects.data.data;

    let reqClasses = await ClassesReqApi.readClasses();
    this.classes = reqClasses.data.data;

    let reqRoles = await RolesReqApi.readRoles();
    this.roles = reqRoles.data.data;
  },
};
</script>

<style scoped>


main {
  height: 100vh;
  padding: 2rem 10rem;
}

form{
  display: flex;
  flex-direction: column;
  width: 70%;
  padding: 1rem;
}

label{
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  gap: 2rem;
}

select {
  border: none;
  border-radius: 10px;
  color: #ffff;
  background-color: #000;
  font-weight: bold;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;;
  padding: 8px 40px;
  cursor: pointer;
  width: 50%;
}
input{
  width: 5%;
  border: none;
  background-color: transparent;
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  font-family: "Poppins", sans-serif;
  border-bottom: 3px solid #000;
  padding: 0 1rem;
}
input:focus{
  outline: none;
  text-align: center;
}
.label_input{
  display: flex;
  flex-direction: row;
  align-items: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield;
}
button {
  width: 20%;
  margin-top: 5rem;
}
</style>