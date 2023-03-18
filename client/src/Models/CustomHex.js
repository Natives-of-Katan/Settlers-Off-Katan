import React, { Component } from 'react';
import { Hexagon } from 'react-hexgrid';

export default class CustomHex extends Component {

  render() {
    let injectedProps = {};

    const { vertices, edges } = this.props;
    
    return <Hexagon {...this.props} {...injectedProps} />
  }
}