const Vertex = (id, number, type, user, cx, cy, hexes) => {
    return ({
      id: id,
      vertexNumber: number,
      type: type,
      user: user,
      cx: cx,
      cy: cy,
      hexes: hexes
    });
}

export default Vertex;