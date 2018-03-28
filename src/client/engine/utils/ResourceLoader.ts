import axios from 'axios';

export default class ResourceLoader {
    private static resources: {[key: string]: any} = {};
    
    public static loadTextFile(name: string, url: string): Promise<string> {
        return axios(url)
            .then((res) => {
                this.resources[name] = res.data;
                return res.data;
            })
            .catch((error) => {
                throw new Error(`Failed to load text Resource '${url}':\n${error.message}`);
            });
    }

    public static getResource(name: string): any {
        if (this.resources[name] === undefined) {
            return null;
        }

        return this.resources[name];
    }
}
