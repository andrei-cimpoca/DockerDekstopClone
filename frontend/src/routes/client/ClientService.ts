import Client from "./Client";
import BackendService from "../../config/BackendService";
import ClientForm from "../client/ClientForm";

export class ClientFilters {
    id: string | null;
    searchText: string | null;
    page: number;
    perPage: number;

    constructor(id: string | null,
                searchText: string | null,
                page: number,
                perPage: number) {
        this.id = id;
        this.searchText = searchText;
        this.page = page;
        this.perPage = perPage;
    }

    toUrlSearchParams(): URLSearchParams {
        const params = new URLSearchParams();
        params.append("id", this.id ? this.id : '');
        params.append("searchText", this.searchText ? this.searchText : '');
        params.append("page", this.page.toString());
        params.append("perPage", this.perPage.toString());
        return params;
    }
}

export class ClientListResponse {
    items: Client[];
    totalItems: number;

    constructor(items: Client[], totalItems: number) {
        this.items = items;
        this.totalItems = totalItems;
    }
}

export default class ClientService {
    static getFilteredList(filters: ClientFilters): Promise<ClientListResponse> {
        return BackendService.getJson('/api/v1/client/filtered', filters.toUrlSearchParams())
            .then(response => {
                const items = response.content.map((item: any) => new Client(item));
                return new ClientListResponse(items, response.totalElements);
            });
    }


    static getList(): Promise<Client[]> {
        return BackendService.getJson('/api/v1/client')
            .then(events => events.map((event: any) => new Client(event)));
    }

    static save(id: number | null, form: ClientForm): Promise<Response> {
        return (null == id)
            ? BackendService.postJson("/api/v1/client", form)
            : BackendService.putJson("/api/v1/client/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/client/" + id);
    }

    static getClient(id: number) {
        return BackendService.getJson("/api/v1/client/" + id)
            .then(client => new Client(client));
    }
}
