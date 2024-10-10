const leftMenuData = {
  state: {
    leftMenuViews: []
  },
  mutations: {
    LEFT_VISITED_VIEWS: (state, view) => {
      state.leftMenuViews.splice(0, state.leftMenuViews.length)
      state.leftMenuViews.push(view)
    },
  },
  actions: {
    leftDataMenuViews({commit}, view) {
      commit('LEFT_VISITED_VIEWS', view)
    }
  }
}
export default leftMenuData