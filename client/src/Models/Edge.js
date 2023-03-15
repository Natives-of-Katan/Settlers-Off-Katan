// returns road

function Edge(start, end, user, onclick) {
    return (
        <line className={"edge-" + user}
        x1={start.x} 
        x2={end.x} 
        y1={start.y} 
        y2={end.y} 
        stroke="gold" 
        strokeWidth="2" 
        strokeLinecap="round" 
        onClick={onclick}/>
    );
}

export default Edge;