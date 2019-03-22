import { createLocalVue } from "@vue/test-utils";
import createTestStore from "@tests/fixtures/datasets/store";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

/**
 * check getters, mutations still working after use of VuexAsyncHelper
 */
test("store still working", () => {
  const storeConfig = createTestStore();
  // noinspection JSValidateTypes
  const store = new Vuex.Store(storeConfig);
  expect(store.getters.name).toEqual("asyncStore Test Store");
  store.dispatch("setName", "a new name");
});

/**
 * dispatch GET request
 */
test("GET async request success", async () => {
  const storeConfig = createTestStore();
  // noinspection JSValidateTypes
  const store = new Vuex.Store(storeConfig);

  await store.dispatch("getSuccess");

  expect(store.getters.getSuccess).toBeEqualResultSet();
});

test("GET async with param async request success", async () => {
  const storeConfig = createTestStore();
  // noinspection JSValidateTypes
  const store = new Vuex.Store(storeConfig);

  await store.dispatch("getWithParam", "http://httpbin.org/get");
  let actual = store.getters.getWithParam;
  actual.origin = "origin fix value";
  expect(actual).toBeEqualResultSet();
});
