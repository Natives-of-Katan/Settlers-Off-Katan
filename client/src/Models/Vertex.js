
function Vertex(type, user, cx1, cy1, onclick) {
    const fillType = type === 'city' ? "url(#city)" : (type === 'none' ? "white": "url(#settlement)");
    
    return (
        <circle className={type + '-' + user} cx={cx1} cy={cy1} r="2" fill={fillType}
        onClick={onclick}/>
    );
}
export default Vertex;


