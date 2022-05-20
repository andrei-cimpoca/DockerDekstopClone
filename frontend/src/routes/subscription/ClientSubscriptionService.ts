import BackendService from "../../config/BackendService";
import {SubscriptionType} from "./SubscriptionType";
import ClientSubscription from "./ClientSubscription";
import SubscriptionForm from "./SubscriptionForm";
import ClientSubscriptionForm from "./ClientSubscriptionForm";

export class ClientSubscriptionFilters {
    clientId:  string | null;
    subscriptionType:  SubscriptionType | null;
    suspended:  boolean | null;
    paid:  boolean | null;
    periodBegin: Date | null;
    periodEnd: Date | null;

    constructor(clientId: string | null,
                subscriptionType: SubscriptionType | null,
                suspended: boolean | null,
                paid: boolean | null,
                periodBegin: Date | null,
                periodEnd: Date | null) {
        this.clientId = clientId;
        this.subscriptionType = subscriptionType;
        this.suspended = suspended;
        this.paid = paid;
        this.periodBegin = periodBegin;
        this.periodEnd = periodEnd;
    }

    toUrlSearchParams(): URLSearchParams {
        const params = new URLSearchParams();
        params.append("clientId", this.clientId ? this.clientId : '');
        params.append("subscriptionType", this.subscriptionType ? this.subscriptionType.toString() : '');
        params.append("suspended", this.suspended ? this.suspended.toString() : '');
        params.append("paid", this.paid ? this.paid.toString() : '');
        params.append("periodBegin", this.periodBegin ? this.periodBegin.toISOString() : '');
        params.append("periodEnd", this.periodEnd ? this.periodEnd.toISOString() : '');
        return params;
    }
}

export default class ClientSubscriptionService {
    static getList(filters: ClientSubscriptionFilters): Promise<ClientSubscription[]> {
        return BackendService.getJson('/api/v1/client-subscription', filters.toUrlSearchParams())
            .then(items => items.map((item: any) => new ClientSubscription(item)));
    }

    static save(id: number | null, form: ClientSubscriptionForm): Promise<Response> {
        return (null == id)
            ? BackendService.postJson("/api/v1/client-subscription", form)
            : BackendService.putJson("/api/v1/client-subscription/" + id, form);
    }
}
