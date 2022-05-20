import {convertToDate} from "../../util/DateUtil";
import {SubscriptionType} from "./SubscriptionType";
import {PromotionType} from "./PromotionType";
import {ExpirationUnit} from "./ExpirationUnit";
import {ExpirationType} from "./ExpirationType";

export default class Subscription {
    id: number;
    name: string;
    description: string;
    price:  number;
    discountAmount:  number;
    taxRate:  number;
    taxIncluded: boolean;
    subscriptionType: SubscriptionType;
    sessions:  number;
    promotionType: PromotionType;
    expirationLength:  number;
    expirationUnit: ExpirationUnit;
    expirationType: ExpirationType;
    sessionsPerDay:  number;
    active: boolean;
    redirectAfterRegistration: boolean;

    createdAt: Date;
    updatedAt: Date;

    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.discountAmount = item.discountAmount;
        this.taxRate = item.taxRate;
        this.taxIncluded = item.taxIncluded;
        this.subscriptionType = item.subscriptionType;
        this.sessions = item.sessions;
        this.promotionType = item.promotionType;
        this.expirationLength = item.expirationLength;
        this.expirationUnit = item.expirationUnit;
        this.expirationType = item.expirationType;
        this.sessionsPerDay = item.sessionsPerDay;
        this.active = item.active;
        this.redirectAfterRegistration = item.redirectAfterRegistration;

        // @ts-ignore
        this.createdAt = convertToDate(item.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(item.updatedAt);
    }
}