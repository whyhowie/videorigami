// This file contains all the mathematical calculations and commands
//  for the origami model


// ----------------------------------------------------------------
// File:js/Point.js
// Point to hold Points
var OR = OR || {};

// 3D : x y z
// Crease pattern flat : xf, yf

OR.Point = function (xf, yf, x, y, z) {

  // Create new Point(x,y,z)
  if (arguments.length === 3) {
    // x y z 3D
    this.x = xf;
    this.y = yf;
    this.z = x;
    // x y Flat, in unfolded state
    this.xf = xf;
    this.yf = yf;
  }

  // Create new Point(xf,yf)
  else if (arguments.length === 2) {
    // x y Flat, in unfolded state
    this.xf = xf;
    this.yf = yf;
    // x y z 3D
    this.x = xf;
    this.y = yf;
    this.z = 0;
  }

  // Create with new Point(xf,yf, x,y,z)
  else {
    // x y Flat, in unfolded state
    this.xf = 0 | xf;
    this.yf = 0 | yf;
    // x y z 3D
    this.x = 0 | x;
    this.y = 0 | y;
    this.z = 0 | z;
  }

  this.select = false;

  // Set x y Flat and  x y z 3D
  function set5d(xf, yf, x, y, z) {
    // x y Flat, in unfolded state
    this.xf = 0 | xf;
    this.yf = 0 | yf;
    // x y z 3D
    this.x = 0 | x;
    this.y = 0 | y;
    this.z = 0 | z;
    return this;
  }

  // Set x y z 3D
  function set3d(x, y, z) {
    this.x = 0 | x;
    this.y = 0 | y;
    this.z = 0 | z;
    return this;
  }

  // Set x y z 2D
  function set2d(xf, yf) {
    this.xf = 0 | xf;
    this.yf = 0 | yf;
    return this;
  }

  // Sqrt(this.this)
  function length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // Scale
  function scale(t) {
    this.x *= t;
    this.y *= t;
    this.z *= t;
    return this;
  }

  // Normalize as a vector
  function norm() {
    var lg = this.length();
    return this.scale(1.0 / lg);
  }

  // String representation [x,y,z xf,yf]
  function toString() {
    return "[" + Math.round(this.x) + "," + Math.round(this.y) + "," + Math.round(this.z)
      + "  " + Math.round(this.xf) + "," + Math.round(this.yf) + "]";
  }

  // Short String representation [x,y,z]
  function toXYZString() {
    return "[" + Math.round(this.x) + "," + Math.round(this.y) + "," + Math.round(this.z) + "]";
  }

  // Short String representation [xf,yf]
  function toXYString() {
    return "[" + Math.round(this.xf) + "," + Math.round(this.yf) + "]";
  }

  // API
  this.set5d = set5d;
  this.set3d = set3d;
  this.set2d = set2d;
  this.length = length;
  this.scale = scale;
  this.norm = norm;
  this.toString = toString;
  this.toXYZString = toXYZString;
  this.toXYString = toXYString;
};

// Static methods

// Dot a with b
OR.Point.dot = function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

// New Vector a + b
OR.Point.add = function add(a, b) {
  return new OR.Point(a.x + b.x, a.y + b.y, a.z + b.z);
};

// New Vector a - b
OR.Point.sub = function sub(a, b) {
  return new OR.Point(a.x - b.x, a.y - b.y, a.z - b.z);
};

// Return 0 if OR.Point is near x,y,z
OR.Point.compare3d = function compare3D(p1, p2, y, z) {
  if (arguments.length === 2) {
    // compare3D (p1, p2)
    var dx2 = (p1.x - p2.x) * (p1.x - p2.x);
    var dy2 = (p1.y - p2.y) * (p1.y - p2.y);
    var dz2 = (p1.z - p2.z) * (p1.z - p2.z);
    var d = dx2 + dy2 + dz2;
    d = d > 1 ? d : 0;
  } else {
    // compare3D (p1, x,y,z)
    dx2 = (p1.x - p2) * (p1.x - p2);
    dy2 = (p1.y - y) * (p1.y - y);
    dz2 = (p1.z - z) * (p1.z - z);
    d = dx2 + dy2 + dz2;
    d = d > 1 ? d : 0;
  }
  return d;
};

// Return 0 if OR.Point is near xf,yf
OR.Point.compare2d = function compare2D(p1, p2) {
  var dx2 = (p1.xf - p2.xf) * (p1.xf - p2.xf);
  var dy2 = (p1.yf - p2.yf) * (p1.yf - p2.yf);
  return Math.sqrt(dx2 + dy2);
};



//  -----------------------------------------------------------
// File: js/Segment.js

// Segment to hold Segments : Two points p1 p2
OR.Segment = function (p1, p2, type) {
  // API
  this.p1 = p1;
  this.p2 = p2;
  this.type = OR.Segment.PLAIN | type;
  this.angle = 0;
  this.select = false;

  // Reverse order of the 2 points of this OR.Segment
  function reverse() {
    var p = this.p1;
    this.p1 = this.p2;
    this.p2 = p;
  }

  // 3D Length in space
  function length3d() {
    return Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x)
      + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y)
      + (this.p1.z - this.p2.z) * (this.p1.z - this.p2.z));
  }

  // 2D Length in flat view
  function length2d() {
    return Math.sqrt(
      (this.p1.xf - this.p2.xf) * (this.p1.xf - this.p2.xf)
      + (this.p1.yf - this.p2.yf) * (this.p1.yf - this.p2.yf));
  }

  // String representation
  function toString() {
    return "S(P1:" + this.p1.toXYZString() + " " + this.p1.toXYString() + ", P2:" + this.p2.toXYZString() + " " + this.p2.toXYString() + ")";
    // +" type:"+this.type+" angle:"+this.angle
    // +" 2d:"+this.lg2d+" 3d:"+this.lg3d+" "
    // +" L="+faceLeft+" R="+faceRight+")";
  }

  // API
  this.reverse = reverse;
  this.length3d = length3d;
  this.length2d = length2d;
  this.toString = toString;
};

// Static values
OR.Segment.PLAIN = 0;
OR.Segment.EDGE = 1;
OR.Segment.MOUNTAIN = 2;
OR.Segment.VALLEY = 3;
OR.Segment.TEMPORARY = -1;
OR.Segment.EPSILON = 0.01;

// Static methods

// Compares segments s1 with s2
OR.Segment.compare = function (s1, s2) {
  var d = OR.Point.compare3d(s1.p1, s2.p1) + OR.Point.compare3d(s2.p2, s2.p2);
  return d > 1 ? d : 0;
};

// 2D Distance between Segment and Point @testOK
OR.Segment.distanceToSegment = function (seg, pt) {
  var x1 = seg.p1.x;
  var y1 = seg.p1.y;
  var x2 = seg.p2.x;
  var y2 = seg.p2.y;
  var x = pt.x;
  var y = pt.y;
  var l2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  var r = ((y1 - y) * (y1 - y2) + (x1 - x) * (x1 - x2)) / l2;
  var s = ((y1 - y) * (x2 - x1) - (x1 - x) * (y2 - y1)) / l2;
  var d = 0;
  if (r <= 0) {
    d = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
  } else if (r >= 1) {
    d = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
  } else {
    d = (Math.abs(s) * Math.sqrt(l2));
  }
  return d;
};

