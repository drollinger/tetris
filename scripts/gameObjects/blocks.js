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
        stickyTrees: [],
        stickyFalling: false,
        backedUp: false,
        dropTime: SB.initDropTime,
        nextShape: createRandomShape(),
    };
    let timer = Info.dropTime;
    let cSoft = 0;
    let softDropping = false;

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
            if (!softDropping) cSoft = 0;
            if (timer < 0 && !Info.backedUp) {
                if (Info.stickyFalling)
                    dropSticky();
                else {
                    let hitGround = fallingHitsFloor();
                    if (softDropping && !hitGround) cSoft++;
                    if (hitGround && !Info.backedUp) {
                        GameAssets['fall'].play();
                        for (let block of Info.falling) {
                            Info.lines[block.loc.y][block.loc.x] = true;
                        }
                        let clearedLines = removeFullLines(Info.falling);
                        Info.falling.length = 0;
                        Info.incSoftScore(cSoft);
                        if(clearedLines.length > 0) {
                            stickyFall(Math.max(...clearedLines));
                            Info.stickyFalling = true;
                        } else NewBrickFall();
                        cSoft = 0;
                    } else if (!hitGround){
                        for (let block of Info.falling) {
                            block.loc.y++;
                        };
                    };

                };
                timer = Info.dropTime;
            };
            softDropping = false;
        };
    };

    let NewBrickFall = function() {
        Info.blocks = Info.blocks.concat(Info.nextShape);
        Info.falling = Info.nextShape;
        Info.nextShape = createRandomShape();
    };

    let ResetBoard = function() {
        Info.blocks.length = 0;
        Info.falling.length = 0;
        clearLines();
        Info.backedUp = false;
        Info.stickyTrees.length = 0;
        Info.stickyFalling = false;
        Info.dropTime = SB.initDropTime;
    };

    let SetGamePlayHandlers = function(incLines, softInc) {
        Info.incLinesHandler = incLines;
        Info.incSoftScore = softInc;
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
    };

    function clockRotHandler() {
        rotHandler(
            function(rX, rY) {
                return Math.floor(rX+rY)-1;
            },
            function(rX, rY) {
                return Math.floor(rY-rX);
            }
        );
    };

    function counterRotHandler() {
        rotHandler(
            function(rX, rY) {
                return Math.floor(rX-rY);
            },
            function(rX, rY) {
                return Math.floor(rY+rX)-1;
            }
        );
    };

    function moveLeftHandler() {
        moveHandler(
            function(item) {return item-1},
            function(item) {return item < 0}
        );
    };

    function moveRightHandler() {
        moveHandler(
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
        let dis = 0;
        for (let block of Info.falling) {
            let nY = closestRow-1-(relativeY-block.rLoc.y)
            dis = nY-block.loc.y;
            block.loc.y = nY;
        };
        //Give scoring as if soft drop
        Info.incSoftScore(dis);
        timer = -1;
    };

    function softDropHandler(k, elapsedTime) {
        if (!Info.stickyFalling) {
            timer -= SB.softSpeedUp*elapsedTime;
            softDropping = true;
        };
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
                GameAssets['fall'].play();
                for (let b of Info.falling)
                    if (b.loc.y < 0) Info.backedUp = true;
                break;
            };
        };
        return hitGround;
    }

    function treeHitsFloor(tree) {
        let hitGround = false;
        for (const [y, subTree] of Object.entries(tree)) {
            for (const [x, block] of Object.entries(subTree)) {
                if (parseInt(y)+1 >= SG.rows) {
                    GameAssets['fall'].play();
                    hitGround = true;
                    break;
                }
                else if (Info.lines[parseInt(y)+1][parseInt(x)]) {
                    GameAssets['fall'].play();
                    hitGround = true;
                    break;
                };
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

    function rotHandler(calcOffX, calcOffY) {
        //x and y flipped since on rotation x -> y
        let wallKick = kick('y');
        for (let block of Info.falling) {
            let rX = block.rot.x - block.rLoc.x;
            let rY = block.rot.y - block.rLoc.y;
            //Save offsets for future use
            block.offX = calcOffX(rX, rY);
            block.offY = calcOffY(rX, rY);

            let nXLoc = block.loc.x+block.offX;
            let nYLoc = block.loc.y+block.offY;
            if(!wallKick.info.kick && block.loc.y >= 0 && (
                    nXLoc < 0 || nXLoc > SG.cols-1 ||
                    Info.lines[block.loc.y][nXLoc]))
                wallKick.update(true, block.offX, block.rLoc.y, getCutOff(rX));
            
        };
        let xKick = wallKick.getMaxKick();
        let sign = Math.sign(xKick);

        let possible;
        for (let i=0; i<=Math.abs(xKick); i++) {
            possible = true;
            for (let block of Info.falling) {
                let nXLoc = block.loc.x+block.offX+sign*i;
                let nYLoc = block.loc.y+block.offY;
                if(nXLoc < 0 || nXLoc > SG.cols-1 ||
                        nYLoc < 0 || nYLoc > SG.rows-1 ||
                        Info.lines[nYLoc][nXLoc])
                    possible = false;
            };
            if (possible) {
                xKick = sign*i;
                break;
            };
        };

        if (possible) {
            GameAssets['selection'].volume = 0.5;
            GameAssets['selection'].currentTime = 0;
            GameAssets['selection'].play();
            for (let block of Info.falling) {
                block.loc = {
                    x: block.loc.x+block.offX+xKick,
                    y: block.loc.y+block.offY,
                };
                block.rLoc = {x:block.rLoc.x+block.offX, y:block.rLoc.y+block.offY};
            };
        };
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

    function stickyFall(minY) {
        let treeAr = [];
        //Go through all lines until true
        for (let j=minY-1; j>=0; j--) {
            for (let i=0; i<Info.lines[j].length; i++) {
                if(Info.lines[j][i]) {
                    let tree = {};
                    createRecTree(i, j, tree);
                    treeAr = treeAr.concat(tree);
                };
            };
        };

        //Go through all blocks
        for (let b=Info.blocks.length-1; b>=0; b--) {
            let block = Info.blocks[b];
            if (block.loc.y < minY) {
                for (let tree of treeAr) {
                    if (tree[block.loc.y]?.[block.loc.x] !== undefined) {
                        tree[block.loc.y][block.loc.x] = block;
                    };
                };
            };
        };

        Info.stickyTrees = treeAr;
    };

    function dropSticky() {
        let treeAr = Info.stickyTrees;
        for (let t=treeAr.length-1; t>=0; t--) {
            if (treeHitsFloor(treeAr[t])) {
                let fallingBlocks = [];
                for (const [y, subTree] of Object.entries(treeAr[t])) {
                    for (const [x, block] of Object.entries(subTree)) {
                        Info.lines[parseInt(y)][parseInt(x)] = true;
                        fallingBlocks.push(block);
                    };
                };
                let clearedLines = removeFullLines(fallingBlocks);
                if(clearedLines.length > 0) {
                    stickyFall(Math.max(...clearedLines));
                    Info.stickyFalling = true;
                } else treeAr.splice(t, 1);
            } else {
                let updatedTree = {};
                for (const [y, subTree] of Object.entries(treeAr[t])) {
                    updatedTree[parseInt(y)+1] = {};
                    for (const [x, block] of Object.entries(subTree)) {
                        block.loc.y++;
                        updatedTree[parseInt(y)+1][parseInt(x)] = block;
                    };
                };
                treeAr[t] = updatedTree;
            };
        };

        if (treeAr.length === 0) {
            Info.stickyFalling = false;
            NewBrickFall();
        };
    };

    function createRecTree(i, j, tree) {
        if (i >= 0 && i < SG.cols &&
                j >= 0 && j < SG.rows &&
                Info.lines[j][i]) {
            if(tree[j] == undefined) tree[j] = {};
            tree[j][i] = {};
            Info.lines[j][i] = false;

            createRecTree(i+1, j, tree);
            createRecTree(i-1, j, tree);
            createRecTree(i, j+1, tree);
            createRecTree(i, j-1, tree);
        };
    };

    function removeFullLines(blockAr) {
        let prevY = [];
        let linesCleared = 0;
        for (let block of blockAr) {
            let y = block.loc.y;
            if (prevY.indexOf(y) < 0) {
                let lineClear = true;
                for (let l of Info.lines[y]) {
                    if (!l) lineClear = false;
                };
                if (lineClear) {
                    for (let i=0; i<Info.lines[y].length; i++) {
                        Info.lines[y][i] = false;
                    };
                    for (let i=Info.blocks.length-1; i>=0; i--) {
                        if (Info.blocks[i].loc.y == y) Info.blocks.splice(i, 1);
                    };
                    prevY.push(y);
                    linesCleared++;
                };
            };
        };
        if(prevY.length > 0) GameAssets['lineClear'].play();
        Info.incLinesHandler(linesCleared);
        return prevY;
    };

    return {
        Info,
        InitBlockHandlers,
        Update,
        NewBrickFall,
        ResetBoard,
        SetGamePlayHandlers,
    };
}
