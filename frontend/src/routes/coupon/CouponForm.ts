import {DiscountType} from "./DiscountType";

export default class CouponForm {
    name: string;
    code: string;
    discountValue: number;
    discountType: DiscountType;
    activationDate: Date | null;
    expirationDate: Date | null;
    maxUses: number | null;
    active: boolean;
    allowedSubscriptionIds: number[];

    constructor(
        name: string,
        code: string,
        discountValue: number,
        discountType: DiscountType,
        activationDate: Date | null,
        expirationDate: Date | null,
        maxUses: number | null,
        active: boolean,
        allowedSubscriptionIds: number[]
    ) {
        this.name = name;
        this.code = code;
        this.discountValue = discountValue;
        this.discountType = discountType;
        this.activationDate = activationDate;
        this.expirationDate = expirationDate;
        this.maxUses = maxUses;
        this.active = active;
        this.allowedSubscriptionIds = allowedSubscriptionIds;
    }
}