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
        falling: [],
        backedUp: false,
    };
    let oldDT;
    let dropTime = SB.initDropTime;
    let timer = dropTime;
    //Initialize lines tracking
    clearLines();

    let InitBlockHandlers = function(keyInput) {
        keyInput.RegisterButtonIds({
            [SE.left]: keyInput.KeyHandler(SE.left, keyInput.OnPressOnly(moveLeftHandler)),
            [SE.right]: keyInput.KeyHandler(SE.right, keyInput.OnPressOnly(moveRightHandler)),
            [SE.ccwRot]: keyInput.KeyHandler(SE.ccwRot, function(){}),
            [SE.cwRot]: keyInput.KeyHandler(SE.cwRot, function(){}),
            [SE.sDrop]: keyInput.KeyHandler(SE.sDrop, keyInput.OnPressOnly(function(){console.log("working")})),
            [SE.hDrop]: keyInput.KeyHandler(SE.hDrop, function(){}),
        });
    };

    let Update = function(elapsedTime, gameInPlay) {
        if (gameInPlay) {
            timer -= elapsedTime;
            if (timer < 0 && !Info.backedUp) {
                let hitGround = false;
                for (let block of Info.falling) {
                    if (block.loc.y+1 >= SG.rows) {
                        hitGround = true;
                        break;
                    }
                    else if (block.loc.y >= -1 && Info.lines[block.loc.y+1][block.loc.x]) {
                        hitGround = true;
                        for (let b of Info.falling)
                            if (b.loc.y < 0) Info.backedUp = true;
                        break;
                    };
                };
                if (hitGround && !Info.backedUp) {
                    for (let block of Info.falling) {
                        Info.lines[block.loc.y][block.loc.x] = true;
                    }
                    NewBrickFall();
                } else if (!hitGround){
                    for (let block of Info.falling) {
                        block.loc.y++;
                    };
                }
                timer = dropTime;
            };
        };
    };

    let NewBrickFall = function() {
        let newShape = createRandomShape();
        Info.blocks = Info.blocks.concat(newShape);
        Info.falling = newShape;
    };

    let ResetBoard = function() {
        Info.blocks.length = 0;
        Info.falling.length = 0;
        clearLines();
        Info.backedUp = false;
        dropTime = SB.initDropTime;
    };

    function moveLeftHandler() {
        let canMove = true;
        for (let block of Info.falling) {
            if (block.loc.x-1 < 0 || Info.lines[block.loc.y][block.loc.x-1]) 
                canMove = false;
        };
        if (canMove)
            for (let block of Info.falling)
                block.loc.x--;
    };

    function moveRightHandler() {
        let canMove = true;
        for (let block of Info.falling) {
            if (block.loc.x+1 >= SG.cols || Info.lines[block.loc.y][block.loc.x+1])
                canMove = false;
        };
        if (canMove)
            for (let block of Info.falling)
                block.loc.x++;
    };

    function softDropHandler() {

    };

    function createRandomShape() {
        let index = Math.floor(Math.random()*SB.shapes.length);
        let shape = [];
        for (let rLoc of SB.shapes[index]) {
            let block = {}
            block.rLoc = Object.assign({},rLoc);
            block.loc = Object.assign({},rLoc);
            block.loc.x += Math.floor(SG.cols/2)-2;
            block.loc.y -= 2;
            block.color = settings.colors.blocks[index];
            shape.push(block);
        };
        return shape;
    };

    function clearLines() {
        //Clear out line tracking
        Info.lines.length = 0;
        for (let i=0; i<SG.rows; i++) {
            Info.lines.push([]);
            for (let j=0; j<SG.cols; j++) {
                Info.lines[i].push(false);
            };
        }; 

    };

    return {
        Info,
        InitBlockHandlers,
        Update,
        NewBrickFall,
        ResetBoard,
    };
}
