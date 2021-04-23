/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Menuing = function() {
    let curState;
    let states = {
        GAME: 1,
        PAUSE: 2,
        MAIN: 3,
        SUB: 4,
    };

    let InitMenuHandlers = function(keyInput, gamePlay) {
        document.getElementById(settings.elements.resume).addEventListener(
            'click', function() {
                toggleMenu(settings.sections.canvas);
                curState = states.GAME;
            }
        );
        document.getElementById(settings.elements.exit).addEventListener(
            'click', function() {
                toggleMenu(settings.sections.main);
                curState = states.MAIN;
            }
        );
        document.getElementById(settings.elements.newGame).addEventListener(
            'click',  function() {
                toggleMenu(settings.sections.canvas);
                curState = states.GAME;
                gamePlay.RestartGameHandler();
            }
        );
        document.getElementById(settings.elements.highscoresButton).addEventListener(
            'click', function() {
                toggleMenu(settings.sections.highscores);
                curState = states.SUB;
            }
        );
        document.getElementById(settings.elements.customize).addEventListener(
            'click', function() {
                toggleMenu(settings.sections.customize);
                curState = states.SUB;
            }
        );
        document.getElementById(settings.elements.credits).addEventListener(
            'click', function() {
                toggleMenu(settings.sections.credits);
                curState = states.SUB;
            }
        );
        document.getElementById(SE.left).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.left)
        );
        document.getElementById(SE.right).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.right)
        );
        document.getElementById(SE.ccwRot).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.ccwRot)
        );
        document.getElementById(SE.cwRot).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.cwRot)
        );
        document.getElementById(SE.sDrop).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.sDrop)
        );
        document.getElementById(SE.hDrop).addEventListener(
            'click', keyInput.ListenAndGetHandler(SE.hDrop)
        );
        keyInput.RegisterCommand(['Escape'],
            keyInput.OnPressOnly(function () {
                switch (curState) {
                    case states.SUB:
                        toggleMenu(settings.sections.main);
                        curState = states.MAIN;
                        break;
                    case states.GAME:
                        toggleMenu(settings.sections.pause);
                        curState = states.PAUSE;
                        break;
                };
            })
        );

        toggleMenu(settings.sections.main);
        curState = states.MAIN;
    };

    let GoToMainMenu = function() {
        toggleMenu(settings.sections.main);
        curState = states.MAIN;
    };

    let GameInPlay = function() {
        return curState == states.GAME;
    };

    function toggleMenu(id) {
        document.querySelectorAll('.row-section').forEach(item => {
            item.style.display='none';
        });
        document.getElementById(id).style.display='initial';
    };

    return {
        InitMenuHandlers,
        GoToMainMenu,
        GameInPlay,
    };
};
