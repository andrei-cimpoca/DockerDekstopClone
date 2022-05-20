import {convertToDate} from "../../util/DateUtil";
import User from "../account/User";

export default class StaffMember {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;


    constructor(staffMember: any) {
        this.id = staffMember.id;
        this.name = staffMember.name;
        this.email = staffMember.email;
        // @ts-ignore
        this.createdAt = convertToDate(staffMember.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(staffMember.updatedAt);
        this.user = staffMember.user;
    }
}