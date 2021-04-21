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
            [SE.sDrop]: keyInput.KeyHandler(SE.sDrop, softDropHandler),
            [SE.hDrop]: keyInput.KeyHandler(SE.hDrop, keyInput.OnPressOnly(hardDropHandler)),
        });
    };

    let Update = function(elapsedTime, gameInPlay) {
        if (gameInPlay) {
            timer -= elapsedTime;
            if (timer < 0 && !Info.backedUp) {
                let hitGround = fallingHitsFloor();
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
    
    function moveHandler(f, limit) {
        let canMove = true;
        for (let block of Info.falling) {
            if (block.loc.y < 0 ||
                    limit(f(block.loc.x)) ||
                    Info.lines[block.loc.y][f(block.loc.x)]) 
                canMove = false;
        };
        if (canMove)
            for (let block of Info.falling)
                block.loc.x = f(block.loc.x);
        
        return canMove;
    };


    function moveLeftHandler() {
        return moveHandler(
            function(item) {return item-1},
            function(item) {return item < 0}
        );
    };

    function moveRightHandler() {
        return moveHandler(
            function(item) {return item+1},
            function(item) {return item >= SG.cols}
        );
    };

    function hardDropHandler() {
        let closestRow = SG.rows;

        //Get the Largest relative location
        let relativeY = 0;
        for (let block of Info.falling)
            if (block.rLoc.y > relativeY) relativeY = block.rLoc.y;

        for (let block of Info.falling) {
            let startY = block.loc.y > 0 ? block.loc.y : 0;
            for (let i=startY; i<Info.lines.length; i++) {
                if (Info.lines[i][block.loc.x] && 
                        i-block.rLoc.y < closestRow-relativeY) {
                    closestRow = i;
                    relativeY = block.rLoc.y;
                }
            };
        };
        for (let block of Info.falling) {
            block.loc.y = closestRow-1-(relativeY-block.rLoc.y);
        };
        timer = 0;
    };

    function softDropHandler(k, elapsedTime) {
        timer -= SB.softSpeedUp*elapsedTime;
    };

    function fallingHitsFloor() {
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
        return hitGround;
    }

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
