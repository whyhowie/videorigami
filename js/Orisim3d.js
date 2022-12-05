import OR from './OR.js'
import View3d from './View3dTHREE.js';
import View2d from './View2d.js'

// Main Entry Point : Orisim3D
// NodeJS dependencies : import them before Orisim3d.js
let OrigamiDemo

// Main Module
function Orisim3d(model, view2d, view3d, command) {
  // Instance variables
  this.model  = model;
  this.view2d = view2d;
  this.view3d = view3d;
  this.command = command;
}

// Main startup



if (typeof window !== 'undefined') {
  window.addEventListener("load", initialize );
}

let isRunning = false

function initialize () {
  window.removeEventListener( "load", initialize );

  // Create model, Command, then lookup view2d, view3d, textarea
  var model = new OR.Model();
  model.init([-200, -200, 200, -200, 200, 200, -200, 200]);
  var command      = new OR.Command(model);
  var canvas2d     = window.document.getElementById('canvas2d');
  var view2d       = canvas2d ? new View2d(model, canvas2d) : null;
  var canvas3d     = window.document.getElementById('canvas3d');
  var view3d       = canvas3d ? new View3d(model, canvas3d) : null;

  // Bind all in OriSim3d
  OrigamiDemo = new Orisim3d(model, view2d, view3d, command);

  // Read tag and launch
  var tag = document.getElementById("cocotte.txt");
  OrigamiDemo.command.command(tag.textContent);

  // Launch animation
  requestAnimationFrame(loop);
}

function rebuild () { // Not sure if it works yet
  var model = OrigamiDemo.model;
  var command = OrigamiDemo.command;

  var canvas2d     = window.document.getElementById('canvas2d');
  var view2d       = canvas2d ? new View2d(model, canvas2d) : null;
  var canvas3d     = window.document.getElementById('canvas3d');
  var view3d       = canvas3d ? new View3d(model, canvas3d) : null;

  OrigamiDemo = new Orisim3d(model, view2d, view3d, command);

  // Launch animation
  // console.log("iCmd from OrigamiDemo: " + OrigamiDemo.command.iCmd)
  // console.log("currentCmd from OrigamiDemo: " + OrigamiDemo.command.currentCmd)
  OrigamiDemo.model.change = true;
  requestAnimationFrame(loop);
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
  requestAnimationFrame(loop);
}


// Animation controls
window.restartAnim = restartAnim
window.previousStep = previousStep
window.pauseAnim = pauseAnim
window.continueAnim = continueAnim

function restartAnim () {
  OrigamiDemo.command.state = State.idle
  console.log(OrigamiDemo.command.state)
  initialize()
}


function previousStep () {
  OrigamiDemo.command.command("u")
  // rebuild()
  // OrigamiDemo.view3d.draw()
  console.log(OrigamiDemo.command.state)
  // OrigamiDemo.model.change = true
}


// The pause behavior in Command.js needs to be fixed
//  for now we only pause at the end of each step
function pauseAnim () { 
  OrigamiDemo.command.command("pa")
  console.log(OrigamiDemo.command.state)
  // isRunning = false
}

// The continue behavior in Command.js needs to be fixed
//  for now we only work on the animation loop
function continueAnim () {
  OrigamiDemo.command.command("co")
  console.log(OrigamiDemo.command.state)
}

// Static values
// See OR.js or Command.js
const State = {idle:0, run:1, anim:2, pause:3, undo:4};


// Just for Node.js
// if (NODE_ENV === true && typeof module !== 'undefined' && module.exports) {
//   module.exports = Orisim3d;
// }
