//Shorthand names
//SST = storage;
//SE = elements;
//SB = blocks;
//SG = grid;
//SD = dim;
//SL = loc;
var settings = {
    dim: {
        width: 25,
        height: 25,
    },
    loc: { //y is the base line of text
        score: {x: 17, y: 6},
        lines: {x: 17, y: 7.5},
        next: {x: 17, y: 13.5, scale: 0.7},
        level: {x: 17, y: 21.75},
        widths: {
            gameInfo: 5,
        },
    },
    grid: {
        startX: 3,
        startY: 5,
        cols: 10,
        rows: 17,
    },
    blocks: {
        initDropTime: 700,
        dropDec: 45,
        dropLow: 80,
        linesPerLevel: 10,
        softSpeedUp: 12,
        shapes: [
            //T
            [{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
            //Line
            [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}],
            //Block
            [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
            //L's
            [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1}],
            [{x:0,y:1},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
            //S's
            [{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:2,y:0}],
            [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
        ],
        rot: [ //rotation point must line up with shapes array
            //T
            {x:1.5,y:1.5},
            //Line
            {x:2,y:2},
            //Block
            {x:2,y:1},
            //L's
            {x:1.5,y:1.5},
            {x:1.5,y:1.5},
            //S's
            {x:1.5,y:1.5},
            {x:1.5,y:1.5},
        ],
    },
    storage: {
        name: 'drollTetris',
        highscores: 'drollTetris.highScores',
    },
    images: {
        background: 'images/background.png',
        block: 'images/block.png',
    },
    fonts: {
        plainText: {size:1, font:"CalculatorRegular"},
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
        plainText: "rgba(255, 250, 212,1)",
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
var SG = settings.grid;
var SD = settings.dim;
var SL = settings.loc;
