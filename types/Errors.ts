export interface CustomError {
    response: {
        data: {
            type: string
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
