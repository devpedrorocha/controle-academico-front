import { createStore } from 'vuex'
import actions from '../req/api/ActionsReqApi.js'

export default createStore({
  state: {
    logged: false,
    modalActive: false,
    actualUser: null,
    loading : null,
    users: [{}],
    acoes: [],

  },
  getters: {
  },
  mutations: {
    SET_USER(state, payload) {
      state.actualUser = payload.data.name
    },
    LOGIN(state){
      state.logged = true
    },
    LOGOUT(state){
      state.logged = false
    },
    OPEN_MODAL(state){
      state.modalActive = true
    },
    CLOSE_MODAL(state){
      state.modalActive = false
    },
    ATUALIZAR_ACOES(state, payload) {
      state.acoes = payload
    }
  },
  actions: {
    async listarAcoes() {
      try {
        const req = await actions.readActions();
        this.state.acoes = req.data.data;
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})
