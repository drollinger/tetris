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

    let Info = {
        level: 1,
        score: 0,
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
        Info.level = 1;
        Info.score = 0;
        Info.started = false;
    };

    return {
        Info,
        Update,
        RestartGameHandler,
    };
}
