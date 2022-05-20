import {convertToDate} from "../../util/DateUtil";
import {SubscriptionType} from "./SubscriptionType";
import {PromotionType} from "./PromotionType";
import {ExpirationUnit} from "./ExpirationUnit";
import {ExpirationType} from "./ExpirationType";
import Client from "../client/Client";
import Payment from "../payment/Payment";

export default class ClientSubscription {
    id: number;
    payment: Payment;
    client: Client;
    name: string;
    subscriptionType: SubscriptionType;
    price:  number;
    taxRate:  number;
    taxIncluded: boolean;
    maxSessions:  number;
    bookedSessions:  number;
    sessionsPerDay:  number;
    beginsAt: Date | null;
    endsAt: Date | null;
    suspended: boolean;
    paid: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(item: any) {
        this.id = item.id;
        this.payment = new Payment(item.payment);
        this.client = new Client(item.client);
        this.name = item.name;
        this.subscriptionType = item.subscriptionType;
        this.price = item.price;
        this.taxRate = item.taxRate;
        this.taxIncluded = item.taxIncluded;
        this.maxSessions = item.maxSessions;
        this.bookedSessions = item.bookedSessions;
        this.sessionsPerDay = item.sessionsPerDay;
        this.beginsAt = convertToDate(item.beginsAt);
        this.endsAt = convertToDate(item.endsAt);
        this.suspended = item.suspended;
        this.paid = item.paid;

        // @ts-ignore
        this.createdAt = convertToDate(item.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(item.updatedAt);
    }
}