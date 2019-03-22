import VuexAsyncHelper from '../../src/VuexAsyncHelper'

const asyncFnName = 'asyncFn'

const initHelper = (success = true) => {
  const commit = jest.fn()
  const asyncStore = new VuexAsyncHelper()
  let api
  if (success === true) {
    api = jest.fn((payload = null) => Promise.resolve({
      data: payload ? `response with payload ${payload}` : 'response data',
    }))
  } else {
    api = jest.fn(() => Promise.reject(new Error({error: 'response error'})))
  }
  asyncStore.add(asyncFnName, api)
  return {asyncStore, commit}
}

/**
 * add
 */
test('add an async api success', () => {
  const asyncStore = new VuexAsyncHelper()
  const api = 'fake api service'
  asyncStore.add('successAsync', api)
  expect(asyncStore.listAsyncConfig).toBeEqualResultSet()
})

test('add an already exists async throw Error', () => {
  const asyncStore = new VuexAsyncHelper()
  const api = 'fake api service'
  asyncStore.add('duplicateAsync', api)
  expect(() => {
    asyncStore.add('duplicateAsync', api)
  }).toThrow(Error('duplicateAsync already registered'))
})

/**
 * doAsync
 */
test('doAsync with unknown async name throw Error', async () => {
  const {asyncStore, commit} = initHelper()

  await expect(asyncStore.doAsync(commit, 'unknownFn')).rejects.toThrow(
    Error('unknownFn not registered'),
  )
})

test('doAsync with success', async () => {
  const {asyncStore, commit} = initHelper()
  expect(await asyncStore.doAsync(commit, asyncFnName)).toEqual({
    data: 'response data',
  })
  expect(commit.mock.calls).toBeEqualResultSet()
})

test('doAsync with failure', async () => {
  const {asyncStore, commit} = initHelper(false)
  const expected_error = Error({error: 'response error'})
  await expect(asyncStore.doAsync(commit, asyncFnName)).rejects.toThrow(
    expected_error,
  )
  expect(commit.mock.calls[1][1]).toEqual(expected_error)
  commit.mock.calls[1][1] = 'expected_error'
  expect(commit.mock.calls).toBeEqualResultSet()
})

test('doAsync with payload success', async () => {
  const {asyncStore, commit} = initHelper()
  expect(
    await asyncStore.doAsync(commit, asyncFnName, {payload: 'a payload'}),
  ).toEqual({
    data: 'response with payload a payload',
  })
  expect(commit.mock.calls).toBeEqualResultSet()
})

test('doAsync with success callback', async () => {
  const {asyncStore, commit} = initHelper()
  const callbackFn = response => commit('CALLBACK', response)
  expect(
    await asyncStore.doAsync(commit, asyncFnName, {callback: callbackFn}),
  ).toEqual({
    data: 'response data',
  })
  expect(commit.mock.calls).toBeEqualResultSet()
})

/**
 * registerState
 */
test('registerState with nothing to register', async () => {
  const asyncStore = new VuexAsyncHelper()

  expect(() => asyncStore.registerState({})).toThrow(
    Error('Nothing to register'),
  )
})

test('registerState with empty state success', () => {
  const {asyncStore} = initHelper()
  const state = {}
  asyncStore.add('anotherAsyncFn', () => Promise.resolve({data: 'another data'}))
  asyncStore.add('lastFn', () => Promise.resolve({data: 'last data'}))
  expect(asyncStore.registerState(state)).toBeEqualResultSet()
})

test('registerState with success', () => {
  const {asyncStore} = initHelper()
  const state = {value1: 'value one', value2: {value3: [1, 2, 3]}}
  asyncStore.registerState(state)
  expect(state).toBeEqualResultSet()
})

/**
 * registerMutations
 */
test('registerMutations with nothing to register', async () => {
  const asyncStore = new VuexAsyncHelper()

  expect(() => asyncStore.registerMutations({})).toThrow(
    Error('Nothing to register'),
  )
})

test('registerMutations with empty mutation success', () => {
  const {asyncStore} = initHelper()
  const mutations = {}
  asyncStore.add('anotherAsyncFn', () => Promise.resolve({data: 'another data'}))
  asyncStore.add('lastFn', () => Promise.resolve({data: 'last data'}))
  asyncStore.registerMutations(mutations)
  expect(Object.keys(mutations)).toBeEqualResultSet()
})

test('registerMutations with success', () => {
  const {asyncStore} = initHelper()
  const mutations = {mutationsAlreadyExists: () => 'already there'}
  const actual = asyncStore.registerMutations(mutations)
  expect(Object.keys(actual)).toBeEqualResultSet()
})

/**
 * registerGetters
 */
test('registerGetters with nothing to register', async () => {
  const asyncStore = new VuexAsyncHelper()

  expect(() => asyncStore.registerGetters({})).toThrow(
    Error('Nothing to register'),
  )
})

test('registerGetters with empty getters success', () => {
  const {asyncStore} = initHelper()
  const getters = {}
  asyncStore.add('anotherAsyncFn', () => Promise.resolve({data: 'another data'}))
  asyncStore.add('lastFn', () => Promise.resolve({data: 'last data'}))
  asyncStore.registerGetters(getters)
  expect(Object.keys(getters)).toBeEqualResultSet()
})

test('registerGetters with success', () => {
  const {asyncStore} = initHelper()
  const getters = {gettersAlreadyExists: () => 'already there'}
  const actual = asyncStore.registerGetters(getters)
  expect(Object.keys(actual)).toBeEqualResultSet()
})
