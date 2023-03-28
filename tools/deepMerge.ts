import type AnyObject from '../types/AnyObject'

const deepMerge = (ob1:any, ob2:any, excludedKeys:string[] = [], historyPath:string = '') => {
    let result:AnyObject = {}
    if (
        typeof ob1 === 'object' &&
        typeof ob2 === 'object' &&
        !Array.isArray(ob1) &&
        !Array.isArray(ob2)
    ) {
        const ob1Keys = Object.keys(ob1)
        const ob2Keys = Object.keys(ob2)
        ob1Keys.forEach((ob1key:string) => {
            const path = `${historyPath}${historyPath ? '.' : ''}${ob1key}`
            if (excludedKeys.includes(path)) {
                result[ob1key] = ob2[ob1key]
            } else if (ob2[ob1key]) {
                result[ob1key] = deepMerge(ob1[ob1key], ob2[ob1key], excludedKeys, path)
                ob2Keys.splice(ob2Keys.indexOf(ob1key), 1)
            } else {
                result[ob1key] = ob1[ob1key]
            }
        })
        ob2Keys.forEach((ob2key:string) => {
            result[ob2key] = ob2[ob2key]
        })
    } else if (Array.isArray(ob1) && Array.isArray(ob2)) {
        result = [...ob1, ...ob2]
    } else {
        result = ob2 || ob1
    }
    return result
}

export default deepMerge
