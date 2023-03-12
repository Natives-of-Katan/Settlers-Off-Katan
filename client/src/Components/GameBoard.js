import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import {React, useEffect, useState} from 'react';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import Vertex from '../Models/Vertex';
import Edge from '../Models/Edge';
import CustomHex from '../Models/CustomHex';

const GameBoard = (/*context, gamestate, moves*/) => {
  
    // map settings
    const config = configs['hexagon'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(this, config.mapProps);
    const layout = config.layout;
    const size = { x: 10, y: 10 };
  
    // initialize map
    const [pointCoords, setPoints] = useState([]);

    // map numbers
    const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];

    // When an element is clicked, it's passed to the appropriate function                    
    const onClick = (id) => {
      // moves.callFunction(id);
    }

    // on initial render, get coordinates for vertices
    useEffect(() => {
      const polygons = Array.from(
        document.getElementsByTagName('polygon')
      );
      setPoints(polygons.map( (obj) => obj.points));
    }, []);

    // add button to specified vertex
    const addVertex = (int, type, user) => {
      // render grid first, or points don't exist
      if (pointCoords[0] != undefined) {
        return new Vertex(type,  user, pointCoords[0][int].x, pointCoords[0][int].y, onClick(int));
      }
    }

    // add edge to specified vertex
    const addEdge = (int, user) => {
      if (pointCoords[0] != undefined) {
        return (
          int < 5 ? new Edge(pointCoords[0][int], pointCoords[0][int + 1], user, onClick(int)) : 
          new Edge(pointCoords[0][int], pointCoords[0][0], user,  onClick(int))
        )
      }
    }

    return (
      <div className="GameBoard">
        <HexGrid width={config.width} height={config.height}>

          <Pattern size={size} id="grain" link="https://static.vecteezy.com/system/resources/thumbnails/005/565/283/small/rural-autumn-landscape-with-windmill-blue-sky-and-yellow-wheat-field-with-spikelet-of-rye-free-vector.jpg" ></Pattern>
          <Pattern size={size} id="pasture" link="https://media.istockphoto.com/id/1163580954/vector/summer-fields-landscape-cartoon-countryside-valley-with-green-hills-blue-sky-and-curly.jpg?s=612x612&w=0&k=20&c=eZFwR7xUp1YCFk7WM4wK4NbOlSXJZRuxzobNoPTWivs=" ></Pattern>
          <Pattern size={size} id="desert" link="https://t3.ftcdn.net/jpg/01/44/97/42/360_F_144974295_zwgoD2Z4wl22POM50B5W2045gDVEEDZ4.jpg"></Pattern>
          <Pattern size={size} id="forest" link="https://i.pinimg.com/originals/20/04/9e/20049e85d9af0e8444fcf38b6e31aa0d.jpg"></Pattern>
          <Pattern size={size} id="hill" link="https://t4.ftcdn.net/jpg/02/79/87/81/360_F_279878111_jpQIKrlz9ElTjSTM8pPiYOp2S1IUPfdy.jpg" ></Pattern>
          <Pattern size={size} id="mountain" link="https://www.shutterstock.com/image-vector/mountain-cartoon-landscape-green-hills-260nw-568649782.jpg"></Pattern>
          <Pattern size={{x:1, y:2}} id="settlement" link="http://atlas-content-cdn.pixelsquid.com/stock-images/simple-house-NxE5a78-600.jpg"></Pattern>
          <Pattern size={{x:1, y:2}} id="city" link="https://img.lovepik.com/free-png/20210918/lovepik-city-png-image_400225367_wh1200.png"></Pattern>


          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={config.origin}>
            { 
              hexagons.map((hex, i) => (
                <CustomHex key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} vertices="" edges="">
                  {addEdge(0, 'none')}
                  {addEdge(1, 'none')}
                  {addEdge(2, 'none')}
                  {addEdge(3, 'none')}
                  {addEdge(4, 'none')}
                  {addEdge(5, 'none')}
                  {addVertex(0, 'none', 'none')} 
                  {addVertex(1, 'settlement', 'none')}
                  {addVertex(2, 'none', 'none')}
                  {addVertex(3, 'city', 'none')}
                  {addVertex(4, 'none', 'none')}
                  {addVertex(5, 'free', 'none')}
                  {/* <Text>{HexUtils.getID(hex)}</Text> */}
                  <Text>{tileNums[i]}</Text>
                </CustomHex>
              ))    
            }
          </Layout>
        </HexGrid>
      </div>
    );
  }

  export default GameBoard;