precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform mat4 transformationMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    fragColor = vertColor;
    gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(vertPosition, 1);
}
