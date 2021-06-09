export interface AuthConfigModel {
    enabled: boolean,
    issuer: string,
    clientId: string,
    allowedUrls: string[],
    showDebugInformation: boolean
    resource?: string
    postLogoutUri?: string
}