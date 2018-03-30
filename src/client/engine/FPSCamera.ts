import { mat4, quat, vec3 } from 'gl-matrix';

export default class FPSCamera {
    private viewMatrix = mat4.identity(mat4.create());

    private pitch: number = 0;
    private yaw: number = 0;
    private roll: number = 0;

    private position: vec3 = vec3.fromValues(0, 0, -5);

    constructor() {
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.getElementById('canvas')) {
                this.yaw += e.movementX / 300;
                this.pitch += e.movementY / 300;
            }
        });
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public update(): void {
        const pitch = quat.setAxisAngle(quat.create(), [1, 0, 0], this.pitch);
        const yaw = quat.setAxisAngle(quat.create(), [0, 1, 0], this.yaw);
        const roll = quat.setAxisAngle(quat.create(), [0, 0, 1], this.roll);

        const orientation = quat.mul(quat.create(), quat.mul(quat.create(), pitch, yaw), roll);
        quat.normalize(orientation, orientation);
        const rotate = mat4.fromQuat(mat4.create(), orientation);

        const translate = mat4.translate(mat4.create(), mat4.create(), [-this.position[0], this.position[1], this.position[2]]);

        mat4.mul(this.viewMatrix, rotate, translate);
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position = vec3.fromValues(x, y, z);
    }
    
}
