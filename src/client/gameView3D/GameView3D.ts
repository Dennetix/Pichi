import autobind from 'autobind-decorator';

import ErrorStore from '../stores/ErrorStore';

import ResourceLoader from '../engine/utils/ResourceLoader';
import Shader from '../engine/Shader';
import Buffer from '../engine/Buffer';

import * as glMatrix from 'gl-matrix';

const triangleVertices = [
    0.0,  0.5, 0.0,     1.0, 1.0, 0.0,
   -0.5, -0.5, 0.0,     1.0, 0.0, 1.0,
    0.5, -0.5, 0.0,     0.0, 1.0, 1.0
];

export default class GameView3D {
    private gl: WebGLRenderingContext;

    private shader: Shader = Object.create(null);
    private vbo: Buffer = Object.create(null);

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

        this.vbo = new Buffer(this.gl, new Float32Array(triangleVertices));

        const positionAttribLocation = this.shader.getAttribLocation(this.gl, 'vertPosition');
        const colorAttribLocation = this.shader.getAttribLocation(this.gl, 'vertColor');
        this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.vertexAttribPointer(colorAttribLocation, 3, this.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT,
             3 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(positionAttribLocation);
        this.gl.enableVertexAttribArray(colorAttribLocation);

        this.shader.enable(this.gl);
        this.vbo.bind(this.gl);

        document.addEventListener('keydown', () => this.keyDown = true);
        document.addEventListener('keyup', () => this.keyDown = false);
    }

    private keyDown = false;
    private distance = -5;

    @autobind
    private render(): void {
        if (this.keyDown) { 
            this.distance += 0.05;
        } else {
            this.distance -= 0.05;
        }

        this.gl.clearColor(0.2, 0.2, 0.8, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        console.log([0, 0, this.distance]);

        glMatrix.mat4.lookAt(this.viewMatrix, [0, 0, this.distance], [0, 0, 20], [0, 1, 0]);
        glMatrix.mat4.perspective(this.projectionMatrix, 70 / 180 * Math.PI, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.shader.setUniformMatrix4(this.gl, 'transformationMatrix', this.transformationMatrix);
        this.shader.setUniformMatrix4(this.gl, 'viewMatrix', this.viewMatrix);
        this.shader.setUniformMatrix4(this.gl, 'projectionMatrix', this.projectionMatrix);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

        requestAnimationFrame(this.render);
    }
}
