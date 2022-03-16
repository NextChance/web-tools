import { ErrorOptions , CustomError} from '../types/Errors'

import { API_ERRORS } from '../constants/errors'


export default class Failure {
    public message: string
    public type: string
    public code: number | undefined
    public loginRequire: boolean
    public isBlocker: boolean
    public canRetry: boolean

    constructor ({ message, response }: CustomError, options: ErrorOptions  = {}) {
        const { status, data: { type } } = response || { data: {} }
        this.message = message
        this.type = typeof options.type === 'undefined'
            ? type || API_ERRORS.server_error.type
            : options.type
        this.code = typeof options.code === 'undefined'
            ? status || API_ERRORS.server_error.code
            : options.code
        this.isBlocker = typeof options.isBlocker === 'undefined'
            ? Failure.getBlockerStatus(type, status)
            : options.isBlocker
        this.canRetry = typeof options.canRetry === 'undefined'
            ? Failure.getRetryStatus(type, status)
            : options.canRetry
        this.loginRequire = status === API_ERRORS.forbidden.code
    }

    private static getBlockerStatus (type: string, code: number|undefined) {
        switch (code) {
            case API_ERRORS.server_error.code:
                return true
            case API_ERRORS.forbidden.code:
                if (type === API_ERRORS.forbidden.type) { return true }
                break
            case API_ERRORS.unauthorized.code:
                if (type === API_ERRORS.unauthorized.type) { return true }
                break
        }
        return false
    }

    private static getRetryStatus (type: string, code: number|undefined) {
        return code === API_ERRORS.unauthorized.code && type === API_ERRORS.unauthorized.type
    }
}
