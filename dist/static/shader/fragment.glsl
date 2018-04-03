precision mediump float;

varying vec2 fragTexCoord;

uniform sampler2D texture;

void main()
{
    gl_FragColor = texture2D(texture, fragTexCoord);
}
