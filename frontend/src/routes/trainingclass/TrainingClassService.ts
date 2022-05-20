import BackendService from "../../config/BackendService";
import TrainingClass from "../trainingclass/TrainingClass";
import LocationForm from "../location/LocationForm";
import TrainingClassForm from "./TrainingClassForm";

export default class TrainingClassService {
    static getList(): Promise<TrainingClass[]> {
        return BackendService.getJson('/api/v1/training-class')
            .then(trainingClasses => trainingClasses.map((trainingClass: any) => new TrainingClass(trainingClass)));
    }

    static save(id: number | null, form: TrainingClassForm): Promise<Response> {
        return (null == id)
            ? BackendService.postJson("/api/v1/training-class", form)
            : BackendService.putJson("/api/v1/training-class/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/training-class/" + id);
    }
}
