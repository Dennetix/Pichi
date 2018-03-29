import autobind from 'autobind-decorator';

import ErrorStore from '../stores/ErrorStore';

import ResourceLoader from '../engine/utils/ResourceLoader';
import Shader from '../engine/Shader';
import Buffer from '../engine/buffers/Buffer';
import IndexBuffer from '../engine/buffers/IndexBuffer';

import * as glMatrix from 'gl-matrix';

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

    private transformationMatrix = glMatrix.mat4.identity(glMatrix.mat4.create());
    private viewMatrix = glMatrix.mat4.identity(glMatrix.mat4.create());
    private projectionMatrix = glMatrix.mat4.identity(glMatrix.mat4.create());
    
    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.loadResources()
            .then(() => {
                this.setup();
                requestAnimationFrame(this.render);
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

        glMatrix.mat4.lookAt(this.viewMatrix, [0, 0, -3], [0, 0, 20], [0, 1, 0]);
        glMatrix.mat4.perspective(this.projectionMatrix, 70 / 180 * Math.PI, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.shader.enable(this.gl);
        this.vbo.bind(this.gl);

        this.shader.setUniformMatrix4(this.gl, 'viewMatrix', this.viewMatrix);
        this.shader.setUniformMatrix4(this.gl, 'projectionMatrix', this.projectionMatrix);
    }

    private angle: number = 0;

    @autobind
    private render(): void {
        this.angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(this.transformationMatrix, glMatrix.mat4.identity(glMatrix.mat4.create()), this.angle, [1, 1, 0]);

        this.gl.clearColor(0.2, 0.2, 0.8, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.shader.setUniformMatrix4(this.gl, 'transformationMatrix', this.transformationMatrix);

        this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(this.render);
    }
}
