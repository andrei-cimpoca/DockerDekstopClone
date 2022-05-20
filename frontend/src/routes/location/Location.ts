import {convertToDate} from "../../util/DateUtil";

export default class Location {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(location: any) {
        this.id = location.id;
        this.name = location.name;
        this.address = location.address;
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.active = location.active;
        // @ts-ignore
        this.createdAt = convertToDate(location.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(location.updatedAt);
    }
}