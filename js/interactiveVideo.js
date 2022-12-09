const timeStamps = [...Array(12).keys()].map(x => x*0.5)  // Test time stamps


// Step diagram buttons/cards
let timeButtonsElement = document.getElementById('time-buttons')
let buttonElements = []

// We use either local video or YouTube video
let videoElement = document.getElementById('video-demo') 
// let youtubeElement = document.getElementById('youtube-demo') 

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var youTubeElement;
function onYouTubeIframeAPIReady() {
  youTubeElement = new YT.Player('youtube-demo', {
    videoId: 'DsfUk8fjLeA',
    playerVars: {
      'playsinline': 1
    },
    events: {
    }
  });
  document.getElementsByTagName('iframe')[0].setAttribute("sandbox",
    "allow-scripts allow-same-origin allow-presentation allow-popups allow-forms")
}



 // Progress bar
let progressElement = document.getElementById('progress')
let progressTextElement = document.createElement('p')
let currentProgress = 0
progressTextElement.innerText = `${currentProgress.toFixed(2)}%`

if (progressElement) {
  progressElement.insertAdjacentElement("afterend", progressTextElement)
}




// Add the buttons
timeStamps.map( (t, idx) => {
    let buttonElement = document.createElement("button")
    buttonElement.classList.add('button')
    buttonElement.setAttribute('data-start', t)
    buttonElement.setAttribute('id', 'button-'+idx)
    buttonElement.innerHTML = `<img src='assets/images/steps/step (${idx}).png' 
      alt="Folding step ${idx}" title="Folding step ${idx}"
      width="200" height="200">
        Step ${idx}
      </img>`
    // buttonElement.innerHTML = '@' + t.toFixed(1) + ' second'
    buttonElement.setAttribute('onclick', 'jumpTo(event)')
    timeButtonsElement.appendChild(buttonElement)
    buttonElements.push(buttonElement)
})

// Click on the button and jump to the specific second
function jumpTo(event) {    // Jump to certain time of the video
    let startTimestamp = event.currentTarget.getAttribute("data-start")
    console.log(startTimestamp)
    event.preventDefault();

    if (videoElement) {
      videoElement.currentTime = startTimestamp;
      // Play if playing; pause if paused
      videoElement.paused ? videoElement.pause() : videoElement.play(); 
    }

    if (youTubeElement) {
      let youTubeStatus = youTubeElement.getPlayerState;
      youTubeElement.seekTo(startTimestamp);
      if (youTubeStatus==2 || youTubeStatus==0) { // if paused (2) or ended (3) 
        youTubeElement.pauseVideo()
      }
    }
    
    
}



function showProgress(event) {    // Scroll based on video progress
    if (isNaN(event.target.duration))   // duration is NotaNumber at Beginning.
      return;
    currentProgress = event.target.currentTime / event.target.duration * 100   // Find the progress and set the state 

    // Make previously highlighted active button inactive
    timeStamps.map((_,idx) => {
      buttonElements[idx].classList.remove('current')
    })
    

    // Find the new button to highlight
    let currentTime = event.target.currentTime
    let diffArr = timeStamps.map(timeStamp => Math.abs(currentTime - timeStamp));
    let minNumber = Math.min(...diffArr);
    let minNumberIndex = diffArr.findIndex(x => x === minNumber);
    let currentButtonElement = buttonElements[minNumberIndex]

    // Scroll the step card into view
    currentButtonElement.classList.add('current')
    currentButtonElement.scrollIntoView({behavior: "auto", block: "nearest", inline: "center"});

    // Update progress value
    if (progressElement) {  // alternatively can use try...catch
      progressElement.setAttribute("value", currentProgress)
      progressTextElement.innerText = `${currentProgress.toFixed(2)}%`
    }
  }



  function show2Dcanvas(checkbox) {
    let canvas2dElement = document.getElementById("canvas2d")
    // !checkbox.checked ? canvas2dElement.setAttribute("hidden",'') :
    //   canvas2dElement.removeAttribute("hidden")
    checkbox.checked ? canvas2dElement.classList.remove("collapse") :
    canvas2dElement.classList.add("collapse")
  }