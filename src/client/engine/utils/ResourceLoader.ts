import axios from 'axios';

export default class ResourceLoader {
    private static resources: {[key: string]: any} = {};
    
    public static get(name: string): any {
        if (this.resources[name] === undefined) {
            console.warn(`Resource '${name}' not found`);
            return null;
        }

        return this.resources[name];
    }

    public static loadTextResource(name: string, url: string): Promise<string> {
        return axios(url)
            .then((res) => {
                this.resources[name] = res.data;
                return res.data;
            })
            .catch((error) => {
                throw new Error(`Failed to load text Resource '${url}':\n${error.message}`);
            });
    }

    public static loadImage(name: string, url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                this.resources[name] = image;
                resolve();
            };
            image.onerror = (e) => {
                reject(`Failed to load image '${url}'`);
            };
            image.src = url;
        });
    }
}
