//Shader instances
function SimpleShader() {
    var SimpleShader_id = "simpleShader";
    this.id = Shader.createShader(SimpleShader_id);
    this.uniforms = {};
    this.attributes = {};
    this.uniforms.lightPosition = vec3.fromValues(4.5, 4.5, -4.5);
    this.uniforms.lightAmbient = vec3.fromValues(1, 1, 1);
    this.uniforms.lightDiffuse = vec3.fromValues(1, 1, 1);
    this.uniforms.lightSpecular = vec3.fromValues(1, 1, 1);
    this.uniforms.ambient = vec3.fromValues(0.1, 0.25, 0.1);
    this.uniforms.diffuse = vec3.fromValues(0, 0.8, 0);
    this.uniforms.specular = vec3.fromValues(0.3, 0.3, 0.3);
    this.uniforms.shininess = 128.0;
}

SimpleShader.prototype.locateAttributes = function() {
    gl.useProgram(this.id);
    this.attributes.vertices = gl.getAttribLocation(this.id, 'aVertexPosition');
    this.attributes.normals = gl.getAttribLocation(this.id, 'aVertexNormal');
    this.attributes.mMatrix = gl.getUniformLocation(this.id, "umMatrix");
    this.attributes.pvmMatrix = gl.getUniformLocation(this.id, "upvmMatrix");
    gl.useProgram(null);
};

SimpleShader.prototype.setUniforms = function() {
    gl.useProgram(this.id);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uEyePosition"), this.uniforms.eye);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightAmbient"), this.uniforms.lightAmbient);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightDiffuse"), this.uniforms.lightDiffuse);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightSpecular"), this.uniforms.lightSpecular);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightPosition"), this.uniforms.lightPosition);

    gl.uniform3fv(gl.getUniformLocation(this.id, "uAmbient"), this.uniforms.ambient);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uDiffuse"), this.uniforms.diffuse);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uSpecular"), this.uniforms.specular);
    gl.uniform1f(gl.getUniformLocation(this.id, "uShininess"), this.uniforms.shininess);

    gl.useProgram(null);
};

SimpleShader.prototype.bind = function() {
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.id);

    gl.enableVertexAttribArray(this.attributes.vertices);
    gl.enableVertexAttribArray(this.attributes.normals);
};

SimpleShader.prototype.unbind = function() {
    gl.disable(gl.DEPTH_TEST);

    gl.disableVertexAttribArray(this.attributes.vertices);
    gl.disableVertexAttribArray(this.attributes.normals);

    gl.useProgram(null);
};
