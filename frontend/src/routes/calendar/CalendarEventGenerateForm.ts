import {dateToTimeStr} from "../../util/DateUtil";

export default class CalendarEventGenerateForm {
    trainingClassId: number;
    locationId: number;
    staffMemberId: number;
    eventGenerationType: number;
    intervalBegin: Date;
    intervalEnd: Date | null;
    weekdays: string[] = [];
    beginsAt: string;
    endsAt: string;
    maxCapacity: number;
    waitingListSize: number;
    minimumBookingMinutesInterval: number;

    constructor(trainingClassId: string,
                locationId: string,
                staffMemberId: string,
                eventGenerationType: string,
                intervalBegin: Date,
                intervalEnd: Date | null,
                weekdays: string[],
                beginsAt: Date,
                endsAt: Date,
                maxCapacity: string,
                waitingListSize: string,
                minimumBookingMinutesInterval: string) {
        this.trainingClassId = Number.parseInt(trainingClassId);
        this.locationId = Number.parseInt(locationId);
        this.staffMemberId = Number.parseInt(staffMemberId);
        this.eventGenerationType = Number.parseInt(eventGenerationType);
        this.intervalBegin = intervalBegin;
        this.intervalEnd = intervalEnd;
        this.weekdays = weekdays;
        this.beginsAt = dateToTimeStr(beginsAt);
        this.endsAt = dateToTimeStr(endsAt);
        this.maxCapacity = Number.parseInt(maxCapacity);
        this.waitingListSize = Number.parseInt(waitingListSize);
        this.minimumBookingMinutesInterval = Number.parseInt(minimumBookingMinutesInterval);
    }
}
