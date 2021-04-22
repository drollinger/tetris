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
            [SE.ccwRot]: keyInput.KeyHandler(SE.ccwRot, keyInput.OnPressOnly(counterRotHandler)),
            [SE.cwRot]: keyInput.KeyHandler(SE.cwRot, keyInput.OnPressOnly(clockRotHandler)),
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
            if (Info.backedUp || limit(f(block.loc.x)) ||
                    (block.loc.y >= 0 && Info.lines[block.loc.y][f(block.loc.x)])) 
                canMove = false;
        };
        if (canMove)
            for (let block of Info.falling)
                block.loc.x = f(block.loc.x);
        
        return canMove;
    };

    function clockRotHandler() {
        //x and y flipped since on rotation x -> y
        let floorKick = kick('x');
        let wallKick = kick('y');
        for (let block of Info.falling) {
            let rX = block.rot.x - block.rLoc.x;
            let rY = block.rot.y - block.rLoc.y;
            //Save offsets for future use
            block.offX = Math.floor(rX+rY)-1;
            block.offY = Math.floor(rY-rX);

            let nXLoc = block.loc.x+block.offX;
            let nYLoc = block.loc.y+block.offY;
            if(!wallKick.info.kick && block.loc.y > 0 && (
                    nXLoc < 0 || nXLoc > SG.cols-1 ||
                    Info.lines[block.loc.y][nXLoc]))
                wallKick.update(true, block.offX, block.rLoc.y, getCutOff(rX));
            
            if(!floorKick.info.kick && block.offY > 0 && (
                    nYLoc > SG.rows-1 ||
                    Info.lines[nYLoc][block.loc.x])) {
                floorKick.update(true, -1*block.offY, block.rLoc.x, getCutOff(rY));
            };
        };
        let xKick = wallKick.getMaxKick();
        let yKick = floorKick.getMaxKick();

        let possible = true;
        for (let block of Info.falling) {
            let nXLoc = block.loc.x+block.offX+xKick;
            let nYLoc = block.loc.y+block.offY+yKick;
            if(nXLoc < 0 || nXLoc > SG.cols-1 ||
                    nYLoc < 0 || nYLoc > SG.rows-1 ||
                    Info.lines[nYLoc][nXLoc])
                possible = false;
        };

        possible = true;

        if (possible) {
            for (let block of Info.falling) {
                block.loc = {
                    x: block.loc.x+block.offX+xKick,
                    y: block.loc.y+block.offY+yKick,
                };
                block.rLoc = {x:block.rLoc.x+block.offX, y:block.rLoc.y+block.offY};
            };
        };
    };

    function counterRotHandler() {
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
            block.rot = SB.rot[index];
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

    function absMax(num1, num2) {
        if (Math.abs(num1) > Math.abs(num2))
            return num1;
        else {
            return num2;
        }
    };

    function getCutOff(v) {
        if (v < 0)
            return Math.floor(v)+1;
        else if (v > 0)
            return Math.ceil(v)-1;
        else
            return 0;
    };

    function kick(o) {
        let info = {
            kick: false,
            dis: 0,
            rel: 0,
            cOff: 0,
        };

        let getMaxKick = function() {
            let len = 0;
            if (info.kick) {
                for (let block of Info.falling) {
                    //check for same sign
                    if (info.dis*(info.rel-block.rLoc[o]) >= 0)
                        len = absMax(len, info.dis+info.rel-block.rLoc[o]-info.cOff);
                };
            };
            //Return opposite so that kick goes the right way
            return -1*len;
        };

        let update = function(k, d, r, c) {
            info.kick = k;
            info.dis = d;
            info.rel = r;
            info.cOff = c;
        };

        return ({info, getMaxKick, update});
    };

    return {
        Info,
        InitBlockHandlers,
        Update,
        NewBrickFall,
        ResetBoard,
    };
}
