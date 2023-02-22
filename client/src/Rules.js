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
                Each player will play as either a Settler or a Native.
                
                Settlers work against both each other and the Natives and win the game by being the first to 10 Victory points. Each Settlement is worth 1 VP, each City is worth 2 VP, each Victory Point card is worth 1 VP, and the Largest Army and Longest Road special cards are each worth 2 VP<br/><br/>
                
                Natives work together to try to get the Settlers off Katan, and can win in one of two ways. If there are ever at least twice as many non-destroyed Tribes as there are non-destroyed Settlements plus non-destroyed Cities, the Natives have enough manpower to force the Settlers off Katan. Alternatively, if any two Settler's Settlements and Cities are all destroyed, then all the remaining Settlers become too scared of the Natives and flee the island.
                <br/><br/>
                
                There are 5 types of terrain tiles on Katan. Each tile produces 2 different resources, 1 normal resource and 1 Native resource.<br/><br/>
                </p>
                <p>
                Pasture<br/>
                Normal Resource: Sheep<br/>
                Native Resource: Fiber<br/><br/>
                
                Field<br/>
                Normal Resource: Wheat<br/>
                Native Resource: Herb<br/><br/>
                
                Forest<br/>
                Normal Resource: Wood<br/>
                Native Resource: Deer<br/><br/>
                
                Hills<br/>
                Normal Resource: Brick<br/>
                Native Resource: Turquoise<br/><br/>
                
                Mountain<br/>
                Normal Resource: Ore<br/>
                Native Resource: Mana
                </p> <br/>
                <p>
                Keywords</p><br/>
                <p class="rules-paragraph">
                Location: Settlements, Cities, Camps, and Tribes are locations.<br/><br/>

                Impaired: The next time the location would produce resources, it instead doesn't and it stops being impaired.<br/><br/>

                Damaged: The next time the location would produce resources, it instead doesn't and it becomes impaired instead of damaged.<br/><br/>

                Destroyed: Whenever the location would produce resources, instead roll a six sided die. If this is the first time the destroyed location would have produced resources, it becomes damaged instead of destroyed if a 6 is rolled. If it is the second time, then it becomes damaged instead of destroyed if a 5 or 6 is rolled. Otherwise, it becomes damaged instead of destroyed if a 4, 5, or 6 is rolled.<br/><br/>

                Attack: Cause the location to become impaired. If it was already impaired, it instead becomes damaged. If it was already damaged, it instead becomes destroyed.<br/><br/>

                Repair: Cause an impaired or damaged location to stop being impaired/damaged or cause a destroyed location to become impaired instead of destroyed.<br/><br/>

                Hampered: Until your next turn, Settlers can't build roads or Settlements on the hampered tile. They may still upgrade Settlements to Cities.<br/><br/>

                Blighted: Until your next turn, Natives can't perform any actions on the blighted tile or any location or road on the blighted tile.  
                </p><br/>
                <p>
                Game Setup</p>
                <p class="rules-paragraph">
                1. Each Native chooses their Tribal Leader. This determines their Tribal Deck and their special ability they can activate if they roll a 7 (see "Tribal Leaders" below).<br/>
                2. Natives begin with a number of starting Tribes equal to one fewer than twice the number of Settlers. This means that the Natives will start with 5 Tribes in a 4-5 player game, and 7 Tribes in a 6-8 player game. Natives take turns placing starting Tribes until there are no more starting Tribes to place. If possible, a starting Tribe must be placed on a tile type that doesn't already have a Tribe on it.<br/>
                3. Each Native draws 2 Basic Cards and 1 Tribal card.<br/>
                4. For each starting Tribe, the Native who placed it chooses one of the two resources that Tribe could produce to add to the Native's resources.<br/>
                5. In clockwise order, starting with a random Settler, each Settler then places 1 Settlement and 1 Road on the board. The Road must be attached to the Settlement and Settlements must be at least 2 edges away from eachother (no matter who they belong to).<br/>
                6. In counter-clockwise order, starting with whoever placed the last Settlement in step 5, each Settler then places another Settlement and Road, with the same restrictions as step 5.<br/>
                7. Each Settler starts with the resources that the Settlement they placed in step 6 could produce.<br/>
                8. Play begins with the Settler who placed the first Settlement in step 5. After each Settler turn is a Native turn and vice versa.
                </p><br />                
                <p>
                Settler Turns</p>
                <p class = "rules-paragraph">
                At the start of each Settler's turn they roll 2 six sided dice. If the total of the 2 dice is anything other than 7, then each Settlement on a tile that matches the value rolled produces 1 normal resource matching the tile for the Settler it belongs to. Cities produce 2 resources instead of 1.<br/><br/>
                
                If the total of the 2 dice is 7, then each Settler with more than 7 resource cards in their hand discards half their resources (rounded down), then the Settler who rolled the 7 moves the Robber to any tile and steals a random resource from a Settler who has a Settlement or City on the tile. The tile the Robber is on will not produce resources until the Robber is moved.<br/><br/>
                
                The Settler then takes any number of the following actions, in any order, as many times as they would like and have resources for (unless stated otherwise).<br/><br/>
                
                Offer a Trade: Offer to trade any number and type(s) of resource cards for any other type(s) of resource cards. Each player then refuses or accepts the offer. If more than 1 player accepts the offer, the Settler who made the offer choses who they trade with.<br/><br/>
                
                Trade with the Bank: Pay 4 of any one resource to draw 1 of any other resource. If they have a ? port, they may instead pay 3 of any one resource to draw 1 of any other resource. If they have a resource specific port, they may instead pay 2 of that specific resource to draw 1 of any other resource.<br/><br/>
                
                Build a Road: Pay 1 Brick and 1 Wood to place a Road connected to one of your Settlements, Cities, or Roads in a place that doesn't already have any road. If no one has the Longest Road card and you now have a chain of at least 5 roads, or you have a longer chain of roads than whoever has the Longest Road card, you take the Longest Road card<br/><br/>
                
                Build a Settlement: Pay 1 Brick, 1 Sheep, 1 Wheat, and 1 Wood to place a Settlement anywhere on one of your Roads at least 2 edges away from any other Settlement.<br/><br/>
               
                Upgrade a Settlement to a City: Pay 3 Ore and 2 Wheat to replace one of your Settlements with a City.<br/><br/>
                
                Buy a Development Card: Pay 1 Sheep, 1 Ore, and 1 Wheat to draw a Development card (see "Settler Cards" below). It cannot be played this turn unless it is a Victory Point card that (potentially with other Victory Point cards) gets you to 10 Victory Points<br/><br/>
                
                Buy a Destruction Card: Pay 2 Ore and 1 Wood to draw a Destruction card (see "Settler Cards" below). It cannot be played this turn.<br/><br/>
                
                Buy a Defensive Card: Pay 2 Bricks and 1 Ore to draw a Defensive card (see "Settler Cards" below). It cannot be played this turn.<br/><br/>
                
                Play a Development Card (limit once per turn): Play a Development card that you didn't draw this turn (unless it's a Victory Point card that would cause you to win, potentially with other VP cards).<br/><br/>
                
                Play a Destruction Card (limit once per turn): Play a Destruction card that you didn't draw this turn.<br/><br/>
                
                Play a Defensive Card (limit once per turn): Play a Defensive card that you didn't draw this turn<br/><br/>
                </p><br />
                <p>
                Settler Cards<br/><br/>
                Development Cards<br/>
                </p>
                <p class="rules-paragraph">
                Knight: Move the Robber and steal a random resource from a Settler who has a Settlement or City on the tile the Robber was moved to. If you now have 3 Knights and no one has the Largest Army card, or you now have more Knights that whoever has the Largest Army card, take the Largest Army card.<br/><br/>
                
                Victory Point: Is worth 1 Victory Point. Must be played if doing so would give you 10 VP, and can only be played if doing so would give you 10 VP. Multiple VP cards may be played in a single turn, and they may be played the turn they are drawn.<br/><br/>
                
                Road Building: Place 2 Roads, following normal Road placement rules.<br/><br/>
                
                Year of Plenty: Take any 2 normal resources from the supply stacks (can be two of the same or two different).<br/><br/>
                
                Monopoly: Name a resource. All Settlers must give you all of the resource cards of that type that they have.<br/><br/>
                </p>
                <p>
                Destruction Cards<br/>
                </p>

                <p class = "rules-paragraph">
                Exploit the Land: Blight a tile that one or more of your Settlements or Cities is on and gain 1 resource from it (of the normal type it produces). May discard a Turquoise or Mana to repeat this on a tile adjacent to the first tile you blighted, which doesn't have to have one of your Settlements or Cities. <br/><br/>
                
                Aggressive Negotiations: Steal 2 random resources from the Natives. May discard a Turquoise or Deer to instead choose which resources to steal. <br/><br/>
                
                Cull the Savages: Attack 2 Camps on tiles with one or more of your Settlements or Cities. May discard a Deer or Herb to repeat this. <br/><br/>
                
                Eliminate the Savages: Attack 1 Tribe on a tile with one or more of your Settlements or Cities. May discard an Herb or Fiber to repeat this.<br/><br/>
                
                Convert the Savages: 1 Native of your choice discards 2 Basic or Tribal cards of their choice. May discard a Fiber or a Mana to instead cause them to discard all of their Basic and Tribal cards.<br/><br/>
                </p>
                <p>
                Defensive Cards<br/>
                </p>
                <p class="rules-paragraph">
                Recover from Unprovoked Aggression: Repair up to 2 Settlements, 2 Cities, or 1 of each. May discard a Fiber or Herb to also prevent both repaired locations from being damaged until your next turn<br/><br/>
                
                Knights Visit the Outskirts: Choose up to 2 Settlements. The next time one of them would be damaged, it instead isn't (the protection then goes away for both of them). This protection remains if one or both are upgraded to a City before the protection is used. May discard a Mana or Herb to instead choose up to 3 Settlements and prevent the next 2 times one of them would be damaged.<br/><br/>
                
                Bolster the City Walls: Choose a City. The next time it would be damaged, it instead isn't. May discard a Mana or Turquoise to repeat this (you may choose the same City, which would prevent the next 2 times it would take damage).<br/><br/>
                
                Scout the Wilds: Choose a tile. Prevent the next time it would be hampered. May discard a Turquoise or Deer to also choose a tile that is already hampered and cause it to no longer be hampered. <br/><br/>
                
                Increase Highway Patrol: Choose one of your Settlements or Cities. The next time a road connected to that location would be removed, it instead isn't. You may discard a Deer or Fiber to instead have this apply to all of your roads and for the next 2 removals to be prevented.  
                </p><br/>
                <p>
                Native Turns<br/>
                At the start of each Native's turn they roll 2 six sided dice then choose one of the following.
                </p>
                <p class="rules-paragraph"> 
                1. If a 7 was rolled, move the Robber and steal a random resource from a Settler who has a Settlement or City on the tile you moved the Robber to.<br/>
                2. If a 7 was rolled, draw 2 Basic cards, 2 Tribal cards, or 1 of each.<br/>
                3. If a 7 was rolled, activate your Tribal Leader's ability (see "Tribal Leaders" below).<br/>
                4. Each Tribe produces 2 resources (2 normal, 2 Native, or 1 of each), and each Camp produces 1 resource (a normal or a Native).<br/>
                5. Draw a Basic or Tribal card, then each Tribe produces 1 resource (a normal or a Native).<br/><br/>
                
                Then the Native may play any cards they have by paying their costs (see "Native Cards" and "Tribal Leaders" below). Natives can also offer trades just like the Settlers, though they can't trade with the bank.
                </p><br/>
                <p>
                Native Cards
                </p>
                <p class="rules-paragraph">
                There are three types of Native cards. Basic Cards, which can be drawn by any Native, Tribal cards, which are unique to each Tribal Leader, and Patron Spirit cards which are unique to each Tribal Leader and start the game outside of the Tribal Decks.<br/><br/>
                </p>
                Basic Cards
                <p class="rules-paragraph">
                Grow our Numbers<br/> 
                Option 1. Pay 1 Fiber, 1 Wood, and 1 Deer/Sheep/Wheat to create a Camp on a tile with no Camp or Tribe.<br/>
                Option 2. Pay 2 Bricks, 1 Ore, 1 Turquoise, and 1 Deer/Sheep/Wheat to upgrade a Camp to a Tribe.<br/><br/>
                
                Regrow after Assault<br/>
                Pay 2 Fiber, 1 Fiber and 1 Wood, or 2 Wood to repair up to 2 Camps, up to 2 Tribes, or 1 of each.<br/><br/>
                
                Raid Their Villages<br/>
                Option 1. Pay 1 Fiber, 1 Ore, and 1 Wood to attack a Settlement that is on a tile with a Camp or Tribe.<br/>
                Option 2. Pay 1 Fiber, 1 Mana, 1 Ore, and 2 Wood to attack a City that is on a tile with a Camp or Tribe.<br/><br/>
                
                Slow their Expansion<br/>
                Option 1. Pay 1 Brick, 1 Mana, and 1 Wood to Hamper a tile that has a Camp or Tribe or is adjacent to a tile with a Tribe.<br/>
                Option 2. Pay 1 Fiber, 1 Mana, 1 Ore, and 1 Wood to remove a Road from the map that is on a tile with a Camp or Tribe. This cannot target a Road if removing that Road would cause any other Roads to no longer be connected to at least 1 Settlement or City of its color.<br/><br/>
                
                Call our Patron Spirit<br/>
                Pay 1 Mana and 1 Herb/Turquoise to shuffle your Patron Spirit card into your Tribal Deck.
                </p><br/>
                <p>
                Tribal Leaders<br/>
                </p>
                <p class="rules-paragraph">
                Each Tribal Leader has 5 unique cards, called Tribal cards, which make up their Tribal Deck. 5 copies of a card that counts as 2 different Basic cards, 4 copies of a card that is a cheaper version of one of those Basic cards, 3 copies of a card that is a stronger version of the other Basic card, 2 copies of a unique temporary effect, and a copy of their Patron Spirit which is a permenant effect and starts the game outside of the Tribal Deck.<br/><br/>
                </p>
                <p>
                Leader Name: Proliferating Rabit
                </p>
                <p class="rules-paragraph">
                Ability on 7: May have each Tribe produce 1 normal resource<br/>
                Patron Spirit: Invoke Earth with Nurtures All Life<br/>
                Pay 2 Brick, 2 Mana, 2 Ore, and 2 Turquoise to add a 6 or 8 to a tile that doesn't already have that number on it. A tile produces for both Settlers and Natives if any of its numbers are rolled. Return this card to the box instead of discarding it.<br/><br/>    
                
                Grow our Numbers / Regrow after Assault<br/>
                Has all the options of Grow our Numbers combined with Regrow after Assault.<br/><br/>
                Make Swift Repairs<br/>
                Pay 1 Fiber or 1 Wood to repair up to 1 Camp and up to 1 Tribe.<br/><br/>
                The Land Supports our Growth<br/>
                Option 1. Pay 1 Fiber, 1 Wood, and 2 Sheep/Wheat/Deer to create a Tribe on a tile that doesn't have a Camp or Tribe.<br/>
                Option 2. Pay 2 Bricks, 1 Ore, 2 Turquoise, and 2 Sheep/Wheat/Deer to upgrade 2 Camps to Tribes.<br/><br/>
                
                Best Gatherers on the Island<br/>
                Pay 1 Deer, 1 Herb, and 1 Turquoise to roll for resources 3 times (same process as the start of a Native turn).<br/><br/>
                </p>
                <p>
                Leader Name: Resiliant Badger
                </p>
                <p class="rules-paragraph">
                Ability on 7: May repair a Camp or Tribe<br/>
                Patron Spirit: Invoke Water Seeks Swift Retribution<br/>
                Pay 1 Herb, 3 Mana, 3 Ore, and 1 Turquoise to make it so from now on whenever a Settler would damage a Camp or Tribe (even if that damage is prevented), damage a random Settlement or City that belongs to that Settler. Return this card to the box instead of discarding it.<br/><br/>
               
                Regrow after Assault / Raid their Villages<br/>
                Has all the options of Regrow after Assault combined with Assault their Villages.<br/><br/>
                
                Attack in the Night<br/>
                Option 1. Pay 2 of the following (must be 2 different resources), 1 Fiber, 1 Ore, 1 Wood to attack a Settlement that is on a tile with a Camp or Tribe.<br/>
                Option 2. Pay 1 Fiber, 1 Mana, 1 Ore, and 1 Wood to attack a City that is on a tile with a Camp or Tribe.<br/><br/>
                
                Make Lasting Repairs<br/>
                Pay 1 Fiber and 1 Brick/Ore to repair up to 2 Camps, up to 2 Tribes, or 1 of each. The next time one of them would be damaged, it instead isn't (the protection then goes away for both of them)<br/><br/>
                
                Best Guardians on the Island<br/>
                Pay 2 Herbs and 1 Ore to choose 3 Camps/Tribes. They cannot be damaged until your next turn.<br/><br/>
                </p>
                <p>
                Leader Name: Paralyzing Viper
                </p>
                <p class="rules-paragraph">
                Ability on 7: May attack a Settlement or City<br/>
                Patron Spirit: Invoke Fire Consumes Indiscriminately<br/>
                Pay 3 Mana and 5 Wood to remove a Settlement or City of each color and a Camp or Tribe from the board. If this would cause any Roads to no longer be connected to a Settlement or City of its color, also remove those Roads. Return this card to the box instead of discarding it.<br/><br/>
                
                Raid their Villages / Slow their Expansion<br/>
                Has all the options of Raid their Villages combined with Slow their Expansion.<br/><br/>
                
                Pester the Invaders<br/>
                Option 1. Pay 1 Brick and 1 Mana to hamper a tile that has a Camp or Tribe<br/>
                Option 2. Pay 1 Fiber, 1 Mana, and 1 Wood to remove a Road from the map that is on a tile with a Camp or Tribe. This cannot target a Road if removing that Road would cause any other Roads to no longer be connected to at least 1 Settlement or City of its color.<br/><br/>
                
                Twin Headed Strike<br/>
                Option 1. Pay 2 Fiber, 1 Ore, and 1 Wood to attack two different Settlements that are each on a tile with a Camp or Tribe (does not have to be the same tile).<br/>
                Option 2. Pay 2 Fiber, 1 Mana, 2 Ore, and 2 Wood to attack two different Cities that are each on a tile with a Camp or Tribe (does not have to be the same tile).<br/><br/>
                
                Best Raiders on the Island<br/>
                Pay 1 Mana, 2 Ore, and 1 Wood to Destroy 1 Settlement or City.<br/><br/>

                </p>
                <p>
                Leader Name: Crafty Fox
                </p>
                <p class="rules-paragraph">
                Ability on 7: May hamper a tile<br/>
                Patron Spirit: Invoke Wind Enjoys Messing with Mortals<br/>
                Pay 3 Fiber, 2 Herbs, 3 Mana, and 2 Turquoise to replace a tile's value with a 2 or a 12. If there was a Camp or Tribe on the chosen tile, you may move it to a tile of the same type that doesn't have a Camp or Tribe. Return this card to the box instead of discarding it.<br/><br/> 

                Slow their Expansion / Call our Patron Spirit<br/>
                Has all the options of Slow their Expansion combined with Call our Patron Spirit.<br/><br/>

                Feast to Celebrate our Patron Spirit<br/>
                Pay 1 Deer/Sheep to shuffle your Patron Spirit card into your Tribal Deck.<br/><br/>

                Properly Planned Mischief<br/>
                Pay 1 Brick, 1 Fiber, 1 Mana, and 1 Wood to hamper a tile and remove a road that is on that tile. This cannot target a Road if removing that Road would cause any other Roads to no longer be connected to at least 1 Settlement or City of its color.<br/><br/>

                Best Thieves on the Island<br/>
                Pay 1 Deer, 1 Mana, and 1 Wood to choose a Settler and steal a random resource from them. Then do that four more times.<br/><br/>
                </p>
                <p>
                Leader Name: Radiant Eagle
                </p>
                <p class="rules-paragraph">
                Ability on 7: May put a card from your discard pile or the Basic discard pile into your hand.<br/>
                Patron Spirit: Invoke Star Summons all Spirits<br/>
                Pay 2 Herbs, 6 Mana, and 2 Turquoise to put every other Patron Spirit card into its Tribal Leader's hand. Patron Spirit cards of Leaders not in this game are instead put into your hand. Return this card to the box instead of discarding it.<br/><br/>

                Call our Patron Spirit / Grow our Numbers<br/>
                Has all the options of Call our Patron Spirit combined with Grow our Numbers<br/><br/>

                Our Light Quickens our Growth<br/>
                Option 1. Pay 1 Wood, and 1 Deer/Sheep/Wheat to create a Camp on a tile with no Camp or Tribe.<br/>
                Option 2. 1 Ore, 1 Turquoise, and 1 Deer/Sheep/Wheat to upgrade a Camp to a Tribe.<br/><br/>

                Spirit Hastens with our Song<br/>
                Pay 1 Herb, 1 Mana, and 1 Turquoise to place your Patron Spirit on top of your Tribal deck. If it is already in your Tribal deck, instead place it in your hand.<br/><br/>

                Best Oracles on the Island<br/>
                Pay 2 Herbs and 2 Mana to look at the top 6 cards of any deck. You may put any number of them on the bottom of that deck in a random order, then return the rest to the top in any order.
                </p><br/>
                <Link to={"/"}>Back</Link>           
            </div><br />   
        </div>
      )    
 }

 export default Rules;