/*jshint esversion: 6 */

/*
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

import * as THREE from 'three';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
var FiddleOutlineShader, CustomBitShader, CustomGrayScaleShader, CustomOutlineShader, OutlineShader, CustomDrawShader //Custom Botanic shaders will be loaded later
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

import * as dat from 'dat.gui';

import './assets/css/avatar.css';


const Config = {
  also_known_as                  : "",
  all_your_bases_are_belong_to_us: "",
  bbot_base_uri                  : "",
  author_tool_domain             : "",
  bbotId                         : ""
};



export class HadronAvatar {
  constructor(self, options) {
    options = typeof(options) !== "undefined" ? options : {};

	  this.name = self;
    this.container = false;
    this.renderer = false;
    this.scene = false;
    this.controls = false;
    this.defaultCamera = false;
    this.threeJSPresent = false;

    this.fps = 15

    this.groundPlanePosition = 0;
    this.groundPlaneImage = "grass.png";
    this.showGroundPlane = true;

    this.useCubeMap = false;
    this.cubeName = 'skybox';
    this.cubeExtension = 'jpg';

    this.glitch = false;

    this.sid = false;

    this.isRandomCamera = false;

    this.useOutlineEffect = false;

    this.useFiddleShader = false;

    this.mouthAnimationList = [];
    this.mouthFormat = 'actr1';

    this.meshes = {}

    this.mixer = false;
    this.effect = false;
    this.prevTime = 0;
    this.state = {actionStates: {}};

    this.rendererIsStable = false;

    this.useShadows       = true;

    this.copyCamera = true;

    this.showStats = false;
    this.stats = false;

    this.usePointLight = true;
    this.useRectLight = false;

    this.loaderTarget = "bsTest_RIG_shaders02.glb";
    this.loaderTargetFormat = "glb";
    this.loaderTargetAnimation = "";

    this.mouthStyle = 'toon';

    this.options = {
      ambientColor: '#9b3131',
      ambientIntensity: 0.1,

      directionalColor: '#ffffff',
      directionalIntensity: 0.13,

      pointColorLeft: '#ff0000',
      pointIntensityLeft: 0.13,

      pointColorRight: '#0000ff',
      pointIntensityRight: 0.13,

      skyColor: '#bbbbff',
      groundColor: '#ffff00',

      useGrayScale: false,
      useToonMaterial: true,
      useBits: true,
      stepSize: 3.0,

      useGlitch: false,
      useVignette: true,
      useEnvMap: false,

      useOutline: false,
      edgeStrength: 10.0,
      edgeGlow: 0.0,
      edgeThickness: 1.0,
      pulsePeriod: 0,
      visibleEdgeColor: '#ffffff',
      hiddenEdgeColor: '#190a05',
      usePatternTexture: false,

      useSepia: true,
      sepiaAmount: 0.9,

      useHalftone: false,

      playbackSpeed: 1.0,

      effectiveTimeScale: 0.25,
      fadeDuration: 2.0,
      durationScale: 1.0,

      speechDelay: 0,

      zeroSlopeAtBegin: false,
      zeroSlopeAtEnd: false,

      crossFadeEnabled: true,

      stop: function() {
      },

      reset: function() {
        // Set back to the defaults ^^^
      }
    };
  }


  getRenderState() {
    var msg = [];
    msg.push('Avatar Settings');
    msg.push('ThreeJS Loaded: ' + inControl.boolToString(this.threeJSPresent));
    msg.push('Use groundplane: ' + inControl.boolToString(this.showGroundPlane));
    msg.push('Use cubemap: ' + inControl.boolToString(this.useCubeMap));
    msg.push('Use outline: ' + inControl.boolToString(this.useOutlineEffect));
    msg.push('Use toon material: ' + inControl.boolToString(this.useToonMaterial));

    return msg;
  }


  // Load threejs, showing progress
  // Show media View
  startAvatar(avatarDefinition) {
    this.rendererIsStable = false;

    this.groundPlanePosition = avatarDefinition.groundPlanePosition; // | this.groundPlanePosition;
    this.groundPlaneImage = avatarDefinition.groundPlaneImage; // | this.groundPlaneImage;
    this.showGroundPlane = avatarDefinition.showGroundPlane; // | this.showGroundPlane;

    this.useCubeMap = avatarDefinition.useCubeMap; // | this.showCube;
    this.cubeName = avatarDefinition.cubeName; // | this.cubeName;
    this.cubeExtension = avatarDefinition.cubeExtension; // | this.cubeExtension;

    this.loaderTarget = avatarDefinition.loaderTarget; // | this.loaderTarget;
    this.loaderTargetFormat = avatarDefinition.loaderTargetFormat; // | this.loaderTargetFormat;
    this.loaderTargetAnimation = avatarDefinition.loaderTargetAnimation; // | this.loaderTargetAnimation;

    this.options.stepSize = avatarDefinition.stepSize || 3;
    this.initialAnimation = avatarDefinition.initialAnimation || false;
    this.acknowledgeAnimation = avatarDefinition.acknowledgeAnimation || false;

    this.avatarAnimations = avatarDefinition.avatarAnimations || []

    this.avatarDefaultCameraPositionX = avatarDefinition.defaultCameraPositionX
    this.avatarDefaultCameraPositionY = avatarDefinition.defaultCameraPositionY
    this.avatarDefaultCameraPositionZ = avatarDefinition.defaultCameraPositionZ
      
    
    this.acknowledgeAnimationAction = false;
    this.initialAnimationAction = false;

    this.envMap = false;

    this.renderAs = avatarDefinition.renderAs;

    this.backfaceMaterial = avatarDefinition.backfaceMaterial;
    this.showWireframe = avatarDefinition.showWireframe;

    //inControl.consoleLog(avatarDefinition);
    //inControl.consoleLog(window.inAvatar);

    if (inControl.mediaViewEnabled == true) {
      this.stopAvatar();
    }

    this.container = inControl.mediaView(true);

    import('./lib/BotanicToonShaders.js').then((m) => {//we need to load dynamically here because CustomDrawShader needs this.container to get some size values
      FiddleOutlineShader = m.FiddleOutlineShader
      CustomBitShader = m.CustomBitShader
      CustomGrayScaleShader = m.CustomGrayScaleShader
      CustomOutlineShader = m.CustomOutlineShader
      OutlineShader = m.OutlineShader
      CustomDrawShader = m.CustomDrawShader
    })

    if (this.threeJSPresent == false) {
      this.sid = $('<section>', {id: 'loading-screen'});
      var slid = $('<div>', {id: 'loader'});

      this.sid.append(slid);

      $('.quark-media-overlay').append(this.sid);
      
      this.startAvatar2();
      
    } else {
      this.startAvatar2();
    }
  }


  // Creates the base renderer object
  createRenderer() {
    // Create the renderer and set some defaults.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.alpha = true;
    this.renderer.autoClear = false;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.sortObjects = true;

    this.renderer.toneMappingExposure = 2; // 1.2;
    this.renderer.toneMappingWhitePoint = 3; //1.0;

    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(this.container.width(), this.container.height());

    this.container.append(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);

    $(window).resize(() => {
      this.defaultCamera.aspect = this.container.width() / this.container.height();
      this.defaultCamera.updateProjectionMatrix();

      if (this.effectFXAA) {
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.container.width(), 1 / this.container.height());
      }

      this.renderer.setSize(this.container.width(), this.container.height());
      this.composer.setSize(this.container.width(), this.container.height());
    });
  }


  // Create the Camera
  createCamera() {
    // Camera
    var fov = 0.8 * 180 / Math.PI;
    this.defaultCamera = new THREE.PerspectiveCamera(fov, this.container.width() / this.container.height(), 0.5, 1000);
    this.scene.add( this.defaultCamera );
  }


  // Create the lighting
  createLighting() {
    this.light1 = new THREE.AmbientLight( 0x9b3131, this.options.ambientIntensity );
    this.light1.name = 'ambient_light';
    this.scene.add( this.light1 );

    this.light2 = new THREE.DirectionalLight( 0xffffff, this.options.directionalIntensity );
    this.light2.position.set(this.maxSize * 0.25, 0.5 * this.maxSize, this.maxSize);
    this.light2.name = 'main_light';
    this.scene.add( this.light2 );


    if (this.usePointLight) {
      this.light2l = new THREE.PointLight( this.options.pointColorLeft, this.options.pointIntensityLeft, this.maxSize * 0.5);
      this.light2l.position.set(this.maxSize * -0.15, this.maxSize * 0.33, 0 /* this.maxSize * 0.25 */);
      this.light2l.name = 'main_light_left';
      this.scene.add( this.light2l );


      this.light2r = new THREE.PointLight( this.options.pointColorRight, this.options.pointIntensityRight, this.maxSize * 0.5);
      this.light2r.position.set(this.maxSize * 0.15, this.maxSize * 0.33, 0 /* this.maxSize * 0.25 */);
      this.light2r.name = 'main_light_right';
      this.scene.add( this.light2r );
    }


    if (this.useRectLight) {
      var width = 20;
      var height = 20;

      this.light2l = new THREE.RectAreaLight( this.options.pointColorLeft, this.options.pointIntensityLeft, width, height);
      this.light2l.position.set(this.maxSize * -1.0, this.maxSize * 0.33, 0);
      this.light2l.lookAt( 0, 0, 0 );
      this.light2l.name = 'main_light_left';
      this.scene.add( this.light2l );


      this.light2r = new THREE.RectAreaLight( this.options.pointColorRight, this.options.pointIntensityRight, width, height);
      this.light2r.position.set(this.maxSize * 1.0, this.maxSize * 0.33, 0);
      this.light2r.name = 'main_light_right';
      this.light2r.lookAt( 0, 0, 0 );
      this.scene.add( this.light2r );
    }


    if (false) {
      var sphereSize = this.maxSize * 0.1;
      var pointLightHelperL = new THREE.PointLightHelper( this.light2l, sphereSize );
      this.scene.add( pointLightHelperL );

      var pointLightHelperR = new THREE.PointLightHelper( this.light2r, sphereSize );
      this.scene.add( pointLightHelperR );
    }

    this.light3 = new THREE.HemisphereLight( 0xbbbbff, 0xffff00 );
	this.light3.position.set( 0.0, this.maxSize, this.maxSize );
	this.scene.add( this.light3 );
  }


  // Create the scene
  createScene() {
    this.scene = new THREE.Scene();
  }


  // Create the cubemap
  createCubemap() {
    if (this.useCubeMap) {
      var path = Config.all_your_bases_are_belong_to_us + 'avatar/cube/' + this.cubeName + '/';
        var format = '.' + this.cubeExtension;
        this.envMap = new THREE.CubeTextureLoader().load( [
          path + 'px' + format, path + 'nx' + format,
          path + 'py' + format, path + 'ny' + format,
          path + 'pz' + format, path + 'nz' + format
        ] );
        this.scene.background = this.envMap;
    } else {
      this.scene.background = new THREE.Color( 0xFFFFFF );
    }
  }


  // Create the orbital controls
  createControls() {
    this.controls = new OrbitControls(this.defaultCamera, this.container[0] /* this.renderer.domElement */);

    this.controls.screenSpacePanning = true;
  }


  // Create a groundpane
  createGroundplane() {
    // Add the ground here so we can access the location of the object
    if (this.showGroundPlane == true) {
      var grassTex = THREE.ImageUtils.loadTexture(Config.all_your_bases_are_belong_to_us + 'avatar/images/' + this.groundPlaneImage);
      grassTex.wrapS = THREE.RepeatWrapping;
      grassTex.wrapT = THREE.RepeatWrapping;
      grassTex.repeat.x = 256;
      grassTex.repeat.y = 256;
      var groundMat = new THREE.MeshBasicMaterial({map:grassTex});

      var groundGeo = new THREE.PlaneGeometry(400,400);

      var ground = new THREE.Mesh(groundGeo,groundMat);
      ground.position.y = -1.9; //lower it
      ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
      //IMPORTANT, draw on both sides
      ground.doubleSided = true;

      this.scene.add(ground);
    }
  }


  createTextPanel() {
    if (inControl.use3DTextPanel == true) {
      this.textPanel = $('<div>', {class: 'hadronAvatarTextPanel'});
      this.textPanelContent = $('<div>', {class: 'hadronAvatarTextPanelContent'});

      this.textPanel.append(this.textPanelContent);

      $(this.container).append(this.textPanel);
    }
  }


  createGUI() {
    
    var gui = new dat.GUI( { autoPlace: false } );

    var animTuningFolder = gui.addFolder('Animation Tuning');
    animTuningFolder.add(this.options, 'effectiveTimeScale', 0.0, 5.0).onChange((e) => {
      this.options.effectiveTimeScale = e;
    });

    animTuningFolder.add(this.options, 'fadeDuration', 0.0, 4.0).onChange((e) => {
      this.options.fadeDuration = e;
    });

    animTuningFolder.add(this.options, 'durationScale', 0.0, 5.0).step(0.05).onChange((e) => {
      this.options.durationScale = e;
    });

    animTuningFolder.add(this.options, 'crossFadeEnabled').onChange((e) => {
      this.options.crossFadeEnabled = e;
    });

    animTuningFolder.add(this.options, 'zeroSlopeAtBegin').onChange((e) => {
      this.options.zeroSlopeAtBegin = e;
    });

    animTuningFolder.add(this.options, 'zeroSlopeAtEnd').onChange((e) => {
      this.options.zeroSlopeAtEnd = e;
    });

    animTuningFolder.add(this.options, 'speechDelay', 0, 600).step(5).onChange((e) => {
      this.options.speechDelay = e;
    });

    this.animFolder = gui.addFolder('Animation');
    const playbackSpeedCtrl = this.animFolder.add(this.options, 'playbackSpeed', 0, 1);

    playbackSpeedCtrl.onChange((speed) => {
      if (this.mixer) {
        this.mixer.timeScale = speed;
      }
    });

    this.animFolder.add({playAll: () => this.playAllClips()}, 'playAll');

    var sceneSettingsOptions = gui.addFolder('Scene Settings');
    sceneSettingsOptions.add(this.options, 'useGlitch').onChange((e) => {
      this.glitchPass.enabled = e;
    });

    sceneSettingsOptions.add(this.options, 'useVignette').onChange((e) => {
      this.vignettePass.enabled = e;
    });

    var toonshadeOptions = gui.addFolder('Toon Settings');

    toonshadeOptions.add(this.options, 'useGrayScale').onChange((e) => {
      this.grayScalePass.enabled = e;
    });

    toonshadeOptions.add(this.options, 'useBits').onChange((e) => {
      this.bitPass.enabled = e;
    });

    toonshadeOptions.add(this.options, 'stepSize', 2.0, 25.0).step(1.0).onChange((e) => {
      this.bitPass.uniforms.bitSize.value = (e * 1.0);
    });

    toonshadeOptions.add(this.options, 'useSepia').onChange((e) => {
      this.sepiaPass.enabled = e;
    });

    toonshadeOptions.add(this.options, "sepiaAmount", 0.50, 1.6).step(0.05).onChange((e) => {
      this.sepiaPass.uniforms.amount.value = e;
    });

    toonshadeOptions.add(this.options, 'useHalftone').onChange((e) => {
      this.halftonePass.enabled = e;
    });

    if (this.outlinePass) {
      var outlineOptions = gui.addFolder('Outline Settings');
      outlineOptions.add(this.options, 'useOutline').onChange((e) => {
        this.useOutlineEffect = e;

        if (this.useOutlineEffect) {
          this.outlinePass.selectedObjects = this.outlineTargets;
        } else {
          this.outlinePass.selectedObjects = false;
        }
      });

      outlineOptions.add( this.options, 'edgeStrength', 0.01, 10 ).onChange((value) => {
        this.outlinePass.edgeStrength = Number( value );
      } );

      outlineOptions.add( this.options, 'edgeGlow', 0.0, 3.0 ).onChange((value) => {
        this.outlinePass.edgeGlow = Number( value );
      } );

      outlineOptions.add( this.options, 'edgeThickness', 1, 4 ).onChange((value) => {
        this.outlinePass.edgeThickness = Number( value );
      } );

      outlineOptions.add( this.options, 'pulsePeriod', 0.0, 5 ).onChange((value) => {
        this.outlinePass.pulsePeriod = Number( value );
      } );

      outlineOptions.addColor( this.options, 'visibleEdgeColor' ).onChange((value) =>  {
        this.outlinePass.visibleEdgeColor.set( value );
      } );

      outlineOptions.addColor( this.options, 'hiddenEdgeColor' ).onChange((value) =>  {
        this.outlinePass.hiddenEdgeColor.set( value );
      } );

      outlineOptions.add( this.options, 'usePatternTexture' ).onChange((value) => {
        this.outlinePass.usePatternTexture = value;
      } );
    }

    var amLight = gui.addFolder('Ambient Light');
    amLight.addColor(this.options, 'ambientColor').onChange((e) => {
      this.light1.color = new THREE.Color(e);
    });

    amLight.add(this.options, 'ambientIntensity', 0, 1).onChange((e) => {
      this.light1.intensity = e;
    });

    var dirLight = gui.addFolder('Directional Light');
    dirLight.addColor(this.options, 'directionalColor').onChange((e) => {
      this.light2.color = new THREE.Color(e);
    });

    dirLight.add(this.options, 'directionalIntensity', 0, 1).onChange((e) => {
      this.light2.intensity = e;
    });


    if (this.usePointLight || this.useRectLight) {
      var pointLight;

      if (this.usePointLight) {
        pointLight = gui.addFolder('Point Light');
      }

      if (this.useRectLight) {
        pointLight = gui.addFolder('Rect Light');
      }

      pointLight.addColor(this.options, 'pointColorLeft').onChange((e) => {
        this.light2.color = new THREE.Color(e);
      });

      pointLight.add(this.options, 'pointIntensityLeft', 0, 1).onChange((e) => {
        this.light2l.intensity = e;
      });

      pointLight.addColor(this.options, 'pointColorRight').onChange((e) => {
        this.light2.color = new THREE.Color(e);
      });

      pointLight.add(this.options, 'pointIntensityRight', 0, 1).onChange((e) => {
        this.light2r.intensity = e;
      });
    }

    var hemiLight = gui.addFolder('Hemisphere Light');
    hemiLight.addColor(this.options, 'skyColor').onChange((e) => {
      this.light3.skyColor = new THREE.Color(e);
    });

    hemiLight.addColor(this.options, 'groundColor').onChange((e) => {
      this.light3.groundColor = new THREE.Color(e);
    });


    var cam = gui.addFolder('Camera');
    cam.add(this.defaultCamera.position, 'x', 0, this.maxSize).listen();
    cam.add(this.defaultCamera.position, 'y', 0, this.maxSize).listen();
    cam.add(this.defaultCamera.position, 'z', 0, this.maxSize).listen();

    gui.close();
    
    var guiInner = $('<div>', {id: 'guiInner'});
    var guiOuter = $('<div>', {id: 'guiOuter'});
    if (!inControl.use3DGUIConfig) {
      $(guiOuter).hide();
    }

    guiInner.append(gui.domElement);
    guiOuter.append(guiInner);
    $(this.container).append(guiOuter);
  
  }


  // Create the stats option.
  createStats() {
    if (this.showStats) {
      this.stats = new Stats();
      this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.container.append( this.stats.dom );
    }
  }


  // Improve the scene, camera, etc now that we have the model.
  setViewForModel(model) {
    model.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    this.controls.maxDistance = size * 10;

    this.maxSize = size;

    if (this.cameraOveridden == false) {
      model.position.x += (model.position.x - center.x);
      model.position.y += (model.position.y - center.y);
      model.position.z += (model.position.z - center.z);

      this.controls.reset();

      this.defaultCamera.updateProjectionMatrix();

      this.defaultCamera.near = size / 100;
      this.defaultCamera.far = size * 100;

      this.defaultCamera.position.copy(center);
      this.defaultCamera.position.x += size / 2.0;
      this.defaultCamera.position.y += size / 5.0;
      this.defaultCamera.position.z += size * 2.0;

      this.defaultCamera.lookAt(center);
    } else {
      model.position.x = (model.position.x - center.x);
      model.position.y = (model.position.y - center.y);
      model.position.z = (model.position.z - center.z);

      this.defaultCamera.position.x = 0;
      this.defaultCamera.position.y = 0;
    }
  }


  // Play all animation clips
  playAllClips() {
    if (this.clips && this.clips.length) {
      this.clips.forEach((clip) => {
        this.state.actionStates[clip.name] = true;
        var action = this.mixer.clipAction(clip);
        action.setEffectiveTimeScale(1);
        action.reset();
        console.log("playing clip: " + clip.name);
        action.play();
      });
    }
  }

  initialSettings() {
    if (this.renderAs == 'toon') {
      this.options.useEnvMap = true;
      this.options.useToonMaterial  = true;
      this.options.useVignette = true;
      this.options.useBits = true;
      this.options.useSepia = true;
      this.options.useOutline = false;

      this.options.directionalIntensity = 0.13;
      this.options.ambientIntensity = 0.1;
      this.options.ambientColor = '#9b3131';

//      this.renderer.toneMappingExposure = 2;
//      this.renderer.toneMappingWhitePoint = 3;
      this.renderer.toneMappingExposure = 2.0;
      this.renderer.toneMappingWhitePoint = 3.0;
    } else if (this.renderAs == 'pbr') {
      this.options.useEnvMap = true;
      this.options.useToonMaterial  = false;
      this.options.useVignette = false;
      this.options.useBits = false;
      this.options.useSepia = false;
      this.options.useOutline = false;

      this.options.directionalIntensity = 1.0;
      this.options.ambientIntensity = 0.1;
      this.options.ambientColor = '#ffffff';

      this.renderer.toneMappingExposure = 1.2;
      this.renderer.toneMappingWhitePoint = 1.0;
    } else if (this.renderAs == 'soft') {
      this.options.useEnvMap = false;
      this.options.useToonMaterial  = true;
      this.options.useVignette = false;
      this.options.useBits = false;
      this.options.useSepia = false;
      this.options.useOutline = false;

      this.options.directionalIntensity = 0.13;
      this.options.ambientIntensity = 0.1;
      this.options.ambientColor = '#444444';

      this.renderer.toneMappingExposure = 1.2;
      this.renderer.toneMappingWhitePoint = 1.0;
    } else {
      console.log('missing renderAs');
    }
  }


  // By now, ThreeJS is loaded, time to make a viewport.
  // Turn into a viewport
  // load some avatar.
  // pass path to a remote resource to override the default avatar
  startAvatar2() {
    if (!this.isWebGLAvailable()) {      
      inControl.showToast('WebGL not supported!');
    }

    // This feels like a config var but can't be since THREE isn't loaded when the config is created.  Must be here.
    if (this.backfaceMaterial == "THREE.DoubleSide") {
      this.backfaceMaterial = THREE.DoubleSide;
    } else {
      this.backfaceMaterial = THREE.FrontSide;
    }

    this.clock = new THREE.Clock();

    this.createRenderer();

    this.initialSettings();

    // Create the scene
    this.createScene();

    this.cameraOveridden = false;

    if (this.isRandomCamera == false) {
      this.createCamera();
    } else {
      this.createRandomCamera();
    }

    this.createControls();

    // Load the cubemap if Enabled
    this.createCubemap();

    // model loader
    var manager = new THREE.LoadingManager();

		manager.onProgress = function (item, loaded, total) {
			inControl.consoleLog(item, loaded, total);
		};

    var loader;

    if (this.loaderTargetFormat == "glb") {
		  loader = new GLTFLoader();
    } else {
      loader = new FBXLoader();
    }

    loader.setCrossOrigin('');

    // test for https, if not we build a local link like always.
    var fullPathToTargetModel = Config.all_your_bases_are_belong_to_us + "assets/avatars/" + this.loaderTarget;

    if (this.loaderTarget.includes('https:') || this.loaderTarget.includes('http:')) {
      fullPathToTargetModel = this.loaderTarget;
    }

		loader.load(fullPathToTargetModel, (object) => {console.log(object)
      if (this.loaderTargetFormat == "glb") {
        this.model = object.scene || object.scenes[0];
      } else {
        this.model = object;
      }

      this.clips = object.animations || [];

      var beta = 0.0;
      var specularColor = new THREE.Color( beta * 0.2, beta * 0.2, beta * 0.2 );

      var alpha = 0.0;
      var specularShininess = Math.pow( 2, alpha * 10 );

      this.outlineTargets = [];

      this.model.traverse((child) => {
        if (child.isCamera && this.copyCamera == true) {
          console.log("Switched to avatar camera");

          this.cameraOveridden = true;

          this.defaultCamera.copy(child);
          this.defaultCamera.aspect = this.container.width() / this.container.height();

          this.defaultCamera.updateProjectionMatrix();
        }

  		if (child.isMesh) {

          this.meshes[child.name] = child

          child.material.side = this.backfaceMaterial;
          child.material.wireframe = this.showWireframe;
          this.outlineTargets.push(child);

          if (this.options.useToonMaterial == true) {
            child.material.roughness = 1.0;
          } else if (this.renderAs == 'pbr') {
            child.material.roughness = 0.0;
          }


          if (this.useCubeMap && this.options.useEnvMap == true) {
            if (this.envMap) {
              child.material.envMap = this.envMap;
            }
          }

          if (this.useShadows == false) {
  				  child.castShadow = true;
  				  child.receiveShadow = true;
          }
  			}
  		});

      this.scene.add(this.model);

      this.setViewForModel(this.model);

      this.createGroundplane();

      this.createLighting();

      this.createEffects();

      this.createGUI();

      this.createTextPanel();
      this.initialGreeting();

      this.rendererIsStable = true;

      if (inControl.ttsEnabled == false && inControl.ttsVisible == true) {
        inControl.showToast('Please press the speaker icon to allow the avatar to talk');
      }

      // Chain animation loading?
      this.mixer = new THREE.AnimationMixer(this.model);
      this.enumerateAnimations();


      this.setDefaultCameraPosition()

      this.render();
		}, undefined, function (e) {
      inControl.consoleLog(e);
    });

    this.createStats();

    this.animate();
  }

  isWebGLAvailable() {
    try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
            return false;
    }
  }

  setDefaultCameraPosition() {    
    if ( this.avatarDefaultCameraPositionX) {
      this.defaultCamera.position.set(this.avatarDefaultCameraPositionX, this.avatarDefaultCameraPositionY, this.avatarDefaultCameraPositionZ)
    }   
  }

  enumerateAnimations() {
    this.animCtrls = [];
    var al = []

    if (this.clips.length) {
      this.animFolder.domElement.style.display = '';
      const actionStates = this.state.actionStates = {};
      this.clips.forEach((clip, clipIndex) => {al.push(clip.name)
        // Autoplay the first clip.
        let action;
        // This forces auto play of first animation, don't want that so set to -1
        if (this.clips.length == 1 && clipIndex === 0) {
          actionStates[clip.name] = true;
          action = this.mixer.clipAction(clip);
          console.log("playing clip: " + clip.name);
          action.play();
        } else {
          actionStates[clip.name] = false;
        }

        // Play other clips when enabled.
        const ctrl = this.animFolder.add(actionStates, clip.name).listen();
        ctrl.onChange((playAnimation) => {
          action = action || this.mixer.clipAction(clip);
          action.setEffectiveTimeScale(1);
          if (playAnimation) {
            console.log("playing clip: " + clip.name);
            action.play();
          } else {
            action.stop();
          }
        });
        this.animCtrls.push(ctrl);
      });

      //initialize animations    
      this.avatarClipActions = {}
      for (var avatarStateName in this.avatarAnimations) {
        var animationClipNames = this.avatarAnimations[avatarStateName]      
        this.avatarClipActions[avatarStateName] = []
        animationClipNames.forEach((acn) => {
          console.log("animationclipname: " + animationClipNames)    
          console.log("avatarstatename: " + avatarStateName)
          var clip = THREE.AnimationClip.findByName(this.clips, acn);          
          var clipAction = this.mixer.clipAction(clip);
          clipAction.reset();
          clipAction.enabled = true;
          this.avatarClipActions[avatarStateName].push(clipAction)
        })
        
      }

      this.avatarState('neutral')
    }
  }


  createGlitch() {
    this.glitchPass = new GlitchPass();
    this.glitchPass.enabled = this.options.useGlitch;
    this.composer.addPass( this.glitchPass );

    return 1;
  }


  createBitShader() {
    this.grayScalePass = new ShaderPass(CustomGrayScaleShader);
    this.grayScalePass.enabled = false;

    this.composer.addPass(this.grayScalePass);

    this.bitPass = new ShaderPass(CustomBitShader);
    this.bitPass.enabled = this.options.useBits;

    this.bitPass.uniforms.bitSize.value = 3.0;

    this.composer.addPass(this.bitPass);
    return 1;
  }


  createFiddleShader() {
    if (this.useFiddleShader) {
      let outlineMaterial = new THREE.ShaderMaterial({
        uniforms: FiddleOutlineShader.uniforms,
        vertexShader: FiddleOutlineShader.vertexShader,
        fragmentShader: FiddleOutlineShader.fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      let outlineMesh = new THREE.Mesh(this.outlineTargets[0].children[1], outlineMaterial);
      this.scene.add(outlineMesh);
    }
  }


  createOutlinePass() {
    this.outlinePass = new OutlinePass(new THREE.Vector2(this.container.width(), this.container.height()), this.scene, this.defaultCamera);
    this.outlinePass.edgeStrength = 10;
    this.outlinePass.edgeGlow = 0.0;
    this.outlinePass.edgeThickness = 1.0;
    this.outlinePass.visibleEdgeColor.set("#ffffff");
    this.outlinePass.enabled = true;

    if (this.useOutlineEffect) {
      this.outlinePass.selectedObjects = this.outlineTargets;
    }

    this.composer.addPass(this.outlinePass);

    if (this.outlinePass != false) {
      var onLoad = (texture) => {
  			this.outlinePass.patternTexture = texture;
  			texture.wrapS = THREE.RepeatWrapping;
  			texture.wrapT = THREE.RepeatWrapping;
  		};

      var loader = new THREE.TextureLoader();
      loader.load(Config.all_your_bases_are_belong_to_us + 'avatar/textures/tri_pattern.jpg', onLoad );
    }
  }


  createOutlineShader1() {
    this.shaderPass = new ShaderPass(CustomOutlineShader);
    this.shaderPass.enabled = true;

    this.composer.addPass(this.shaderPass);
  }


  createOutlineEffect() {
    this.outlineEffect = new OutlineEffect( this.renderer /* , {defaultThickness: 0.1, defaultColor: new THREE.Color( 0x444444 ), defaultAlpha: 1, defaultKeepAlive: true} */);
    this.outlineEffectPass = new ShaderPass(this.outlineEffect);
    this.composer.addPass(this.outlineEffectPass);
  }


  createOutlineShaderToy() {
    this.drawShader = new ShaderPass(CustomDrawShader);
    this.composer.addPass(this.drawShader);


    this.finalDrawShader = new ShaderPass(CustomFinalDrawShader);
    this.finalDrawShader.material.extensions.derivatives = true;
    this.composer.addPass(this.finalDrawShader);
  }

  // Create outline
  createOutline() {
    this.outlinePass = false;

    this.outlineEffect = new ShaderPass(OutlineShader);
    this.composer.addPass(this.outlineEffect);

    this.copyPass = new ShaderPass(CopyShader);
    this.composer.addPass(this.copyPass);

    return 1;
  }


  createVignette() {
    this.vignettePass = new ShaderPass(VignetteShader);
    this.vignettePass.enabled = this.options.useVignette;

    this.composer.addPass(this.vignettePass);
    return 1;
  }


  createSepia() {
    this.sepiaPass = new ShaderPass(SepiaShader);
    this.sepiaPass.uniforms.amount.value = 0.9;
    this.sepiaPass.enabled = this.options.useSepia;

    this.composer.addPass(this.sepiaPass);
    return 1;
  }


  createHalftone() {
    var params = {
			shape: 1,
			radius: 5,
			rotateR: Math.PI / 12,
			rotateB: Math.PI / 12 * 2,
			rotateG: Math.PI / 12 * 3,
			scatter: 0,
			blending: 1,
			blendingMode: 1,
			greyscale: true,
			disable: false
		};

    this.halftonePass = new HalftonePass( this.container.width(), this.container.height(), params );
    this.halftonePass.enabled = this.options.useHalftone;
	  this.composer.addPass( this.halftonePass );

    return 1;
  }


  createFXAA() {
    this.effectFXAA = new ShaderPass( FXAAShader );
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.container.width(), 1 / this.container.height());
    this.effectFXAA.renderToScreen = true;
    this.effectFXAA.needsSwap = true;
    this.composer.addPass(this.effectFXAA);
  }


  createEffects() {
    this.renderPass = new RenderPass(this.scene, this.defaultCamera);
    this.composer.addPass(this.renderPass);

    this.composer.renderTarget1.stencilBuffer = true;
    this.composer.renderTarget2.stencilBuffer = true;

    var added = 0;

    this.createGlitch();

    this.createBitShader();

    this.createOutlinePass();

    this.createSepia();

    this.createHalftone();

    this.createVignette();

    this.createFXAA();
  }


  createCelShader() {
  }


  

  //returns running clipAnimations 
  getRunningAnimations() {
    let running = []    
    for (var key in this.avatarClipActions) {
      var cas = this.getClipAnimationsByStateName(key)
      cas.forEach((ca) => {
        if (ca.isRunning()) {
          running.push(ca)
        }
      })      
    }
    return running
  }

  //crossFade all running animations to the new one  
  crossFadeToAnimation(animation, duration, exclude) {
    exclude = exclude || []
    duration = duration || 0.3
    let runningAnimations = this.getRunningAnimations()       
    let animationClipName = animation.getClip().name
    runningAnimations.forEach((ra) => {
      var raClipName = ra.getClip().name      
      //console.log('trying to crossfadefrom ' + raClipName + ' to ' + animationClipName + ' with excludes: ', exclude)
      if (raClipName != animationClipName && !exclude.includes(raClipName)) {              
        ra.crossFadeTo(animation, duration, true);
        //console.log('crossfading!')
        /*setTimeout(() => {
          ra.stop()
        }, duration)
        */
      }
    })
  }

  fadeOutAllAnimations(excludeList, duration) {
    excludeList = excludeList || []
    duration = duration || 0.5
    let runningAnimations = this.getRunningAnimations()           
    runningAnimations.forEach((ra) => {
      var raClipName = ra.getClip().name            
      //console.log('trying to fadeout ' + raClipName + ' excluding ', excludeList)
      if (!excludeList.includes(raClipName) && ra.weight != 0) {              
        ra.fadeOut(duration)
        //console.log('fading out!')
      }    
    })
  }

  getClipAnimationsByStateName(stateName) {
    return this.avatarClipActions[stateName]    
  }

  getAnimationsNameByStateName(state) {
    return this.avatarAnimations[state]
  }
  
  avatarState(state, duration) {
    console.log('Avatar state to: ' + state)
    duration = duration || 0.5
    this.avatarState == state;
    //console.log('crossfade to: ' + state + ' in ' + duration + ' seconds')

    var cas = this.getClipAnimationsByStateName(state)
    var animNames = this.getAnimationsNameByStateName(state)

    var runningAnimations = this.getRunningAnimations()           
    
      //console.log('will fade to:', animNames)
      cas.forEach((ca) => {            
        if (runningAnimations.length) {
          ca.reset()          
          ca.play()       
          ca.fadeOut(0.01)     
          this.crossFadeToAnimation(ca, duration, animNames) 
        } else {
          ca.reset()
          ca.play()
        }
  /*
        ca.reset()      
        ca.play()
        //ca.weight = 0.3
        ca.setEffectiveTimeScale(1)
        ca.fadeOut(0.01)      
        ca.fadeIn(2)      
        console.log('playing and fadein ' + ca.getClip().name)*/
      })
      //this.fadeOutAllAnimations(animNames)

  }


  // The render loop
  render() {
    if (this.rendererIsStable == false) {
      return;
    }

    if (this.sid) {
      this.sid.remove();
      this.sid = false;
    }

    if (this.isRandomCamera) {
      this.randomCameraUpdate();
    }

    this.composer.render(this.scene, this.defaultCamera);
  }


  animate(time) {
    setTimeout( function() {
      requestAnimationFrame(window.inAvatar.animate);

      var delta = window.inAvatar.clock.getDelta()

      window.inAvatar.controls.update();

      if (window.inAvatar.showStats) {
        window.inAvatar.stats.update();
      }

      if (window.inAvatar.mixer != false) {
        window.inAvatar.mixer.update(delta);
      }

       if( window.inAvatar.mouthMixer) {                           
          window.inAvatar.mouthMixer.update(delta);        
      }

      window.inAvatar.render();

    }, 1000 / window.inAvatar.fps );
  }


  stopAvatar() {
    inControl.mediaView(false);
  }


  stringIncludedInList(needle, haystack) {
    var result = false;

    haystack.forEach((innerString) => {
      if (needle.includes(innerString)) {
        result = true;
      }
    });

    return result;
  }


  

  processMessages(messages) {
    if (inControl.use3DTextPanel == true) {
      var speeches = [];
      for (var index = 0, len = messages.length; index < len; ++index) {
        if (messages[index].speech != "") {
          var spoke = inControl.parseBotResponse(messages[index].speech);
          speeches.push(spoke);
        }
      }

      var cleanMessages = speeches.join('<br>');

      this.textPanelContent.html(cleanMessages);
    }
  }


  initialGreeting() {
    var msg = {speech: "..."};
    this.processMessages([msg]);
  }


  // Process actr commands
  processACTR(visemes) {
    if (visemes == false || visemes.length == 0) {
      return;
    }
    this.speakNow(visemes['visemes']);    
  }


  speakNow(visemes) {
    console.log(visemes)
    // Find a pause rate to sync these up.
    if (inControl.ttsURIToCall) {
      inControl.handleTTS(inControl.ttsURIToCall, () => {
        // Start Callback
        setTimeout(() => {
          this.avatarState('speaking', 0.5);          

          //start mouth visemes
          this.playMouthVisemes(visemes)

        }, window.inAvatar.options.speechDelay);
      },
      () => {
      // End callback
          this.stopMouthVisemes()
          this.avatarState('neutral', 0.5);
        }
      );
    }
  }


  playMouthVisemes(visemes) {
    setTimeout(() => {
      //console.log(visemes)      
      
      let currViseme, nextViseme, prevViseme, morphT1, morphT2, prevDuration, mouthMixer, setDuration, setDuration2
      prevDuration = 0
      this.visemeAnimations = []
        
      this.mouthMixer = new THREE.AnimationMixer(this.meshes['head_geo']);				                 

      for (var i = 0; i < visemes.length; i++) { 
          currViseme = visemes[i]
          morphT1 = this.getMorphTarget(this.avatarType, currViseme.value)
          
          if (i == visemes.length - 1) {
            break
          } else {
            nextViseme = visemes[i + 1]
          }
          morphT2 = this.getMorphTarget(this.avatarType, nextViseme.value)

          if (i > 0) {
            prevViseme = visemes[i - 1]
          } else {
            prevViseme = {viseme: 'sil', duration:0}
          }

          var mt = [morphT1, morphT2]
          //console.log(mt)
          var animName = currViseme.value + '_' + nextViseme.value
          var sequence = THREE.AnimationClip.CreateFromMorphTargetSequence(animName, mt, this.fps, true);
          var animation = this.mouthMixer.clipAction(sequence);
          animation.setLoop(THREE.LoopOnce)
          var duration = nextViseme.duration
          
          setDuration = duration / 1000 /*/ (100 / this.options.transitionDelayScale)*/
          animation.clampWhenFinished = false
          /*if (nextViseme.value == 'sil') {
            //lets make it fast transition to silence
            setDuration = 0.3
          }*/
          animation.setDuration(setDuration)
          animation.startAt(prevDuration / 1000)
          animation.weight = 1

          this.visemeAnimations.push(animation)
          //console.log("Queued animation from " + currViseme.value + " to " + nextViseme.value + " - duration " + setDuration + " - startAt: " + prevDuration / 1000)

          prevDuration += duration

      }
      
      this.visemeAnimations.forEach((a) => {              
          a.play()
      })

          
        }, window.inAvatar.options.speechDelay)
        
  }

  stopMouthVisemes() {
    this.visemeAnimations.forEach((a) => {              
          a.stop()
          a.reset()
      })

  }

  getMorphTarget(avatarType, visemes) {
    //console.log('trying to find viseme morphtarget for viseme ' + visemes)
    return this.getMorphTargetForJackie(visemes)
  }
  
  /**
   * polly   jackie viseme blendshape    phoneme                     example word
    a       0                           ah                          Adapt, marshA    
    a       1                           aa                          Odd, adAh                
    O       2                           ao                          scOre, OUght     
    o       3                           aw ow                       OAts, cOW        
    u       4                           oy uh uw                    tWO              
    @       5                           eh ae                       tEd, cAt
    i       6                           ih ay                       hIt, hIde                
    e       7                           ey                          ATE, gATE
    i       8                           y iy                        Yes, Yum, EAt    
    r       9                           r er                        Ranger
    t       10                          l                           Loud, unLoad
    u       11                          w                           Would unWind     
    p       12                          m p b                       Me, Be, Pee
    s       13                          nn n dh d g t z zh th k s   Zee, Sea        
    S       14                          ch j sh                     CHeese, Gee, seiZure, SHe
    f       15                          f v                         Vee, Fee
    sil     16                          x                           silence
        
        https://docs.aws.amazon.com/polly/latest/dg/ph-table-english-us.html

   */
  getMorphTargetForJackie(viseme) {
    var map = {
      'p': 12,
      't': 10,
      'S': 14,
      'T': 13, // ?
      'f': 15,
      'k': 13, // ?
      'i': 8,
      'r': 9,
      's': 13,
      'u': 11,
      '@': 5,
      'a': 0,
      'e': 7,
      'E': 7, // ?
      'o': 3,
      'O': 2,
      'sil': 16
    }
    return this.meshes['head_geo'].geometry.morphAttributes.position[map[viseme]]
  }

  createRandomCamera() {
    var randomPoints = [];
    for ( var i = 0; i < 100; i ++ ) {
        randomPoints.push(
            new THREE.Vector3(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100)
        );
    }
    this.spline = new THREE.SplineCurve3(randomPoints);
    this.camPosIndex = 0;

    this.defaultCamera = new THREE.PerspectiveCamera( 75,  window.inAvatar.container.width() / window.inAvatar.container.height(), 0.1, 2000 );
    this.scene.add(this.defaultCamera);
  }


  randomCameraUpdate() {
    this.camPosIndex++;

    if (this.camPosIndex > 10000) {
      this.camPosIndex = 0;
    }
    var camPos = this.spline.getPoint(this.camPosIndex / 10000);
    var camRot = this.spline.getTangent(this.camPosIndex / 10000);

    this.defaultCamera.position.x = camPos.x;
    this.defaultCamera.position.y = camPos.y;
    this.defaultCamera.position.z = camPos.z;

    this.defaultCamera.rotation.x = camRot.x;
    this.defaultCamera.rotation.y = camRot.y;
    this.defaultCamera.rotation.z = camRot.z;

    this.defaultCamera.lookAt(this.spline.getPoint((this.camPosIndex+1) / 10000));
  }

  curvedCamera() {
    this.splineCamera = false;

    this.splineCamera = new THREE.PerspectiveCamera( 84, window.inAvatar.container.width() / window.inAvatar.container.height(), 0.01, 1000 );

    this.scene.add(this.splineCamera);
    this.sampleClosedSpline = new THREE.CatmullRomCurve3( [
			new THREE.Vector3( 0, -40, -40 ),
			new THREE.Vector3( 0, 40, -40 ),
			new THREE.Vector3( 0, 140, -40 ),
			new THREE.Vector3( 0, 40, 40 ),
			new THREE.Vector3( 0, -40, 40 )
		] );
		this.sampleClosedSpline.curveType = 'catmullrom';
		this.sampleClosedSpline.closed = true;
  }


  checkACTRInput(param) {
    var avatarDefinition = {};

    avatarDefinition.avatarAnimations = []

    avatarDefinition.backfaceMaterial = "THREE.FrontSide";
    avatarDefinition.showWireframe = false;

    avatarDefinition.loaderTargetAnimation = "";
    avatarDefinition.loaderTargetFormat = "glb";

    avatarDefinition.groundPlanePosition = 0;
    avatarDefinition.groundPlaneImage = "grass.png";
    avatarDefinition.showGroundPlane = true;

    avatarDefinition.useCubeMap = true;
    avatarDefinition.cubeName = 'skybox';
    avatarDefinition.cubeExtension = 'jpg';

    avatarDefinition.renderAs = 'pbr';

    if (param == "0") {
      avatarDefinition.loaderTarget = "bsTest_RIG_shaders02.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
    } else if (param == "1") {
      avatarDefinition.loaderTarget = "BoxAnimated.glb";
    } else if (param == "2") {
      avatarDefinition.loaderTarget = "CesiumMan.glb";
    } else if (param == "3") {
      avatarDefinition.loaderTarget = "Monster.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
    } else if (param == "4") {
      //Replace with better
      avatarDefinition.loaderTarget = "DamagedHelmet.glb";
    } else if (param == "5") {
      avatarDefinition.loaderTarget = "DamagedHelmet.glb";
    } else if (param == "6") {
      //Replace with better
      avatarDefinition.loaderTarget = "DamagedHelmet.glb";
      avatarDefinition.renderAs = 'toon';
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.stepSize = 2;
    } else if (param == "7") {
      //Replace with better
      avatarDefinition.loaderTarget = "TrexByJoel3d.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      // meta?
    } else if (param == "8") {
      avatarDefinition.loaderTarget = "toonTest.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'skybox';
      avatarDefinition.cubeExtension = 'jpg';

      avatarDefinition.renderAs = 'soft';
    } else if (param == "9") {
      avatarDefinition.loaderTarget = "toonTest.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'skybox';
      avatarDefinition.cubeExtension = 'jpg';

      avatarDefinition.renderAs = 'pbr';
    
    } else if (param == "11") {
      avatarDefinition.loaderTarget = "forever_and_ever.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
    } else if (param == "12") {
      avatarDefinition.loaderTarget = "beautiful_sphere.glb";
      avatarDefinition.showGroundPlane = false;
    } else if (param == "13") {
      avatarDefinition.loaderTarget = "https://raw.githubusercontent.com/b-ran-don/Hadron/master/Arthur/arthurDemo.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'toon';
      avatarDefinition.cubeExtension = 'jpg';
//      avatarDefinition.initialAnimation = 'em10_d13000_head';
//      avatarDefinition.acknowledgeAnimation = 'iconic_listeningB_d2000';
//      avatarDefinition.acknowledgeAnimation = 'em10_d2000_body';

      avatarDefinition.backfaceMaterial = "THREE.DoubleSide";

      avatarDefinition.renderAs = 'pbr';
    
    } else if (param == "16") {
      avatarDefinition.loaderTarget = "sprout_avatar.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'skybox';
      avatarDefinition.cubeExtension = 'jpg';

      avatarDefinition.renderAs = 'pbr';    
    
    } else {
      avatarDefinition.loaderTarget = "jackie_final_short/em10_mouth_iconics.gltf";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'jackie17';
      avatarDefinition.cubeExtension = 'jpg';
      avatarDefinition.renderAs = 'pbr';
      avatarDefinition.showWireframe = false;

      avatarDefinition.avatarAnimations['neutral'] = ['em10_d13000_head', 'em10_d8000_body']
      avatarDefinition.avatarAnimations['speaking'] = ['em10_d2000_head', 'em10_d8000_body']

      avatarDefinition.defaultCameraPositionX = 15
      avatarDefinition.defaultCameraPositionY = 70
      avatarDefinition.defaultCameraPositionZ = 220

    }

    this.startAvatar(avatarDefinition);

    return true;
  }
}

