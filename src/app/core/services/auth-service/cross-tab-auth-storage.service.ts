import { OAuthStorage } from "angular-oauth2-oidc";
import { ConfigService } from "../config-service/config.service";

export function CrossTabAuthStorageFactory(): OAuthStorage {
    return new CrossTabAuthStorageService;
}

export class CrossTabAuthStorageService extends OAuthStorage {
    readonly AUTHORIZED_KEY = `AUTHORIZED`;

    constructor() {
        super();
        window.addEventListener('storage', (event: StorageEvent) => {
            if(event.key === this.AUTHORIZED_KEY) {
                sessionStorage.clear();
                location.reload();
            }
        })
    }

    getItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
        if(key === 'access_token') localStorage.removeItem(this.AUTHORIZED_KEY);
    }

    setItem(key: string, data: string): void {
        sessionStorage.setItem(key, data);
        if(key === 'access_token') localStorage.setItem(this.AUTHORIZED_KEY, 'true');
    }


}