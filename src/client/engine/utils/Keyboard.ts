export default class Keyboard {
    private static keys: {[key: number]: boolean} = {};

    public static initialize() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });
    }

    public static isKeyPressed(keyCode: number) {
        return this.keys[keyCode] ? true : false;
    }
}

Keyboard.initialize();
