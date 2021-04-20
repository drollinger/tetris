var settings = {
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
