/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: Object which tracks location and 
 *  states of all blocks in game
 *************************************************/
'use strict';

let Blocks = function(spec) {
    let Info = {
        blocks: [],
        lines: [],
    };
    let test = true;

    let Update = function(elapsedTime, gameInPlay) {
        if (gameInPlay) {
            //for(block of blocks) {
            //};
            if (test) {
                Info.blocks = createRandomShape();
                //test = false;
            }
        };
    };

    function createRandomShape() {
        let index = Math.floor(Math.random()*SB.shapes.length);
        let shape = [];
        for (let rLoc of SB.shapes[index]) {
            let block = {}
            block.rLoc = Object.assign({},rLoc);
            block.loc = Object.assign({},rLoc);
            block.loc.x += Math.floor(SB.cols/2)-2;
            block.loc.y -= 2;
            block.falling = true;
            block.color = settings.colors.blocks[index];
            shape.push(block);
        };
        return shape;
    };

    return {
        Info,
        Update,
    };
}
