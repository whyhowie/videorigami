import OR from './OR.js'
import View3d from './View3dTHREE.js';
import View2d from './View2d.js'

// Main Entry Point : Orisim3D
// NodeJS dependencies : import them before Orisim3d.js
let OrigamiDemo

// Main Module
function Orisim3d(model, view2d, view3d, command) {
  // Instance variables
  this.model = model;
  this.view2d = view2d;
  this.view3d = view3d;
  this.command = command;
}

// Static values
// See OR.js or Command.js
const State = { idle: 0, run: 1, anim: 2, pause: 3, undo: 4 };

// Main startup

var commandText = ''

if (typeof window !== 'undefined') {
  // Read tag and launch
  commandText = document.getElementById("cocotte.txt").textContent;
  window.addEventListener("load", () => { initialize(commandText) });
}

var animReq

function initialize(cmdText) {
  window.removeEventListener("load", initialize);

  // Create model, Command, then lookup view2d, view3d, textarea
  var model = new OR.Model();
  model.init([-200, -200, 200, -200, 200, 200, -200, 200]);
  var command = new OR.Command(model);
  var canvas2d = window.document.getElementById('canvas2d');
  var view2d = canvas2d ? new View2d(model, canvas2d) : null;
  var canvas3d = window.document.getElementById('canvas3d');
  var view3d = canvas3d ? new View3d(model, canvas3d) : null;

  // Bind all in OriSim3d
  OrigamiDemo = new Orisim3d(model, view2d, view3d, command);

  // Run commands
  OrigamiDemo.command.command(cmdText);

  // Check settings:
  OrigamiDemo.command.autoPause = document.getElementById('auto-pause').checked

  // Launch animation
  animReq = requestAnimationFrame(loop);

  setRunningListener()
}

// Animation loop
function loop() {

  if (OrigamiDemo.model.change) {
    if (OrigamiDemo.view2d !== null) {
      OrigamiDemo.view2d.draw();
    }
    if (OrigamiDemo.view3d !== null) {
      OrigamiDemo.view3d.initBuffers();
    }
    // !! convert to boolean (should not be necessary)
    // When anim() returns false, no model changes so no repaint
    OrigamiDemo.model.change = !!OrigamiDemo.command.anim()
  }
  
  OrigamiDemo.view3d.draw();
  animReq = requestAnimationFrame(loop);
}


// Animation controls
window.takeScreenshot = takeScreenshot

window.restartAnim = restartAnim
window.previousStep = previousStep
window.pauseAnim = pauseAnim
window.continueAnim = continueAnim
window.fastForward = fastForward
window.autoPause = autoPause


function takeScreenshot() {
  OrigamiDemo.view3d.takeScreenshot()
}


function restartAnim() {
  // cancelAnimationFrame(animReq)
  // OrigamiDemo.command.state = State.idle
  console.log(OrigamiDemo.command.state)
  initialize(commandText)

}


function previousStep() {
  OrigamiDemo.command.command("u")
  // OrigamiDemo.command.state = State.idle
  // rebuild()

  OrigamiDemo.model.change = true
  OrigamiDemo.view3d.initBuffers();
}


// The pause behavior in Command.js needs to be fixed
//  for now we only pause at the end of each step
function pauseAnim() {
  OrigamiDemo.command.command("pa")
  console.log(OrigamiDemo.command.state)
}

// The continue behavior in Command.js needs to be fixed
//  for now we only work on the animation loop
function continueAnim() {
  OrigamiDemo.command.command("co")
  console.log(OrigamiDemo.command.state)
}

// This changes the appearance of the continue button
//  when commands are running
function setRunningListener() {
  let continueButtonElt = window.document.getElementById("continue")
  console.log(continueButtonElt)
  const runningListener = () => {
    if (OrigamiDemo.command.state == State.run || 
      OrigamiDemo.command.state == State.anim) {
      continueButtonElt.classList.add("running")
      return setTimeout(runningListener, 100);
    }
    // If state says not running
    continueButtonElt.classList.remove("running")
    return setTimeout(runningListener, 100); // every 100ms
  };
  runningListener();
}



// Fast-forward (skipping animation)
function fastForward() {
  OrigamiDemo.command.command("ff")
  console.log(OrigamiDemo.command.state)
}

// A checkbox handler for auto pausing at the end of commands
function autoPause(checkbox) {
  OrigamiDemo.command.autoPause = checkbox.checked
}


// Just for Node.js
// if (NODE_ENV === true && typeof module !== 'undefined' && module.exports) {
//   module.exports = Orisim3d;
// }
