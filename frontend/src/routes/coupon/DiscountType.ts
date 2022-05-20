export enum DiscountType {
    PERCENT = "PERCENT",
    AMOUNT = "AMOUNT"
}

export const discountTypes: Map<DiscountType, string> = new Map([
    [DiscountType.PERCENT, "procent"],
    [DiscountType.AMOUNT, "suma"]
]);
