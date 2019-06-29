/*jshint esversion: 6 */

/*
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

// send color codes for background via avatarDefinition
// research point fogs


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

    this.groundPlanePosition = 0;
    this.groundPlaneImage = "grass.png";
    this.showGroundPlane = true;

    this.useCubeMap = false;
    this.cubeName = 'skybox';
    this.cubeExtension = 'jpg';

    this.glitch = false;

    this.useGUI = true;

    this.sid = false;

    this.isRandomCamera = false;

    this.useOutlineEffect = false;

    this.useFiddleShader = false;

    this.mouthAnimationList = [];
    this.mouthFormat = 'actr1';

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

    if (this.threeJSPresent == false) {
      this.sid = $('<section>', {id: 'loading-screen'});
      var slid = $('<div>', {id: 'loader'});

      this.sid.append(slid);

      $('.quark-media-overlay').append(this.sid);

      loadThreeJS(() => {
        this.threeJSPresent = true;
        this.startAvatar2();
      });
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

    this.composer = new THREE.EffectComposer(this.renderer);

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
    this.defaultCamera = new THREE.PerspectiveCamera(fov, this.container.width() / this.container.height(), 0.01, 1000);
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
    this.controls = new THREE.OrbitControls(this.defaultCamera, this.container[0] /* this.renderer.domElement */);

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
    if (this.useGUI == true) {
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

      guiInner.append(gui.domElement);
      guiOuter.append(guiInner);
      $(this.container).append(guiOuter);
    }
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
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }

    // This feels like a config var but can't be since THREE isn't loaded when the config is created.  Must be here.
    if (this.backfaceMaterial == "THREE.DoubleSide") {
      this.backfaceMaterial = THREE.DoubleSide;
    } else {
      this.backfaceMaterial = THREE.FrontSide;
    }


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
		  loader = new THREE.GLTFLoader();
    } else {
      loader = new THREE.FBXLoader();
    }

    loader.setCrossOrigin('');

    // test for https, if not we build a local link like always.
    var fullPathToTargetModel = Config.all_your_bases_are_belong_to_us + "avatar/models/" + this.loaderTarget;

    if (this.loaderTarget.includes('https:') || this.loaderTarget.includes('http:')) {
      fullPathToTargetModel = this.loaderTarget;
    }

		loader.load(fullPathToTargetModel, (object) => {
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

      this.render();
		}, undefined, function (e) {
      inControl.consoleLog(e);
    });

    this.createStats();

    this.animate();
  }


  enumerateAnimations() {
    this.animCtrls = [];

    if (this.clips.length) {
      this.animFolder.domElement.style.display = '';
      const actionStates = this.state.actionStates = {};
      this.clips.forEach((clip, clipIndex) => {
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

      if (this.clips.length > 1 && this.initialAnimation) {
        //jem
        var clip = THREE.AnimationClip.findByName(this.clips, this.initialAnimation);
        if (clip) {
          this.initialAnimationAction = this.mixer.clipAction(clip);

          this.initialAnimationAction.reset();
          this.initialAnimationAction.enabled = true;
          console.log("playing initialAnimation: " + clip.name);
          this.initialAnimationAction.play();
        }
      }
    }
  }


  createGlitch() {
    this.glitchPass = new THREE.GlitchPass();
    this.glitchPass.enabled = this.options.useGlitch;
    this.composer.addPass( this.glitchPass );

    return 1;
  }


  createBitShader() {
    this.grayScalePass = new THREE.ShaderPass(THREE.CustomGrayScaleShader);
    this.grayScalePass.enabled = false;

    this.composer.addPass(this.grayScalePass);

    this.bitPass = new THREE.ShaderPass(THREE.CustomBitShader);
    this.bitPass.enabled = this.options.useBits;

    this.bitPass.uniforms.bitSize.value = 3.0;

    this.composer.addPass(this.bitPass);
    return 1;
  }


  createFiddleShader() {
    if (this.useFiddleShader) {
      let outlineMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.FiddleOutlineShader.uniforms,
        vertexShader: THREE.FiddleOutlineShader.vertexShader,
        fragmentShader: THREE.FiddleOutlineShader.fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      let outlineMesh = new THREE.Mesh(this.outlineTargets[0].children[1], outlineMaterial);
      this.scene.add(outlineMesh);
    }
  }


  createOutlinePass() {
    this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(this.container.width(), this.container.height()), this.scene, this.defaultCamera);
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
    this.shaderPass = new THREE.ShaderPass(THREE.CustomOutlineShader);
    this.shaderPass.enabled = true;

    this.composer.addPass(this.shaderPass);
  }


  createOutlineEffect() {
    this.outlineEffect = new THREE.OutlineEffect( this.renderer /* , {defaultThickness: 0.1, defaultColor: new THREE.Color( 0x444444 ), defaultAlpha: 1, defaultKeepAlive: true} */);
    this.outlineEffectPass = new THREE.ShaderPass(this.outlineEffect);
    this.composer.addPass(this.outlineEffectPass);
  }


  createOutlineShaderToy() {
    this.drawShader = new THREE.ShaderPass(CustomDrawShader);
    this.composer.addPass(this.drawShader);


    this.finalDrawShader = new THREE.ShaderPass(CustomFinalDrawShader);
    this.finalDrawShader.material.extensions.derivatives = true;
    this.composer.addPass(this.finalDrawShader);
  }

  // Create outline
  createOutline() {
    this.outlinePass = false;

    this.outlineEffect = new THREE.ShaderPass(THREE.OutlineShader);
    this.composer.addPass(this.outlineEffect);

    this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
    this.composer.addPass(this.copyPass);

    return 1;
  }


  createVignette() {
    this.vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    this.vignettePass.enabled = this.options.useVignette;

    this.composer.addPass(this.vignettePass);
    return 1;
  }


  createSepia() {
    this.sepiaPass = new THREE.ShaderPass(THREE.SepiaShader);
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

    this.halftonePass = new THREE.HalftonePass( this.container.width(), this.container.height(), params );
    this.halftonePass.enabled = this.options.useHalftone;
	  this.composer.addPass( this.halftonePass );

    return 1;
  }


  createFXAA() {
    this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.container.width(), 1 / this.container.height());
    this.effectFXAA.renderToScreen = true;
    this.effectFXAA.needsSwap = true;
    this.composer.addPass(this.effectFXAA);
  }


  createEffects() {
    this.renderPass = new THREE.RenderPass(this.scene, this.defaultCamera);
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


  avatarState(state) {
    this.avatarState == state;

    if (state == 'acknowledge') {
      if (this.initialAnimationAction) {
        this.initialAnimationAction.stop();
        this.initialAnimationAction.reset();
      }

      if (this.acknowledgeAnimation) {
        if (this.acknowledgeAnimationAction) {
          this.acknowledgeAnimationAction.play();
        } else {
          var clip = THREE.AnimationClip.findByName(this.clips, this.acknowledgeAnimation);
          if (clip) {
            this.acknowledgeAnimationAction = this.mixer.clipAction(clip);

            this.acknowledgeAnimationAction.reset();
            this.acknowledgeAnimationAction.enabled = true;
            console.log("playing acknowledgeAnimation: " + clip.name);
            this.acknowledgeAnimationAction.play();
          }
        }
      }
    } else if (state == 'waiting') {
      if (this.acknowledgeAnimationAction) {
        this.acknowledgeAnimationAction.stop();
        this.acknowledgeAnimationAction.reset();
      }

      if (this.initialAnimationAction) {
        console.log("playing initialAnimation: ");
        this.initialAnimationAction.play();
      }
    } else if (state == 'paused') {
      console.log('pausing body');

      if (this.acknowledgeAnimationAction) {
        this.acknowledgeAnimationAction.stop();
        this.acknowledgeAnimationAction.reset();
      }

      if (this.initialAnimationAction) {
        this.initialAnimationAction.play();

        setTimeout(() => {
          if (this.initialAnimationAction) {
            this.initialAnimationAction.stop();
            this.initialAnimationAction.reset();
          }
        }, 150);
      }


    }
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
    //setTimeout( function() {
    requestAnimationFrame(window.inAvatar.animate);

    const dt = (time - window.inAvatar.prevTime) / 1000;

    window.inAvatar.controls.update();

    if (window.inAvatar.showStats) {
      window.inAvatar.stats.update();
    }

    if (window.inAvatar.mixer != false) {
      window.inAvatar.mixer.update(dt);
    }

    window.inAvatar.render();

    window.inAvatar.prevTime = time;
    //}, 1000 / 46 );
  }


  stopAvatar() {
    inControl.mediaView(false);
  }


  playAnimation(clip, nextClip, durationSeconds) {
    if (nextClip) {
      this.nextAnimationAction = this.mixer.clipAction(nextClip);
    } else {
      this.nextAnimationAction = false;
    }

    this.currentAnimationAction = this.mixer.clipAction(clip);

    if (this.currentAnimationAction) {
      this.currentAnimationAction.reset();
      this.currentAnimationAction.enabled = true;
      this.currentAnimationAction.loop = THREE.LoopOnce;
      this.currentAnimationAction.setEffectiveTimeScale(this.options.effectiveTimeScale);
      this.currentAnimationAction.zeroSlopeAtBegin = this.options.zeroSlopeAtBegin;
      this.currentAnimationAction.zeroSlopeAtEnd = this.options.zeroSlopeAtEnd;
      console.log("playing clip: " + clip.name);
      this.currentAnimationAction/*.setDuration(durationSeconds)*/.play();
    } else {
      console.log("clip was not found: " + clip.name);
    }

    if (this.nextAnimationAction) {
      if (this.options.crossFadeEnabled) {
        this.currentAnimationAction.crossFadeTo(this.nextAnimationAction, this.options.fadeDuration, true);
      }
    } else {
      this.currentAnimationAction.stopFading();
    }
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


  parseMouthAccurate(ACTRdata, callback) {
    var count = ACTRdata.length;

    this.mouthAnimationList = [];

    ACTRdata.forEach((controlStates) => {
      var controlGroup = controlStates.control_group;

      var animationTarget = {name: controlGroup, specs: controlStates};
      this.mouthAnimationList.push(animationTarget);

      count--;

      if (count == 0) {
        if (callback) {
          callback();
        }
      }
    });
  }


  parseMouthToon(ACTRdata, callback) {
    var count = ACTRdata.length;

    this.mouthAnimationList = [];

    this.newState = {};
    this.newMouth = '';

    ACTRdata.forEach((controlStates) => {
      var controlGroup = controlStates.control_group;

      // These are all mapped to "mouth_c_500"
      if (this.stringIncludedInList(controlGroup, ['mouth_a_d500', 'mouth_c_d500', 'mouth_e_d500'])) {
        controlGroup = this.newMouth = 'mouth_e_d500';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      } else if (this.stringIncludedInList(controlGroup, ['mouth_u_d500', 'mouth_o_d500'])) {
        controlGroup = this.newMouth = 'mouth_u_d500';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      } else if (this.stringIncludedInList(controlGroup, ['mouth_m_d500'])) {
        controlGroup = this.newMouth = 'mouth_m_d500';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      } else {
        controlGroup = this.newMouth = 'mouth_neutral_d500';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      }

      var animationTarget = {name: controlGroup, specs: controlStates};

      this.mouthAnimationList.push(animationTarget);

      count--;

      if (count == 0) {
        if (callback) {
          callback();
        }
      }
    });
  }


  // This is the actr2 version of mouth handling.  New parser so it doesn't affect actr1 versions.
  parseMouthMiddling(ACTRdata, callback) {
    var count = ACTRdata.length;
    var currentInc = 0;

    this.mouthAnimationList = [];

    this.newState = {};
    this.currentMouth = '';
    this.newMouth = '';
    this.viseme = '';
    this.firstMovementDetected = false;
    this.ACTRdata = ACTRdata;

    var animationTarget;

    this.ACTRdata.forEach((controlStates) => {
      var isNeutral = false;
      var controlGroup = controlStates.control_group;

      var nextState = false;
      if ((currentInc + 1) < this.ACTRdata.length) {
        nextState = this.ACTRdata[currentInc + 1];
      }

      // These are all mapped to "mouth_c_500"
      if (this.stringIncludedInList(controlGroup, ['mouth_a_d500', 'mouth_c_d500', 'mouth_e_d500'])) {
        controlGroup = this.newMouth = 'mouth_e_d500';
        this.viseme = 'e';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      } else if (this.stringIncludedInList(controlGroup, ['mouth_u_d500', 'mouth_o_d500'])) {
        controlGroup = this.newMouth = 'mouth_u_d500';
        this.viseme = 'u';

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      } else if (this.stringIncludedInList(controlGroup, ['mouth_m_d500'])) {
        this.viseme = 'm';

        controlGroup = this.newMouth;

        controlStates.control_group = this.newMouth;
        controlStates.control_group_human_readable = this.newMouth;
      }

      // override the var is the neutral was first. No sense in doubling up neutral.
      if (controlGroup.includes('mouth_neutral') == true && this.firstMovementDetected == false) {
        this.firstMovementDetected = true;
      }

      // Needs an initial transition value
      if (this.firstMovementDetected == false) {
        this.firstMovementDetected = true;
        isNeutral = true;

        var neutralState = jQuery.extend(true, {}, controlStates);

        var neutralName = 'mouth_neutral_d500_transitionTo' + this.viseme.toUpperCase();
        neutralState.settings.duration = 250;
        neutralState.control_group = neutralState.control_group_human_readable = neutralName;

        animationTarget = {name: neutralName, specs: neutralState, repeat: THREE.LoopOnce};
        console.log('transition: ' + neutralName);
        console.log(neutralState);

        this.mouthAnimationList.push(animationTarget);

        // Now the first official viseme
        var animationTarget = {name: controlGroup, specs: controlStates, repeat: THREE.LoopOnce};
        this.mouthAnimationList.push(animationTarget);
      } else {
        var animationTarget = {name: controlGroup, specs: controlStates, repeat: THREE.LoopOnce};
        this.mouthAnimationList.push(animationTarget);
      }

      console.log('currentState');
      console.log(controlStates);
      console.log('nextState');
      console.log(nextState);

      count--;

      if (count == 0) {
        if (callback) {
          callback();
        }
      }

      currentInc++;
    });
  }


  detectMouthFormat() {
    var clp;

    // This is actr1 detect.
    clp = THREE.AnimationClip.findByName(window.inAvatar.clips, "mouth_e_d500");

    if (clp) {
      this.mouthFormat = 'actr1';
    }


    // This is actr2
    clp = THREE.AnimationClip.findByName(window.inAvatar.clips, "mouth_e_d500_transitionToO");

    if (clp) {
      this.mouthFormat = 'actr2';
    }


    console.log("mouthFormat: " + this.mouthFormat);
  }


  // Reduce to just ACTR so things work as expected.
  onlyMouthAnimations(ACTRdata) {
    this.onlyMouthAnimationList = [];

    ACTRdata.forEach((innerACTR) => {
      if (innerACTR.type == 'animation') {
        innerACTR.control_states.forEach((controlState) => {
          var controlGroup = controlState.control_group;

          if (controlGroup.includes('mouth_')) {
            this.onlyMouthAnimationList.push(controlState);
          }
        });
      }
    });

    return this.onlyMouthAnimationList;
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
  processACTR(ACTRdata) {
    if (ACTRdata == false) {
      return;
    }

    if (ACTRdata.length == 0) {
      return;
    }

    ACTRdata = this.onlyMouthAnimations(ACTRdata);

    this.detectMouthFormat();

    if (this.mouthFormat == 'actr2') {
      this.mouthStyle = 'middling';
    }

    if (this.mouthStyle == 'accurate') {
      this.parseMouthAccurate(ACTRdata, () => {
        this.speakNow();
      });
    } else if (this.mouthStyle == 'toon') {
      this.parseMouthToon(ACTRdata, () => {
        this.speakNow();
      });
    } else if (this.mouthStyle == 'middling') {
      this.parseMouthMiddling(ACTRdata, () => {
        this.speakNow();
      });
    } else {
      console.log("Unhandled mouthStyle: " + this.mouthStyle + " used 'toon' instead.");

      this.parseMouthToon(ACTRdata, () => {
        this.speakNow();
      });
    }
  }


  speakNow() {
    // Find a pause rate to sync these up.
    if (inControl.ttsURIToCall) {
      inControl.handleTTS(inControl.ttsURIToCall, () => {
        // Start Callback
        setTimeout(() => {
          this.avatarState('paused');

          this.currentAnimationAction = false;
          this.nextAnimationAction = false;
          this.totalTickTock = 0;
          this.lastAnimationName = "";
          this.runAnimationList();
        }, window.inAvatar.options.speechDelay);
      },
      () => {
      // End callback
        if (this.currentAnimationAction) {
          this.currentAnimationAction.stopFading();
          this.currentAnimationAction.reset();
          this.currentAnimationAction.stop();

          // Clear the list to try to end the loop, for slowed animations.
          this.mouthAnimationList = [];

          this.avatarState('waiting');
        }
      });
    }
  }


  runAnimationList() {
    var animationTarget;
    this.animationChanged = false; // true means they have changed, make sure to animate next clip.  If toon mode is enabled, it is forced to false when they are the same so it keeps the same clip running.

    if (this.mouthAnimationList.length) {
      animationTarget = this.mouthAnimationList.shift();
      if (this.mouthStyle == 'toon') {
        if (this.lastAnimationName != animationTarget.name) {
          this.animationChanged = true;
        }
      } else {
        this.animationChanged = true;
      }

      // Store this for the next pass.
      this.lastAnimationName = animationTarget.name;

      var nextAnimationTarget = false;

      if (this.mouthAnimationList.length) {
        nextAnimationTarget = this.mouthAnimationList[0];
      }

      var clp = THREE.AnimationClip.findByName(window.inAvatar.clips, animationTarget.name);

      if (nextAnimationTarget) {
        var nextClp = THREE.AnimationClip.findByName(window.inAvatar.clips, nextAnimationTarget.name);
      }

      if (clp) {
        window.inAvatar.playAnimation(clp, nextClp, animationTarget.specs.settings.duration / (1000 / 1), true);

        this.totalTickTock += animationTarget.specs.settings.duration;
      }

      setTimeout(() => {
        if (this.currentAnimationAction) {
          this.currentAnimationAction.stopFading();
        }

        if (this.animationChanged == true) {
          if (this.currentAnimationAction) {
            this.currentAnimationAction.stop();
          }
        } else {
          console.log("repeated clip: " + this.lastAnimationName);
        }

        window.inAvatar.runAnimationList();
      }, animationTarget.specs.settings.duration * this.options.durationScale);

//      window.inAvatar.mixer.addEventListener('finished', (e) => {
//        console.log('ani done:');
//        window.inAvatar.startAnimationList();
//      });
    } else {
      console.log('Total animation: ' + this.totalTickTock / 1000);

      if (this.totalTickTock == 0) {
        inControl.showToast('No ACTR animation available.  Please report this to engineering.');
      }

      if (this.currentAnimationAction) {
        this.currentAnimationAction.stopFading();
        this.currentAnimationAction.reset();
        this.currentAnimationAction.stop();
      }
    }
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

    if (param == "0" || param == "") {
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
    } else if (param == "10") {
      avatarDefinition.loaderTarget = "em10_mouth_iconics.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'toon';
      avatarDefinition.cubeExtension = 'jpg';
      avatarDefinition.initialAnimation = 'em10_d13000_head';
      avatarDefinition.acknowledgeAnimation = 'iconic_listeningB_d2000';
//      avatarDefinition.acknowledgeAnimation = 'em10_d2000_body';

      avatarDefinition.renderAs = 'toon';
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
    } else if (param == "14") {
      avatarDefinition.loaderTarget = "em10_mouth_iconics.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'toon';
      avatarDefinition.cubeExtension = 'jpg';
      avatarDefinition.initialAnimation = 'em10_d13000_head';
      avatarDefinition.acknowledgeAnimation = 'iconic_listeningB_d2000';
      avatarDefinition.renderAs = 'toon';
      avatarDefinition.showWireframe = true;
    } else if (param == "15") {
      avatarDefinition.loaderTarget = "https://raw.githubusercontent.com/b-ran-don/Hadron/master/em10_mouth_iconics.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'toon';
      avatarDefinition.cubeExtension = 'jpg';
      avatarDefinition.initialAnimation = 'em10_d13000_head';
      avatarDefinition.acknowledgeAnimation = 'iconic_listeningB_d2000';
      avatarDefinition.renderAs = 'toon';
      avatarDefinition.showWireframe = false;
    } else if (param == "16") {
      avatarDefinition.loaderTarget = "sprout_avatar.glb";
      avatarDefinition.showGroundPlane = false;
      avatarDefinition.useCubeMap = false;
      avatarDefinition.cubeName = 'skybox';
      avatarDefinition.cubeExtension = 'jpg';

      avatarDefinition.renderAs = 'pbr';
    } else {
      avatarDefinition.loaderTarget = "bsTest_RIG_shaders02.glb";
    }

    this.startAvatar(avatarDefinition);

    return true;
  }
}


// First pass
function loadThreeJS(callback) {
  var scripts = [
    Config.all_your_bases_are_belong_to_us + 'three.js',

    Config.all_your_bases_are_belong_to_us + 'dat.gui.min.js',

    Config.all_your_bases_are_belong_to_us + 'EffectComposer.js',
    Config.all_your_bases_are_belong_to_us + 'RenderPass.js',
    Config.all_your_bases_are_belong_to_us + 'MaskPass.js',
    Config.all_your_bases_are_belong_to_us + 'ShaderPass.js',

    Config.all_your_bases_are_belong_to_us + 'DigitalGlitch.js',
    Config.all_your_bases_are_belong_to_us + 'GlitchPass.js',

//    Config.all_your_bases_are_belong_to_us + 'CurveExtras.js',

    Config.all_your_bases_are_belong_to_us + 'HalftoneShader.js',
    Config.all_your_bases_are_belong_to_us + 'HalftonePass.js',

    Config.all_your_bases_are_belong_to_us + 'OrbitControls.js',
    Config.all_your_bases_are_belong_to_us + 'Detector.js',
    Config.all_your_bases_are_belong_to_us + 'OutlineEffect.js',
    Config.all_your_bases_are_belong_to_us + 'CopyShader.js',

    Config.all_your_bases_are_belong_to_us + 'VignetteShader.js',
    Config.all_your_bases_are_belong_to_us + 'ToonShader.js',
    Config.all_your_bases_are_belong_to_us + 'SepiaShader.js',
    Config.all_your_bases_are_belong_to_us + 'FXAAShader.js',

    Config.all_your_bases_are_belong_to_us + 'OutlinePass.js',
    Config.all_your_bases_are_belong_to_us + 'ShaderToon.js',

    Config.all_your_bases_are_belong_to_us + 'SobelOperatorShader.js',

    Config.all_your_bases_are_belong_to_us + 'GLTFLoader.js',
    Config.all_your_bases_are_belong_to_us + 'FBXLoader.js',
    Config.all_your_bases_are_belong_to_us + 'inflate.min.js',
    Config.all_your_bases_are_belong_to_us + 'stats.min.js',
  ];
  var src;
  var script;
  var pendingScripts = [];
  var firstScript = document.scripts[0];

  // Watch scripts load in IE
  function stateChange() {
    // Execute as many scripts in order as we can
    var pendingScript;
    while (pendingScripts[0] && pendingScripts[0].readyState == 'loaded') {
      pendingScript = pendingScripts.shift();
      // avoid future loading events from this script (eg, if src changes)
      pendingScript.onreadystatechange = null;
      // can't just appendChild, old IE bug if element isn't closed
      firstScript.parentNode.insertBefore(pendingScript, firstScript);
    }
  }

  // loop through our script urls
  var head = document.getElementsByTagName("head")[0];
  var scriptLoadCount = scripts.length;

  head.addEventListener("load", function(event) {
      if (event.target.nodeName === "SCRIPT") {
        scriptLoadCount--;

        if (scriptLoadCount == 0) {
          callback();
        }
      }
  }, true);

  while (src = scripts.shift()) {
    if ('async' in firstScript) { // modern browsers
      script = document.createElement('script');
      script.async = false;
      script.src = src;
      document.head.appendChild(script);
    } else if (firstScript.readyState) { // IE<10
      // create a script and add it to our todo pile
      script = document.createElement('script');
      pendingScripts.push(script);
      // listen for state changes
      script.onreadystatechange = stateChange;
      // must set src AFTER adding onreadystatechange listener
      // else we’ll miss the loaded event for cached scripts
      script.src = src;
    }
    else { // fall back to defer
      document.write('<script src="' + src + '" defer></'+'script>');
    }
  }
}
