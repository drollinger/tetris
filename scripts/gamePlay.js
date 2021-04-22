/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: GamePlay orgainizes the flow of
 *  gameplay and tracks things like levels and 
 *  transitions.
 *************************************************/
'use strict';

let GamePlay = function(spec) {
    let scores = spec.scores;
    let blocks = spec.blocks;
    blocks.SetLineIncHandler(incLines);

    let Info = {
        score: 0,
        lines: 0,
        level: 1,
        started: false,
    };

    let Update = function(elapsedTime, menuing) {
        let gameInPlay = menuing.GameInPlay();
        if (gameInPlay) {
            if (!Info.started) {
                blocks.ResetBoard();
                blocks.NewBrickFall();
                Info.started = true;
            };
        };
    };

    let RestartGameHandler = function() {
        Info.score = 0;
        Info.lines = 0;
        Info.level = 1;
        Info.started = false;
    };

    function incLines() {
        Info.lines++;
    };

    return {
        Info,
        Update,
        RestartGameHandler,
    };
}
