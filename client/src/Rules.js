//Game rules go here

import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Rules = () => {
    
    return(
        <div className="App">
            <div className ="content rules">
                <h1>Game Rules</h1>
                <p>
                General Overview<br/>
                </p>
                <p class = "rules-paragraph">
                Each player will play as either a Settler trying to expand their control over the island of Katan. Settlers work against both each other and the Natives and win the game by being the first to 10 Victory points. Each Settlement is worth 1 VP, each City is worth 2 VP, each Victory Point card is worth 1 VP, and the Largest Army and Longest Road special cards are each worth 2 VP<br/><br/>
                <br/><br/>
                
                There are 5 types of terrain tiles on Katan. Each tile produces 1 type of resource.<br/><br/>
                </p>
                <p>
                Pasture<br/>
                Resource: Sheep<br/><br/>
                
                Field<br/>
                Resource: Wheat<br/><br/>
                
                Forest<br/>
                Resource: Wood<br/><br/>
                
                Hills<br/>
                Resource: Brick<br/><br/>
                
                Mountain<br/>
                Resource: Ore
                </p> <br/>
                
                <p>
                Game Setup</p>
                <p class="rules-paragraph">
                1. In clockwise order, starting with a random Settler, each Settler then places 1 Settlement and 1 Road on the board. The Road must be attached to the Settlement and Settlements must be at least 2 edges away from eachother (no matter who they belong to).<br/><br/>
                2. In counter-clockwise order, starting with whoever placed the last Settlement in step 5, each Settler then places another Settlement and Road, with the same restrictions as step 5.<br/><br/>
                3. Each Settler starts with the resources that the Settlement they placed in step 6 could produce.<br/><br/>
                4. Play begins with the Settler who placed the first Settlement in step 1. Then proceeds in clockwise order.
                </p><br />                
                <p>
                Settler Turns</p>
                <p class = "rules-paragraph">
                At the start of each Settler's turn they roll 2 six sided dice. If the total of the 2 dice is anything other than 7, then each Settlement on a tile that matches the value rolled produces 1 resource matching the tile for the Settler it belongs to. Cities produce 2 resources instead of 1.<br/><br/>
                
                If the total of the 2 dice is 7, then each Settler with more than 7 resource cards in their hand discards half their resources (rounded down), then the Settler who rolled the 7 moves the Robber to any tile and steals a random resource from a Settler who has a Settlement or City on the tile. The tile the Robber is on will not produce resources until the Robber is moved.<br/><br/>
                
                The Settler then takes any number of the following actions, in any order, as many times as they would like and have resources for (unless stated otherwise).<br/><br/>
                
                Offer a Trade: Offer to trade any number and type(s) of resource cards for any other type(s) of resource cards. Each player then refuses or accepts the offer. If more than 1 player accepts the offer, the Settler who made the offer choses who they trade with.<br/><br/>
                
                Trade with the Bank: Pay 4 of any one resource to draw 1 of any other resource. If they have a ? port, they may instead pay 3 of any one resource to draw 1 of any other resource. If they have a resource specific port, they may instead pay 2 of that specific resource to draw 1 of any other resource.<br/><br/>
                
                Build a Road: Pay 1 Brick and 1 Wood to place a Road connected to one of your Settlements, Cities, or Roads in a place that doesn't already have any road. If no one has the Longest Road card and you now have a chain of at least 5 roads, or you have a longer chain of roads than whoever has the Longest Road card, you take the Longest Road card<br/><br/>
                
                Build a Settlement: Pay 1 Brick, 1 Sheep, 1 Wheat, and 1 Wood to place a Settlement anywhere on one of your Roads at least 2 edges away from any other Settlement.<br/><br/>
               
                Upgrade a Settlement to a City: Pay 3 Ore and 2 Wheat to replace one of your Settlements with a City.<br/><br/>
                
                Buy a Development Card: Pay 1 Sheep, 1 Ore, and 1 Wheat to draw a Development card (see "Settler Cards" below). It cannot be played this turn unless it is a Victory Point card that (potentially with other Victory Point cards) gets you to 10 Victory Points<br/><br/>
                
                Play a Development Card (limit once per turn): Play a Development card that you didn't draw this turn (unless it's a Victory Point card that would cause you to win, potentially with other VP cards).<br/><br/>
                
                </p><br />
                <p>
                Settler Cards<br/><br/>
                Development Cards<br/>
                </p>
                <p class="rules-paragraph">
                Knight: Move the Robber and steal a random resource from a Settler who has a Settlement or City on the tile the Robber was moved to. If you now have 3 Knights and no one has the Largest Army card, or you now have more Knights that whoever has the Largest Army card, take the Largest Army card.<br/><br/>
                
                Victory Point: Is worth 1 Victory Point. Must be played if doing so would give you 10 VP, and can only be played if doing so would give you 10 VP. Multiple VP cards may be played in a single turn, and they may be played the turn they are drawn.<br/><br/>
                
                Road Building: Place 2 Roads, following normal Road placement rules.<br/><br/>
                
                Year of Plenty: Take any 2 resources from the supply stacks (can be two of the same or two different).<br/><br/>
                
                Monopoly: Name a resource. All Settlers must give you all of the resource cards of that type that they have.<br/><br/>
                </p>
                
                <Link to={"/"}>Back</Link>           
            </div><br />   
        </div>
      )    
 }

 export default Rules;