precision mediump float; // set float to medium precision
uniform vec3 uOutlineColor; //outline Color
void main(void) {    
    
    gl_FragColor = vec4(uOutlineColor, 1.0);

} // end main