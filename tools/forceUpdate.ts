import LocalStorage from './localstorage'

export const convertVersionString = (versionString: string) => {
  return versionString.substring(versionString.indexOf('v') + 1).split('.')
}

export const compareVersions = (versionA: Array<string>, versionB: Array<string>) => {
  return versionA.reduce((acc: number, posA: string, idx: number) =>
      !acc
        ? Math.sign(parseInt(posA) - parseInt(versionB[idx]))
        : acc
    , 0)
}

export default (minVersion: string) => {
  const codeVersion: string = process.env.APP_VERSION || ''
  if (process.env.ENVIRONMENT !== 'prod') {
    console.log(`[ForceUpdate] codeVersion:${codeVersion} // requiredVersion:${minVersion}`)
  }
  if (minVersion && codeVersion) {
    const parsedWebVersion = convertVersionString(minVersion)
    const parsedCodeVersion = convertVersionString(codeVersion)
    const hasTryedToUpgrade = LocalStorage.get('tryedToUpgrade') === '1'
    if (process.env.ENVIRONMENT !== 'prod') {
      console.log(`[ForceUpdate] hasTryedToUpgrade? ${hasTryedToUpgrade}`)
    }
    if (!hasTryedToUpgrade) {
      const versionComparation = compareVersions(parsedCodeVersion, parsedWebVersion)
      if (process.env.ENVIRONMENT !== 'prod') {
        console.log(`[ForceUpdate] codeVersion is ${
          versionComparation < 0
            ? 'lower'
            : versionComparation === 0
              ? 'equal'
              : 'greater'
        }`)
      }
      if (versionComparation < 0) {
        LocalStorage.set('tryedToUpgrade', '1')
        location.reload()
      } else {
        LocalStorage.set('tryedToUpgrade', '0')
      }
    } else {
      LocalStorage.set('tryedToUpgrade', '0')
    }
}
