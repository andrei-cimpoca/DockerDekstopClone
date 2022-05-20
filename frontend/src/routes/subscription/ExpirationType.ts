export enum ExpirationType {
    PURCHASE = "PURCHASE",
    FIRST_USAGE = "FIRST_USAGE"
}

export const expirationTypes: Map<ExpirationType, string> = new Map([
    [ExpirationType.PURCHASE, "cumpararii"],
    [ExpirationType.FIRST_USAGE, "primei utilizari"]
]);
