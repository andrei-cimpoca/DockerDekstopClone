import Container from "../routes/container/Container";
import EnvironmentVariable from "../routes/image/EnvironmentVariable";
import InstalledImage from "../routes/image/InstalledImage";
import Volume from "../routes/image/Volume";
import Network from "../routes/network/Network";

//andrei@localhost:~> docker images  --format "{{json . }}"
const fakeDockerImagesResponse = 
    '{"Containers":"N/A","CreatedAt":"2022-04-08 13:33:54 +0300 EEST","CreatedSince":"6 weeks ago","Digest":"\u003cnone\u003e","ID":"412157ea134f","Repository":"ttf","SharedSize":"N/A","Size":"309MB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"309MB"}\n' +
    '{"Containers":"N/A","CreatedAt":"2022-04-06 08:14:46 +0300 EEST","CreatedSince":"6 weeks ago","Digest":"\u003cnone\u003e","ID":"22da36aef001","Repository":"tomcat","SharedSize":"N/A","Size":"265MB","Tag":"9.0-jre11-temurin","UniqueSize":"N/A","VirtualSize":"264.8MB"}\n' +
    '{"Containers":"N/A","CreatedAt":"2022-03-29 19:02:44 +0300 EEST","CreatedSince":"7 weeks ago","Digest":"\u003cnone\u003e","ID":"12766a6745ee","Repository":"nginx","SharedSize":"N/A","Size":"142MB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"141.5MB"}\n' +
    '{"Containers":"N/A","CreatedAt":"2022-03-29 15:06:20 +0300 EEST","CreatedSince":"7 weeks ago","Digest":"\u003cnone\u003e","ID":"82b20510737b","Repository":"vulfocus/spring-core-rce-2022-03-29","SharedSize":"N/A","Size":"839MB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"839MB"}\n' +
    '{"Containers":"N/A","CreatedAt":"2022-03-02 00:35:51 +0200 EET","CreatedSince":"2 months ago","Digest":"\u003cnone\u003e","ID":"2bd3f5856e2f","Repository":"arubaryan/mobileiron","SharedSize":"N/A","Size":"89.2MB","Tag":"1.1.0","UniqueSize":"N/A","VirtualSize":"89.21MB"}\n' +
    '{"Containers":"N/A","CreatedAt":"2022-01-22 07:14:48 +0200 EET","CreatedSince":"4 months ago","Digest":"\u003cnone\u003e","ID":"d78e982c2f2b","Repository":"mcr.microsoft.com/mssql/server","SharedSize":"N/A","Size":"1.48GB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"1.484GB"}';


//andrei@localhost:~> docker ps -a --format "{{json . }}"
const fakeDockerPSAResponse =
    '{"Command":"\\"catalina.sh run\\"","CreatedAt":"2022-04-08 14:35:10 +0300 EEST","ID":"d5e4db78610b","Image":"ttf","Labels":"","LocalVolumes":"0","Mounts":"","Names":"flamboyant_ptolemy","Networks":"bridge","Ports":"","RunningFor":"5 weeks ago","Size":"5.69kB (virtual 309MB)","State":"exited","Status":"Exited (130) 5 weeks ago"}\n' +
    '{"Command":"\\"/app/tomcat/bin/cat…\\"","CreatedAt":"2022-04-06 14:42:56 +0300 EEST","ID":"2d4c98efa8c4","Image":"vulfocus/spring-core-rce-2022-03-29","Labels":"org.label-schema.license=GPLv2,org.label-schema.name=CentOS Base Image,org.label-schema.schema-version=1.0,org.label-schema.vendor=CentOS,version=0.2.2,description=Vulfocus for Docker,maintainer=r4v3zn \u003cwoo0nise@gmail.com\u003e,org.label-schema.build-date=20210915","LocalVolumes":"0","Mounts":"/home/andrei/S…","Names":"operator","Networks":"bridge","Ports":"","RunningFor":"6 weeks ago","Size":"6.08kB (virtual 839MB)","State":"exited","Status":"Exited (130) 6 weeks ago"}\n' +
    '{"Command":"\\"/app/tomcat/bin/cat…\\"","CreatedAt":"2022-04-06 14:17:01 +0300 EEST","ID":"2200c390a9cf","Image":"vulfocus/spring-core-rce-2022-03-29","Labels":"version=0.2.2,description=Vulfocus for Docker,maintainer=r4v3zn \u003cwoo0nise@gmail.com\u003e,org.label-schema.build-date=20210915,org.label-schema.license=GPLv2,org.label-schema.name=CentOS Base Image,org.label-schema.schema-version=1.0,org.label-schema.vendor=CentOS","LocalVolumes":"0","Mounts":"","Names":"springrce","Networks":"bridge","Ports":"","RunningFor":"6 weeks ago","Size":"33.4MB (virtual 872MB)","State":"exited","Status":"Exited (143) 6 weeks ago"}\n' +
    '{"Command":"\\"/opt/mssql/bin/perm…\\"","CreatedAt":"2022-03-01 15:54:45 +0200 EET","ID":"688740375bb3","Image":"mcr.microsoft.com/mssql/server:latest","Labels":"com.microsoft.product=Microsoft SQL Server,com.microsoft.version=15.0.4198.2,vendor=Microsoft","LocalVolumes":"0","Mounts":"","Names":"mssql","Networks":"bridge","Ports":"","RunningFor":"2 months ago","Size":"576MB (virtual 2.06GB)","State":"exited","Status":"Exited (0) 6 weeks ago"}';

