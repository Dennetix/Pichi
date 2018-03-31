import { mat4, quat, vec3 } from 'gl-matrix';

import Keyboard from '../engine/utils/Keyboard';

export default class FPSCamera {
    private viewMatrix = mat4.identity(mat4.create());

    private pitch: number = 0;
    private yaw: number = 0;
    private roll: number = 0;

    private position: vec3 = vec3.fromValues(0, 0, 5);

    constructor() {
        this.updateViewMatrix();

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.getElementById('canvas')) {
                this.yaw += e.movementX / 450;
                this.pitch += e.movementY / 450;
            }
        });
    }

    public update(): void {
        if (Keyboard.isKeyPressed(87)) {
            this.position[0] += Math.sin(this.yaw) * 0.3;
            this.position[2] -= Math.cos(this.yaw) * 0.3;
        }
        if (Keyboard.isKeyPressed(83)) {
            this.position[0] -= Math.sin(this.yaw) * 0.3;
            this.position[2] += Math.cos(this.yaw) * 0.3;
        }
        if (Keyboard.isKeyPressed(65)) {
            this.position[0] += Math.sin(this.yaw - Math.PI / 2) * 0.3;
            this.position[2] -= Math.cos(this.yaw - Math.PI / 2) * 0.3;
        }
        if (Keyboard.isKeyPressed(68)) {
            this.position[0] -= Math.sin(this.yaw - Math.PI / 2) * 0.3;
            this.position[2] += Math.cos(this.yaw - Math.PI / 2) * 0.3;
        }
        if (Keyboard.isKeyPressed(32)) {
            this.position[1] += 0.3;
        }
        if (Keyboard.isKeyPressed(16)) {
            this.position[1] -= 0.3;
        }

        this.updateViewMatrix();
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    private updateViewMatrix(): void {
        const qRotate = quat.create();
        quat.rotateX(qRotate, qRotate, this.pitch);
        quat.rotateY(qRotate, qRotate, this.yaw);
        quat.rotateZ(qRotate, qRotate, this.roll);

        const mRotate = mat4.fromQuat(mat4.create(), qRotate);
        const mTranslate = mat4.translate(mat4.create(), mat4.create(), [-this.position[0], -this.position[1], -this.position[2]]);

        mat4.mul(this.viewMatrix, mRotate, mTranslate);
    }
    
}
