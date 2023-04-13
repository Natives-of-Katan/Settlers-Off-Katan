import Point from "react-hexgrid/lib/models/Point";
import { HexUtils } from "react-hexgrid";
import Vertex from "../Models/Vertex";
import Edge from "../Models/Edge";

export const getHexKey = (h) => {
  return "q: " + h.q + ", r: " + h.r + ", s: " + h.s
}

export const compareUsers = (e, color) => {
  return (e == null) ? false : e.props.stroke == color;
}

export const isActive = (v) => {
  return (v == null) ? false : v.props.classes.includes('active');
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

export const adjacentRoadsToVertex = (i) => {
  let r1 = i == 0 ? 5 : (i - 1);
  let r2 = i
  let r3 = i == 5 ? 0 : (i + 1);
  return [r1, r2, r3];
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
          const hexes = [hex, HexUtils.neighbour(hex, (5 - j))];
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

// check if adjacent vertices have settlements
export const adjacentVerticesActive = (v, hexes) => {
    let adjacentV = getAdjacentVertices(v.props.vertexNumber)
    const vertexHexes = v.props.hexes;
    
    // check if vertices in adjacent hexes are active
    for (let n = 0; n < adjacentV.length; n++) {
        var aHex = hexes.get(getHexKey((n < 2) ? vertexHexes[0] : (n < 3) ? vertexHexes[1] : vertexHexes[2]));
        if (aHex != null) {
            aHex = aHex.props.vertices[adjacentV[n]];
            if (vertexActive(aHex, hexes))
                return true;
        }
    }
    return false;
}

export const vertexAvailable = (vertex, hexes) => {
  // vertex can't be placed if any of the 3 adjacent vertices are active
  return !(isActive(vertex) || adjacentVerticesActive(vertex, hexes))
}

export const edgeAvailable = (edge, hexes) => {
  return !(isActive(edge) || adjacentEdgeActive(edge, hexes))
}

export const vertexConnectsRoad = (v, hexes, color) => {
  // get current and adjacent hexagon
  let currentHex = hexes.get(getHexKey(v.props.hexes[0]));
  let thirdHex = hexes.get(getHexKey(v.props.hexes[1]));

  // get adjacent edges 1, 2, and 3
  let edges = [currentHex, currentHex, thirdHex].map((h, i) => (
    h != null ? h.props.edges[adjacentRoadsToVertex(v.props.vertexNumber)[i]] : h
  ))

  const overlapEdges = edges.map((e) => (
    (e == null || hexes.get(getHexKey(e.props.hexes[1])) == null) ? null : 
    hexes.get(getHexKey(e.props.hexes[1])).props.edges[getOverlappingEdge(e.props.edgeNumber)]
  ))
  
  edges.push(overlapEdges);
  edges = edges.flat();
  // check if any edges are active with current player
  for (let e of edges) {
    if (compareUsers(e, color) && isActive(e))
      return true;
  }
  return false;
}

export const edgeConnectsProperty = (e, hexes, color) => {
  // get 2 road vertices
  let hex = hexes.get(getHexKey(e.props.hexes[0]));
  let v1 = hex.props.vertices[e.props.edgeNumber];
  let v2 = hex.props.vertices[(e.props.edgeNumber + 1) < 5 ? (e.props.edgeNumber + 1) : 0];

  return (vertexConnectsRoad(v1, hexes, color) || vertexConnectsRoad(v2, hexes, color))
}

// check both edges
const adjacentEdgeActive = (e, hexes) => {
  if (isActive(e)) return true;
  // check overlapping edge
  let overlap = getOverlappingEdge(e.props.edgeNumber);
  let o1 = hexes.get(getHexKey(e.props.hexes[1]));
  return (o1 != null && isActive(o1.props.edges[overlap[0]]))
}

const vertexActive = (v, hexes) => {
  if (isActive(v)) return true;
  // check all overlapping vertices
  let overlap = getOverlappingVertices(v.props.vertexNumber);
  let o1 = hexes.get(getHexKey(v.props.hexes[1]));
  let o2 = hexes.get(getHexKey(v.props.hexes[2]));

  if (o1 != null && isActive(o1.props.vertices[overlap[0]]))
    return true;
  return (o2 != null && isActive(o2.props.vertices[overlap[1]]))
}

export const vertexUser = (v, hexes) => {
  // check all overlapping vertices
  let overlap = getOverlappingVertices(v.props.vertexNumber);
  let o1 = hexes.get(getHexKey(v.props.hexes[1]));
  let o2 = hexes.get(getHexKey(v.props.hexes[2]));

  if (o1 != null && vertexUserHelper(o1.props.vertices[overlap[0]]) != "Empty")
    return (vertexUserHelper(o1.props.vertices[overlap[0]]));
  else if (o2 != null && vertexUserHelper(o2.props.vertices[overlap[1]]) != "Empty")
    return (vertexUserHelper(o2.props.vertices[overlap[1]]));
  else if (vertexUserHelper(v) != undefined)
    return (vertexUserHelper(v));
  
}

const vertexUserHelper = (v) => {
  if (isActive(v)) 
    return v.props.user;
  else 
    return "Empty";
  //return (v == null) ? false : v.props.classes.includes('active');
}

export const initRoadPlacement = (e, hexArr, color) => {
  // get 2 road vertices
  let hex = hexArr.get(getHexKey(e.props.hexes[0]));
  let v1 = hex.props.vertices[e.props.edgeNumber];
  let v2 = hex.props.vertices[(e.props.edgeNumber + 1) < 5 ? (e.props.edgeNumber + 1) : 0];

  if (edgeConnectsVertex(v1, hexArr, color) || edgeConnectsVertex(v2, hexArr, color))
    return true;
  return false;
}

const edgeConnectsVertex = (v, hexes, color) => {
  // check vertex
  if (v.props.user == color) return true;
  let overlap = getOverlappingVertices(v.props.vertexNumber);
  let o1 = v.props.hexes[1];
  let o2 = v.props.hexes[2];
  let oArray = [o1, o2];

  for (let j = 0; j < oArray.length; j++) {
    let hex = hexes.get(getHexKey(oArray[j]));
    if (hex != null && hex.props.vertices[overlap[j]].props.user == color)
      return true;
  }
  return false;
}

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
