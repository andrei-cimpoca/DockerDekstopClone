import {convertToDate} from "../../util/DateUtil";
import MultiLanguageText from "../../util/MultiLanguageText";

export default class TrainingClass {
    id: number;
    name: string;
    description: MultiLanguageText;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(trainingClass: any) {
        this.id = trainingClass.id;
        this.name = trainingClass.name;
        this.description = new MultiLanguageText(trainingClass.description);
        this.active = trainingClass.active;
        // @ts-ignore
        this.createdAt = convertToDate(trainingClass.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(trainingClass.updatedAt);
    }
}