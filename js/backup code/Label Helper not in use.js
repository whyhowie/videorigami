
  // Label vertices and faces (not working)
  var size = 10;
  var color = 0xff0000;

  var indexesMode1 = 2 // face 	//  mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face
  let vertexFaceNumbersHelper1 = new vertexFaceNumbersHelper( model, indexesMode1, size, color );
  vertexFaceNumbersHelper1.update( indexesMode1 );














//-----------------------------------------------------------
  // Helper function for labeling faces
  // https://hofk.de/main/discourse.threejs/2018/HelperExample/HelperExample.html

  function vertexFaceNumbersHelper(model, mode, size, color) {
    //  mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face
    var verticesCount;
    var facesCount;

    var vertexNumbers = [];
    var faceNumbers = [];
    var materialDigits = new THREE.LineBasicMaterial({ color: color });
    var geometryDigit = [];
    var digit = [];
    var d100, d10, d1;		// digits
    var coordDigit = [];	// design of the digits


    var digitPositions = [];

    function numbering() {

      i1++;														// starts with  -1 + 1 = 0		
      if (i1 === 10) { i1 = 0; i10++ }
      if (i10 === 10) { i10 = 0; i100++ }
      if (i100 === 10) { i100 = 0 }								// hundreds (reset when overflow)

      if (i100 > 0) {
        d100 = digit[i100].clone();							// digit for hundreds
        board.add(d100);										// on the board ...
        d100.position.x = -8 * 0.1 * size;						// ... move slightly to the left			
      }

      if ((i100 > 0) || ((i100 === 0) && (i10 > 0))) {	// no preceding zeros tens			
        d10 = digit[i10].clone();								// digit for tenth
        board.add(d10);										// on the board			
      }

      d1 = digit[i1].clone();									// digit 
      board.add(d1);											//  on the board ...
      d1.position.x = 8 * 0.1 * size;		 						// ... move slightly to the right					
    }

    coordDigit[0] = [0, 0, 0, 9, 6, 9, 6, 0, 0, 0];
    coordDigit[1] = [0, 6, 3, 9, 3, 0];
    coordDigit[2] = [0, 9, 6, 9, 6, 6, 0, 0, 6, 0];
    coordDigit[3] = [0, 9, 6, 9, 6, 5, 3, 5, 6, 5, 6, 0, 0, 0];
    coordDigit[4] = [0, 9, 0, 5, 6, 5, 3, 5, 3, 6, 3, 0];
    coordDigit[5] = [6, 9, 0, 9, 0, 5, 6, 5, 6, 0, 0, 0];
    coordDigit[6] = [6, 9, 0, 9, 0, 0, 6, 0, 6, 5, 0, 5];
    coordDigit[7] = [0, 9, 6, 9, 6, 6, 0, 0];
    coordDigit[8] = [0, 0, 0, 9, 6, 9, 6, 5, 0, 5, 6, 5, 6, 0, 0, 0];
    coordDigit[9] = [6, 5, 0, 5, 0, 9, 6, 9, 6, 0, 0, 0];


    if (model) {
      if (mode === 1 || mode === 3) {
        verticesCount = model.points.length;
      }

      if (mode === 2 || mode === 3) {
        facesCount = model.faces.length;
      }

      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < coordDigit[i].length / 2; j++) {
          let vertices = []
          vertices.push(new THREE.Vector3(0.1 * size * coordDigit[i][2 * j], 0.1 * size * coordDigit[i][2 * j + 1], 0))
          geometryDigit[i] = new THREE.BufferGeometry().setFromPoints(vertices);
        }

        digit[i] = new THREE.Line(geometryDigit[i], materialDigits);
      }

      if (mode === 1 || mode === 3) {
        var i100 = 0;
        var i10 = 0;
        var i1 = -1;

        for (var i = 0; i < verticesCount; i++) {
          // Number on board, up to three digits are pinned there	
          var board = new THREE.Mesh(new THREE.BufferGeometry());

          numbering(); // numbering the vertices, hundreds ...

          vertexNumbers.push(board);	// place the table in the vertex numbering data field
          mesh.add(vertexNumbers[i]);
        }
      }

      if (mode === 2 || mode === 3) {
        var i100 = 0;
        var i10 = 0;
        var i1 = -1;

        for (var i = 0; i < facesCount; i++) {
          // Number on board, up to three digits are pinned there

          var board = new THREE.Mesh(new THREE.BufferGeometry());

          numbering(); // numbering the facesces, hundreds ...

          faceNumbers.push(board);	// place the table in the face numbering data field
          paper.add(faceNumbers[i]);
        }
      }
    }

    // update helper

    this.update = function (mode) {
      var x, y, z;

      // Geometry	
      if (model) {
        if (mode === 1 || mode === 3) {
          for (var n = 0; n < vertexNumbers.length; n++) {
            vertexNumbers[n].position.set(vertices[n].x, vertices[n].y, vertices[n].z);
            vertexNumbers[n].quaternion.copy(camera.quaternion);
          }
        }


        if (mode === 2 || mode === 3) {
          

          for (var iFace = 0; iFace < faceNumbers.length; iFace++) {
            var f = model.faces[iFace];
            var pts = f.points;
            // Normal needed for Offset and used for lightning
            f.computeFaceNormal();
            var n = f.normal;
            // Triangle FAN can be used only because of convex CCW face
            var c = pts[0]; // center
            var p = pts[1]; // previous
            var s = pts[2]; // second

            x = 0;
            x += c.x + f.offset * n[0];
            x += p.x + f.offset * n[0];
            x += s.x + f.offset * n[0];
            x /= 3;

            y = 0;
            y += c.y + f.offset * n[1];
            y += p.y + f.offset * n[1];
            y += s.y + f.offset * n[1];
            y /= 3;

            z = 0;
            z += c.z + f.offset * n[2];
            z += p.z + f.offset * n[2];
            z += s.z + f.offset * n[2];
            z /= 3;

            faceNumbers[iFace].position.set(x, y, z);
            faceNumbers[iFace].quaternion.copy(camera.quaternion);
          }
        }
      }
    }
  }
