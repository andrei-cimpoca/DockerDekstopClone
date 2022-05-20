import BackendService from "../../config/BackendService";
import Payment from "../payment/Payment";
import {PaymentMethod} from "./PaymentMethod";
import {PaymentStatus} from "./PaymentStatus";

// import PaymentForm from "./PaymentForm";

export class PaymentFilters {
    id: string | null;
    clientId: string | null;
    paymentMethod: PaymentMethod | undefined;
    paymentStatus: PaymentStatus | undefined;
    // periodBegin: Date | null;
    // periodEnd: Date | null;
    page: number;
    perPage: number;

    constructor(id: string | null,
                clientId: string | null,
                paymentMethod: PaymentMethod | undefined,
                paymentStatus: PaymentStatus | undefined,
                // periodBegin: Date | null;
                // periodEnd: Date | null;
                page: number,
                perPage: number) {
        this.id = id;
        this.clientId = clientId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        // this.periodBegin = periodBegin;
        // this.periodEnd = periodEnd;
        this.page = page;
        this.perPage = perPage;
    }

    toUrlSearchParams(): URLSearchParams {
        const params = new URLSearchParams();
        params.append("id", this.id ? this.id : '');
        params.append("clientId", this.clientId ? this.clientId : '');
        params.append("paymentMethod", this.paymentMethod ? this.paymentMethod.toString() : '');
        params.append("paymentStatus", this.paymentStatus ? this.paymentStatus.toString() : '');
        // params.append("periodBegin", this.periodBegin ? this.periodBegin.toISOString() : '');
        // params.append("periodEnd", this.periodEnd ? this.periodEnd.toISOString() : '');
        params.append("page", this.page.toString());
        params.append("perPage", this.perPage.toString());
        return params;
    }
}

export class PaymentListResponse {
    items: Payment[];
    totalItems: number;

    constructor(items: Payment[], totalItems: number) {
        this.items = items;
        this.totalItems = totalItems;
    }
}

export default class PaymentService {
    static getList(filters: PaymentFilters): Promise<PaymentListResponse> {
        return BackendService.getJson('/api/v1/payment', filters.toUrlSearchParams())
            .then(response => {
                const items = response.content.map((item: any) => new Payment(item));
                return new PaymentListResponse(items, response.totalElements);
            });
    }

    static approve(id: number): Promise<Response> {
        return BackendService.get('/api/v1/payment/approve/' + id);
    }
}
