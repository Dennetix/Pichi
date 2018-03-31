export default class Keyboard {
    private static keys: Map<number, boolean> = new Map();

    public static initialize() {
        document.addEventListener('keydown', (e) => {
            this.keys.set(e.keyCode, true);
        });

        document.addEventListener('keyup', (e) => {
            this.keys.set(e.keyCode, false);
        });
    }

    public static isKeyPressed(keyCode: number) {
        return this.keys.get(keyCode) ? true : false;
    }
}

Keyboard.initialize();
