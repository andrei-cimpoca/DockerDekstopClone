export default class UserPermission {
    id: string;
    name: string;

    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
    }

}
