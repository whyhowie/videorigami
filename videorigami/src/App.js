import React, { useState, useEffect, useRef } from "react";
import * as THREE from 'three'
import './App.css';



function App() {
  const videoRef = useRef();
  const videoPath = process.env.PUBLIC_URL + "/assets/videos/catjam_blue.mp4"


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
      const script = document.createElement("script");
      script.src = "cubeAnimation.js"; // Public folder
      script.type = "module"
      script.async = true;
      document.body.appendChild(script);
  })


  // useEffect(() => {
  //   let canvasElement = document.getElementById("test")
  //   let containerElement  = document.getElementById("container")
  //   const renderer = new THREE.WebGLRenderer({canvas: canvasElement});
  //   let rendererWidth = containerElement.clientWidth
  //   let aspectRatio = containerElement.clientWidth / containerElement.clientHeight
  //   renderer.setSize( rendererWidth, rendererWidth / aspectRatio );
  //   renderer.setClearColor(0x88ff88)

  //   const camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 20000 );
  //   camera.position.set( 0, 0, 50 );
  //   camera.lookAt( 0, 0, 0 );

  //   //  Responsive window 
  //   window.addEventListener("resize", () => {
  //     rendererWidth = containerElement.clientWidth
  //     aspectRatio = containerElement.clientWidth / containerElement.clientHeight
  //     renderer.setSize(rendererWidth, rendererWidth / aspectRatio);
  //     camera.aspect = aspectRatio;
  //     camera.updateProjectionMatrix();
  //     renderer.render(scene, camera);
  //   });

  //   //  Create scene
  //   const scene = new THREE.Scene();

  //   //  Add lighting
  //   var light = new THREE.AmbientLight(0xff0000, 0.1)
  //   scene.add(light)
  //   var light1 = new THREE.PointLight(0xffffff, 1.0)
  //   light1.position.set(-10, -10, 10)
  //   scene.add(light1)

  //   // Add the cube
  //   var material = new THREE.MeshLambertMaterial();
  //   var cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
  //   var cube = new THREE.Mesh( cubeGeometry, material );
  //   cube.position.set(0,0,-40);
  //   scene.add( cube );		
    
  //   //  Add outline
  //   var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
  //   // var cubeGeometryMerged = BufferGeometryUtils.mergeVertices(cubeGeometry);
  //   var outlineMesh2 = new THREE.Mesh( cubeGeometry, outlineMaterial2 );

  //   outlineMesh2.scale.multiplyScalar(1.1);
  //   outlineMesh2.name = 'outline'
  //   cube.add( outlineMesh2 );

  //   function rotateMesh(mesh) {
  //     mesh.rotation.x += 0.01
  //     mesh.rotation.y += 0.01
  //     mesh.rotation.z += 0.01
  // }
  
  //   function animate(t) {
  //       requestAnimationFrame( animate );
  //       rotateMesh(cube) 
  //       renderer.render( scene, camera );
  //   }

  //   animate()

  // }, []
  // )

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
        <canvas id="canvas2d"></canvas>
        <canvas id="canvas3d"></canvas>
      </div>
      
      <div id="cocotte.txt">
      // Cocotte
      d -200 200 -200 -200 200 -200 200 200
      // Marque les médianes et diagonales
      c 0 1 c 0 3 c 0 2 c 1 3
      // Marque les demi-bords
      c 0 8 c 8 3 c 0 4 c 4 1
      // Marque les coins
      c 6 0 c 6 1 c 6 2 c 6 3
      // Retourne iad interpolateur accelerate decelerate
      iad
      t 500 ty 180)
      // Replie le coin et retourne
      t 1000 r 48 180 21 0 10)
      o 1 24 0 7 25
      t 500 ty 180)
      // Bord haut
      t 1000 r 35 179 8 17 3) // Pas mal
      t 500 r 55 90 17 3 a 3 19)
      // Côté droit
      t 1000 r 29 179 5 22 2 a 19 3 17)
      t 500 r 54 -45 19 3 17)
      t 100 r 55 -30 17 a 3) // Ferme la patte
      // Oreille bas
      t 500 r 53 -90 22 2 a 2 18) // Bof à revoir
      t 1000 r 45 179 1 12 7 a 18 2 22)
      t 500 r 53 -87 22 2 18 a 18 2)
      t 100 r 52 30 18 a 2) // Ferme la patte
      // Oreille bas gauche
      t 500 r 50 -90 1 12 a 1 24)
      t 1000 r 23 179 4 a 24 1 12)
      t 500 r 50 -87 12 1 24 a 24 1)
      t 100 r 50 -30 24 a 1) // Ferme la patte
      // Replie en ouvrant le bec
      t 500 r 16 -90 10 8 20 17 16 14 3 19 r 40 -90 0)
      t 500 r 16 -80 10 8 20 17 16 14 3 19 a 0)
      // Ajuste à peu près
      o 0
      r 24 10 4 r 37 -10 8
      r 29 -5 5 8 r 23 -5 7 4
      r 15 10 21  r 15 -10 10
      // Montre
      iao
      t 1000 zf)
      t 1000 tz -45)
      t 1000 zf)
      iso t 4000 ty 360)
      </div>



    </div>

  );
}

export default App;
