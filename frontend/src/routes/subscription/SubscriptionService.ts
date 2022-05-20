import BackendService from "../../config/BackendService";
import Subscription from "../subscription/Subscription";
import SubscriptionForm from "./SubscriptionForm";

export default class SubscriptionService {
    static getList(): Promise<Subscription[]> {
        return BackendService.getJson('/api/v1/subscription')
            .then(items => items.map((item: any) => new Subscription(item)));
    }

    static save(id: number | null, form: SubscriptionForm): Promise<Response> {
            return (null == id)
                ? BackendService.postJson("/api/v1/subscription", form)
                : BackendService.putJson("/api/v1/subscription/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/subscription/" + id);
    }
}
