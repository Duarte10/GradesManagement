export class AuthService {

    saveLoginData(accessToken: string, expiresAt: string) {
        // store login data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("expiresAt", expiresAt);
    }

    logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiresAt");
    }

    isAuthenticated(): boolean {
        // check if token exists
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return false;

        // check if expires at exists
        const expiresAt = localStorage.getItem("expiresAt");
        if (!expiresAt) {
            return false;
        }

        // check if token has expired
        return new Date(parseInt(expiresAt)) > new Date();
    }

    getAccessToken(): string {
        return localStorage.getItem("accessToken");
    }
}