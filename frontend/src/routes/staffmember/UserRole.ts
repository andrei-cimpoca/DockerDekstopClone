import UserPermission from "./UserPermission";

export default class UserRole {
    id: string;
    name: string;
    permissions: UserPermission[];

    constructor(role: any) {
        this.id = role.id;
        this.name = role.name;
        this.permissions = role.permissions;
    }

    getFullRightsString(): string {
        let strings = this.permissions.map(value => value.id);
        strings.push(this.id);
        return strings.join("#");
    }

}
