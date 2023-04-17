import Tooltip from "./Tooltip";

const Vertex = (props) => {

  return (
    <g class="settlement">
      <circle 
      id={props.id}
      className={[props.type + '-' + props.user, props.classes].join(' ')} 
      cx={props.cx} 
      cy={props.cy} 
      r="2" 
      stroke={props.user}
      onClick={props.onClick}
      hexes={props.hexes}
      onMouseMove={props.onMouseOut}
      fill={
        props.type === 'city' ? "url(#city)" : (props.type === 'none' ? "white": "url(#settlement)")
      }
      />
      <Tooltip cx={props.cx} cy={props.cy}  
      display={props.displayTooltip == null ? "none" : props.displayTooltip}></Tooltip>
    </g>
  );
}

Vertex.defaultProps = {
classes: '',
vertexNumber: 0, 
type: 'none',
user: 'none'
}

export default Vertex;