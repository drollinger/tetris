/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loop
 **************************************************/
'use strict';

function main() {
    let [
        graphics,
        keyInput,
        menuing,
        gamePlay,
        blocks,
        scores,
    ] = Initialize();

    let prevTime = performance.now();
    requestAnimationFrame(gameLoop);

    //The Main Game Loop
    function gameLoop(timestamp) {
        let elapsedTime = timestamp - prevTime;
        prevTime = timestamp;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };
    
    function update(elapsedTime) {
        gamePlay.Update(elapsedTime, menuing);
        blocks.Update(elapsedTime, menuing.GameInPlay());
    };
    
    function render() {
        graphics.Clear();
        graphics.RenderBackground();
        graphics.RenderHighscores({
            scores:scores,
        });
        graphics.RenderCustomControls({
            gettingNextKey:keyInput.GettingNextKey(),
            buttons:keyInput.IdToKey,
        });
        graphics.RenderGamePlay({
            gamePlay:gamePlay
        });
        graphics.RenderBlocks({
            blocks:blocks,
        });
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

function Initialize() {
    let scores = {
        highscores: localStorage.getItem(SST.highscores)?.split(',') ?? [],
    };

    //Game Objects
    let menuing = Menuing({});
    let blocks = Blocks({});
    let gamePlay = GamePlay({
        scores: scores,
    });

    //Game Input
    let input = Input();
    let keyInput = input.Keyboard();
    menuing.InitMenuHandlers(keyInput, gamePlay);
    keyInput.RegisterButtonIds({
        [SE.left]: keyInput.KeyHandler(SE.left, function(){}),
        [SE.right]: keyInput.KeyHandler(SE.right, function(){}),
        [SE.ccwRot]: keyInput.KeyHandler(SE.ccwRot, function(){}),
        [SE.cwRot]: keyInput.KeyHandler(SE.cwRot, function(){}),
        [SE.sDrop]: keyInput.KeyHandler(SE.sDrop, function(){}),
        [SE.hDrop]: keyInput.KeyHandler(SE.hDrop, function(){}),
    });

    //Game Graphics
    let graphics = Graphics({
        background: settings.images.background,
        block: settings.images.block,
    });

    return [
        graphics,
        keyInput,
        menuing,
        gamePlay,
        blocks,
        scores
    ];
};