// Closest points from s1 to s2 returned as a new segment
OR.Segment.closestSeg = function closestSeg(s1, s2) {
  // On this segment we have : S1(t1)=p1+t1*(p2-p1)       = p1+t1*v1   = p
  // On v argument we have   : S2(t2)=v.p1+t2*(v.p2-v.p1) = s2.p2+t2*v2 = q
  // Vector pq perpendicular to both lines : pq(t1,t2).v1=0  pq(t1,t2).v2=0
  // Cramer system :
  // (v1.v1)*t1 - (v1.v2)*t2 = -v1.r <=> a*t1 -b*t2 = -c
  // (v1.v2)*t1 - (v2.v2)*t2 = -v2.r <=> b*t1 -e*t2 = -f
  // Solved to t1=(bf-ce)/(ae-bb) t2=(af-bc)/(ae-bb)
  var t1;
  var t2;
  // s1 direction
  var v1 = new OR.Point(s1.p2.x - s1.p1.x, s1.p2.y - s1.p1.y, s1.p2.z - s1.p1.z);
  // s2 direction
  var v2 = new OR.Point(s2.p2.x - s2.p1.x, s2.p2.y - s2.p1.y, s2.p2.z - s2.p1.z);
  // s2.p1 to s1.p1
  var r = new OR.Point(s1.p1.x - s2.p1.x, s1.p1.y - s2.p1.y, s1.p1.z - s2.p1.z);
  var a = OR.Point.dot(v1, v1); // squared length of s1
  var e = OR.Point.dot(v2, v2); // squared length of s2
  var f = OR.Point.dot(v2, r);  //
  // Check degeneration of segments into points
  var closest;
  if (a <= OR.Segment.EPSILON && e <= OR.Segment.EPSILON) {
    // Both degenerate into points
    t1 = t2 = 0.0;
    closest = new OR.Segment(s1.p1, s2.p1, OR.Segment.TEMPORARY);
  } else {
    if (a <= OR.Segment.EPSILON) {
      // This segment degenerate into point
      t1 = 0.0;
      t2 = f / e; // t1=0 => t2 = (b*t1+f)/e = f/e
      t2 = t2 < 0 ? 0 : t2 > 1 ? 1 : t2;
    }
    else {
      var c = OR.Point.dot(v1, r);
      if (e <= OR.Segment.EPSILON) {
        // Second segment degenerate into point
        t2 = 0.0;
        t1 = -c / a; // t2=0 => t1 = (b*t2-c)/a = -c/a
        t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
      } else {
        // General case
        var b = OR.Point.dot(v1, v2); // Delayed computation of b
        var denom = a * e - b * b; // Denominator of Cramer system
        // Segments not parallel, compute closest and clamp
        if (denom !== 0.0) {
          t1 = (b * f - c * e) / denom;
          t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
        }
        else {
          // Arbitrary point, here 0 => p1
          t1 = 0;
        }
        // Compute closest on L2 using
        t2 = (b * t1 + f) / e;
        // if t2 in [0,1] done, else clamp t2 and recompute t1
        if (t2 < 0.0) {
          t2 = 0;
          t1 = -c / a;
          t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
        }
        else if (t2 > 1.0) {
          t2 = 1.0
            ;
          t1 = (b - c) / a;
          t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
        }
      }
    }
    var c1 = OR.Point.add(s1.p1, v1.scale(t1)); // c1 = p1+t1*(p2-p1)
    var c2 = OR.Point.add(s2.p1, v2.scale(t2)); // c2 = p1+t2*(p2-p1)
    closest = new OR.Segment(c1, c2);
  }
  return closest;
};

// Closest points from s1(line) to s2(line) returned as a new segment
OR.Segment.closestLine = function closestLine(s1, s2) {
  // On s1 segment we have : S1(t1)=p1+t1*(p2-p1)       = p1+t1*v1   = p
  // On s2 segment we have : S2(t2)=v.p1+t2*(v.p2-v.p1) = s2.p2+t2*v2 = q
  // Vector pq perpendicular to both lines : pq(t1,t2).v1=0  pq(t1,t2).v2=0
  // Cramer system :
  // (v1.v1)*t1 - (v1.v2)*t2 = -v1.r <=> a*t1 -b*t2 = -c
  // (v1.v2)*t1 - (v2.v2)*t2 = -v2.r <=> b*t1 -e*t2 = -f
  // Solved to t1=(bf-ce)/(ae-bb) t2=(af-bc)/(ae-bb)
  var t1;
  var t2;
  var v1 = new OR.Point(s1.p2.x - s1.p1.x, s1.p2.y - s1.p1.y, s1.p2.z - s1.p1.z); // s1 direction
  var v2 = new OR.Point(s2.p2.x - s2.p1.x, s2.p2.y - s2.p1.y, s2.p2.z - s2.p1.z); // s direction
  var r = new OR.Point(s1.p1.x - s2.p1.x, s1.p1.y - s2.p1.y, s1.p1.z - s2.p1.z); // s2.p1 to s1.p1
  var a = OR.Point.dot(v1, v1); // squared length of s1
  var e = OR.Point.dot(v2, v2); // squared length of s2
  var f = OR.Point.dot(v2, r);  //
  // Check degeneration of segments into points
  var closest;
  if (a <= OR.Segment.EPSILON && e <= OR.Segment.EPSILON) {
    // Both degenerate into points
    t1 = t2 = 0.0;
    closest = new OR.Segment(s1.p1, s2.p1, OR.Segment.TEMPORARY, -1);
  } else {
    if (a <= OR.Segment.EPSILON) {
      // This segment degenerate into point
      t1 = 0.0;
      t2 = f / e; // t1=0 => t2 = (b*t1+f)/e = f/e
    } else {
      var c = OR.Point.dot(v1, r);
      if (e <= OR.Segment.EPSILON) {
        // Second segment degenerate into point
        t2 = 0.0;
        t1 = -c / a; // t2=0 => t1 = (b*t2-c)/a = -c/a
      } else {
        // General case
        var b = OR.Point.dot(v1, v2); // Delayed computation of b
        var denom = a * e - b * b; // Denominator of cramer system
        // Segments not parallel, compute closest
        if (denom !== 0.0) {
          t1 = (b * f - c * e) / denom;
        }
        else {
          // Arbitrary point, here 0 => p1
          t1 = 0;
        }
        // Compute closest on L2 using
        t2 = (b * t1 + f) / e;
      }
    }
    var c1 = OR.Point.add(s1.p1, v1.scale(t1)); // c1 = p1+t1*(p2-p1)
    var c2 = OR.Point.add(s2.p1, v2.scale(t2)); // c2 = p1+t2*(p2-p1)
    closest = new OR.Segment(c1, c2);
  }
  // console.log(closest.length2d())
  return closest;
};



//  -----------------------------------------------------------
// File: js/Plane.js
// Dependencies : import them before Plane.js in browser

// Plane is defined by an origin point R and a normal vector N
// a point P is on plane if and only if RP.N = 0
OR.Plane = function (r, n) {
  this.r = r;
  this.n = n;

  function isOnPlane(p) {
    // Point P is on plane iff RP.N = 0
    var rp = OR.Point.sub(p, this.r);
    var d = OR.Point.dot(rp, this.n);
    return (Math.abs(d) < 0.1);
  }

  // Intersection of This plane with segment defined by two points
  function intersectPoint(a, b) {
    // (A+tAB).N = d <=> t = (d-A.N)/(AB.N) then Q=A+tAB 0<t<1
    var ab = new OR.Point(b.x - a.x, b.y - a.y, b.z - a.z);
    var abn = OR.Point.dot(ab, this.n);
    // segment parallel to plane
    if (abn === 0)
      return null;
    // segment crossing
    var t = (OR.Point.dot(this.r, this.n) - OR.Point.dot(a, this.n)) / abn;
    if (t >= 0 && t <= 1.0)
      return OR.Point.add(a, ab.scale(t));
    return null;
  }

  // Intersection of This plane with Segment Return Point or null
  function intersectSeg(s) {
    // (A+tAB).N=d <=> t=(d-A.N)/(AB.N) then Q=A+tAB 0<t<1
    var ab = new OR.Point(s.p2.x - s.p1.x, s.p2.y - s.p1.y, s.p2.z - s.p1.z);
    var abn = OR.Point.dot(ab, this.n);
    if (abn === 0)
      return null;
    var t = (OR.Point.dot(this.r, this.n) - OR.Point.dot(s.p1, this.n)) / abn;
    if (t >= 0 && t <= 1.0)
      return OR.Point.add(s.p1, ab.scale(t));
    return null;
  }

  // Classify point to thick plane 1 in front 0 on -1 behind
  function classifyPointToPlane(p) {
    // (A+tAB).N = d <=> d<e front, d>e behind, else on plane
    var dist = OR.Point.dot(this.r, this.n) - OR.Point.dot(this.n, p);
    if (dist > OR.Plane.THICKNESS)
      return 1;
    if (dist < -OR.Plane.THICKNESS)
      return -1;
    return 0;
  }

  // toString
  function toString() {
    return "Pl[r:" + this.r + " n:" + this.n + "]";
  }

  // API
  this.isOnPlane = isOnPlane;
  this.intersectPoint = intersectPoint;
  this.intersectSeg = intersectSeg;
  this.classifyPointToPlane = classifyPointToPlane;
  this.toString = toString;
};

// Static values
OR.Plane.THICKNESS = 1;

// Static methods

