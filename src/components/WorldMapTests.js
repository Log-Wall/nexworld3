import React, { useState, useEffect } from "react";
import { geoCircle, geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import * as t from "topojson-client";

const simpleTopology = (object) => {
  return {
    type: "Topology",
    transform: { scale: [10, 10], translate: [0, 0] },
    objects: { foo: object },
    arcs: [
      [
        [0, 0],
        [0, 10],
        [10, 0],
        [0, -10],
        [-10, 0],
      ],
      [
        [50, 0],
        [0, 10],
        [10, 0],
        [0, -10],
        [-10, 0],
      ],
    ],
  };
};
const testTopo = {
  type: "Topology",
  transform: { scale: [10, 10], translate: [10, 10] },
  objects: {
    foo: {
      type: "GeometryCollection",
      geometries: [
        { type: "Polygon", arcs: [[0]] },
        { type: "Polygon", arcs: [[1]] },
        { type: "Polygon", arcs: [[2]] },
      ],
    },
    markers: {
      type: "GeometryCollection",
      geometries: [{ type: "Point", coordinates: [[5, 5, 2]] }],
    },
  },
  arcs: [
    [
      [0, 0],
      [2, 0],
      [0, 100],
    ],
    [
      [50, 0],
      [0, 10],
      [10, 0],
      [0, -10],
      [-10, 0],
    ],
  ],
};
const gridTopo = {
  type: "Topology",
  transform: { scale: [10, 10], translate: [0, 0] },
  objects: {
    grid: {
      type: "GeometryCollection",
      geometries: [
        { type: "LineString", arcs: [[0]] },
        { type: "LineString", arcs: [[1]] },
      ],
    },
  },
  arcs: [
    [
      [0, 10],
      [100, 0],
    ],
    [
      [0, 200],
      [100, 0],
    ],
  ],
};

const example = {
  type: "Topology",
  transform: {
    scale: [10, 10],
    translate: [0, 0],
  },
  objects: {
    "two-squares": {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Polygon",
          arcs: [[0, 1]],
          properties: { name: "Left_Polygon" },
        },
        {
          type: "Polygon",
          arcs: [[2, -1]],
          properties: { name: "Right_Polygon" },
        },
      ],
    },
    "one-line": {
      type: "GeometryCollection",
      geometries: [
        {
          type: "LineString",
          arcs: [3],
          properties: { name: "Under_LineString" },
        },
      ],
    },
    "two-places": {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Point",
          coordinates: [0, 0],
          properties: { name: "Origine_Point" },
        },
        {
          type: "Point",
          coordinates: [0, -1],
          properties: { name: "Under_Point" },
        },
      ],
    },
  },
  arcs: [
    [
      [1, 2],
      [0, -2],
    ],
    [
      [1, 0],
      [-1, 0],
      [0, 2],
      [1, 0],
    ],
    [
      [1, 2],
      [1, 0],
      [0, -2],
      [-1, 0],
    ],
    [
      [0, -1],
      [2, 0],
    ],
  ],
};
const topoj = {
  type: "Topology",
  transform: { scale: [0, 0], translate: [0, 0] }, // This will be overwritten later
  arcs: [
    [
      [-0.5, -0.5],
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
    marsh: {
      type: "GeometryCollection",
      geometries: [
        // {type: 'Polygon',arcs:[[5,6,7]],id:'MP-SK'}, /* DON'T DELETE, Sample
      ],
    },
    chops: {
      type: "GeometryCollection",
      geometries: [],
    },
    grass: {
      type: "GeometryCollection",
      geometries: [],
    },
    mount: {
      type: "GeometryCollection",
      geometries: [],
    },
    reefs: {
      type: "GeometryCollection",
      geometries: [],
    },
    roughs: {
      type: "GeometryCollection",
      geometries: [],
    },
  },
};

const geoTest = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
        [0, 0],
      ],
    ],
  },
};
const topoString = "ddsdsdsdddddsdddddwdwwdww";
const arcTable = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
};
const stringToArc = (txt) => {
  const stringArray = txt.split("");
  const arcArray = [];
  let arc = [];
  let currentChar = false;
  stringArray.forEach((char) => {
    if (currentChar === char) {
      arc[0] += arcTable[char][0];
      arc[1] += arcTable[char][1];
    } else {
      if (arc.length > 0) {
        arcArray.push([...arc]);
      }
      currentChar = char;
      arc = [...arcTable[char]];
    }
  });
  return arcArray;
};
const reverseCoords = (arr) => {
  const res = [];
  arr.forEach(e => {
    e[0] = e[0] * -1;
    e[1] = e[1] * -1;
    res.push(e);
  }
  );
  return res;

};
testTopo.arcs.push([[30, 30], ...stringToArc(topoString)]);

globalThis.test = simpleTopology({ type: "Polygon", arcs: [[1]] });
globalThis.testO = feature(testTopo, testTopo.objects.foo);
globalThis.testC = feature(testTopo, testTopo.objects.foo.geometries[0]);
globalThis.testO = feature(topoj, topoj.objects["ports"]);
globalThis.geoGenerator = geoPath()(globalThis.testO);

const generateGrid = () => {
  const height = 10;
  const width = 10;
  const offsetHeight = height / 2;
  const offsetWidth = width / 2;
};
const WorldMap = () => {
  return (
    <div>
      <svg width={800} height={450} viewBox="0 0 800 450">
        <g>{geoGenerator}</g>
        <g className="countries">
          {/*geographies.map((d, i) => (
            <path
              key={`path-${i}`}
              d={geoPath().projection(projection)(d)}
              className="country"
              fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))*/}
          {topoj.objects.ports.geometries.map((obj, i) => {
            return <path key={i} d={geoPath()(feature(topoj, obj))} />;
          })}
        </g>
      </svg>
      {gridTopo.objects.grid.geometries.map((obj, i) => {
        return (
          <svg key={i} width={800} height={450} viewBox="0 0 800 450">
            <g>
              <path
                d={geoPath()(feature(gridTopo, obj))}
                stroke={"red"}
                strokeWidth={1}
              />
            </g>
          </svg>
        );
      })}
      <canvas></canvas>
    </div>
  );
};

export default WorldMap;
