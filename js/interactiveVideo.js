const timeStamps = [...Array(12).keys()].map(x => x*0.5)

let timeButtonsElement = document.getElementById('time-buttons')
let buttonElements = []
let videoElement = document.getElementById('video-demo')
let progressElement = document.getElementById('progress')
let progressTextElement = document.createElement('p')
let currentProgress = 0
progressTextElement.innerText = `${currentProgress.toFixed(2)}%`
progressElement.insertAdjacentElement("afterend", progressTextElement)



// Add the buttons
timeStamps.map( (t, idx) => {
    let buttonElement = document.createElement("button")
    buttonElement.classList.add('button')
    buttonElement.setAttribute('data-start', t)
    buttonElement.setAttribute('id', 'button-'+idx)
    buttonElement.innerHTML = `<img src='../assets/images/cocotte-sticker.png' alt="Cocotte Sticker Icon" width="200" height="200">Step ${idx}</img>`
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
    videoElement.currentTime = startTimestamp;

    // Play if playing; pause if paused
    videoElement.paused ? videoElement.pause() : videoElement.play(); 
    
}



function showProgress(event) {    // Scroll based on video progress
    if (isNaN(event.target.duration))   // duration is NotaNumber at Beginning.
      return;
    currentProgress = event.target.currentTime / event.target.duration * 100   // Find the progress and set the state 

    // Make previously highlighted active button inactive
    timeStamps.map((_,idx) => {
      buttonElements[idx].classList.remove('active')
    })
    

    // Find the new button to highlight
    let currentTime = event.target.currentTime
    let diffArr = timeStamps.map(timeStamp => Math.abs(currentTime - timeStamp));
    let minNumber = Math.min(...diffArr);
    let minNumberIndex = diffArr.findIndex(x => x === minNumber);
    let currentButtonElement = buttonElements[minNumberIndex]

    // Scroll into view
    currentButtonElement.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
    currentButtonElement.classList.add('active')

    // Update progress value
    progressElement.setAttribute("value", currentProgress)
    progressTextElement.innerText = `${currentProgress.toFixed(2)}%`
  }



  function show2Dcanvas(checkbox) {
    let canvas2dElement = document.getElementById("canvas2d")
    // !checkbox.checked ? canvas2dElement.setAttribute("hidden",'') :
    //   canvas2dElement.removeAttribute("hidden")
    checkbox.checked ? canvas2dElement.classList.remove("collapse") :
    canvas2dElement.classList.add("collapse")
  }