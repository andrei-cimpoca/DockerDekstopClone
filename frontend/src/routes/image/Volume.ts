export default class Volume {
    hostPath: string = ""
    containerPath: string = ""
    constructor(hostPath: string, containerPath: string) {
        this.hostPath = hostPath
        this.containerPath = containerPath
    }
}