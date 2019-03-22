import fs from 'fs'

export class TestSettings {
  static getWorkingDir () {
    if (!this.workingDir) {
      let splitted = __dirname.split('/')
      this.workingDir = '/' + splitted.slice(1, splitted.length - 1).join('/')
    }
    return this.workingDir
  }

  static getFixturesPath () {
    return this.getWorkingDir() + '/tests/fixtures'
  }

  static getDataSetsPath () {
    return this.getFixturesPath() + '/datasets'
  }

  static getResultSetsPath () {
    return this.getFixturesPath() + '/resultsets'
  }

  static getTmpDir () {
    let tmpDir = this.getWorkingDir() + '/DONOTCOMMIT_tmp'
    existsOrCreatePath(tmpDir)
    return tmpDir
  }

  static workingDir
}

export function existsOrCreatePath (path) {
  fs.mkdirSync(path, {recursive: true})
}
