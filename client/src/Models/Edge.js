// returns road

function Edge(id, start, end, user, hexes) {
    return (
        {
            id: id,
            x1: start.x,
            x2: end.x,
            y1: start.y,
            y2: end.y,
            stroke: user,
            hexes: hexes
        }
    );
}

export default Edge;
