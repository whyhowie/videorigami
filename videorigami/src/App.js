import React, { useState, useEffect, useRef } from "react";
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
    const script = document.createElement('script');

    script.src = "./js/app.js";
    script.type = "text/javascript"
    script.async = true;

    document.body.appendChild(script);

    // return () => {
    //   document.body.removeChild(script);
    // }
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
      
      <div className="title">
        <h1>Origami Test</h1>
      </div>
      <div>
        <canvas id="canvas2d"></canvas>
        <canvas id="canvas3d"></canvas>
      </div>
      <script id="cocotte.txt" type="not-javascript">
        // Cocotte
        d -200 200 -200 -200 200 -200 200 200
        // Marque les médianes et diagonales
        c 0 1 c 0 3 c 0 2 c 1 3)
        // lol 10 15 lol 3 12)
        zf
        
        // t 2000 r 13 -170 0 4 8 13 
        t 2000 r 9 -178 1 r 6 178 3 a 0 4 8)
        t 2000 r 13 89 4 r 12 89 8 a 0)


      </script>
      <img style={{display: 'none'}} id="front" src="textures/front.jpg"/>
      <img style={{display: 'none'}} id="back"  src="textures/back.jpg"/>


    </div>

  );
}

export default App;
