data.put = function (opt, dataset) {
  // I'd prefer to split this out, but knowing how shit doesn't work, better to define locally
  var arcs = opt.arcs || [];
  var type = opt.type || "Polygon";
  var objt = opt.objt || "undefined";
  var id = opt.id || "";

  var data = dataset || asm.data.topoj;
  data.objects[objt] = data.objects[objt] || {};
  data.objects[objt].type = data.objects[objt].type || "GeometryCollection";
  data.objects[objt].geometries = data.objects[objt].geometries || [];
  var t = {};
  t.type = type;
  t.id = id;
  t.arcs = t.arcs || [];
  var initialLength = data.arcs.length;
  var n = [];
  for (var i = 0; i < arcs.length; i++) {
    n.push(initialLength + i);
    data.arcs.push(arcs[i]);
  }
  t.arcs.push(n);
  data.objects[objt].geometries.push(t);
  return dataset;
};

asm.grid = function (context, zoom) {
  var c = context;
  var r = zoom;
  var n = opt_gridnum || 445;
  var uh = opt_unitHeight || 7;
  var uw = opt_unitWidth || 4;

  c.beginPath();
  var fr = 1;
  switch (true) {
    case r.k < 0.05:
      fr = 100;
      break;
    case r.k < 0.15:
      fr = 50;
      break;
    case r.k < 0.35:
      fr = 20;
      break;
    case r.k < 0.8:
      fr = 10;
      break;
    case r.k < 1.4:
      fr = 5;
      break;
    default:
      fr = 1;
      break;
  }

  var belowMe = Math.floor(uh / 2);
  for (var DTU = 0; DTU > -n; DTU -= uh * fr) {
    var j = DTU + belowMe;
    var a = r.apply([-n, j]);
    var b = r.apply([n, j]);
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
  }
  for (var UTD = 0; UTD < n; UTD += uh * fr) {
    var j = UTD + belowMe;
    var a = r.apply([-n, j]);
    var b = r.apply([n, j]);
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
  }
  var leftOfMe = Math.floor(uw / 2);
  for (var LTR = 0; LTR < n; LTR += uw * fr) {
    var j = LTR - leftOfMe;
    var a = r.apply([j, -n]);
    var b = r.apply([j, n]);
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
  }
  for (var RTL = 0; RTL > -n; RTL -= uw * fr) {
    var j = RTL - leftOfMe;
    var a = r.apply([j, -n]);
    var b = r.apply([j, n]);
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
  }
  c.lineWidth = 1;
  c.strokeStyle = "rgba(155,155,155,0.85)";
  c.strokeStyle = "rgba( 15, 35, 75,0.45)";
  c.stroke();
};
t;
