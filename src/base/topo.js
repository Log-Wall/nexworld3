import { topographies } from "./tables";

export const topoj = {
  type: "Topology",
  transform: { scale: [10, 10], translate: [0, 0] }, // This will be overwritten later
  arcs: [
    [
      [1.5, -0.5],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ],
    [
      [42.5, -5.5],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ], // Sea Lion Cove
  ],
  objects: {
    world: {
      type: "GeometryCollection",
      geometries: [],
    },
    ports: {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Polygon",
          arcs: [[0]],
          id: "SK",
          properties: { name: "Shala-Khulia" },
        },
        {
          type: "Polygon",
          arcs: [[1]],
          id: "SL",
          properties: { name: "Sea Lion Cove" },
        },
      ],
    },
    reefs: {
      type: "GeometryCollection",
      geometries: [],
    },
    beach: {
      type: "GeometryCollection",
      geometries: [
        // {type: 'Polygon',arcs:[[5,6,7]],id:'MP-SK'}, /* DON'T DELETE, Sample
      ],
    },
    desert: {
      type: "GeometryCollection",
      geometries: [
        // {type: 'Polygon',arcs:[[5,6,7]],id:'MP-SK'}, /* DON'T DELETE, Sample
      ],
    },
    jungle: {
      type: "GeometryCollection",
      geometries: [
        // {type: 'Polygon',arcs:[[5,6,7]],id:'MP-SK'}, /* DON'T DELETE, Sample
      ],
    },
    grass: {
      type: "GeometryCollection",
      geometries: [],
    },
    mountains: {
      type: "GeometryCollection",
      geometries: [],
    },
    swamp: {
      type: "GeometryCollection",
      geometries: [],
    },
    lowmt: {
      type: "GeometryCollection",
      geometries: [],
    },
    chops: {
      type: "GeometryCollection",
      geometries: [],
    },
    roughs: {
      type: "GeometryCollection",
      geometries: [],
    },
    road: {
      type: "GeometryCollection",
      geometries: [],
    },
    nnnbb: {
      type: "GeometryCollection",
      geometries: [],
    },
    nnnbr: {
      type: "GeometryCollection",
      geometries: [],
    },
    ___br: {
      type: "GeometryCollection",
      geometries: [],
    },
    "...wt": {
      type: "GeometryCollection",
      geometries: [],
    },
    WWbwn: {
      type: "GeometryCollection",
      geometries: [],
    },
    YYred: {
      type: "GeometryCollection",
      geometries: [],
    },
    __blk: {
      type: "GeometryCollection",
      geometries: [],
    },
    "##bwn": {
      type: "GeometryCollection",
      geometries: [],
      properties: { color: "green" },
    },
    "..blk": {
      type: "GeometryCollection",
      geometries: [],
    },
    "##ylw": {
      type: "GeometryCollection",
      geometries: [],
    },
    "..wht": {
      type: "GeometryCollection",
      geometries: [],
    },
    mmblk: {
      type: "GeometryCollection",
      geometries: [],
    },
  },
};

/* 
export const insert = (data, type) => {
  for (let i = 0; i < data.arcs.length; i++) {
    const arc = data.arcs[i];
    const entry = {
      type: type || "Polygon",
      id: data.id,
      properties: { color: topographies[data.objt] || "red", type: data.objt },
      arcs: [[topoj.arcs.length]],
    };
    topoj.objects.world.geometries.push(entry);
    topoj.arcs.push(arc);
  }
};*/

export const insert = (data, type) => {
  for (let i = 0; i < data.arcs.length; i++) {
    const arc = data.arcs[i];
    const entry = {
      type: type || "Polygon",
      id: data.id,
      arcs: [[topoj.arcs.length]],
    };
    topoj.objects[data.objt].geometries.push(entry);
    topoj.arcs.push(arc);
  }
};

export const checkClosed = (arr) => {
  const res = arr.reduce(
    (a, c) => {
      a[0] += c[0];
      a[1] += c[1];
      return a;
    },
    [0, 0]
  );
  return res;
};

export const reverseCoords = (arr) => {
  const res = [];
  arr.forEach((e) => {
    e[0] = e[0] * -1;
    e[1] = e[1] * -1;
    res.unshift(e);
  });
  console.log(JSON.stringify(res));
  return res;
};

const WASDTable = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
};
const NESWTable = {
  n: [0, -1],
  w: [-1, 0],
  s: [0, 1],
  e: [1, 0],
};
export const WASDToArc = (txt) => {
  const stringArray = txt.split("");
  const arcArray = [];
  let arc = [];
  let currentChar = false;
  stringArray.forEach((char) => {
    if (currentChar === char) {
      arc[0] += WASDTable[char][0];
      arc[1] += WASDTable[char][1];
    } else {
      if (arc.length > 0) {
        arcArray.push([...arc]);
      }
      currentChar = char;
      arc = [...WASDTable[char]];
    }
  });
  console.log(JSON.stringify(arcArray));
  return arcArray;
};
export const NESWToArc = (txt) => {
  const stringArray = txt.split("");
  const arcArray = [];
  let arc = [];
  let currentChar = false;
  stringArray.forEach((char) => {
    if (currentChar === char) {
      arc[0] += NESWTable[char][0];
      arc[1] += NESWTable[char][1];
    } else {
      if (arc.length > 0) {
        arcArray.push([...arc]);
      }
      currentChar = char;
      arc = [...NESWTable[char]];
    }
  });
  console.log(JSON.stringify(arcArray));
  return arcArray;
};
