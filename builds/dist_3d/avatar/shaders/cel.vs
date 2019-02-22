attribute vec3 aVertexPosition; // vertex position
attribute vec3 aVertexNormal; // vertex normal
        
uniform mat4 umMatrix; // the model matrix
uniform mat4 upvmMatrix; // the project view model matrix
        
varying vec3 vWorldPos; // interpolated world position of vertex
varying vec3 vVertexNormal; // interpolated normal for frag shader

void main(void) {
            
    // vertex position
    vec4 vWorldPos4 = umMatrix * vec4(aVertexPosition, 1.0);
    vWorldPos = vec3(vWorldPos4.x,vWorldPos4.y,vWorldPos4.z);
    gl_Position = upvmMatrix * vec4(aVertexPosition, 1.0);

    // vertex normal (assume no non-uniform scale)
    vec4 vWorldNormal4 = umMatrix * vec4(aVertexNormal, 0.0);
    vVertexNormal = normalize(vec3(vWorldNormal4.x,vWorldNormal4.y,vWorldNormal4.z)); 
}