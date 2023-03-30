<template>
  <div class="container-home">
    <div class="div_titulo">
      <h1>
        SELECIONE UMA OPÇÃO
      </h1>
    </div>

    <div class="opcoes">
      <section class="secoes">
        <router-link
          v-for="(opcao, index) in listaOpcoes"
          :key="index"
          :to="{ name: `${opcao.path}` }"
        >
          <SectionVue :titleA="opcao.secao">
            <template v-slot:icone>
              <img :src="opcao.icone" alt="" />
            </template>
          </SectionVue>
        </router-link>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import SectionVue from "../components/SectionVue.vue";
import icon_user from "../assets/user.svg";
import icon_scroll from "../assets/scroll.svg";
import icon_class from "../assets/chalkboard-teacher.svg";
import icon_books from "../assets/books.svg";
import icon_id from "../assets/identification-badge.svg";
import icon_target from "../assets/target.svg";

export default {
  name: "HomeView",
  data() {
    return {
      listaOpcoes: [
        {
          secao: "USUÁRIOS",
          icone: icon_user,
          path: "users",
        },
        {
          secao: "MATRÍCULA TURMA",
          icone: icon_scroll,
          path: "enrolleds",
        },
        {
          secao: "TURMAS",
          icone: icon_class,
          path: "classes",
        },
        {
          secao: "DISCIPLINAS",
          icone: icon_books,
          path: "subjects",
        },
        {
          secao: "PAPÉIS",
          icone: icon_id,
          path: "roles",
        },
        {
          secao: "AÇÕES",
          icone: icon_target,
          path: "actions",
        },
      ],
    };
  },
  components: {
    SectionVue,
  },
};
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
  margin-bottom: 5rem;
}

.secoes {
  display: grid;
  grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
  gap: 3rem;
}

img {
  width: 60%;
}
</style>