import autobind from 'autobind-decorator';
import { glMatrix, mat4, quat, vec3 } from 'gl-matrix';

import ErrorStore from '../stores/ErrorStore';

import ResourceLoader from '../engine/utils/ResourceLoader';
import Shader from '../engine/Shader';
import Buffer from '../engine/buffers/Buffer';
import IndexBuffer from '../engine/buffers/IndexBuffer';

import FPSCamera from '../engine/FPSCamera';

const vertices = [
    // Top
    -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
    1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
    1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
    1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
    1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
    1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
    1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
    1.0, -1.0, -1.0,    0.5, 0.5, 1.0
];

const indices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
];

export default class GameView3D {
    private gl: WebGLRenderingContext;

    private shader: Shader = Object.create(null);
    private vbo: Buffer = Object.create(null);
    private ibo: IndexBuffer = Object.create(null);

    private transformationMatrix = mat4.create();
    private projectionMatrix = mat4.create();

    private camera: FPSCamera = Object.create(null);

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.loadResources()
            .then(() => {
                this.setup();
                requestAnimationFrame(this.loop);
            })
            .catch(ErrorStore.setError);
    }

    private loadResources(): Promise<any> {
        return Promise.all([
            ResourceLoader.loadTextFile('vertexShaderSource','/static/shader/vertex.glsl'),
            ResourceLoader.loadTextFile('fragmentShaderSource','/static/shader/fragment.glsl')
        ]);
    }

    private setup(): void {
        this.shader = new Shader(this.gl, ResourceLoader.getResource('vertexShaderSource'), ResourceLoader.getResource('fragmentShaderSource'));

        this.vbo = new Buffer(this.gl, new Float32Array(vertices));
        this.ibo = new IndexBuffer(this.gl, new Uint16Array(indices));

        const positionAttribLocation = this.shader.getAttribLocation(this.gl, 'vertPosition');
        const colorAttribLocation = this.shader.getAttribLocation(this.gl, 'vertColor');
        this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.vertexAttribPointer(colorAttribLocation, 3, this.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT,
             3 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(positionAttribLocation);
        this.gl.enableVertexAttribArray(colorAttribLocation);

        this.camera = new FPSCamera();

        mat4.perspective(this.projectionMatrix, 70 / 180 * Math.PI, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.shader.enable(this.gl);
        this.vbo.bind(this.gl);
        
        this.shader.setUniformMatrix4(this.gl, 'transformationMatrix', this.transformationMatrix);
        this.shader.setUniformMatrix4(this.gl, 'projectionMatrix', this.projectionMatrix);

        window.addEventListener('resize', this.onWindowResize);
    }

    @autobind
    private loop(): void {
        this.update();
        this.render();

        requestAnimationFrame(this.loop);
    }

    private update(): void {
        this.camera.update();
    }

    private render(): void {
        this.gl.clearColor(0.18, 0.18, 0.2, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.shader.setUniformMatrix4(this.gl, 'viewMatrix', this.camera.getViewMatrix());

        this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    @autobind
    public onWindowResize(): void {
        mat4.perspective(this.projectionMatrix, 70 / 180 * Math.PI, window.innerWidth / window.innerHeight, 0.1, 1000);   
        this.shader.enable(this.gl);
        this.shader.setUniformMatrix4(this.gl, 'projectionMatrix', this.projectionMatrix);        
    }
}
