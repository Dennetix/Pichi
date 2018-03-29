export default class Buffer {
    public buffer: WebGLBuffer = 0;
    
    constructor(gl: WebGLRenderingContext, data: Uint16Array) {
        this.buffer = gl.createBuffer() as WebGLBuffer;
        this.bind(gl);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    public bind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}
