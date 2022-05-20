import BackendService from "../../config/BackendService";
import StaffMember from "../staffmember/StaffMember";
import UserRole from "./UserRole";
import StaffMemberForm from "./StaffMemberForm";

export default class StaffMemberService {
    static getList(): Promise<StaffMember[]> {
        return BackendService.getJson('/api/v1/staff-member')
            .then(items => {
                return items.map((item: any) => {
                    return new StaffMember(item);
                });
            });
    }
    static getRoles(): Promise<UserRole[]> {
        return BackendService.getJson('/api/v1/staff-member/roles')
            .then(items => items.map((item: any) => new UserRole(item)));
    }

    static save(id: number | null, form: StaffMemberForm): Promise<Response> {
            return (null == id)
                ? BackendService.postJson("/api/v1/staff-member", form)
                : BackendService.putJson("/api/v1/staff-member/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/staff-member/" + id);
    }
}
