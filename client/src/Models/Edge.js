// returns road

const Edge = (props) => {
    return (
        <line 
        id={props.id} 
        className={props.classes} 
        x1={props.x1} 
        x2={props.x2} 
        y1={props.y1} 
        y2={props.y2} 
        stroke={props.stroke} 
        onClick={props.onClick}
        // hexes={props.hexes}
        />
    );
}

export default Edge;
