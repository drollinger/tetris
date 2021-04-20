var settings = {
    blocks: {
        dropTime: 500,
        cols: 10,
        shapes: [
            //T
            [{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
            //Line
            [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
            //Block
            [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
            //L's
            [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1}],
            [{x:0,y:1},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
            //S's
            [{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:2,y:0}],
            [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
        ],
    },
    storage: {
        name: 'drollTetris',
        highscores: 'drollTetris.highScores',
    },
    images: {
        background: 'images/Background.png',
        block: 'images/block.png',
    },
    sounds: {
    },
    colors: {
        blocks: [
            'rgba(198, 122, 206, 1)',
            'rgba(216, 248, 183, 1)',
            'rgba(255, 154, 140, 1)',
            'rgba(81, 196, 211, 1)',
            'rgba(206, 31, 106, 1)',
            'rgba(84, 227, 70, 1)',
            'rgba(255, 210, 113, 1)',
        ],
    },
    sections: {
        main: 'mainMenuSection',
        canvas: 'canvasSection',
        highscores: 'highscoresSection',
        customize: 'customizeSection',
        credits: 'creditsSection',
        pause: 'pauseMenuSection',
    },
    elements: {
        canvas: 'canvas',
        resume: 'resumeMenu',
        exit: 'exitMenu',
        newGame: 'newGameMenu',
        highscoresButton: 'highscoresMenu',
        credits: 'creditsMenu',
        highscoresList: 'highscoresList',
        customize: 'customizeMenu',
        customizeMsg: 'msgText',
        left: 'left',
        right: 'right',
        ccwRot: 'ccwRotation',
        cwRot: 'cwRotation',
        sDrop: 'softDrop',
        hDrop: 'hardDrop',
    },
    //defaults must have same key as element values
    defaults: {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        ccwRotation: 'Home',
        cwRotation: 'PageUp',
        softDrop: 'ArrowDown',
        hardDrop: 'ArrowUp',
    },
    messages: {
        customize: 'Please Press New Button<br>Or Esc to Exit',
    },
};
//Shortcuts to elements
var SST = settings.storage;
var SE = settings.elements;
var SB = settings.blocks;
