interface Data {
    [key: string]: string
}

class SessionStorage {
    data: Data

    constructor () {
        this.data = {}
    }

    get (key: string, defaultValue: string = ''): string {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            return window.sessionStorage[key] === undefined
                ? defaultValue
                : window.sessionStorage.getItem(key) || ''
        } else {
            return !this.data[key] ? defaultValue : this.data[key]
        }
    }

    set (key:string, value:string):void {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem(key, value)
        }
    }

    remove (key:string):void {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem(key)
        }
    }
}

export default new SessionStorage()
