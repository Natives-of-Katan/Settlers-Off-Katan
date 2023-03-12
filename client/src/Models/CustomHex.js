import React, { Component } from 'react';
import { Hexagon } from 'react-hexgrid';

export default class CustomHex extends Component {
  render() {
    let injectedProps = {};

    const { vertices, edges } = this.props;

    return <Hexagon {...this.props} {...injectedProps} />
  }
}


// function removeExtraVertices(circles) {
//     const bounds = [];
//     const hex = [];
//     const vertex = [];

    //   // make sure all vertices are rendered
    //   if (circles.length == 114) {
    //     for (var i = 0; i < 114; i++) {    
    //       var b = circles[i].getBoundingClientRect();             
    //       var x = Math.floor(b.left);
    //       var y = Math.floor(b.top);

    //       // if a vertex has multiple hexes, add them to the list
    //       var index = bounds.indexOf(JSON.stringify([x, y]));
    //       if (index == -1) {
    //         bounds.push(JSON.stringify([x, y]));
    //         hex.push([hexagons[i]]);
    //       }
    //       else {
    //         hex[index].push(hexagons[i]);  
            
    //         circles[i].remove();
    //       }          
    //     }
    //     for (var i = 0; i < hex.length; i++) {
    //       vertex.push(Vertex(bounds[i], hex[i], null, null));
    //     }
    //     console.log(vertex);
    //   }
//   }