import Vue from "vue";
import Vuex from "vuex";
import api from "@tests/fixtures/datasets/api";
import VuexAsyncHelper from "@/VuexAsyncHelper";

Vue.use(Vuex);

let asyncStore = new VuexAsyncHelper();
asyncStore.add("getSuccess", api.getSuccess);
asyncStore.add("getWithParam", api.getWithParam);

const state = {
  name: "asyncStore Test Store"
};

const mutations = {
  setName: (state, newValue) => {
    state.name = newValue;
  }
};

const actions = {
  setName({ commit }, newName) {
    commit("setName", newName);
  },
  async getSuccess({ commit }) {
    await asyncStore.doAsync(commit, "getSuccess");
  },
  async getWithParam({ commit }, url) {
    await asyncStore.doAsync(commit, "getWithParam", { payload: url });
  }
};

const getters = {
  name: state => state.name
};

export default function createTestStore() {
  return {
    state: asyncStore.registerState(state),
    mutations: asyncStore.registerMutations(mutations),
    actions,
    getters: asyncStore.registerGetters(getters)
  };
}
