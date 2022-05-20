export default class StaffMemberForm {
    name: string;
    email: string;
    password: string | null;
    active: boolean;
    permissions: string[];

    constructor(
        name: string,
        email: string,
        password: string | null,
        permissions: string[],
        active: boolean
    ) {
        this.name = name;
        this.email = email;
        this.password = '' == password?.trim() ? null : password;
        this.permissions = permissions;
        this.active = active;
    }
}