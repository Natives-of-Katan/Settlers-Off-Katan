import Point from "react-hexgrid/lib/models/Point";
import { HexUtils } from "react-hexgrid";
import Vertex from "../Models/Vertex";
import Edge from "../Models/Edge";

export const isActive = (v) => {
  if (v == null) return false;
  if(v.props.classes.includes('active'))
      return true;
  return false;
}

export const getOverlappingVertices = (i) => {
    let v1 = (i + 2) % 6;
    let v2 = (i + 4) % 6;
    return [v1, v2]
}

export const getOverlappingEdge = (i) => {
  return (i + 3) % 6;
}

export const getAdjacentVertices = (i) => {
  let v1 = (i + 1) % 6
  let v2 = (((i - 1) % 6) + 6) % 6;
  let v3 = v1
  let v4 = v2
  return [v1, v2, v3, v4]
}

// export const adjacentRoadsToVertex = (i) {
//   let r1 = ;
// }

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

// @param: array of game board hexes, array of vertice points
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
        let d1 = (6 - j) % 6
        const hexes = [
          hex, 
          HexUtils.neighbour(hex, d1),
          HexUtils.neighbour(hex, (((d1 - 1) % 6) + 6) % 6),
        ];
        const vertex = <Vertex id={JSON.stringify(hex) + "-v-" + j} vertexNumber={j}
        cx={points[j].x} cy={points[j].y} hexes={hexes}></Vertex>
        hexVertices.push(vertex);
      })
      verticeArray.push(hexVertices);
    })
    return verticeArray;
}


export const initEdges = (hexagons, size) => {
    const points = calculateCoordinates(size.x, Math.PI / 6, new Point(0,0));
    var edgeArray = [];

    hexagons.map((hex) => {
        var hexEdges = []
        for (var j = 0; j < 6; j++) {
          // error checking later - check if adjacent hexes have a vertex corresponding to this
          const hexes = [hex, HexUtils.neighbour(hex, (j == 0 ? j : 6 - j))];
          var secPoint = j < 5 ? j + 1 : 0;
          hexEdges.push(
          <Edge 
            id={JSON.stringify(hex) + "-e-" + j} 
            hexes={hexes} 
            edgeNumber={j}
            x1={points[j].x} 
            y1={points[j].y} 
            x2={points[secPoint].x} 
            y2={points[secPoint].y} 
          ></Edge>);
        }
        edgeArray.push(hexEdges);
    })
    return edgeArray;
}

// vertex can't be placed if any of the 3 adjacent vertices have a property
export const adjacentVerticesActive = (v, hexes) => {
    let adjacentV = getAdjacentVertices(v.props.vertexNumber)
    // for each adjacent vertex, get hex objects
    const vertexHexes = v.props.hexes.map((h) => (
        "q: " + h.q + ", r: " + h.r + ", s: " + h.s
    ))
    
    // check if vertices in adjacent hexes are active
    for (let n = 0; n < adjacentV.length; n++) {
        var aHex = (n < 2) ? hexes.get(vertexHexes[0]) : 
        (n < 3) ? hexes.get(vertexHexes[1]) : hexes.get(vertexHexes[2]);
        if (aHex != null) {
            aHex = aHex.props.vertices[adjacentV[n]];
            if (vertexActive(aHex, hexes))
                return true;
        }
    }
    return false;
}

// check both edges
export const adjacentEdgeActive = (e, hexes) => {
  if (isActive(e)) return true;
  // check overlapping edge
  let overlap = getOverlappingEdge(e.props.edgeNumber);
  let o1 = e.props.hexes[1];
  o1 = "q: " + o1.q + ", r: " + o1.r + ", s: " + o1.s
  if (hexes.get(o1) != null && isActive(hexes.get(o1).props.edges[overlap[0]]))
      return true;
  return false;
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
    if (hexes.get(oArray[j]) != null 
    && isActive(hexes.get(oArray[j]).props.vertices[overlap[j]]))
      return true;
  }
  return false;
}

export const vertexAvailable = (vertex, hexes) => {
  // vertex can't be placed if any of the 3 adjacent vertices are active
  if (isActive(vertex) || adjacentVerticesActive(vertex, hexes))
      return false;
  return true;
}

export const edgeAvailable = (edge, hexes) => {
  if (isActive(edge) || adjacentEdgeActive(edge, hexes))
      return false;
  return true
  // road has to connect to existing user vertex
  // or edge.
}