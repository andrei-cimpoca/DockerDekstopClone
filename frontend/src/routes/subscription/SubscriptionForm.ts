import {SubscriptionType} from "./SubscriptionType";
import {PromotionType} from "./PromotionType";
import {ExpirationUnit} from "./ExpirationUnit";
import {ExpirationType} from "./ExpirationType";

export default class SubscriptionForm {
    name: string;
    description: string;
    price: number;
    discountAmount: number;
    taxRate: number;
    taxIncluded: boolean;
    subscriptionType: SubscriptionType;
    sessions: number;
    promotionType: PromotionType;
    expirationLength: number;
    expirationUnit: ExpirationUnit;
    expirationType: ExpirationType;
    sessionsPerDay: number;
    active: boolean;
    redirectAfterRegistration: boolean;

    constructor(
        name: string,
        description: string,
        price: number,
        discountAmount: number,
        taxRate: number,
        taxIncluded: boolean,
        subscriptionType: SubscriptionType,
        sessions: number,
        promotionType: PromotionType,
        expirationLength: number,
        expirationUnit: ExpirationUnit,
        expirationType: ExpirationType,
        sessionsPerDay: number,
        active: boolean,
        redirectAfterRegistration: boolean
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.discountAmount = discountAmount;
        this.taxRate = taxRate;
        this.taxIncluded = taxIncluded;
        this.subscriptionType = subscriptionType;
        this.sessions = sessions;
        this.promotionType = promotionType;
        this.expirationLength = expirationLength;
        this.expirationUnit = expirationUnit;
        this.expirationType = expirationType;
        this.sessionsPerDay = sessionsPerDay;
        this.active = active;
        this.redirectAfterRegistration = redirectAfterRegistration;
    }
}