export default class ContainerForm {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    active: boolean;

    constructor(
        name: string,
        address: string,
        latitude: string,
        longitude: string,
        active: boolean
    ) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.active = active;
    }
}