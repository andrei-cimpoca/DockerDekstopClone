export enum BillingType {
    PERSON = "PERSON",
    COMPANY = "COMPANY"
}

export const paymentMethods: Map<BillingType, string> = new Map([
    [BillingType.PERSON, "persoana fizica"],
    [BillingType.COMPANY, "firma"]
]);
