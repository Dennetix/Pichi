export default class Buffer {
    public buffer: WebGLBuffer = 0;
    
    constructor(gl: WebGLRenderingContext, data: Float32Array) {
        this.buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); 
    }

    public bind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }

    public unbind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
