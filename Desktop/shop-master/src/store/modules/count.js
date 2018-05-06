const state = {
  count:2
}

const getters = {
  count: (state) =>  {return state.count - 1}
}

const actions = {
  add({commit, state},num){
    commit('der',num)
  }
}

const mutations = {
  add(state){
    state.count += 3
  },
  der(state,num){
    state.count -= num
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}