// Define a plane across 2 points
OR.Plane.across = function (p1, p2) {
  var middle = new OR.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
  var normal = new OR.Point(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
  return new OR.Plane(middle, normal);
};

// Plane by 2 points along Z
OR.Plane.by = function (p1, p2) {
  var r = new OR.Point(p1.x, p1.y, p1.z);
  // Cross product P2P1 x 0Z
  var n = new OR.Point(p2.y - p1.y, -(p2.x - p1.x), 0);
  return new OR.Plane(r, n);
};

// Plane orthogonal to Segment and passing by Point
OR.Plane.ortho = function (s, p) {
  var r = new OR.Point(p.x, p.y, p.z);
  var normal = new OR.Point(s.p2.x - s.p1.x, s.p2.y - s.p1.y, s.p2.z - s.p1.z);
  return new OR.Plane(r, normal);
};




// --------------------------------------------------------------------------
// File: js/Face.js

// Face contains points, segments, normal
OR.Face = function () {
  this.points = [];
  this.normal = [0, 0, 1];
  this.select = 0;
  this.highlight = false;
  this.offset = 0;

  // Compute Face normal
  function computeFaceNormal() {
    if (this.points.length < 3) {
      console.log("Warn Face < 3pts:" + this);
      return null;
    }
    for (var i = 0; i < this.points.length - 2; i++) {
      // Take triangles until p2p1 x p1p3 > 0.1
      var p1 = this.points[i];
      var p2 = this.points[i + 1];
      var p3 = this.points[i + 2];
      var u = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
      var v = [p3.x - p1.x, p3.y - p1.y, p3.z - p1.z];
      this.normal[0] = u[1] * v[2] - u[2] * v[1];
      this.normal[1] = u[2] * v[0] - u[0] * v[2];
      this.normal[2] = u[0] * v[1] - u[1] * v[0];
      if (Math.abs(this.normal[0]) + Math.abs(this.normal[1]) + Math.abs(this.normal[2]) > 0.1) {
        break;
      }
    }
    normalize(this.normal);
    return this.normal;
  }

  // Normalize vector v[3] = v[3]/||v[3]||
  function normalize(v) {
    var d = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v[0] /= d;
    v[1] /= d;
    v[2] /= d;
  }

  // String representation
  function toString() {
    var str = "F" + "(";
    this.points.forEach(function (p, i, a) {
      str = str + "P" + i + p.toString() + (i === a.length - 1 ? "" : " ");
    });
    str = str + ")";
    return str;
  }

  // API
  this.computeFaceNormal = computeFaceNormal;
  this.toString = toString;
};



// ----------------------------------------------------------------
// File: js/Model.js

// Model to hold Points, Segments, Faces
OR.Model = function (list) {
  // Arrays to hold points, faces, segments
  this.points = [];
  this.segments = [];
  this.faces = [];
  this.needRebuild = true;
  this.change = true; // should trigger a redraw

  // Initializes this orModel with XY points CCW @testOK
  function init(list) {
    this.points = [];
    this.segments = [];
    this.faces = [];
    var f = new OR.Face();
    // Add XY as XYZ points, make EDGE segments
    var p1 = null;
    for (var i = 0; i < list.length; i += 2) {
      var p2 = this.addPointXYZ(list[i], list[i + 1], list[i], list[i + 1], 0);
      f.points.push(p2);
      if (p1 !== null) {
        this.addSegment(p1, p2, OR.Segment.EDGE);
      }
      p1 = p2;
    }
    this.addSegment(p1, f.points[0], OR.Segment.EDGE);
    this.addFace(f);
    this.needRebuild = true;
  }

  // Adds a point to this Model or return the point at x,y @testOK
  function addPointXYZ(xf, yf, x, y, z) {
    // Create a new Point
    var p = null;
    if (arguments.length === 2) {
      p = new OR.Point(xf, yf);
    }
    else if (arguments.length === 3) {
      p = new OR.Point(x, y, z);
    }
    else if (arguments.length === 5) {
      p = new OR.Point(xf, yf, x, y, z);
    }
    else {
      console.log("Warn wrong number of Args for addPointXYZ")
    }
    this.points.push(p);
    return p;
  }

  // Adds a point to this Model or return existing point @testOK
  function addPoint(pt) {
    // Search existing points
    for (var i = 0; i < this.points.length; i++) {
      if (OR.Point.compare3d(this.points[i], pt) < 1) {
        // Return existing point instead of pt parameter
        return this.points[i];
      }
    }
    // Add new Point if not already in model
    this.points.push(pt);
    return pt;
  }

  // Adds a segment to this model @testOK
  function addSegment(p1, p2, type) {
    if (OR.Point.compare3d(p1, p2) === 0) {
      console.log("Warn Add degenerate segment:" + p1);
      return null;
    }
    var s = new OR.Segment(p1, p2, type);
    this.segments.push(s);
    return s;
  }

  // Adds a face to this model @testOK
  function addFace(f) {
    // TODO search existing faces
    this.faces.push(f);
    return f;
  }

  // Align Point p on segment s in 2D from coordinates in 3D @testOK
  function align2dFrom3d(p, s) {
    // Compute the length from p1 to p in 3D
    var lg3d = Math.sqrt((s.p1.x - p.x) * (s.p1.x - p.x)
      + (s.p1.y - p.y) * (s.p1.y - p.y)
      + (s.p1.z - p.z) * (s.p1.z - p.z));
    // Compute ratio with the segment length
    var t = lg3d / s.length3d();
    // Set 2D to have the same ratio
    p.xf = s.p1.xf + t * (s.p2.xf - s.p1.xf);
    p.yf = s.p1.yf + t * (s.p2.yf - s.p1.yf);
  } //;

  // Find face on the right of segment a b @testOK
  function faceRight(a, b) {
    if (b === undefined) {
      // Guess we have a segment instead of two points
      b = a.p2;
      a = a.p1;
    }
    var ia = 0, ib = 0;
    var right = null;
    this.faces.forEach(function (f) {
      // Both points are in face
      if (((ia = f.points.indexOf(a)) >= 0)
        && ((ib = f.points.indexOf(b)) >= 0)) {
        // a is after b, the face is on the right
        if (ia === ib + 1 || (ib === f.points.length - 1 && ia === 0)) {
          right = f;
        }
      }
    });
    return right;
  }

  // Find face on the left @testOK
  function faceLeft(a, b) {
    if (b === undefined) {
      // Guess we have a segment instead of two points
      b = a.p2;
      a = a.p1;
    }
    var ia, ib;
    var left = null;
    this.faces.forEach(function (f) {
      // Both points are in face
      if (((ia = f.points.indexOf(a)) >= 0)
        && ((ib = f.points.indexOf(b)) >= 0)) {
        // b is after a, the face is on the left
        if (ib === ia + 1 || (ia === f.points.length - 1 && ib === 0)) {
          left = f;
        }
      }
    });
    return left;
  }

  // Search face containing a and b but which is not f0 @testOK
  function searchFace(s, f0) {
    var a = s.p1;
    var b = s.p2;
    var found = null;
    this.faces.forEach(function (f) {
      if (f0 === null
        && (f.points.indexOf(a) > -1)
        && (f.points.indexOf(b) > -1)) {
        found = f;
      }
      else if (f !== f0
        && (f.points.indexOf(a)) > -1
        && (f.points.indexOf(b) > -1)) {
        found = f;
      }
    });
    return found;
  }

  // Compute angle between face left and right of a segment, angle is positive  @testOK
  function computeAngle(s) {
    var a = s.p1;
    var b = s.p2;
    // Find faces left and right
    var left = this.faceLeft(a, b);
    var right = this.faceRight(a, b);
    // Compute angle in Degrees at this segment
    if (s.type === OR.Segment.EDGE) {
      console.log("Warn Angle on Edge:" + s);
      return 0;
    }
    if (right === null || left === null) {
      console.log("Warn No right and left face for:" + s + " left:" + left + " right:" + right);
      return 0;
    }
    var nL = left.computeFaceNormal();
    var nR = right.computeFaceNormal();
    // Cross product nL nR
    var cx = nL[1] * nR[2] - nL[2] * nR[1], cy = nL[2] * nR[0] - nL[0] * nR[2], cz = nL[0] * nR[1] - nL[1] * nR[0];
    // Segment vector
    var vx = s.p2.x - s.p1.x, vy = s.p2.y - s.p1.y, vz = s.p2.z - s.p1.z;
    // Scalar product between segment and cross product, normed
    var sin = (cx * vx + cy * vy + cz * vz) /
      Math.sqrt(vx * vx + vy * vy + vz * vz);
    // Scalar between normals
    var cos = nL[0] * nR[0] + nL[1] * nR[1] + nL[2] * nR[2];
    if (cos > 1.0)
      cos = 1.0;
    if (cos < -1.0)
      cos = -1.0;
    s.angle = Math.acos(cos) / Math.PI * 180.0;
    if (Number.isNaN(s.angle)) {
      s.angle = 0.0;
    }
    if (sin < 0)
      s.angle = -s.angle;
    // Follow the convention folding in front is positive
    s.angle = -s.angle;
    return s.angle;
  }

  // Search segment containing Points a and b @testOK
  function searchSegmentTwoPoints(a, b) {
    var list = [];
    this.segments.forEach(function (s) {
      if ((OR.Point.compare3d(s.p1, a) === 0 && OR.Point.compare3d(s.p2, b) === 0)
        || (OR.Point.compare3d(s.p2, a) === 0 && OR.Point.compare3d(s.p1, b) === 0))
        list.push(s);
    });
    if (list.length > 1) {
      console.log("Error More than one segment on 2 points:" + list.length
        + " " + list[0].p1 + list[0].p2 + " " + list[1].p1 + list[1].p2);
    }
    if (list.length === 0)
      return null;
    return list[0];
  }

  // Search segments containing Point a @testOK
  function searchSegmentsOnePoint(a) {
    var list = [];
    this.segments.forEach(function (s) {
      if (s.p1 === a || s.p2 === a)
        list.push(s);
    });
    return list;
  }

  // Splits Segment by a point @testOK
  function splitSegmentByPoint(s, p) {
    // No new segment if on ending point
    if (OR.Point.compare3d(s.p1, p) === 0 || OR.Point.compare3d(s.p2, p) === 0) {
      return s;
    }
    // Create new Segment
    var s1 = this.addSegment(p, s.p2, s.type);
    // Shorten s
    s.p2 = p;
    s.length2d();
    s.length3d();
    return s1;
  }

  // Split segment on a point, add point to model, update faces containing segment @testOK
  function splitSegmentOnPoint(s1, p) {
    var pts = null, i = null;

    // Align Point p on segment s in 2D from coordinates in 3D
    this.align2dFrom3d(p, s1);
    // Add point P to first face.
    var l = this.searchFace(s1, null);
    if (l !== null && l.points.indexOf(p) === -1) {
      // Add after P2 or P1 for the left face (CCW)
      pts = l.points;
      for (i = 0; i < pts.length; i++) {
        if (pts[i] === s1.p1
          && pts[i === pts.length - 1 ? 0 : i + 1] === s1.p2) {
          pts.splice(i + 1, 0, p);
          break;
        }
        if (pts[i] === s1.p2
          && pts[i === pts.length - 1 ? 0 : i + 1] === s1.p1) {
          pts.splice(i + 1, 0, p);
          break;
        }
      }
    }
    // Add point P to second face.
    var r = this.searchFace(s1, l);
    if (r !== null && r.points.indexOf(p) === -1) {
      pts = r.points;
      // Add after P2 or P1 for the right face (CCW)
      for (i = 0; i < pts.length; i++) {
        if (pts[i] === s1.p1 && pts[i === pts.length - 1 ? 0 : i + 1] === s1.p2) {
          pts.splice(i + 1, 0, p);
          break;
        }
        if (pts[i] === s1.p2 && pts[i === pts.length - 1 ? 0 : i + 1] === s1.p1) {
          pts.splice(i + 1, 0, p);
          break;
        }
      }
    }
    // Add this as a new point to the model
    this.addPoint(p);
    // Now we can shorten s to p
    this.splitSegmentByPoint(s1, p);
    return s1;
  }

  // Splits Segment by a ratio k in  ]0 1[ counting from p1 @testOK
  function splitSegmentByRatio(s, k) {
    // Create new Point
    var p = new OR.Point();
    p.set3d(
      s.p1.x + k * (s.p2.x - s.p1.x),
      s.p1.y + k * (s.p2.y - s.p1.y),
      s.p1.z + k * (s.p2.z - s.p1.z));
    this.splitSegmentOnPoint(s, p);
  }

  // Origami
  // Split Face f by plane pl @testOK except on <:> degenerate poly
  // Complex by design
  function splitFaceByPlane(f1, pl) {
    var front = []; // Front side
    var back = []; // Back side
    var inFront = false; // Front face with at least one point
    var inBack = false;  // Back face with at least one point
    var lastinter = null; // Last intersection

    // Begin with last point
    var a = f1.points[f1.points.length - 1];
    var aSide = pl.classifyPointToPlane(a);
    for (var n = 0; n < f1.points.length; n++) {
      // Segment from previous 'a'  to current 'b'
      // 9 cases : behind -1, on 0, in front +1
      // Push to front and back
      //  	  a  b Inter front back
      // c1) -1  1 i     i b   i    bf
      // c2)  0  1 a     b     .    of
      // c3)  1  1 .     b     .    ff
      // c4)  1 -1 i     i     i b  fb
      // c5)  0 -1 a     .     a b  ob ??
      // c6) -1 -1 .           b    bb
      // c7)  1  0 b     b     .    fo
      // c8)  0  0 a b   b     .    oo
      // c9) -1  0 b     b     b    bo
      var b = f1.points[n];
      var bSide = pl.classifyPointToPlane(b);
      if (bSide === 1) {    // b in front
        if (aSide === -1) { // a behind
          // c1) b in front, a behind => edge cross bf
          var j = pl.intersectPoint(b, a);
          // Add i to model points
          var i = this.addPoint(j);
          // Add 'i' to front and back sides
          front.push(i);
          back.push(i);
          // Examine segment a,b to split (can be null if already split)
          var s = this.searchSegmentTwoPoints(a, b);
          var index = this.segments.indexOf(s);
          if (index !== -1) {
            // Set i 2D coordinates from 3D
            this.align2dFrom3d(i, s);
            // Add new segment
            this.addSegment(i, b, OR.Segment.PLAIN);
            // Modify existing set b = i
            // this.segments.splice(index, 1); has drawback
            if (s.p1 === a) {
              s.p2 = i;
            }
            else {
              s.p1 = i;
            }
          }
          // Eventually add segment from last intersection
          if (lastinter !== null) {
            this.addSegment(lastinter, i, OR.Segment.PLAIN);
            lastinter = null;
          } else {
            lastinter = i;
          }
        }
        else if (aSide === 0) {
          // c2) 'b' in front, 'a' on
          lastinter = a;
        }
        else if (aSide === 1) {
          // c3) 'b' in front 'a' in front
        }
        // In all 3 cases add 'b' to front side
        front.push(b);
        inFront = true;
      }
      else if (bSide === -1) {  // b behind
        if (aSide === 1) {        // a in front
          // c4) edge cross add intersection to both sides
          j = pl.intersectPoint(b, a);
          // Add i to model points
          i = this.addPoint(j);
          // Add 'i' to front and back sides
          front.push(i);
          back.push(i);
          // Examine segment a,b to split
          s = this.searchSegmentTwoPoints(a, b);
          index = this.segments.indexOf(s);
          if (index !== -1) {
            // Set i 2D coordinates from 3D
            this.align2dFrom3d(i, s);
            // Add new segment
            this.addSegment(i, b, OR.Segment.PLAIN);
            // Modify existing
            // this.segments.splice(index, 1); has drawback
            if (s.p1 === a) {
              s.p2 = i;
            } else {
              s.p1 = i;
            }
          }
          // Eventually add segment from last inter
          if (lastinter !== null && i !== lastinter) {
            this.addSegment(lastinter, i);
            lastinter = null;
          } else {
            lastinter = i;
          }
        }
        else if (aSide === 0) {
          // c5) 'a' on 'b' behind
          if (back[back.length - 1] !== a) {
            back.push(a);
          }
          // Eventually add segment from last inter
          if (lastinter !== null && lastinter !== a) {
            this.addSegment(lastinter, a, OR.Segment.PLAIN);
            lastinter = null;
          } else {
            lastinter = a;
          }
        }
        else if (aSide === -1) {
          // c6) 'a' behind 'b' behind
        }
        // In all 3 cases add current point 'b' to back side
        back.push(b);
        inBack = true;
      }
      else if (bSide === 0) {   // b on
        if (aSide === 1) {
          // c7) 'a' front 'b' on
        }
        if (aSide === 0) {
          // c8) 'a' on 'b' on
        }
        if (aSide === -1) {       // a behind
          // c9 'a' behind 'b' on
          back.push(b);
          // Eventually add segment from last inter
          if (lastinter !== null && lastinter !== b) {
            s = this.searchSegmentTwoPoints(lastinter, b);
            if (s === null) {
              this.addSegment(lastinter, b, OR.Segment.PLAIN);
            }
            lastinter = null;
          } else {
            lastinter = b;
          }
        }
        // In all 3 cases, add 'b' to front side
        front.push(b);
      }
      // Next edge
      a = b;
      aSide = bSide;
    }

    // Modify initial face f1 and add new face if not degenerated
    // this.faces.splice(this.faces.indexOf(f1), 1); change Array
    if (inFront) {
      f1.points = front;
      f1 = null;
    }
    if (inBack) {
      if (f1 !== null) {
        f1.points = back;
      } else {
        var f = new OR.Face();
        f.points = back;
        this.faces.push(f);
      }
    }
  }

  // Split all or given Faces by a plane @testOK
  function splitFacesByPlane(pl, list) {
    // Split list or all faces
    list = (list !== undefined) ? list : this.faces;
    // When a face is split, one face is modified in Array and one added, at the end
    for (var i = list.length - 1; i > -1; i--) {
      var f = list[i];
      this.splitFaceByPlane(f, pl);
    }
  }

  // Split all or given faces Across two points @testOK
  function splitCross(p1, p2, list) {
    var pl = OR.Plane.across(p1, p2);
    this.splitFacesByPlane(pl, list);
  }

  // Split all or given faces By two points @testOK
  function splitBy(p1, p2, list) {
    var pl = OR.Plane.by(p1, p2);
    this.splitFacesByPlane(pl, list);
  }

  // Split faces by a plane Perpendicular to a Segment passing by a Point "p" @testOK
  function splitOrtho(s, p, list) {
    var pl = OR.Plane.ortho(s, p);
    this.splitFacesByPlane(pl, list);
  }

  // Split faces by a plane between two segments given by 3 points p1 center @testOK
  function splitLineToLineByPoints(p0, p1, p2, list) {
    // Project p0 on p1 p2
    var p0p1 = Math.sqrt((p1.x - p0.x) * (p1.x - p0.x)
      + (p1.y - p0.y) * (p1.y - p0.y)
      + (p1.z - p0.z) * (p1.z - p0.z));
    var p1p2 = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x)
      + (p1.y - p2.y) * (p1.y - p2.y)
      + (p1.z - p2.z) * (p1.z - p2.z));
    var k = p0p1 / p1p2;
    var x = p1.x + k * (p2.x - p1.x);
    var y = p1.y + k * (p2.y - p1.y);
    var z = p1.z + k * (p2.z - p1.z);

    // e is on p1p2 symmetric of p0
    var e = new OR.Point(x, y, z);
    // find the midpoint of segment p0e (fixed by Howie)
    var mp = OR.Point.add(p0, OR.Point.sub(e, p0).scale(0.5))
    // Define Plane
    var pl = OR.Plane.by(p1, mp);
    this.splitFacesByPlane(pl, list);
  }

  // Split faces by a plane between two segments @testOK
  function splitLineToLine(s1, s2, list) {
    var s = OR.Segment.closestLine(s1, s2);
    if (s.length3d() < 1) {
      // Segments cross at c Center
      var c = s.p1;
      var a = OR.Point.sub(s1.p1, c).length() > OR.Point.sub(s1.p2, c).length() ? s1.p1 : s1.p2;
      var b = OR.Point.sub(s2.p1, c).length() > OR.Point.sub(s2.p2, c).length() ? s2.p1 : s2.p2;
      this.splitLineToLineByPoints(a, c, b, list);
    } else {
      // Segments do not cross, parallel
      var pl = OR.Plane.across(s.p1, s.p2);
      this.splitFacesByPlane(pl, list);
    }
  }

  // Rotate around axis Segment by angle a list of Points @testOK
  function rotate(s, angle, list) {
    var angleRd = angle * Math.PI / 180.0;
    var ax = s.p1.x, ay = s.p1.y, az = s.p1.z;
    var nx = s.p2.x - ax, ny = s.p2.y - ay, nz = s.p2.z - az;
    var n = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx *= n;
    ny *= n;
    nz *= n;
    var sin = Math.sin(angleRd), cos = Math.cos(angleRd);
    var c1 = 1.0 - cos;
    var c11 = c1 * nx * nx + cos, c12 = c1 * nx * ny - nz * sin, c13 = c1 * nx * nz + ny * sin;
    var c21 = c1 * ny * nx + nz * sin, c22 = c1 * ny * ny + cos, c23 = c1 * ny * nz - nx * sin;
    var c31 = c1 * nz * nx - ny * sin, c32 = c1 * nz * ny + nx * sin, c33 = c1 * nz * nz + cos;
    list.forEach(function (p) {
      var ux = p.x - ax, uy = p.y - ay, uz = p.z - az;
      p.x = ax + c11 * ux + c12 * uy + c13 * uz;
      p.y = ay + c21 * ux + c22 * uy + c23 * uz;
      p.z = az + c31 * ux + c32 * uy + c33 * uz;
    });
  }

  // Adjust one Point on its (eventually given) segments @testOK
  function adjust(p, segments) {
    // Take all segments containing point p or given list
    var segs = segments || this.searchSegmentsOnePoint(p);
    var dmax = 100;
    // Kaczmarz or Verlet
    // Iterate while length difference between 2d and 3d is > 1e-3
    for (var i = 0; dmax > 0.001 && i < 20; i++) {
      dmax = 0;
      // Iterate over all segments
      // Pm is the medium point
      var pm = new OR.Point(0, 0, 0);
      for (var j = 0; j < segs.length; j++) {
        var s = segs[j];
        var lg3d = s.length3d();
        var lg2d = s.length2d(); // Should not change
        var d = (lg2d - lg3d);
        if (Math.abs(d) > dmax) {
          dmax = Math.abs(d);
        }
        // Move B = A + AB * r with r = l2d / l3d
        // AB * r is the extension based on length3d to match length2d
        var r = (lg2d / lg3d);
        if (s.p2 === p) {
          // move p2
          pm.x += s.p1.x + (s.p2.x - s.p1.x) * r;
          pm.y += s.p1.y + (s.p2.y - s.p1.y) * r;
          pm.z += s.p1.z + (s.p2.z - s.p1.z) * r;
        } else if (s.p1 === p) {
          // move p1
          pm.x += s.p2.x + (s.p1.x - s.p2.x) * r;
          pm.y += s.p2.y + (s.p1.y - s.p2.y) * r;
          pm.z += s.p2.z + (s.p1.z - s.p2.z) * r;
        }
      }
      // Set Point with average position taking all segments
      if (segs.length !== 0) {
        p.x = pm.x / segs.length;
        p.y = pm.y / segs.length;
        p.z = pm.z / segs.length;
      }
    }
    return dmax;
  }

  // Adjust list of Points @testOK
  function adjustList(list) {
    var dmax = 100;
    for (var i = 0; dmax > 0.001 && i < 100; i++) {
      dmax = 0;
      for (var j = 0; j < list.length; j++) {
        var p = list[j];
        var segs = this.searchSegmentsOnePoint(p);
        var d = this.adjust(p, segs);
        if (Math.abs(d) > dmax) {
          dmax = Math.abs(d);
        }
      }
    }
    return dmax;
  }

  // Evaluate and highlight segments with wrong length @testOK
  function evaluate() {
    // Iterate over all segments
    for (var i = 0; i < this.segments.length; i++) {
      var s = this.segments[i];
      var d = Math.abs(s.length2d() - s.length3d());
      s.highlight = d >= 0.1;
    }
  }

  // Move list of points by dx,dy,dz @testOK
  function move(dx, dy, dz, pts) {
    pts = (pts === null) ? this.points : (pts === undefined) ? this.points : pts;
    pts.forEach(function (p) {
      p.x += dx;
      p.y += dy;
      p.z += dz;
    });
  }

  // Move on a point P0 all following points, k from 0 to 1 for animation @testOK
  function moveOn(p0, k1, k2, pts) {
    pts.forEach(function (p) {
      p.x = p0.x * k1 + p.x * k2;
      p.y = p0.y * k1 + p.y * k2;
      p.z = p0.z * k1 + p.z * k2;
    });
  }

  // Move given or all points to z = 0
  function flat(pts) {
    var lp = pts === undefined ? this.points : pts;
    lp.forEach(function (p) {
      p.z = 0;
    });
  }

  // Turn model around axis by  angle @testOK
  function turn(axe, angle) {
    angle *= Math.PI / 180.0;
    var ax = 0, ay = 0, az = 0;
    var nx = 0.0;
    var ny = 0.0;
    var nz = 0.0;
    if (axe === 1) {
      nx = 1.0;
    }
    else if (axe === 2) {
      ny = 1.0;
    }
    else if (axe === 3) {
      nz = 1.0;
    }
    var n = (1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz));
    nx *= n;
    ny *= n;
    nz *= n;
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    var c1 = 1.0 - cos;
    var c11 = c1 * nx * nx + cos, c12 = c1 * nx * ny - nz * sin, c13 = c1 * nx * nz + ny * sin;
    var c21 = c1 * ny * nx + nz * sin, c22 = c1 * ny * ny + cos, c23 = c1 * ny * nz - nx * sin;
    var c31 = c1 * nz * nx - ny * sin, c32 = c1 * nz * ny + nx * sin, c33 = c1 * nz * nz + cos;
    this.points.forEach(function (p) {
      var ux = p.x - ax, uy = p.y - ay, uz = p.z - az;
      p.x = ax + c11 * ux + c12 * uy + c13 * uz;
      p.y = ay + c21 * ux + c22 * uy + c23 * uz;
      p.z = az + c31 * ux + c32 * uy + c33 * uz;
    });
  }

  // Select (highlight) points @testOK
  function selectPts(pts) {
    pts.forEach(function (p) {
      p.select = !p.select;
    });
  }

  // Select (highlight) segments @testOK
  function selectSegs(segs) {
    segs.forEach(function (s) {
      s.select = !s.select;
    });
  }

  // Offset by dz all following faces according to Z @testOK
  function offset(dz, lf) {
    lf.forEach(function (f) {
      f.offset += dz;
    });
  }

  // 2D Boundary [xmin, ymin, xmax, ymax] @testOK
  function get2DBounds() {
    var xmax = -100.0;
    var xmin = 100.0;
    var ymax = -100.0;
    var ymin = 100.0;
    this.points.forEach(function (p) {
      var x = p.xf, y = p.yf;
      if (x > xmax) xmax = x;
      if (x < xmin) xmin = x;
      if (y > ymax) ymax = y;
      if (y < ymin) ymin = y;
    });
    var obj = {};
    obj.xmin = xmin;
    obj.ymin = ymin;
    obj.xmax = xmax;
    obj.ymax = ymax;
    return obj;
  }

  // Fit the model to -200 +200 @testOK
  function zoomFit() {
    var b = this.get3DBounds();
    var w = 400;
    var scale = w / Math.max(b.xmax - b.xmin, b.ymax - b.ymin);
    var cx = -(b.xmin + b.xmax) / 2;
    var cy = -(b.ymin + b.ymax) / 2;
    this.move(cx, cy, 0, null);
    this.scaleModel(scale);
  }

  // Scale model @testOK
  function scaleModel(scale) {
    this.points.forEach(function (p) {
      p.x *= scale;
      p.y *= scale;
      p.z *= scale;
    });
  }

  // 3D Boundary View [xmin, ymin, xmax, ymax]
  function get3DBounds() {
    var xmax = -200.0, xmin = 200.0;
    var ymax = -200.0, ymin = 200.0;
    this.points.forEach(function (p) {
      var x = p.x, y = p.y;
      if (x > xmax) xmax = x;
      if (x < xmin) xmin = x;
      if (y > ymax) ymax = y;
      if (y < ymin) ymin = y;
    });
    var obj = {};
    obj.xmin = xmin;
    obj.ymin = ymin;
    obj.xmax = xmax;
    obj.ymax = ymax;
    return obj;
  }

  // API
  this.init = init;
  this.addPointXYZ = addPointXYZ;
  this.addPoint = addPoint;
  this.addSegment = addSegment;
  this.addFace = addFace;
  this.searchSegmentsOnePoint = searchSegmentsOnePoint;
  this.searchSegmentTwoPoints = searchSegmentTwoPoints;
  this.align2dFrom3d = align2dFrom3d;
  this.faceLeft = faceLeft;
  this.faceRight = faceRight;
  this.splitFacesByPlane = splitFacesByPlane;
  this.splitFaceByPlane = splitFaceByPlane;
  this.searchFace = searchFace;
  this.splitSegmentByPoint = splitSegmentByPoint;
  this.splitSegmentOnPoint = splitSegmentOnPoint;
  this.splitSegmentByRatio = splitSegmentByRatio;

  this.splitCross = splitCross;
  this.splitBy = splitBy;
  this.splitOrtho = splitOrtho;
  this.splitLineToLine = splitLineToLine;

  this.splitLineToLineByPoints = splitLineToLineByPoints;
  this.computeAngle = computeAngle;
  this.rotate = rotate;
  this.turn = turn;
  this.adjust = adjust;
  this.adjustList = adjustList;
  this.evaluate = evaluate;
  this.move = move;
  this.moveOn = moveOn;
  this.flat = flat;
  this.offset = offset;

  this.selectSegs = selectSegs;
  this.selectPts = selectPts;
  this.get2DBounds = get2DBounds;
  this.get3DBounds = get3DBounds;

  this.zoomFit = zoomFit;
  this.scaleModel = scaleModel;

  // Initialize if a list is provided
  var boundinit = init.bind(this);
  list ? boundinit(list) : list = null;
};


