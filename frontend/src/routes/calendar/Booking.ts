import {convertToDate} from "../../util/DateUtil";
import {BookingStatus} from "./BookingStatus";

export default class Booking {
    id: number;
    clientId: number;
    calendarEventId: number;
    createdAt: Date;
    status: BookingStatus;

    constructor(booking: any) {
        this.id = booking.id;
        this.clientId = booking.clientId;
        this.calendarEventId = booking.calendarEventId;
        // @ts-ignore
        this.createdAt = convertToDate(booking.createdAt);
        this.status = booking.status;
    }
}