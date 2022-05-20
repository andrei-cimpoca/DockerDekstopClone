export enum PromotionType {
    NEW_ONLY = "NEW_ONLY",
    EXISTING_ONLY = "EXISTING_ONLY",
    NEW_AND_EXISTING = "NEW_AND_EXISTING"
}

export const promotionTypes: Map<PromotionType, string> = new Map([
    [PromotionType.NEW_ONLY, "Pentru utilizatori noi"],
    [PromotionType.EXISTING_ONLY, "Pentru utilizatori existenti"],
    [PromotionType.NEW_AND_EXISTING, "Pentru oricine"]
]);
