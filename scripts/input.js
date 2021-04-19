/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: Our input processing adapted from
 *   provided code. The main update function is
 *   what calls registered functions
 *************************************************/
'use strict';

let Input = function() {
    let Keyboard = function() {
        let keys = {};
        let handlers = {};

        //Variables for traking custom controls
        let idToKey = {};
        let gettingNextKey = false;
        let clickAssign;
        
        let RegisterCommand = function(keyList, handler) {
            for (let key of keyList) {
                handlers[key] = handler;
            };
        };

        let UnregisterKey = function(key) {
            delete handlers[key];
        };

        let RegisterButtonIds = function(spec) {
            for (let item in spec) {
                let obj = spec[item];
                idToKey[item] = obj.key;
                handlers[obj.key] = obj.handler;
            }
        };

        let KeyHandler = function(id, hand) {
            return {
                key: localStorage.getItem(SST.name+'.'+id) ??
                    settings.defaults[id],
                handler: hand,
            };
        };


        let Update = function(elapsedTime) {
            if (gettingNextKey) {
                for (let key in keys) {
                    clickAssign(key);
                    break;
                };
            }
            else {
                for (let key in keys) {
                    handlers[key]?.(keys[key], elapsedTime);
                    keys[key].heldPress = true;
                };
            };
        };

        let OnPressOnly = function(f) {
            return (function(key, elapsedTime) {
                if (!key.heldPress) f();
            });
        };

        let ListenAndGetHandler = function(id) {
            return (function () {
                gettingNextKey = true;
                clickAssign = function(key) {
                    if (key != 'Escape') {
                        keyboard.RegisterCommand([key], handlers[key]);
                        UnregisterKey(idToKey[id]);
                        idToKey[id] = key;
                        localStorage[settings.storage.name+`.${id}`] = key;
                    };
                    gettingNextKey = false;
                };
            });
        };

        function keyPress(e) {
            if (!keys[e.key]) {
                keys[e.key] = {};
                keys[e.key].heldPress = false;
            }
            keys[e.key].timeStamp = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete keys[e.key];
        }

        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);
        
        return {
            RegisterCommand,
            UnregisterKey,
            RegisterButtonIds,
            Update,
            OnPressOnly,
            ListenAndGetHandler,
        };
    }

    return {
        Keyboard
    };
};
