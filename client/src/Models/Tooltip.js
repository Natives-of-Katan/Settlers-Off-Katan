import { Text } from "react-hexgrid";

const Tooltip = (props) => {    

    return (
        <g class="tooltip" style={{display:props.display}}>
            <polygon points={ (props.cx)  + " " + (props.cy - 8)
            + ", " + (props.cx + 4) + " " + (props.cy - 5.5) + ", " 
            + (props.cx) +  " " + (props.cy) + ", " 
            + (props.cx - 4)  + " " + (props.cy - 5.5)}/>
            <Text x={props.cx} y={props.cy - 4.3}>Invalid</Text>
        </g>
    ); 
}

export default Tooltip;