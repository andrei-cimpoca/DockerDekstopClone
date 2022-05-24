
    // '{
    //     "Command":"\"catalina.sh run\"",
    //     "CreatedAt":"2022-04-08 14:35:10 +0300 EEST",
    //     "ID":"d5e4db78610b",
    //     "Image":"ttf",
    //     "Labels":"",
    //     "LocalVolumes":"0",
    //     "Mounts":"",
    //     "Names":"flamboyant_ptolemy",
    //     "Networks":"bridge",
    //     "Ports":"",
    //     "RunningFor":"5 weeks ago",
    //     "Size":"5.69kB (virtual 309MB)",
    //     "State":"exited",
    //     "Status":"Exited (130) 5 weeks ago"}' +

export default class Container {
    command: string;
    createdAt: string;
    id: string;
    image: string;
    names: string;
    ports: string;
    state: string;
    status: string;
    size: string;

    constructor(item: any) {
        this.command = item.Command;
        this.createdAt = item.CreatedAt;
        this.id = item.ID;
        this.image = item.Image;
        this.names = item.Names;
        this.ports = item.Ports;
        this.size = item.Size;
        this.state = item.State;
        this.status = item.Status;
    }
}