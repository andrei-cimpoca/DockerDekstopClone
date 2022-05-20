export enum SubscriptionType {
    ONE_TIME = "ONE_TIME",
    MULTIPLE = "MULTIPLE",
    UNLIMITED = "UNLIMITED"
}

export const subscriptionTypes: Map<SubscriptionType, string> = new Map([
    [SubscriptionType.ONE_TIME, "De unica folosinta"],
    [SubscriptionType.MULTIPLE, "Numar fix de sesiuni"],
    [SubscriptionType.UNLIMITED, "Nelimitat"]
]);
