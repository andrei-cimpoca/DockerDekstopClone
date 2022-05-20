import BackendService from "../../config/BackendService";
import CalendarEvent from "./CalendarEvent";
import CalendarEventGenerateForm from "./CalendarEventGenerateForm";
import CalendarEventEditForm from "./CalendarEventEditForm";
import BookingCreateForm from "./BookingCreateForm";
import {BookingStatus} from "./BookingStatus";
import Booking from "./Booking";
import CalendarEventClient from "./CalendarEventClient";

export class EventFilters {
    trainingClassId:  string | null;
    locationId:  string | null;
    staffMemberId: number | undefined;
    periodBegin: Date | null;
    periodEnd: Date | null;

    constructor(periodBegin: Date | null,
                periodEnd: Date | null,
                trainingClassId: string | null,
                locationId: string | null,
                staffMemberId: number | undefined) {
        this.periodBegin = periodBegin;
        this.periodEnd = periodEnd;
        this.trainingClassId = trainingClassId;
        this.locationId = locationId;
        this.staffMemberId = staffMemberId;
    }

    toUrlSearchParams(): URLSearchParams {
        const params = new URLSearchParams();
        params.append("periodBegin", this.periodBegin ? this.periodBegin.toISOString() : '');
        params.append("periodEnd", this.periodEnd ? this.periodEnd.toISOString() : '');
        params.append("trainingClassIds", this.trainingClassId ? this.trainingClassId : '');
        params.append("locationIds", this.locationId ? this.locationId : '');
        params.append("staffMemberIds", this.staffMemberId ? this.staffMemberId.toString() : '');
        return params;
    }
}

export default class CalendarService {
    static getEvents = (filters: EventFilters): Promise<CalendarEvent[]> =>
        BackendService.getJson("/api/v1/calendar", filters.toUrlSearchParams())
            .then(events => events.map((event: any) => new CalendarEvent(event)));

    static generateEvents(form: CalendarEventGenerateForm): Promise<Response> {
        return BackendService.postJson("/api/v1/calendar/generate", form);
    }

    static save(form: CalendarEventEditForm): Promise<Response> {
        return BackendService.postJson("/api/v1/calendar/save", form);
    }

    static delete(ids: number[]): Promise<Response> {
        return BackendService.postJson("/api/v1/calendar/delete", ids);
    }

    static getEvent = (eventId: number): Promise<CalendarEvent> => {
        return BackendService.getJson("/api/v1/calendar/get/" + eventId)
            .then(data => new CalendarEvent(data));
    }

    static createBooking(form: BookingCreateForm): Promise<Response> {
        return BackendService.postJson("/api/v1/calendar/create-booking", form);
    }

    static deleteBooking = (id: number): Promise<Response> =>
        BackendService.postJson("/api/v1/calendar/delete-bookings", [id]);

    static setBookingStatus = (id: number, status: BookingStatus) =>
        BackendService.postJson("/api/v1/calendar/set-booking-status", {id: id, status: status});

    static getClientBookings = (clientId: number): Promise<CalendarEventClient[]> =>
        BackendService.getJson("/api/v1/calendar/client-bookings/" + clientId)
            .then(bookings => bookings.map((booking: any) => new CalendarEventClient(booking)));

}
