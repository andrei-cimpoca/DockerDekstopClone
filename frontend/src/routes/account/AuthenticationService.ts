import BackendService from "../../config/BackendService";
import StaffMember from "../staffmember/StaffMember";

let authenticationData = window.localStorage.getItem('authenticationData');
let parsedData = {authorization: null, staffMember: {}};
let staffMember: StaffMember | null = null;
if (authenticationData) {
    parsedData = JSON.parse(authenticationData);
    BackendService.setAuthorizationToken(parsedData['authorization']);
    staffMember = new StaffMember(parsedData.staffMember);
}

export default class AuthenticationService {
    static readonly signInRoute = "/sign-in";
    private static staffMember: StaffMember | null = staffMember;

    static isAuthenticated(): boolean {
        return this.staffMember != null;
    }

    static getDetails(): StaffMember | null {
        return null == this.staffMember ? null : new StaffMember(this.staffMember);
    }

    static signIn(request: Map<string, string>) {
        return BackendService.post('/login', request)
            .then(response => {
                if (200 === response.status) {
                    return response.json();
                } else {
                    return Promise.reject("Invalid username or password");
                }
            }).then(data => {
                BackendService.setAuthorizationToken(data['authorization']);
                this.staffMember = new StaffMember(data['staffMember']);
                window.localStorage.setItem("authenticationData", JSON.stringify(data));
                return data;
            });
    }

    static signOut() {
        this.staffMember = null;
        BackendService.setAuthorizationToken(null);
        window.localStorage.removeItem('authenticationData');
    }
}
