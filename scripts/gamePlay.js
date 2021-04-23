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
    let menuing = spec.menuing;
    blocks.SetGamePlayHandlers(incLines, softDropScore);

    let Info = {
        score: 0,
        lines: 0,
        level: 0,
        started: false,
        gameOver: false,
        endCount: SB.gameOverTime,
    };

    let Update = function(elapsedTime, menuing) {
        let gameInPlay = menuing.GameInPlay();
        if (gameInPlay) {
            if (Info.endCount < 0) {
                menuing.GoToMainMenu();
                //Save High Score
                scores.highscores.push(Info.score);
                scores.highscores.sort(function(a, b){return b-a});
                if (scores.highscores.length > 5) scores.highscores = scores.highscores.slice(0, 5);
                localStorage[SST.highscores] = scores.highscores;
                RestartGameHandler();
            }
            else if (!Info.started) {
                blocks.ResetBoard();
                blocks.NewBrickFall();
                Info.started = true;
            }
            else if(blocks.Info.backedUp) {
                Info.gameOver = true;
                Info.endCount -= elapsedTime;
            }
        };
    };

    let RestartGameHandler = function() {
        Info.score = 0;
        Info.lines = 0;
        Info.level = 0;
        Info.started = false;
        Info.gameOver = false;
        Info.endCount = SB.gameOverTime;
    };

    function incLines(lines) {
        Info.lines += lines;

        //Set new level
        Info.level = Math.floor(Info.lines/SB.linesPerLevel);

        //Add scoring
        //Scoring is the Original Nintendo Scoring System
        let mult = 0;
        if (lines == 1) mult = 40;
        else if (lines == 2) mult = 50;
        else if (lines == 3) mult = 100;
        else if (lines >= 4) mult = 300;
        Info.score += lines*mult*(Info.level+1);

        //Set drop time
        let dt = blocks.Info.dropTime;
        dt = SB.initDropTime-(SB.dropDec*Info.level);
        if (dt < SB.dropLow) dt = SB.dropLow;
        blocks.Info.dropTime = dt;
    };

    function softDropScore(score) {
        //Scoring of the Original Nintendo Scoring System
        // awards a point for each continuous soft drop
        // hard drop is not mentioned but is counted as if
        // soft dropped the whole way
        Info.score += score;
    };

    return {
        Info,
        Update,
        RestartGameHandler,
    };
}
