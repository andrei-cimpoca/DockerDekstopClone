import {convertToDate} from "../../util/DateUtil";
import {DiscountType} from "./DiscountType";

export default class Coupon {
    id: number;
    name: string;
    code: string;
    discountValue: number;
    discountType: DiscountType;
    activationDate: Date | null;
    expirationDate: Date | null;
    maxUses: number;
    active: boolean;
    allowedSubscriptionIds: number[];

    createdAt: Date | null;
    updatedAt: Date | null;

    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.code = item.code;
        this.discountValue = item.discountValue;
        this.discountType = item.discountType;
        this.activationDate = convertToDate(item.activationDate);
        this.expirationDate = convertToDate(item.expirationDate);
        this.maxUses = item.maxUses;
        this.active = item.active;
        this.allowedSubscriptionIds = item.allowedSubscriptionIds instanceof Array ? item.allowedSubscriptionIds : [];

        this.createdAt = convertToDate(item.createdAt);
        this.updatedAt = convertToDate(item.updatedAt);
    }
}