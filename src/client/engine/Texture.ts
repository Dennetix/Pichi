export default class Texture {
    private texture: WebGLTexture = 0;
    
    constructor(gl: WebGLRenderingContext, img: HTMLImageElement, linear: boolean = true) {
        this.texture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public bind(gl: WebGLRenderingContext, texture: number): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(texture);
    }

    public unbind(gl: WebGLRenderingContext): void {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
