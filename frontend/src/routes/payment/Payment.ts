import {convertToDate} from "../../util/DateUtil";
import Client from "../client/Client";
import Subscription from "../subscription/Subscription";
import {PaymentMethod} from "./PaymentMethod";
import {PaymentStatus} from "./PaymentStatus";

export default class Payment {
    id: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    subtotal: number;
    discountAmount: number;
    total: number;
    invoiceCreated: boolean;
    invoiceEmailSent: boolean;
    client: Client;
    // clientSubscription: ClientSubscription;
    subscription: Subscription;

    createdAt: Date;
    updatedAt: Date;

    constructor(item: any) {
        this.id = item.id;
        this.paymentMethod = item.paymentMethod;
        this.paymentStatus = item.paymentStatus;
        this.subtotal = item.subtotal;
        this.discountAmount = item.discountAmount;
        this.total = item.total;
        this.invoiceCreated = item.invoiceCreated;
        this.invoiceEmailSent = item.invoiceEmailSent;
        this.client = item.client;
        // this.clientSubscription = item.clientSubscription;
        this.subscription = item.subscription;

        // @ts-ignore
        this.createdAt = convertToDate(item.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(item.updatedAt);
    }

    public isPendingOP(): boolean {
        return this.paymentMethod === PaymentMethod.OP && this.paymentStatus === PaymentStatus.PENDING;
    }
}