import Point from "react-hexgrid/lib/models/Point";
import { HexUtils } from "react-hexgrid";
import Vertex from "../Models/Vertex";
import Edge from "../Models/Edge";

// from library logic
const calculateCoordinates = (
    circumradius,
    angle,
    center,
    ) => {
    const corners = [];
    
    for (let i = 0; i < 6; i++) {
        const x = circumradius * Math.cos((2 * Math.PI * i) / 6 + angle)
        const y = circumradius * Math.sin((2 * Math.PI * i) / 6 + angle)
        const point = new Point(center.x + x, center.y + y)
        corners.push(point)
    }
    return corners;
}

// @param: array of game board hexes
// @param: array of vertice points
// returns: array of vertice objects with adjacent hexes
export const initVertices = (hexagons, size) => {
    const points = calculateCoordinates(size.x, Math.PI / 6, new Point(0,0));
    var verticeArray = [];
    var num = [0,1,2,3,4,5];

    // loop through hexagons and get vertices and adjacent hexes
    hexagons.map((hex) => {
      var hexVertices = [];
      // add 6 vertices
      num.map((j) => {
        const hexes = [
          hex, 
          HexUtils.neighbour(hex, (6 - j) % 6),
          HexUtils.neighbour(hex, (((6 - j) % 6) - 1) % 6),
        ];
        const vertex = <Vertex id={JSON.stringify(hex) + "-v-" + j} classes='' vertexNumber={j}
        type='none' user='none' cx={points[j].x} cy={points[j].y} hexes={hexes}></Vertex>
        hexVertices.push(vertex);
      })
      verticeArray.push(hexVertices);
    })
    return verticeArray;
}


export const initEdges = (hexagons, size) => {
    const points = calculateCoordinates(size.x, Math.PI / 6, new Point(0,0));
    var edgeArray = [];

    for (var i = 0; i < hexagons.length; i++) {
        var hexEdges = []

        for (var j = 0; j < 6; j++) {
          var hex = hexagons[i];
          // error checking later - check if adjacent hexes have a vertex corresponding to this
          const hexes = [hex, HexUtils.neighbour(hexagons[i], (j == 0 ? j : 6 - j))];
          var secPoint = j < 5 ? j + 1 : 0;

          hexEdges.push(<Edge 
            id={"hex-" + i + "-edge-" + j} 
            classes='' 
            x1={points[j].x} 
            y1={points[j].y} 
            x2={points[secPoint].x} 
            y2={points[secPoint].y} 
            stroke='gold' 
            hexes={hexes}
            ></Edge>);
        }
        edgeArray.push(hexEdges);
    }
    return edgeArray;
}

export const getAdjacentVertices = (i) => {
    let v1 = (i + 1) % 6
    let v2 = (i + 3) % 6
    let v3 = v2

    return [v1, v2, v3]
}

export const getOverlappingVertices = (i) => {
    let v1 = (i + 2) % 6;
    let v2 = (i + 4) % 6;

    return [v1, v2]
}

export const isActive = (v) => {
  if (v == null) return false;
  console.log("isActive: ",v.props.classes.includes('active'))
  return v.props.classes.includes('active') ? true : false;
}

const vertexActive = (v, hexes) => {
    if (isActive(v)) return true;

    // check all overlapping vertices
    let overlap = getOverlappingVertices(v.props.vertexNumber);
    let o1 = v.props.hexes[1];
    let o2 = v.props.hexes[2];
    let oArray = [o1, o2];
  
    oArray = oArray.map((o) => (
        "q: " + o.q + ", r: " + o.r + ", s: " + o.s
    ))

    for (let j = 0; j < oArray.length; j++) {
      if (hexes.get(oArray[j]) != null && isActive(hexes.get(oArray[j]).props.vertices[overlap[j]])) {
        return true;
      }
    }
    return false;
}

// vertex can't be placed if any of the 3 adjacent vertices have a property
export const adjacentVerticesActive = (v, hexes) => {
    // get vertex number (0-5) and 3 adjacent vertices (0-5)
    let vID = v.props.vertexNumber
    let adjacentV = getAdjacentVertices(vID)

    // for each adjacent vertex, get hex objects
    const vertexHexes = v.props.hexes.map((h) => (
        "q: " + h.q + ", r: " + h.r + ", s: " + h.s
    ))

    // check if vertices in same hex are active
    if (isActive(hexes.get(vertexHexes[0]).props.vertices[(vID - 1) % 6]) ||
        isActive(hexes.get(vertexHexes[0]).props.vertices[(vID + 1) % 6])) {
          return true
    }

    // check if vertices in adjacent hexes are active
    for (let n = 0; n < adjacentV.length; n++) {
        let aHex = (n < 2) ? hexes.get(vertexHexes[1]) : hexes.get(vertexHexes[2]);
        if (aHex != null) {
            aHex = aHex.props.vertices[adjacentV[n]];
            if (vertexActive(aHex, hexes))
                return true;
        }
    }
    return false;
}