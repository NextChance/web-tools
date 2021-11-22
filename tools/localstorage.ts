interface Data {
  [key: string]: string
}

class LocalStorage {
  data: Data

  constructor () {
    this.data = {}
    if (typeof window !== 'undefined' && !window.localStorage) {
      this.data = JSON.parse(process?.env?.LOCAL_STORAGE || '{}')
    }
  }

  get (key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage[key] === undefined
        ? defaultValue
        : window.localStorage.getItem(key) || ''
    } else {
      return !this.data[key] ? defaultValue : this.data[key]
    }
  }

  set (key:string, value:string):void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
    } else {
      this.data[key] = value
      process.env.LOCAL_STORAGE = JSON.stringify(this.data)
    }
  }

  remove (key:string):void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: removedKey, ...remainingData } = this.data
      this.data = remainingData
      process.env.LOCAL_STORAGE = JSON.stringify(this.data)
    }
  }
}

export default new LocalStorage()
