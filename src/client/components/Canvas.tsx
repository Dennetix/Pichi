import * as React from 'react';
import autobind from 'autobind-decorator';

import * as styles from './Canvas.css';

import ErrorStore from '../stores/ErrorStore';

import GameView3D from '../gameView3D/GameView3D';

export default class Canvas extends React.Component {
    private canvas: HTMLCanvasElement = Object.create(null);
    private gl: WebGLRenderingContext = Object.create(null);

    public componentDidMount(): void {
        this.initCanvas();
        this.initWebGL();

        window.addEventListener('resize', this.onWindowResize);

        new GameView3D(this.gl);
    }

    private initCanvas(): void {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private initWebGL(): void {
        this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext;

        if (!this.gl) {
            this.gl = this.canvas.getContext('experimental-webgl') as WebGLRenderingContext;
            if (!this.gl) {
                ErrorStore.setError('WebGL not supported');
                return;
            }
            console.warn('WebGL not supported => using Experimental-WebGL');
        }

        console.log(`OpenGL Version: ${this.gl.getParameter(this.gl.VERSION)}`);
        console.log(`GLSL Version: ${this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION)}`);

        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        
        this.gl.clearColor(0.18, 0.18, 0.2, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    @autobind
    private onWindowResize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    }

    public render() {
        return (
            <div>
                <canvas id="canvas" className={styles.canvas}>
                    This browser doesn't support HTML5 canvas!
                </canvas>
            </div>
        );
    }
}
