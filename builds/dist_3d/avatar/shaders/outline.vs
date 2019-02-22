attribute vec3 aVertexPosition; // vertex position
attribute vec3 aVertexNormal; // vertex normal

uniform mat4 upvmMatrix; // the project view model matrix

uniform float uOutlineWidth; // width of the outline

void main(void) {
    gl_Position = upvmMatrix * vec4(aVertexPosition + aVertexNormal * uOutlineWidth, 1.0);
}