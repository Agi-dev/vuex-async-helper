export default class VuexAsyncHelper {
  listAsyncConfig = {}

  add (asyncName, apiService) {
    if (asyncName in this.listAsyncConfig) {
      throw new Error(`${asyncName} already registered`)
    }

    const nameCapitalize =
      asyncName.charAt(0).toUpperCase() + asyncName.slice(1)

    this.listAsyncConfig[asyncName] = {
      api: apiService,
      state: {
        [`${asyncName}Loading`]: false,
        [`${asyncName}Data`]: null,
        [`${asyncName}Error`]: null
      },
      mutationsName: {
        PENDING: `set${nameCapitalize}Pending`,
        SUCCESS: `set${nameCapitalize}Success`,
        FAILURE: `set${nameCapitalize}Failure`
      }
    }
  }

  async doAsync (
    commit,
    asyncName,
    options = {payload: null, callback: null}
  ) {
    const asyncConfig = this.checkAsyncNameExists(asyncName)
    commit(asyncConfig.mutationsName.PENDING, true)
    try {
      const response = await asyncConfig.api(options.payload)
      if (options.callback) {
        options.callback(response)
      }
      commit(asyncConfig.mutationsName.SUCCESS, {data: response.data})
      return response
    } catch (e) {
      commit(asyncConfig.mutationsName.FAILURE, e)
      throw e
    }
  }

  registerState (state) {
    this._checkSomethingToRegister()
    Object.keys(this.listAsyncConfig).forEach(asyncName => {
      Object.assign(state, this.listAsyncConfig[asyncName].state)
    })
    return state
  }

  registerMutations (mutations) {
    this._checkSomethingToRegister()
    Object.keys(this.listAsyncConfig).forEach(asyncName => {
      let mutationsName = this.listAsyncConfig[asyncName].mutationsName
      mutations[mutationsName.PENDING] = (state, payload) => {
        state[`${asyncName}Loading`] = payload.pending
      }

      mutations[mutationsName.SUCCESS] = (state, payload) => {
        state[`${asyncName}Data`] = payload.data
        state[`${asyncName}Loading`] = false
      }

      mutations[mutationsName.FAILURE] = (state, payload) => {
        state[`${asyncName}Error`] = payload
        state[`${asyncName}Loading`] = false
      }
    })
    return mutations
  }

  registerGetters (getters) {
    this._checkSomethingToRegister()
    Object.keys(this.listAsyncConfig).forEach(asyncName => {
      getters[`${asyncName}`] = state => state[`${asyncName}Data`]
      getters[`${asyncName}Loading`] = state => state[`${asyncName}Loading`]
    })
    return getters
  }

  checkAsyncNameExists (asyncName) {
    if (asyncName in this.listAsyncConfig) {
      return this.listAsyncConfig[asyncName]
    }
    throw new Error(`${asyncName} not registered`)
  }

  _checkSomethingToRegister () {
    if (
      Object.entries(this.listAsyncConfig).length === 0 &&
      this.listAsyncConfig.constructor === Object
    ) {
      throw new Error('Nothing to register')
    }
  }
}