// ----------------------------------------------------------------------------
// File: js/Interpolator.js
// Dependencies : import them before Command in browser

// Maps time to time
// interpolate(tn) returns t for tn.
// t and tn should start at 0.0 and end at 1.0
// between 0 and 1, t can be < 0 (anticipate) and >1 (overshoot)
// Use Padé approximations to speed up complex calculations
OR.Interpolator = {
  // Linear "il"
  LinearInterpolator: function (t) {
    return t;
  },
  // Starts and ends slowly accelerate between "iad"
  /** @return {number} */
  AccelerateDecelerateInterpolator: function (t) {
    return (Math.cos((t + 1) * Math.PI) / 2.0) + 0.5;
  },
  // Model of a spring with overshoot "iso"
  /** @return {number} */
  SpringOvershootInterpolator: function (t) {
    if (t < 0.1825)
      return (((-237.110 * t) + 61.775) * t + 3.664) * t + 0.000;
    if (t < 0.425)
      return (((74.243 * t) - 72.681) * t + 21.007) * t - 0.579;
    if (t < 0.6875)
      return (((-16.378 * t) + 28.574) * t - 15.913) * t + 3.779;
    if (t < 1.0)
      return (((5.120 * t) - 12.800) * t + 10.468) * t - 1.788;
    return (((-176.823 * t) + 562.753) * t - 594.598) * t + 209.669;
  },
  // Model of a spring with bounce "isb"
  // 1.0-Math.exp(-4.0*t)*Math.cos(2*Math.PI*t)
  /** @return {number} */
  SpringBounceInterpolator: function (t) {
    var x = 0.0;
    if (t < 0.185)
      x = (((-94.565 * t) + 28.123) * t + 2.439) * t + 0.000;
    else if (t < 0.365)
      x = (((-3.215 * t) - 4.890) * t + 5.362) * t + 0.011;
    else if (t < 0.75)
      x = (((5.892 * t) - 10.432) * t + 5.498) * t + 0.257;
    else if (t < 1.0)
      x = (((1.520 * t) - 2.480) * t + 0.835) * t + 1.125;
    else x = (((-299.289 * t) + 945.190) * t - 991.734) * t + 346.834;
    return x > 1 ? 2 - x : x;
  },
  // Model of a gravity with bounce "igb"
  // a = 8.0, k=1.5; x=(a*t*t-v0*t)*Math.exp(-k*t);
  /** @return {number} */
  GravityBounceInterpolator: function (t) {
    var x = 0.0;
    if (t < 0.29)
      x = (((-14.094 * t) + 9.810) * t - 0.142) * t + 0.000;
    else if (t < 0.62)
      x = (((-16.696 * t) + 21.298) * t - 6.390) * t + 0.909;
    else if (t < 0.885)
      x = (((31.973 * t) - 74.528) * t + 56.497) * t + -12.844;
    else if (t < 1.0)
      x = (((-37.807 * t) + 114.745) * t - 114.938) * t + 39.000;
    else x = (((-7278.029 * t) + 22213.034) * t - 22589.244) * t + 7655.239;
    return x > 1 ? 2 - x : x;
  },
  // Bounce at the end "ib"
  /** @return {number} */
  BounceInterpolator: function (t) {
    function bounce(t) {
      return t * t * 8.0;
    }
    t *= 1.1226;
    if (t < 0.3535) return bounce(t);
    else if (t < 0.7408) return bounce(t - 0.54719) + 0.7;
    else if (t < 0.9644) return bounce(t - 0.8526) + 0.9;
    else return bounce(t - 1.0435) + 0.95;
  },
  // Overshoot "io"
  /** @return {number} */
  OvershootInterpolator: function (t) {
    const mTension = 2;
    t -= 1.0;
    return t * t * ((mTension + 1) * t + mTension) + 1.0;
  },
  // Anticipate "ia"
  /** @return {number} */
  AnticipateInterpolator: function (t) {
    const mTension = 0; // 2
    return t * t * ((mTension + 1) * t - mTension);
  },
  // Anticipate Overshoot "iao"
  /** @return {number} */
  AnticipateOvershootInterpolator: function (t) {
    const mTension = 1.5;
    function a(t, s) {
      return t * t * ((s + 1) * t - s);
    }
    function o(t, s) {
      return t * t * ((s + 1) * t + s);
    }
    if (t < 0.5) return 0.5 * a(t * 2.0, mTension);
    else return 0.5 * (o(t * 2.0 - 2.0, mTension) + 2.0);
  }
};



