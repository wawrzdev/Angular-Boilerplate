import { LogLevel } from "../logging-service/log-level.model";
import { AuthConfigModel } from "./auth-config.model";

export interface AppConfigModel {
    logLevel: LogLevel,
    appName: string,
    appVersion: string,
    apiUrl: string,
    apiVersion: string,
    authConfig: AuthConfigModel
}