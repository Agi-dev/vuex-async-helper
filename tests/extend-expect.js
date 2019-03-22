import { dirname } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { TestSettings, existsOrCreatePath } from '../src/test-utils.js'

/* eslint-disable no-console,no-undef */
expect.extend({
  toBeEqualResultSet (actual) {
    const workingDir = TestSettings.getWorkingDir()
    const callingFilename = this.testPath
    const callingMethod = this.currentTestName
      .replace(new RegExp(' ', 'g'), '_')
      .toLowerCase()
    const splitted = callingFilename
      .replace(workingDir, '')
      .split('/')
      .slice(2)

    const resultSetFilename = `${TestSettings.getResultSetsPath()}` +
      `/${splitted.join('/').replace(/.unit.spec.js|.int.spec.js/, '/')}`
        + `${callingMethod}.json`

    // get expected result sets or initialize it
    let expected = null
    existsOrCreatePath(dirname(resultSetFilename))
    if (fs.existsSync(resultSetFilename)) {
      expected = JSON.parse(fs.readFileSync(resultSetFilename))
    } else {
      fs.writeFileSync(resultSetFilename, JSON.stringify(null))
    }
    try {
      expect(actual).toEqual(expected)
      return {message: () => 'ok', pass: true}
    } catch (e) {
      const tmp_filename = `${TestSettings.getTmpDir()
        }/${
        splitted.join('_').replace('.spec.js', '')
        }${callingMethod
        }_ACTUAL.json`
      existsOrCreatePath(dirname(tmp_filename))
      fs.writeFileSync(tmp_filename, JSON.stringify(actual, null, 2))
      execSync(`charm diff ${resultSetFilename} ${tmp_filename}`)
      throw e
    }
  },
})