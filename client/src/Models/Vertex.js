const Vertex = (
  id,
  classes, 
  number, 
  type, 
  user, 
  cx, 
  cy, 
  hexes) => {
    return ({
      id: id,
      classes: classes,
      vertexNumber: number,
      type: type,
      user: user,
      cx: cx,
      cy: cy,
      hexes: hexes
    });
}

export default Vertex;