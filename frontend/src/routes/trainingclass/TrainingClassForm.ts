import MultiLanguageText from "../../util/MultiLanguageText";

export default class TrainingClassForm {
    name: string;
    description: MultiLanguageText;
    active: boolean;

    constructor(
        name: string,
        description: MultiLanguageText,
        active: boolean
    ) {
        this.name = name;
        this.description = description;
        this.active = active;
    }
}