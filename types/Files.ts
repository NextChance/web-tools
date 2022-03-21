export interface MockFile extends Blob {
    name: string
    lastModified: number
    isFromDiscovery?: boolean
    originalUrl?: string
}
