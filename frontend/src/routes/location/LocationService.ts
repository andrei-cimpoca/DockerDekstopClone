import BackendService from "../../config/BackendService";
import Location from "../location/Location";
import LocationForm from "./LocationForm";

export default class LocationService {
    static getList(): Promise<Location[]> {
        return BackendService.getJson('/api/v1/location')
            .then(events => events.map((event: any) => new Location(event)));
    }

    static save(id: number | null, form: LocationForm): Promise<Response> {
            return (null == id)
                ? BackendService.postJson("/api/v1/location", form)
                : BackendService.putJson("/api/v1/location/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/location/" + id);
    }
}
