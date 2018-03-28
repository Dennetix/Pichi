export default class Shader {
    public program: WebGLProgram = 0;

    constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vertexSource);
        gl.shaderSource(fragmentShader, fragmentSource);

        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(`Failed to compile vertex shader:\n${gl.getShaderInfoLog(vertexShader)}`);
        }

        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(`Failed to compile fragment shader:\n${gl.getShaderInfoLog(fragmentShader)}`);
        }

        this.program = gl.createProgram() as WebGLProgram;
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error(`Failed to link program:\n${gl.getProgramInfoLog(this.program)}`);
        }

        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            throw new Error(`Failed to validate program:\n${gl.getProgramInfoLog(this.program)}`);
        }
    }

    public enable(gl: WebGLRenderingContext): void {
        gl.useProgram(this.program);
    }

    public getAttribLocation(gl: WebGLRenderingContext, name: string): number {
        return gl.getAttribLocation(this.program, name);
    }

    public setUniformMatrix4(gl: WebGLRenderingContext, name: string, data: Float32Array): void {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name) as WebGLUniformLocation, false, data);
    }
}
