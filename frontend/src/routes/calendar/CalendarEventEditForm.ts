export default class CalendarEventEditForm {
    ids: number[] = [];
    trainingClassId: number;
    locationId: number;
    staffMemberId: number;
    maxCapacity: number;
    waitingListSize: number;

    constructor(ids: number[],
                trainingClassId: string,
                locationId: string,
                staffMemberId: string,
                maxCapacity: string,
                waitingListSize: string) {
        this.ids = ids;
        this.trainingClassId = Number.parseInt(trainingClassId);
        this.locationId = Number.parseInt(locationId);
        this.staffMemberId = Number.parseInt(staffMemberId);
        this.maxCapacity = Number.parseInt(maxCapacity);
        this.waitingListSize = Number.parseInt(waitingListSize);
    }
}
