import StaffMember from "../staffmember/StaffMember";
import Location from "../location/Location";
import Booking from "./Booking";
import {convertToDate} from "../../util/DateUtil";
import TrainingClass from "../trainingclass/TrainingClass";

export default class CalendarEventClient {
    id: number;
    trainingClass: TrainingClass;
    trainingClassId: number;
    location: Location;
    locationId: number;
    staffMember: StaffMember;
    staffMemberId: number;
    beginsAt: Date;
    endsAt: Date;
    listed: boolean;
    maxCapacity: number;
    waitingListSize: number;
    createdAt: Date | null;
    bookings: number;
    booking: Booking;

    constructor(item: any) {
        this.id = item.id;
        this.trainingClass = new TrainingClass(item.trainingClass);
        this.trainingClassId = item.trainingClassId;
        this.location = new Location(item.location);
        this.locationId = item.locationId;
        this.staffMember = new StaffMember(item.staffMember);
        this.staffMemberId = item.staffMemberId;
        // @ts-ignore
        this.beginsAt = convertToDate(item.beginsAt);
        // @ts-ignore
        this.endsAt = convertToDate(item.endsAt);
        this.listed = item.listed;
        this.maxCapacity = item.maxCapacity;
        this.waitingListSize = item.waitingListSize;
        this.createdAt = convertToDate(item.createdAt);
        this.bookings = item.bookings;
        this.booking = new Booking(item.booking);
    }
}