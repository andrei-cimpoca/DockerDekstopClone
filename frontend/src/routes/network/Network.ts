export default class Network {
  createdAt: Date = new Date();
  driver: string = "";
  id: string = "";
  ipv6: boolean = false;
  internal: boolean = false;
  labels: string = "";
  name: string = "";
  scope: string = "";

  constructor(item: any) {
    this.createdAt = item.CreatedAt;
    this.driver = item.Driver;
    this.id = item.ID;
    this.ipv6 = item.IPv6;
    this.internal = item.Internal;
    this.labels = item.Labels;
    this.name = item.Name;
    this.scope = item.Scope;
  }
}