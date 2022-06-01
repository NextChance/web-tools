export interface CustomError {
    response: {
        data: {
            type: string,
            keys?: Array<string>
        }
        status: number|undefined
    }
    message: string
}

export interface ErrorOptions {
    type?: string
    code?: number
    isBlocker?: boolean
    canRetry?: boolean
}
