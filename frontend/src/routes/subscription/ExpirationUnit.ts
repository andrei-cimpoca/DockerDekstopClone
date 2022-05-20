export enum ExpirationUnit {
    DAYS = "DAYS",
    WEEKS = "WEEKS",
    MONTHS = "MONTHS"
}

export const expirationUnits: Map<ExpirationUnit, string> = new Map([
    [ExpirationUnit.DAYS, "zile"],
    [ExpirationUnit.WEEKS, "saptamani"],
    [ExpirationUnit.MONTHS, "luni"]
]);
