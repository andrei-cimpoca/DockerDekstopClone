export default class BookingCreateForm {
    clientId: number;
    calendarEventId: number;

    constructor(clientId: string,
                calendarEventId: string) {
        this.clientId = Number.parseInt(clientId);
        this.calendarEventId = Number.parseInt(calendarEventId);
    }
}
