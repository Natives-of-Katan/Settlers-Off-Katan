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
      hexes={props.hexes}
      title="hello"
      fill={
        props.type === 'city' ? "url(#city)" : (props.type === 'none' ? "white": "url(#settlement)")
      }
      />
    );
}

Vertex.defaultProps = {
  classes: '',
  vertexNumber: 0, 
  type: 'none',
  user: 'none'
}

export default Vertex;