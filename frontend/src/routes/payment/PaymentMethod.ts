export enum PaymentMethod {
    FREE = "FREE",
    CARD = "CARD",
    OP = "OP"
}

export const paymentMethods: Map<PaymentMethod, string> = new Map([
    [PaymentMethod.FREE, "gratuit"],
    [PaymentMethod.CARD, "cu cardul"],
    [PaymentMethod.OP, "ordin de plata"]
]);
