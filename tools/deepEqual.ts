import AnyObject from '../types/AnyObject'

const compareShallow = (obj1: AnyObject|Array<any>, obj2: AnyObject|Array<any>): boolean => {
  let item1: AnyObject
  let item2: AnyObject

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    item1 = obj1
    item2 = obj2

    return item1.length === item2.length &&
      item1.reduce((acc: boolean, value: any, index: number) => {
        if (acc) {
          return typeof value === 'object' && !!value
            ? compareShallow(value, item2[index])
            : value === item2[index]
        }
        return acc
      }, true)
  } else {
    item1 = (obj1 as AnyObject)
    item2 = (obj2 as AnyObject)
    const obj1Keys = Object.keys(item1)
    return obj1Keys.length === Object.keys(item2).length &&
      obj1Keys.reduce((acc: boolean, key: string) => {
        if (acc) {
          return typeof item1[key] === 'object' && !!item1[key]
            ? compareShallow(item1[key], item2[key])
            : item1[key] === item2[key]
        }
        return acc
      }, true)
  }
}

export default (obj1: AnyObject|Array<any>, obj2: AnyObject|Array<any>): boolean => compareShallow(obj1, obj2)
