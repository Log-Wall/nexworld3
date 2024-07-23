import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoPath, geoContains } from "d3-geo";
import { zoom, zoomTransform } from "d3-zoom";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { quadtree } from "d3-quadtree";
import { topoj } from "../base/topo";

const WorldMapCanvas = ({ nexWorld, setCoords, width, height }) => {
  const [location, setLocation] = useState({
    previous: nexWorld.location,
    current: nexWorld.location,
  });
  const [context, setContext] = useState();
  const [zoomState, setZoomState] = useState();
  const [firstRender, setFirstRender] = useState(true);
  const [direction, setDirection] = useState("n");
  const [traceCount, setTraceCount] = useState(0);

  const [geojsonFeatures, setGeojsonFeatures] = useState([]);
  const [quadTree, setQuadTree] = useState(null);

  const canvasRef = useRef();
  const zoomRef = useRef();
  const pathRef = useRef();

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toUpperCase();
      switch (key) {
        case "W":
          nexWorld.traceInsert("n");
          break;
        case "A":
          nexWorld.traceInsert("w");
          break;
        case "S":
          nexWorld.traceInsert("s");
          break;
        case "D":
          nexWorld.traceInsert("e");
          break;
        default:
          break;
      }
      if (event.keyCode === 8) {
        // Backspace pressed
        nexWorld.traceUndo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    nexWorld.setTraceCount = setTraceCount;
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    nexWorld.evt.addEventListener("nexWorld-location-update", ({ detail }) => {
      setLocation((prevState) => ({
        ...{ previous: [...prevState.current] },
        current: detail,
      }));
    });
    nexWorld.evt.addEventListener("nexWorld-direction-update", ({ detail }) => {
      console.log("dir event");
      setDirection(detail);
    });
  }, []);

  useEffect(() => {
    console.log("render");
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d");
    const path = geoPath().context(context);
    pathRef.current = path;

    setContext(context);

    canvas.attr("width", width).attr("height", height);

    zoomRef.current = zoom()
      .scaleExtent([1 / 27, 85])
      .translateExtent([
        [-10000, -10000], // set your desired min x and min y values
        [width + 10000, height + 10000], // set your desired max x and max y values
      ])
      .on("zoom", ({ transform }) => {
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        nexWorld.drawMap({
          context: context,
          zoom: zoomRef.current,
          path: path,
          width: width,
          height: height,
          transform: transform,
        });
        context.restore();

        setZoomState(transform);
      });

    canvas.call(zoomRef.current);

    canvas.on("mousemove", (event) => {
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      const coords = [(x - r.x) / r.k, (y - r.y) / r.k];
      setCoords([Math.round(coords[0] / 10), Math.round(coords[1] / 10)]);

      if (quadTree) {
        const candidates = [];
        quadTree.visit((node, x0, y0, x1, y1) => {
          if (!node.length) {
            do {
              const d = node.data;
              if (
                x0 <= coords[0] &&
                coords[0] < x1 &&
                y0 <= coords[1] &&
                coords[1] < y1
              ) {
                candidates.push(d);
              }
            } while ((node = node.next));
          }
          return (
            x0 > coords[0] || x1 < coords[0] || y0 > coords[1] || y1 < coords[1]
          );
        });

        let featureType = "None";
        for (const feature of candidates) {
          if (geoContains(feature, coords)) {
            featureType = feature.geometry.type;
            break;
          }
        }
        console.log(
          `The feature type at (${coords[0]}, ${coords[1]}) is: ${featureType}`
        );
      }
    });

    context.save();

    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: path,
      width: width,
      height: height,
      transform: zoomTransform(canvasRef.current),
    });

    // Set initial starting coordinate view [0, 0]
    console.log(location.current);
    zoomRef.current.translateTo(
      select(canvasRef.current),
      location.current[0] * nexWorld.unitWidth,
      location.current[1] * nexWorld.unitHeight
    );
    // Set initial zoom scale
    zoomRef.current.scaleTo(select(canvasRef.current), 2);

    context.restore();

    nexWorld.zoomRef = zoomRef.current;
    nexWorld.selection = select(canvasRef.current);

    // Load Topology Data
    const geojson = topojson.feature(
      topoj,
      topoj.objects.yourObjectName
    ).features;

    const qTree = quadtree()
      .x((d) => d.geometry.coordinates[0])
      .y((d) => d.geometry.coordinates[1])
      .addAll(geojson);

    setGeojsonFeatures(geojson);
    setQuadTree(qTree);

    // Debug statements
    window.p = geoPath().context(context);
    window.cc1 = canvas;
    window.zr = zoomRef.current;
    window.zt = zoomTransform(canvasRef.current);
  }, [width, height]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: pathRef.current,
      width: width,
      height: height,
      transform: zoomState,
    });

    // Check to see if the user has panned the map.
    // If they have, do not automatically recenter on location update
    if (
      zoomState.x !== -location.previous[0] * 20 + width / 2 ||
      zoomState.y !== -location.previous[1] * 20 + height / 2
    ) {
      console.log("state mismatch");
      nexWorld.follow = false;
    }

    if (!nexWorld.follow) {
      zoomRef.current.transform(select(canvasRef.current), zoomState);
    } else {
      nexWorld.center();
    }
  }, [location, direction, traceCount]);

  useEffect(() => {
    window.ctx = context;
  }, [context]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: "rgba(20, 60, 135, 0.93)",
      }}
    />
  );
};

export default WorldMapCanvas;
