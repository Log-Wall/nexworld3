import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
const topoString = "ssddwawa";
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
console.log(JSON.stringify(stringToArc(topoString)));
const reverseCoords = (arr) => {
    const res = [];
    arr.forEach(e => {
        e[0] = e[0] * -1;
        e[1] = e[1] * -1;
        res.unshift(e);
    }
    );
    return res;
};
window.reverseCoords = reverseCoords;