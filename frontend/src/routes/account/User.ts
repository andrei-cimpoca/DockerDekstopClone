export default class User {
    active: boolean;
    permissions: string[];

    constructor(user: any) {
        this.active = user.active;
        this.permissions = user.permissions;
    }
}