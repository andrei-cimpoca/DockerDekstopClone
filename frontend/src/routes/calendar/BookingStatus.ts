export enum BookingStatus {
    UPCOMING = "UPCOMING",
    SHOWED_UP = "SHOWED_UP",
    EARLY_CANCEL = "EARLY_CANCEL",
    LATE_CANCEL = "LATE_CANCEL"
}

export const bookingStatusMap: Map<BookingStatus, string> = new Map([
    [BookingStatus.UPCOMING, "upcoming"],
    [BookingStatus.SHOWED_UP, "showed up"],
    [BookingStatus.EARLY_CANCEL, "early cancel"],
    [BookingStatus.LATE_CANCEL, "late cancel"]
]);
