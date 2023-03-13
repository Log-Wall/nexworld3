import React, { useState, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
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
  transform: { scale: [10, 10], translate: [0, 0] },
  objects: {
    foo: {
      type: "GeometryCollection",
      geometries: [
        { type: "Polygon", arcs: [[0]] },
        { type: "Polygon", arcs: [[1]] },
        { type: "Polygon", arcs: [[2]] },
      ],
    },
  },
  arcs: [
    [
      [0, 0],
      [2, 0],
      [0, -1],
      [0, -10],
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
testTopo.arcs.push([[30, 30], ...stringToArc(topoString)]);

globalThis.test = simpleTopology({ type: "Polygon", arcs: [[1]] });
globalThis.testO = feature(testTopo, testTopo.objects.foo);
//globalThis.testO = feature(example, example.objects["two-squares"]);
globalThis.geoGenerator = geoPath()(globalThis.testO);
const WorldMap = () => {
  return (
    <div>
      <svg width={800} height={450} viewBox="0 0 800 450">
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
          <path d={geoGenerator} />
        </g>
      </svg>
      <canvas></canvas>
    </div>
  );
};

export default WorldMap;
