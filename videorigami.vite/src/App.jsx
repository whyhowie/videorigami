import React, { useState, useEffect, useRef } from "react";
import * as THREE from './three.module'
import './App.css';



function App() {

  const videoRef = useRef();
  const videoPath = "/assets/videos/catjam_blue.mp4"

  console.log(videoPath)

  const timeStamps = [...Array(12).keys()].map(x => x*0.5)
  const [progress, setProgress] = useState(0)

  function jumpTo(e) {    // Jump to certain time of the video
    let startTimestamp = e.target.getAttribute("data-start")
    e.preventDefault();
    videoRef.current.currentTime = startTimestamp;
    e.target.classList.add('active')

    // Play if playing; pause if paused
    videoRef.current.paused ? videoRef.current.pause() : videoRef.current.play();
    
  }

  let buttonElements = []
  let buttonRefs = []
  timeStamps.map((t, idx) => {
    buttonRefs.push(React.createRef())
    let buttonElement = (<button key={idx} data-start={t} 
      className="button" ref={buttonRefs[idx]}
      onClick={jumpTo}>@{t.toFixed(1)} second</button>)
    buttonElements.push(buttonElement)
  })


  function showProgress(e) {    // Scroll based on video progress
    if (isNaN(e.target.duration))   // duration is NotaNumber at Beginning.
      return;
    setProgress(e.target.currentTime / e.target.duration * 100)   // Find the progress and set the state 

    // Make previously highlighted active button inactive
    timeStamps.map((_,idx) => {
      buttonRefs[idx].current.classList.remove('active')
    })
    

    // Find the new button to highlight
    let currentTime = e.target.currentTime
    let diffArr = timeStamps.map(timeStamp => Math.abs(currentTime - timeStamp));
    let minNumber = Math.min(...diffArr);
    let minNumberIndex = diffArr.findIndex(x => x === minNumber);
    let buttonRef = buttonRefs[minNumberIndex]

    // Scroll into view
    buttonRef.current.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    buttonRef.current.classList.add('active')
  }





  useEffect(() => {
    let canvasElement = document.getElementById("test")
    let containerElement  = document.getElementById("container")
    const renderer = new THREE.WebGLRenderer({canvas: canvasElement});
    let rendererWidth = containerElement.clientWidth
    let aspectRatio = containerElement.clientWidth / containerElement.clientHeight
    renderer.setSize( rendererWidth, rendererWidth / aspectRatio );
    renderer.setClearColor(0x88ff88)

    const camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 20000 );
    camera.position.set( 0, 0, 50 );
    camera.lookAt( 0, 0, 0 );

    //  Responsive window 
    window.addEventListener("resize", () => {
      rendererWidth = containerElement.clientWidth
      aspectRatio = containerElement.clientWidth / containerElement.clientHeight
      renderer.setSize(rendererWidth, rendererWidth / aspectRatio);
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });

    //  Create scene
    const scene = new THREE.Scene();

    //  Add lighting
    var light = new THREE.AmbientLight(0xff0000, 0.1)
    scene.add(light)
    var light1 = new THREE.PointLight(0xffffff, 1.0)
    light1.position.set(-10, -10, 10)
    scene.add(light1)

    // Add the cube
    var material = new THREE.MeshLambertMaterial();
    var cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
    var cube = new THREE.Mesh( cubeGeometry, material );
    cube.position.set(0,0,-100);
    scene.add( cube );		
    
    //  Add outline
    var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
    // var cubeGeometryMerged = BufferGeometryUtils.mergeVertices(cubeGeometry);
    var outlineMesh2 = new THREE.Mesh( cubeGeometry, outlineMaterial2 );

    outlineMesh2.scale.multiplyScalar(1.1);
    outlineMesh2.name = 'outline'
    cube.add( outlineMesh2 );

    function rotateMesh(mesh) {
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      // mesh.rotation.z += 0.01
  }
  
    function animate(t) {
        requestAnimationFrame( animate );
        rotateMesh(cube)
        // let color = cube.getObjectByName("outline").material.uniforms.color.value;
        // color.r = Math.sin(t * 0.01 + Math.PI) * 0.5 + 0.5;
        // color.g = Math.sin(t * 0.01 + Math.PI * 0.5) * 0.5 + 0.5;
        // color.b = Math.sin(t * 0.01 + Math.PI) * 0.5 + 0.5;
        // rotateMesh(outlineMesh2)
    
    
        renderer.render( scene, camera );
    }

    animate()

  }, []
  )





  return (
    <div className="App">
      <p>VideOrigami</p>
      <div id="video-container">
        <video controls ref={videoRef} onTimeUpdate={showProgress}>
          <source src={videoPath}
            type="video/mp4" />
        </video>
      </div>

      <div className="nav">
        {buttonElements}
      </div>

      <div id="progress-container">
        <progress id="progress" max="100" value={progress} />
        <p>{progress.toFixed(2) + "%"}</p>
      </div>
      
      <div id="container">
        <canvas id="test"></canvas>
      </div>


    </div>


  );
}

export default App;
