export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETE = "COMPLETE",
    REJECTED = "REJECTED"
}

export const paymentStatuses: Map<PaymentStatus, string> = new Map([
    [PaymentStatus.PENDING, "in asteptare"],
    [PaymentStatus.COMPLETE, "completa"],
    [PaymentStatus.REJECTED, "respinsa"]
]);
