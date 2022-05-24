export default class InstalledImage {
    id: string;
    createdAt: string;
    createdSince: string;
    repository: string;
    tag: string;
    size: string;

    constructor(item: any) {
        this.id = item.ID;
        this.createdAt = item.CreatedAt;
        this.createdSince = item.CreatedSince;
        this.repository = item.Repository;
        this.tag = item.Tag;
        this.size = item.Size;
    }
}