// --------------------------------------------------------------------------
// File: js/Command.js
// Dependencies : import them before Command.js in browser

// Interprets a list of commands, and apply them on Model
OR.Command = function (modele) {
  var model = modele;
  var stepModels = [];  // an array of all models created from the commands
  var toko = [];  //  all cleaned up commands
  var done = [];
  // var iTok         = 0;

  this.iCmd = 0;
  this.cmdList = [];
  this.currentCmd = [];

  // State machine
  this.state = State.idle; //  this will be accessed by other codes

  // Animation time
  var t
  var tn // Between 0 and 1, progress of the animation

  // Time interpolated at instant 'p' preceding and at instant 'n' current
  // Between 0 and 1
  var tni = 1;
  var tpi = 0;
  var animDoneFlag = false; //  Animation done flag
  // scale, cx, cy, cz used in ZoomFit
  var za = [0, 0, 0, 0];
  // Interpolator used in anim() to map tn (time normalized) to tni (time interpolated)
  var interpolator = OR.Interpolator.LinearInterpolator;

  // Coefficient to multiply value given in Offset commands
  var kOffset = 1; // 0.2 for real rendering, can be 10 to debug
  //
  var undo, pauseStart, pauseDuration, duration, tstart, undoInProgress;

  var context = this;

  // Tokenize, split the String in toko Array of String @testOK
  const tokenize = (input) => { //  Arrow function to bind "this"
    var text = input.replace(/[\);]/g, ' eoc'); //  End of Command
    text = text.replace(/,/g, ' ');
    text = text.replace(/\/\/.*$/mg, '');
    let text2 = text.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "")
    let commandList = text2.split(/\n+/)
    //  https://stackoverflow.com/questions/31412765/regex-to-remove-white-spaces-blank-lines-and-final-line-break-in-javascript
    commandList.shift() //  Remove the first empty element
    // console.log(commandList)
    this.cmdList = commandList

    // toko = text.split(/\s+/); //  all cleaned up commands
    this.iCmd = 0;
    context.toko = toko;
    // return toko;
    return toko
  }

  // Read a File @testOK
  function readfile(filename) {
    var text = null;

    // text = TextFile(filename) //  This is for React. Put the text file will be in the public folder!!

    // If we are in NodeJS fs is required
    if (NODE_ENV === true && typeof require !== 'undefined') {
      const fs = require('fs');
      text = fs.readFileSync(filename, 'utf-8');
    }
    // If we are in browser XHR or Script embedded
    else {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          const type = request.getResponseHeader("Content-Type");
          if (type.match(/^text/)) { // Make sure response is text
            text = request.responseText;
          }
        } else if (request.readyState !== XMLHttpRequest.OPENED) {
          console.log("Error ? state:" + request.readyState + " status:" + request.status);
        }
      };
      // XMLHttpRequest.open(method, url, async)
      // Here async = false ! => Warning from Firefox, Chrome,
      request.open('GET', filename, false);
      request.send(null);
    }
    if (text === null) {
      console.log("Error reading:" + filename);
    }
    return text;
  }



  // Execute one command line on model
  const execute = (cmd, dir = 1) => { // Arrow function to bind "this"
    // dir indicates whether the command is reversed

    var list = [], a = null, b = null, angle = null, s = null, p = null;
    let idx = 0;

    while (idx < cmd.length) {  // move the cursor (idx) through the whole command line
      // Crease Pattern Commands
      // "d : define" @testOK
      if (cmd[idx] === "d" || cmd[idx] === "define") {
        // Define sheet by N points x,y CCW
        idx++;
        while (Number.isInteger(Number(cmd[idx]))) {
          list.push(cmd[idx++]);
        }
        model.init(list);
      }
      // Origami splits
      // "b : by" @testOK
      else if (cmd[idx] === "b" || cmd[idx] === "by") {
        // Split by two points
        idx++;
        a = model.points[cmd[idx++]];
        b = model.points[cmd[idx++]];
        model.splitBy(a, b);
      }
      // "c : cross"  @testOK
      else if (cmd[idx] === "c" || cmd[idx] === "cross") {
        // Split across two points all (or just listed) faces
        idx++;
        // console.log("Cross:" + cmd[idx] +', ' + cmd[idx+1])
        a = model.points[cmd[idx++]];
        b = model.points[cmd[idx++]];
        model.splitCross(a, b);
      }
      // "p : perpendicular"  @testOK
      else if (cmd[idx] === "p" || cmd[idx] === "perpendicular") {
        // Split perpendicular of line by point
        idx++;
        s = model.segments[cmd[idx++]];
        p = model.points[cmd[idx++]];
        model.splitOrtho(s, p);
      }
      // "lol : LineOnLine" TODO test
      else if (cmd[idx] === "lol" || cmd[idx] === "lineonline") {
        // Split by a plane passing between segments
        idx++;
        var s0 = model.segments[cmd[idx++]];
        var s1 = model.segments[cmd[idx++]];
        model.splitLineToLine(s0, s1);
      }
      // Segment split TODO test
      // "s : split seg numerator denominator"
      else if (cmd[idx] === "s" || cmd[idx] === "split") {
        // Split set by N/D
        idx++;
        s = model.segments[cmd[idx++]];
        var n = cmd[idx++];
        var d = cmd[idx++];
        model.splitSegmentByRatio(s, n / d);
      }

      // --------------------------------------------------------------
      // Animation commands use tni tpi
      // " r : rotate Seg Angle Points"
      else if (cmd[idx] === "r" || cmd[idx] === "rotate") {
        // Rotate Seg Angle Points with animation
        idx++;
        s = model.segments[cmd[idx++]];
        // console.log("folding around segment: "+cmd[idx-1])
        angle = dir * (cmd[idx++] * (tni - tpi));
        list = listPoints(cmd, idx);
        model.rotate(s, angle, list);
      }
      // "f : fold to angle"
      else if (cmd[idx] === "f" || cmd[idx] === "fold") {
        idx++;
        s = model.segments[cmd[idx++]];
        // Cache current angle at start of animation
        var angleBefore = 0;
        if (tpi === 0) {
          angleBefore = model.computeAngle(s);
        }
        angle = dir * ((cmd[idx++] - angleBefore) * (tni - tpi));
        list = listPoints(cmd, idx);
        // Reverse segment to have the first point on left face
        if (tpi === 0 && model.faceRight(s.p1, s.p2).points.indexOf(list[0]) !== -1)
          s.reverse();
        model.rotate(s, angle, list);
      }

      // Adjust all or listed points
      // "a : adjust"
      else if (cmd[idx] === "a" || cmd[idx] === "adjust") {
        // Adjust Points in 3D to fit 3D length
        idx++;
        list = listPoints(cmd, idx);
        var liste = list.length === 0 ? model.points : list;
        if (dir != -1) {
          model.adjustList(liste);
        }
      }

      // Offsets
      // "o : offset"
      else if (cmd[idx] === "o" || cmd[idx] === "offset") {
        // Offset by dz the list of faces : o dz f1 f2...
        idx++;
        var dz = dir * cmd[idx++] * kOffset;
        list = listFaces(cmd, idx);
        model.offset(dz, list);
      }

      // Moves
      // "m : move dx dy dz pts"
      else if (cmd[idx] === "m" || cmd[idx] === "move") {
        // Move 1 point by dx,dy,dz in 3D with Coefficient for animation
        idx++;
        model.move(dir * cmd[idx++] * (tni - tpi)
          , dir * cmd[idx++] * (tni - tpi)
          , dir * cmd[idx++] * (tni - tpi)
          , model.points);
      }
      // "mo : move on"
      else if (cmd[idx] === "mo") {
        // Move all points on one with animation
        idx++;
        var p0 = model.points.get(cmd[idx++]);
        var k2 = dir * ((1 - tni) / (1 - tpi));
        var k1 = dir * (tni - tpi * k2);
        model.moveOn(p0, k1, k2, model.points);
      }

      // Turns
      // "tx : TurnX angle"
      else if (cmd[idx] === "tx") {
        idx++;
        model.turn(1, dir * Number(cmd[idx++]) * (tni - tpi));
      }
      // "ty : TurnY angle"
      else if (cmd[idx] === "ty") {
        idx++;
        model.turn(2, dir * Number(cmd[idx++]) * (tni - tpi));
      }
      // "tz : TurnZ angle"
      else if (cmd[idx] === "tz") {
        idx++;
        model.turn(3, dir * Number(cmd[idx++]) * (tni - tpi));
      }

      // Zooms
      // "z : Zoom scale x y" The zoom is centered on x y z=0
      else if (cmd[idx] === "z") {
        idx++;
        var scale = cmd[idx++];
        var x = cmd[idx++];
        var y = cmd[idx++];
        // for animation
        var ascale = dir * ((1 + tni * (scale - 1)) / (1 + tpi * (scale - 1)));
        var bfactor = (scale * (tni / ascale - tpi));
        model.move(x * bfactor, y * bfactor, 0, null);
        model.scaleModel(ascale);
      }
      // "zf : Zoom Fit"
      else if (cmd[idx] === "zf") {
        idx++;
        if (tpi === 0) {
          b = model.get3DBounds();
          var w = 400;
          za[0] = w / Math.max(b.xmax - b.xmin, b.ymax - b.ymin);
          za[1] = -(b.xmin + b.xmax) / 2;
          za[2] = -(b.ymin + b.ymax) / 2;
        }
        scale = ((1 + tni * (za[0] - 1)) / (1 + tpi * (za[0] - 1)));
        bfactor = za[0] * (tni / scale - tpi);
        model.move(za[1] * bfactor, za[2] * bfactor, 0, null);
        model.scaleModel(scale);
      }

      // --------------------------------------------------------------
      // Interpolators
      else if (cmd[idx] === "il") { // "il : Interpolator Linear"
        idx++;
        context.interpolator = OR.Interpolator.LinearInterpolator;
      }
      else if (cmd[idx] === "ib") { // "ib : Interpolator Bounce"
        idx++;
        context.interpolator = OR.Interpolator.BounceInterpolator;
      } else if (cmd[idx] === "io") { // "io : Interpolator OverShoot"
        idx++;
        context.interpolator = OR.Interpolator.OvershootInterpolator;
      }
      else if (cmd[idx] === "ia") { // "ia : Interpolator Anticipate"
        idx++;
        context.interpolator = OR.Interpolator.AnticipateInterpolator;
      }
      else if (cmd[idx] === "iao") { // "iao : Interpolator Anticipate OverShoot"
        idx++;
        context.interpolator = OR.Interpolator.AnticipateOvershootInterpolator;
      }
      else if (cmd[idx] === "iad") { // "iad : Interpolator Accelerate Decelerate"
        idx++;
        context.interpolator = OR.Interpolator.AccelerateDecelerateInterpolator;
      }
      else if (cmd[idx] === "iso") { // "iso Interpolator Spring Overshoot"
        idx++;
        context.interpolator = OR.Interpolator.SpringOvershootInterpolator;
      }
      else if (cmd[idx] === "isb") { // "isb Interpolator Spring Bounce"
        idx++;
        context.interpolator = OR.Interpolator.SpringBounceInterpolator;
      }
      else if (cmd[idx] === "igb") { // "igb : Interpolator Gravity Bounce"
        idx++;
        context.interpolator = OR.Interpolator.GravityBounceInterpolator;
      }

      // Mark points and segments
      // "select points"
      else if (cmd[idx] === "pt") {
        idx++;
        model.selectPts(model.points);
      }
      // "select segments"
      else if (cmd[idx] === "seg") {
        idx++;
        model.selectSegs(model.segments);
      }

      // End skip remaining tokens
      // "end" give Control back to CommandLoop
      else if (cmd[idx] === "end") {
        return idx
      }

      // End of command and default behavior
      else if (cmd[idx] === "eoc") {
        idx++;
        this.state = State.pause
      } else {
        // Real default : ignore illegal characters
        idx++;
      }
    }

    return idx
  }



  // List makers
  // Make a list from following points numbers @testOK
  const listPoints = (cmd, iStart) => {
    var list = [];
    while (Number.isInteger(Number(cmd[iStart]))) {
      list.push(model.points[cmd[iStart++]]);
    }
    return list;
  }

  // Make a list from following segments numbers
  const listSegments = (cmd, iStart) => {
    var list = [];
    while (Number.isInteger(Number(cmd[iStart]))) {
      list.push(model.segments[cmd[iStart++]]);
    }
    return list;
  }

  // Make a list from following faces numbers @testOK
  const listFaces = (cmd, iStart) => {
    var list = [];
    while (Number.isInteger(Number(cmd[iStart]))) {
      list.push(model.faces[cmd[iStart++]]);
    }
    return list;
  }


  // Rollback - Un-execute
  const rollBack = () => {

      if (this.iCmd >= 1) {
        --this.iCmd;  // Have to decrement to go back to the command we just executed
        this.currentCmd = this.cmdList[this.iCmd].split(' ');
        // console.log(this.currentCmd)
  
        // When seeing "t" (animation time)
        // if (this.currentCmd[0] === "t") {
        //   this.currentCmd.splice(0, 2)
        // }
  
        // else if (this.currentCmd[0] === "c" || "b" || "lol") {
        //   return
        // }
  
        // Execute one command
        // execute(this.currentCmd, -1);
        // execute(this.currentCmd, -1);
        stepModels.pop()
        model = stepModels[stepModels.length-1]
        model.change = true
  
        // Post an event to repaint
        // The repaint will not occur till next animation, or end Cde
        this.state = State.pause;   // back to pause  

        // commandLoop()  // For some reason I have to roll forward without rendering
      }

    
    
    return

  }


  // Main entry Point
  // Execute list of commands
  // TODO : simplify
  const command = (cde) => {  // arrow function to bind "this"

    // -- State Idle tokenize list of command
    if (this.state === State.idle) {

      // When idle, the function returns early only when no commands or "read"
      if (cde.startsWith("read")) {
        var filename = cde.substring(5);
        if (filename.indexOf("script") !== -1) {
          // Expect "read script cocotte.txt" => filename="script cocotte.txt" => id="cocotte.txt"
          // With a tag <script id="cocotte.txt" type="not-javascript">d ...< /script> in html file
          var id = filename.substring(7);
          cde = document.getElementById(id).text;
        } else {
          // Attention replace argument cde by the content of the file
          cde = readfile(filename.trim());
        }
        if (cde === null)
          return;
        // On success clear toko and use read cde
        done = [];
        undo = [];
        // Continue to Execute
      }
      else if (cde === "co" || cde === "pa") {
        // In idle, no job, continue, or pause are irrelevant
        return;
      }
      else if (cde.startsWith("d")) {
        // Starts a new folding
        done = [];
        undo = [];
      }

      // If not the cases above, start execute folding commands.
      // Initialize again!
      tokenize(cde)
      // toko  = tokenize(cde);
      this.state = State.run;
      this.iCmd = 0;
      commandLoop();
      return;
    }
    // -- State Run execute list of command
    if (this.state === State.run) {
      commandLoop();
      return;
    }
    // -- State Animation execute up to ')' or pause
    if (this.state === State.anim) {
      // "Pause"
      if (cde === "pa") {
        pauseStart = new Date().getTime()
        this.state = State.pause;
      }
      return;

    }
    // -- State Paused in animation
    if (this.state === State.pause) {
      // "Continue"
      if (cde === "co") {
        if (tn >= 1.0) {
          // console.log("Continue from OR.js")
          pauseDuration = new Date().getTime() - pauseStart;
          this.state = State.run;
          commandLoop();
        }
        else {
          console.log("Animation still in progress!")
        }

      }
      else if (cde === "u") {
        // Undo one step
        if (tn >= 1.0) {
          this.state = State.run;
          rollBack()
        }
        else {
          console.log("Animation still in progress!")
        }
      }
      return;
    }
    // -- State undo (Not using it now)
    if (this.state === State.undo) {
      if (undoInProgress === false) {
        if (cde === "u") {
          // Ok continue to undo
          // undo();
        }
        else if (cde === "pa") {
          // Forbidden ignore pause
        } else {
          // A new Command can only come from Debug
          // Removes 't' or 'd'
          // Execute
          tokenize(cde);
          this.state = State.run;
          this.iCmd = 0;
          commandLoop();
        }
      }
    }
  }

  // Loop to execute commands
  const commandLoop = () => { // arrow function to bind "this"

    while (this.iCmd < this.cmdList.length) { // Keep reading command lines!

      //  Get the current command
      
      this.currentCmd = this.cmdList[this.iCmd].split(' ');
      // console.log(this.currentCmd)

      // When seeing "t" (animation time), stop reading more commands
      // and focus on animating the current command
      if (this.currentCmd[0] === "t") {
        // Time t duration ... )
        duration = this.currentCmd[1];  //  ++x returns value after incrementing
        this.currentCmd.splice(0, 2)
        pauseDuration = 0;
        this.state = State.anim;
        animStart();
        this.iCmd++;
        // Return breaks the loop, giving control to anim
        return;
      }

      // Execute one command
      execute(this.currentCmd);
      stepModels.push(model)
      this.iCmd++;  // Move to the next command!

      // Post an event to repaint
      // The repaint will not occur till next animation, or end Cde
      model.change = true;
    }
    // When run out of commands, switch to idle
    if (this.state === State.run) {
      this.state = State.idle;
    }
  }

  // Sets a flag in model which is tested in Animation loop
  const animStart = () => {
    model.change = true;
    tstart = new Date().getTime();
    tpi = 0.0;
  }

  // Called from Orisim3d.js in Animation loop
  // This function changes geometry frame by frame
  // return true if anim should continue false if anim should end
  const anim = () => {
    // We are in state anim
    t = new Date().getTime();
    // Compute tn varying from 0 to 1
    tn = (t - tstart - pauseDuration) / duration; // tn from 0 to 1

    // tn = (t - tstart) / duration; // tn from 0 to 1
    if (tn > 1.0) { // Make sure tn is no greater than 1
      tn = 1.0;
    }
    tni = context.interpolator(tn);   // Use the interpolator to scale tn


    // Execute commands just after t xxx up to including ')'
    execute(this.currentCmd);

    // Keep t (tpi) preceding t now (tni)
    tpi = tni; // t preceding

    // If Animation is finished, set end values
    if (tn >= 1.0) {
      tni = 1.0;
      tpi = 0.0;

      // console.log(model)
      stepModels.push(model)

      //  When there's a pause state update, pause upon completing the step
      if (this.state === State.pause) {
        pauseStart = new Date().getTime();
        return false;
      }
      else if (this.state !== State.anim) {
        return false;
      }

      // Switch back to run and launch next cde
      this.state = State.run;
      commandLoop();

      // If commandLoop has launched another animation we continue
      if (this.state === State.anim) {
        return true;
      }

      // OK we stop anim
      return false;
    }

    // Rewind to continue animation
    return true;
  }



  // API
  this.tokenize = tokenize;
  this.readfile = readfile;
  this.execute = execute;

  this.interpolator = interpolator;
  this.listPoints = listPoints;
  this.listSegments = listSegments;

  this.command = command;
  this.commandLoop = commandLoop;
  this.anim = anim;

};

// Static values
const State = { idle: 0, run: 1, anim: 2, pause: 3, undo: 4 };
// console.log(Object.keys(State)[1]); // run



export default OR