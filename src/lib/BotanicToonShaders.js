/*
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

import * as THREE from 'three';

// Does not behave
var CustomOutlineShader = {
    uniforms: {
        "linewidth":  { type: "f", value: 0.3 },
    },

    vertexShader: [
      "precision highp float;",
      "precision highp int;",

  //    "attribute vec2 uv;",
      "attribute vec2 uv2;",

//      "varying vec3 vPosition;",
//      "varying vec3 vNormal;",
      "varying vec2 vUv;",
//      "varying vec2 vUv2;",

      "void main() {",
//      "  vNormal = normal;",
      "  vUv = uv;",
//      "  vUv2 = uv2;",
//      "  vPosition = position;",

      "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"

//        "uniform float linewidth;",
//        "void mainNO() {",
//            "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
//            "vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;",
//            "gl_Position = projectionMatrix * displacement;",
//        "}"
    ].join("\n"),

    fragmentShader: [
      "precision highp float;",
      "precision highp int;",

      "varying vec2 vUv;",
      "void main() {",
      "    float x = 1.0 - sin(vUv.x * 6.2831853 * 0.5);",
      "    float y = 1.0 - sin(vUv.y * 6.2831853 * 0.5);",

      "    x = pow(x, 20.0);",
      "    y = pow(y, 20.0);",

      "    x *= 4.0;", // Strength
      "    y *= 4.0;", // Strength

      "    float val = mix(x, y, 0.5);",

      "    gl_FragColor = vec4(val, val, val, 1.0);",
      "}"

//        "void mainNO() {",
//            "gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );",
//        "}"
    ].join("\n")
};


 var CustomGrayScaleShader = {
    uniforms: {
        "tDiffuse": {type: "t", value: null},
        "rPower": {type: "f", value: 0.2126},
        "gPower": {type: "f", value: 0.7152},
        "bPower": {type: "f", value: 0.0722}
    },

    // 0.2126 R + 0.7152 G + 0.0722 B
    // vertexshader is always the same for postprocessing steps
    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"

    ].join("\n"),

    fragmentShader: [
        // pass in our custom uniforms
        "uniform float rPower;",
        "uniform float gPower;",
        "uniform float bPower;",

        // pass in the image/texture we'll be modifying
        "uniform sampler2D tDiffuse;",

        // used to determine the correct texel we're working on
        "varying vec2 vUv;",

        // executed, in parallel, for each pixel
        "void main() {",

        // get the pixel from the texture we're working with (called a texel)
        "vec4 texel = texture2D( tDiffuse, vUv );",

        // calculate the new color
        "float gray = texel.r*rPower + texel.g*gPower + texel.b*bPower;",

        // return this new color
        "gl_FragColor = vec4( vec3(gray), texel.w );",

        "}"

    ].join("\n")

};

var CustomBitShader = {
    uniforms: {
        "tDiffuse": {type: "t", value: null},
        "bitSize": {type: "i", value: 4}
    },

    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform int bitSize;",
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",

        "void main() {",
        "vec4 texel = texture2D( tDiffuse, vUv );",
        "float n = float(bitSize);", //pow(float(bitSize),2.0);",
        "float newR = floor(texel.r*n)/n;",
        "float newG = floor(texel.g*n)/n;",
        "float newB = floor(texel.b*n)/n;",
        "gl_FragColor = vec4( vec3(newR, newG, newB), 1.0);",
        "}"

    ].join("\n")
};


var CustomPhongDiffuse = {
	uniforms: {
		"uDirLightPos":	{ type: "v3", value: new THREE.Vector3() },
		"uDirLightColor": { type: "c", value: new THREE.Color( 0xffffff ) },

		"uMaterialColor":  { type: "c", value: new THREE.Color( 0xffffff ) },

		uKd: {
			type: "f",
			value: 0.7
		},
		uBorder: {
			type: "f",
			value: 0.4
		}
	},

	vertexShader: [
		"varying vec3 vNormal;",
		"varying vec3 vViewPosition;",

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"vNormal = normalize( normalMatrix * normal );",
			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vViewPosition = -mvPosition.xyz;",

		"}"

	].join("\n"),

	fragmentShader: [
		"uniform vec3 uMaterialColor;",

		"uniform vec3 uDirLightPos;",
		"uniform vec3 uDirLightColor;",

		"uniform float uKd;",
		"uniform float uBorder;",

		"varying vec3 vNormal;",
		"varying vec3 vViewPosition;",

		"void main() {",

			// compute direction to light
			"vec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );",
			"vec3 lVector = normalize( lDirection.xyz );",

			// diffuse: N * L. Normal must be normalized, since it's interpolated.
			"vec3 normal = normalize( vNormal );",
			//was: "float diffuse = max( dot( normal, lVector ), 0.0);",
			// solution
			"float diffuse = dot( normal, lVector );",
			"if ( diffuse > 0.6 ) { diffuse = 1.0; }",
			"else if ( diffuse > -0.2 ) { diffuse = 0.7; }",
			"else { diffuse = 0.3; }",

			"gl_FragColor = vec4( uKd * uMaterialColor * uDirLightColor * diffuse, 1.0 );",

		"}"

	].join("\n")
};


const VERTEX = `
    varying vec2 vUv;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
`;

const FRAGMENT = `
    uniform sampler2D tDiffuse;
    uniform sampler2D tShadow;
    uniform vec2 iResolution;
    varying vec2 vUv;
    #define Sensitivity (vec2(0.3, 1.5) * iResolution.y / 400.0)
    float checkSame(vec4 center, vec4 samplef)
    {
        vec2 centerNormal = center.xy;
        float centerDepth = center.z;
        vec2 sampleNormal = samplef.xy;
        float sampleDepth = samplef.z;
        vec2 diffNormal = abs(centerNormal - sampleNormal) * Sensitivity.x;
        bool isSameNormal = (diffNormal.x + diffNormal.y) < 0.1;
        float diffDepth = abs(centerDepth - sampleDepth) * Sensitivity.y;
        bool isSameDepth = diffDepth < 0.1;
        return (isSameNormal && isSameDepth) ? 1.0 : 0.0;
    }
    void main( )
    {
        vec4 sample0 = texture2D(tDiffuse, vUv);
        vec4 sample1 = texture2D(tDiffuse, vUv + (vec2(1.0, 1.0) / iResolution.xy));
        vec4 sample2 = texture2D(tDiffuse, vUv + (vec2(-1.0, -1.0) / iResolution.xy));
        vec4 sample3 = texture2D(tDiffuse, vUv + (vec2(-1.0, 1.0) / iResolution.xy));
        vec4 sample4 = texture2D(tDiffuse, vUv + (vec2(1.0, -1.0) / iResolution.xy));
        float edge = checkSame(sample1, sample2) * checkSame(sample3, sample4);
        // gl_FragColor = vec4(edge, sample0.w, 1.0, 1.0);
        float shadow = texture2D(tShadow, vUv).x;
        gl_FragColor = vec4(edge, shadow, 1.0, 1.0);
    }
`;


const resolution = new THREE.Vector2(window.inAvatar.container.width(), window.inAvatar.container.height());

const CustomDrawShader = {
    uniforms: {
        tDiffuse: { type: 't', value: null },
        tShadow: { type: 't', value: null },
        iResolution: { type: 'v2', value: resolution },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
};

const FRAGMENT_FINAL = `
uniform sampler2D tDiffuse;
uniform sampler2D tNoise;
uniform float iTime;
varying vec2 vUv;
#define EdgeColor vec4(0.2, 0.2, 0.15, 1.0)
#define BackgroundColor vec4(1,0.95,0.85,1)
#define NoiseAmount 0.01
#define ErrorPeriod 30.0
#define ErrorRange 0.003
// Reference: https://www.shadertoy.com/view/MsSGD1
float triangle(float x)
{
    return abs(1.0 - mod(abs(x), 2.0)) * 2.0 - 1.0;
}
float rand(float x)
{
    return fract(sin(x) * 43758.5453);
}
void main()
{
    float time = floor(iTime * 16.0) / 16.0;
    vec2 uv = vUv;
    uv += vec2(triangle(uv.y * rand(time) * 1.0) * rand(time * 1.9) * 0.005,
            triangle(uv.x * rand(time * 3.4) * 1.0) * rand(time * 2.1) * 0.005);
    float noise = (texture2D(tNoise, uv * 0.5).r - 0.5) * NoiseAmount;
    vec2 uvs[3];
    uvs[0] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 0.0) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 0.0) + noise);
    uvs[1] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 1.047) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 3.142) + noise);
    uvs[2] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 2.094) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 1.571) + noise);
    float edge = texture2D(tDiffuse, uvs[0]).r * texture2D(tDiffuse, uvs[1]).r * texture2D(tDiffuse, uvs[2]).r;
    float diffuse = texture2D(tDiffuse, uv).g;
    float w = fwidth(diffuse) * 2.0;
    vec4 mCol = mix(BackgroundColor * 0.5, BackgroundColor, mix(0.0, 1.0, smoothstep(-w, w, diffuse - 0.3)));
    gl_FragColor = mix(EdgeColor, mCol, edge);
}
`;


const CustomFinalDrawShader = {
    uniforms: {
        tDiffuse: { type: 't', value: null},
        iTime: { type: 'f', value: 0.0},
        tNoise: { type: 't', value: new THREE.TextureLoader().load('./avatar/images/noise.png')}
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT_FINAL
};


var OutlineShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'tSize':    { value: new THREE.Vector2( 1024, 1024 ) },
		'center':   { value: new THREE.Vector2( 0.5, 0.5 ) },
		'scale':    { value: 1.3 },
		'angle':    { value: 20. },
	},

	vertexShader: [
		'varying vec2 vUv;',
		'void main() {',
			'vUv = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'
	].join( '\n' ),

	fragmentShader: [
		'uniform sampler2D tDiffuse;',
		'uniform vec2 tSize;',
		"varying vec2 vUv;",
		"uniform vec2 center;",
		"uniform float scale;",
		"uniform float angle;",

		"float pattern(float c) {",
			"float a = sin( angle + c ), b = cos( angle - c );",
			"vec2 tex = vUv * tSize - center;",
			"vec2 point = vec2( b * tex.x - a * tex.y, a * tex.x + b * tex.y ) * scale;",
			'float d = max(point.x, point.y);',

			"return sin((point.x + c + point.y) * (1./c));",
		"}",

		'void main(){',
			'vec4 mainPixel = texture2D(tDiffuse, vUv);',
			'vec4 up = texture2D(tDiffuse, vec2(vUv.x - .002, vUv.y - .002));',
			'vec4 left = texture2D(tDiffuse, vec2(vUv.x - .002, vUv.y));',
			'vec4 diagonal = texture2D(tDiffuse, vec2(vUv.x - .002, vUv.y - .002));',

			'vec3 d1 = abs(vec3(mainPixel - up));',
			'vec3 d2 = abs(vec3(mainPixel - left));',
			'vec3 d3 = abs(vec3(mainPixel - diagonal));',

			'float m = max(max(d2.y, d2.z), max(max(d1.x, d1.y), max(d1.z, d2.x)));',

			'm = 1. - clamp(clamp((m * 9.) - 1., 0., 1.) * 1., 0.0, 1.0);',

			'gl_FragColor = vec4(m, m, m, 1.);',
		'}',
	].join( '\n' )
};


//Fiddle g593q, et al
var FiddleOutlineShader = {
    uniforms: {
        "offset":  { type: "f", value: 1.5 },
    },
    vertexShader: [
      "uniform float offset;",
            "void main() {",
                "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
                "gl_Position = projectionMatrix * pos;",
            "}"
    ].join("\n"),

    fragmentShader: [
        "void main() {",
            "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );",
        "}"
    ].join("\n")
};


export { CustomOutlineShader, CustomGrayScaleShader, CustomBitShader, CustomPhongDiffuse, CustomDrawShader, 
    CustomFinalDrawShader, OutlineShader, FiddleOutlineShader};
