precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;

uniform mat4 transformationMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    fragTexCoord = vertTexCoord;
    gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(vertPosition, 1);
}
