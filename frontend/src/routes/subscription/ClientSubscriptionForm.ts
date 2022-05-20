export default class ClientSubscriptionForm {
    beginsAt: Date | null;
    endsAt: Date | null;

    constructor(
        beginsAt: Date | null,
        endsAt: Date | null
    ) {
        this.beginsAt = beginsAt;
        this.endsAt = endsAt;
    }
}