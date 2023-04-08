import { getHexKey, compareUsers, isActive, getOverlappingEdge } from "./boardUtils";

export const longestRoad = (roadList, hexes) => {
    // find all endpoint roads
    let endpoints = parseRoadEndpoints([...roadList], hexes)

    let longestRoad = 1;
    // For each endpoint, find longest road
    endpoints.forEach((ePoint) => {
      let l = findLongestRoad([], ePoint, hexes, endpoints);
      if (l > longestRoad)
        longestRoad = l;
    })
    console.log("longest",longestRoad)
    return longestRoad;

}

const findLongestRoad = (tRoads, currentRoad, hexes, endpoints) => {
    let traversedRoads = tRoads;
    traversedRoads.push(currentRoad);

    // get all connecting roads for each vertex
    let vertices = getRoadVertices(currentRoad, hexes);
    let newRoads = vertices.map((v) => (
      nextRoads(v, hexes, currentRoad.props.stroke)
    ))
    
    // filter traversed roads out
    newRoads = newRoads.map((r) => (
      r.filter(function (road) { return !traversedRoads.includes(road) })
    ))
      
    // End recursion when you reach an endpoint
    if (traversedRoads.length > 1 && endpoints.includes(currentRoad)) return 1;
    else {
        let newRoadV = (newRoads[0].length == 0) ? newRoads[1] : newRoads[0]

         // If multiple roads, branch and return longest path
        if (newRoadV.length > 1) {
            let b1Traversed =  [...traversedRoads]
            b1Traversed.push(newRoadV[1])
            let b2Traversed = [...traversedRoads]
            b2Traversed.push(newRoadV[0])
            let branch1 = findLongestRoad(b1Traversed,newRoadV[0], hexes, endpoints)
            let branch2 = findLongestRoad(b2Traversed,newRoadV[1], hexes, endpoints)
            return 1 + (branch1 > branch2 ? branch1 : branch2)
        }
        if (newRoadV.length == 0) return 1;
        return 1 + findLongestRoad(traversedRoads,newRoadV[0], hexes, endpoints)
    }
}

const parseRoadEndpoints = (roads, hexes) => {
  let endpoints = [];
  for (let e of roads){
      // get 2 road vertices
      let vertices = getRoadVertices(e, hexes);
      let newRoads = vertices.map((v) => (
        nextRoads(v, hexes, e.props.stroke)
      ))
      // if only one vertex has a road, add to endpoints
      if (xor(newRoads[0].length == 1, newRoads[1].length == 1))
        endpoints.push(e)
  }
  return endpoints
}

const nextRoads = (v, hexes, color) => {
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
  
  edges = edges.concat(overlapEdges);
  let activeEdges = [];
  // check if any edges are active with current player
  for (let e of edges) {
    if (compareUsers(e, color) && isActive(e)) {
      activeEdges.push(e);
    }
  }
  return activeEdges;
}

const getRoadVertices = (e, hexes) => {
  let hex = hexes.get(getHexKey(e.props.hexes[0]));
  let v1 = hex.props.vertices[e.props.edgeNumber];
  let v2 = hex.props.vertices[(e.props.edgeNumber + 1) < 5 ? (e.props.edgeNumber + 1) : 0];
  return [v1, v2];
}

const adjacentRoadsToVertex = (i) => {
  let r1 = i == 0 ? 5 : (i - 1);
  let r2 = i
  let r3 = i == 5 ? 0 : (i + 1);
  return [r1, r2, r3];
}

const xor = (a, b) => Boolean(!a ^ !b);