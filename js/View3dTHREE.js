import * as THREE from './three.module.js'
import { OrbitControls } from './OrbitControls.js'

// File: js/View3dTHREE.js
// Dependencies : import them before View3d.js in browser （Using THREE.js)
// If not modules, import three.js

// View3d
function View3d(modele, canvas3dElt) {
  // Instance variables
  var model = modele; // Object reference
  var canvas3d = canvas3dElt; // Object reference
  var nbFacesVertice = 0;

  //  Three: initialisation
  this.renderer = new THREE.WebGLRenderer({ 
    canvas: canvas3d,
    antialias: true,
    alpha: true });

  let backgroundColor = 0x88ee88;

  this.rendererWidth = canvas3d.clientWidth
  this.rendererHeight = canvas3d.clientHeight
  let aspectRatio = canvas3d.clientWidth / canvas3d.clientHeight
  this.renderer.setSize(this.rendererWidth, this.rendererWidth / aspectRatio);
  this.renderer.setClearColor(backgroundColor, 1) // second argument is opacity

  
  //  Three: camera
  this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 20000);
  this.camera.position.set(0, 0, 800);
  this.camera.lookAt(0, 0, 0);

  //  Three: Scene
  this.scene = new THREE.Scene();

  //  Three: lighting
  var light = new THREE.AmbientLight(0xffffff, 0.7)
  this.scene.add(light)

  var light1 = new THREE.PointLight(0xffffff, 0.6)
  light1.position.set(300, 300, 800)
  this.scene.add(light1)

  var light2 = new THREE.PointLight(0xffffff, 0.6)
  light2.position.set(300, 300, -800)
  this.scene.add(light2)

  var light3 = new THREE.PointLight(0xffffff, 0.4)
  light3.position.set(-300, 300, 800)
  this.scene.add(light3)

  var light4 = new THREE.PointLight(0xffffff, 0.4)
  light4.position.set(-300, -300, -800)
  this.scene.add(light4)


  //  Three: custom geometry
  //  (Using custom bufferGeometry will be faster; will look into it if time permits)
  //  https://r105.threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
  //  https://r105.threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html

  const geometry = new THREE.BufferGeometry();


  initBuffers();


  function initBuffers() {
    // Keep the geometry parts as-is
    // Also used in Orisim3d.js
    // Faces
    var vtx = []; // vertex
    var ftx = []; // front texture coords
    var btx = []; // back texture coords
    var fnr = []; // front normals coords
    var bnr = []; // back normals coords Not used for now
    var fin = []; // front indices
    var bin = []; // back indices
    var index = 0;

    for (var iFace = 0; iFace < model.faces.length; iFace++) {
      var f = model.faces[iFace];
      var pts = f.points;
      // Normal needed for Offset and used for lightning
      f.computeFaceNormal();
      var n = f.normal;
      // Triangle FAN can be used only because of convex CCW face
      var c = pts[0]; // center
      var p = pts[1]; // previous
      var s = pts[2]; // second
      for (var i = 2; i < pts.length; i++) {
        
        vtx.push(c.x + f.offset * n[0]);
        vtx.push(c.y + f.offset * n[1]);
        vtx.push(c.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + c.xf) / View3d.wTexFront);
        ftx.push((200 + c.yf) / View3d.hTexFront);
        btx.push((200 + c.xf) / View3d.wTexBack);
        btx.push((200 + c.yf) / View3d.hTexBack);
        // index
        fin.push(index);
        bin.push(index);
        index++;
        vtx.push(p.x + f.offset * n[0]);
        vtx.push(p.y + f.offset * n[1]);
        vtx.push(p.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + p.xf) / View3d.wTexFront);
        ftx.push((200 + p.yf) / View3d.hTexFront);
        btx.push((200 + p.xf) / View3d.wTexBack);
        btx.push((200 + p.yf) / View3d.hTexBack);
        // index Note +1 for back face index
        fin.push(index);
        bin.push(index + 1);
        index++;
        vtx.push(s.x + f.offset * n[0]);
        vtx.push(s.y + f.offset * n[1]);
        vtx.push(s.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + s.xf) / View3d.wTexFront);
        ftx.push((200 + s.yf) / View3d.hTexFront);
        btx.push((200 + s.xf) / View3d.wTexBack);
        btx.push((200 + s.yf) / View3d.hTexBack);
        // index Note -1 for back face index
        fin.push(index);
        bin.push(index - 1);
        index++;
        // next triangle
        p = s;
      }
    }

    // Make into arrays
    var vertices = new Float32Array(vtx);
    var normals = new Float32Array(fnr);
    var texCoordsFront = new Float32Array(ftx);
    var texCoordsBack = new Float32Array(btx);

    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;

    // "addAttribute" hasbeen changed to setAttribute
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), positionNumComponents));
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(texCoordsFront), uvNumComponents));


    var faceVertexIndicesArray = new Uint8Array(fin);

    // Used in draw()
    nbFacesVertice = faceVertexIndicesArray.length;

  }


  // Textures/materials
  const loader = new THREE.TextureLoader();
  // const texture = loader.load('../textures/back.jpg');


  // Require CORS
  // View3d.imageFront.src = './textures/front.jpg';
  // Does not require CORS, use if image is inlined in html
  View3d.imageFront = new Image();
  if (window.document.getElementById("front")) {
    View3d.imageFront.src = window.document.getElementById("front").src;
    View3d.wTexFront = View3d.imageFront.width;
    View3d.hTexFront = View3d.imageFront.height;
  }


  // Require CORS
  // View3d.imageBack.src = './textures/back.jpg';
  // Does not require CORS if image is inlined
  View3d.imageBack = new Image();
  if (window.document.getElementById("back")) {
    View3d.imageBack.src = window.document.getElementById("back").src;
  }


  // initBuffers();

  let frontColor = 0xDD33DD;
  const materialFront = new THREE.MeshLambertMaterial({ color: frontColor, side: THREE.FrontSide });

  //  Generate the mesh for paper!!
  const paper = new THREE.Mesh(geometry, materialFront) // Front and back materials

  // Generate Backside
  let backColor = 0x888888;
  var materialBack = new THREE.MeshLambertMaterial({ color: backColor, side: THREE.BackSide });
  var backMesh = new THREE.Mesh(geometry, materialBack);
  paper.add(backMesh);

  // Add wireframe
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
  var wireMesh = new THREE.Mesh(geometry, wireMaterial)
  paper.add(wireMesh)

 
  // Add to scene
  paper.position.x = 0;
  this.scene.add(paper);


  // Add a wall
  // var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
  // var planeMaterial = new THREE.MeshLambertMaterial({color: 0x66bb66});

  // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.receiveShadow = true;
  // plane.position.x = 0;
  // plane.position.y = 0;
  // plane.position.z = -1000;
  // this.scene.add(plane);


  // Three: Orbit Controls
  // controls
  let controls = new OrbitControls(this.camera, this.renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enablePan = true;
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1400;
  controls.maxPolarAngle = Math.PI / 2;

  // Mouse, keyboard, and touch controls are available by default





  // Three: take screenshots
  //  From: https://jsfiddle.net/2pha/art388yv/
  function takeScreenshot(mode = 0) {
    this.renderer.setClearColor(0xffffff, 0)  // set background to transparent
    switch (mode) {
      case 0: // open in new tab/window
        // open in new window like this
        var w = window.open('', '');
        w.document.title = "Screenshot";
        var img = new Image();
        // Without 'preserveDrawingBuffer' set to true, we must render now
        this.renderer.render(this.scene, this.camera);
        img.src = this.renderer.domElement.toDataURL();
        // Just wanna make image centered 
        w.document.body.style.textAlign = "center"
        w.document.body.appendChild(img); 
        break;

      case 1: // download using toDataURL
        // download file like this.
        // simulating a link click
        var a = document.createElement('a');
        // Without 'preserveDrawingBuffer' set to true, we must render now
        this.renderer.render(this.scene, this.camera);
        a.href = this.renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
        a.download = 'canvas.png'
        a.click();
        break;

      case 2: // download using toBlob
        // New version of file download using toBlob.
        // toBlob should be faster than toDataUrl.
        // But maybe not because also calling createOjectURL.
        //
        this.renderer.render(this.scene, this.camera);
        this.renderer.domElement.toBlob(function(blob){
          var a = document.createElement('a');
          var url = URL.createObjectURL(blob);
          a.href = url;
          a.download = 'canvas.png';
          a.click();
        }, 'image/png', 1.0);
        break;
    
      default:
        break;
    }
      
    this.renderer.setClearColor(backgroundColor, 1)

  }


  // --------------------------- FINALLY ---------------------------------------//
  // Three: Render
  function draw() {
    this.renderer.render(this.scene, this.camera);
    controls.update();
  }


  //  Responsive window (need to put canvas3d in a container)
  let containerElt = canvas3d.parentElement;
  if (containerElt) {
    window.addEventListener("resize", () => {

      this.rendererWidth = containerElt.clientWidth
      let aspectRatio = containerElt.clientWidth / containerElt.clientHeight
      this.renderer.setSize(this.rendererWidth, this.rendererWidth / aspectRatio);
      this.camera.aspect = aspectRatio;
      this.camera.updateProjectionMatrix();
  
    });
  }
  

  



  
  // API
  this.initBuffers = initBuffers;
  this.draw = draw;
  this.takeScreenshot = takeScreenshot;

}


export default View3d