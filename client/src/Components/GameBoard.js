import { HexGrid, Layout, Hexagon, Text, GridGenerator } from 'react-hexgrid';
import configs from './configurations';
import Pattern from './Pattern'

const GameBoard = () => {
  
    // map state
    const config = configs['hexagon'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(this, config.mapProps);
    const layout = config.layout;
    const size = { x: 10, y: 10 };

    // map numbers
    const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

    // map resources
    const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
    "forest", "pasture", "forest", "desert", "forest", "forest", "hill", "hill", 
    "hill", "mountain", "mountain", "mountain", "pasture"];

    return (
      <div className="GameBoard">
        <HexGrid width={config.width} height={config.height}>

          { /* patterns define tile fills */}
          <Pattern size={size} id="grain" link="https://static.vecteezy.com/system/resources/thumbnails/005/565/283/small/rural-autumn-landscape-with-windmill-blue-sky-and-yellow-wheat-field-with-spikelet-of-rye-free-vector.jpg" ></Pattern>
          <Pattern size={size} id="pasture" link="https://media.istockphoto.com/id/1163580954/vector/summer-fields-landscape-cartoon-countryside-valley-with-green-hills-blue-sky-and-curly.jpg?s=612x612&w=0&k=20&c=eZFwR7xUp1YCFk7WM4wK4NbOlSXJZRuxzobNoPTWivs=" ></Pattern>
          <Pattern size={size} id="desert" link="https://t3.ftcdn.net/jpg/01/44/97/42/360_F_144974295_zwgoD2Z4wl22POM50B5W2045gDVEEDZ4.jpg"></Pattern>
          <Pattern size={size} id="forest" link="https://i.pinimg.com/originals/20/04/9e/20049e85d9af0e8444fcf38b6e31aa0d.jpg"></Pattern>
          <Pattern size={size} id="hill" link="https://t4.ftcdn.net/jpg/02/79/87/81/360_F_279878111_jpQIKrlz9ElTjSTM8pPiYOp2S1IUPfdy.jpg" ></Pattern>
          <Pattern size={size} id="mountain" link="https://www.shutterstock.com/image-vector/mountain-cartoon-landscape-green-hills-260nw-568649782.jpg"></Pattern>

          <Layout size={size} flat={layout.flat} spacing={1.05} origin={config.origin}>
            {
              // note: key must be unique between re-renders.
              hexagons.map((hex, i) => (
                <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} >
                  <Text>{tileNums[i]}</Text>
                </Hexagon>
              ))
            }
          </Layout>
        </HexGrid>
      </div>
    );
  }

  export default GameBoard;