export class DockerService {
    public static start(id: String): Promise<string> {
        return this.runCommand(`docker start ${id}`);
    }

    public static stop(id: String): Promise<string> {
        return this.runCommand(`docker stop ${id}`);
    }

    public static getInstalledImages(): Promise<InstalledImage[]> {
        return new Promise((accept, reject) => {

            //@ts-ignore
            if (window['electronAPI'] === undefined) {
                const images: InstalledImage[] = [];
                fakeDockerImagesResponse.split(/\n/)
                .map(line => images.push(new InstalledImage(JSON.parse(line))));
                accept(images);
            } else {
                //@ts-ignore
                window.electronAPI.handleCommandResponse((event: any, data: string) => {
                    const images: InstalledImage[] = [];
                    data.split(/\n/)
                    .map(line => {
                        try {
                            const parsedLine = JSON.parse(line);
                            images.push(new InstalledImage(parsedLine));
                        } catch (e) {

                        }
                    });
                    accept(images);
                })
            
                const command = ['docker', 'images', '--format', '{{json . }}'];
                //@ts-ignore
                window.electronAPI.runCommand(command)
            }

        });
    }

    public static getContainers(): Promise<Container[]> {
        return new Promise((accept, reject) => {

            //@ts-ignore
            if (window['electronAPI'] === undefined) {
                const containers: Container[] = [];
                fakeDockerPSAResponse.split(/\n/)
                .map(line => {console.info(line); containers.push(new Container(JSON.parse(line)))});
                accept(containers);
            } else {
                //@ts-ignore
                window.electronAPI.handleCommandResponse((event: any, data: string) => {
                    //console.info(data);
                    const containers: Container[] = [];
                    data.split(/\n/)
                    .map(line => {
                       try {
                            const parsedLine = JSON.parse(line);
                            containers.push(new Container(parsedLine));
                        } catch (e) {

                        }
                    });
                    accept(containers);
                });
            
                const command = ['docker', 'ps', '-a', '--format', '{{json . }}'];
                //@ts-ignore
                window.electronAPI.runCommand(command)
            }

        });
    }

    public static getNetworks(): Promise<Network[]> {
        return new Promise((resolve, reject) => {
            this.runCommandWithArray(['docker', 'network', 'ls', '--format', '{{json . }}']).then((data: string) => {
                const networks: Network[] = [];
                data.split(/\n/).map(line => {
                    console.log(line);
                    try {
                        const parsedLine = JSON.parse(line);
                        networks.push(new Network(parsedLine));
                        console.log("+1 network");
                    } catch (e) {
                        console.log(`exception: ${e}`);
                    }
                });
                resolve(networks);
            });
        });
    }

    public static runImage(imageId: string, containerName: string, port: string, volumes: Volume[], environmentVariables: EnvironmentVariable[]): Promise<string> {
        const envVariablesArg = environmentVariables.map(variable => `-e ${variable.name}=${variable.value}`).join(" ")
        const volumesArg = volumes.map(volume => `-v ${volume.hostPath}:${volume.containerPath}`).join(" ")

        return this.runCommand(`docker run -d --name ${containerName} -p ${port} ${envVariablesArg} ${volumesArg} ${imageId}`);
    }

    public static deleteImage(imageId: string): Promise<string> {
        return this.runCommand(`docker rmi -f ${imageId}`);
    }

    public static deleteContainer(containerId: string): Promise<string> {
        return this.runCommand(`docker rm -f ${containerId}`);
    }

    public static getContainerLogs(containerId: string): Promise<string> {
        return this.runCommand(`docker logs ${containerId}`);
    }

    public static pullImage(imageName: string): Promise<string> {
        return this.runCommand(`docker pull ${imageName}`);
    }

    private static runCommand(command: string): Promise<string> {
        return this.runCommandWithArray(command.split(/\s+/));
    }

    private static runCommandWithArray(command: string[]): Promise<string> {
        //@ts-ignore
        if (window['electronAPI'] === undefined) {
            return new Promise(() => {});
        }

        return new Promise((resolve, reject) => {
            //@ts-ignore
            window.electronAPI.handleCommandResponse((event: any, data: string) => {
                resolve(data);
            });

            //@ts-ignore
            window.electronAPI.runCommand(command);
        });
    }
}