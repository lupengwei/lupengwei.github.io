const state = {
  name: 'hehe',
  num:1

}

const getters = {
  name: state => 'name: ' + state.name
}

const actions = {
  changeName({commit, state}, name){
    commit('changeName', name)
  }
}

const mutations = {
  changeName(state, name){
    state.name = name
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}