const Vertex = (props) => {
    return (
      <circle 
      id={props.id}
      className={[props.type + '-' + props.user, props.classes].join(' ')} 
      cx={props.cx} 
      cy={props.cy} 
      r="2" 
      stroke={props.user}
      onClick={props.onClick}
      // hexes={props.hexes}
      fill={
        props.type === 'city' ? "url(#city)" : (props.type === 'none' ? "white": "url(#settlement)")
      }
      />
    );
}

export default Vertex;