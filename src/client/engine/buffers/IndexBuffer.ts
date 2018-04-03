export default class Buffer {
    public buffer: WebGLBuffer = 0;
    
    constructor(gl: WebGLRenderingContext, data: Uint16Array) {
        this.buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public bind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    public unbind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
