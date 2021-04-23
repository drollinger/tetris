'use strict';
var GameAssets = {};
let scriptOrder = [
    newScript('settings'),
    newScript('gameObjects/blocks'),
    newScript('gameObjects/menuing'),
    newScript('gameObjects/gamePlay'),
    newScript('render/audio'),
    newScript('render/graphics'),
    newScript('render/particles'),
    newScript('input/input'),
    newScript('main')
];

let assetOrder = [{
        key: 'background',
        source: '/images/background.png'
    }, {
        key: 'block',
        source: '/images/block.png'
    }
];

//------------------------------------------------------------------
//
// Helper function used to load scripts in the order specified by the
// 'scripts' parameter.  'scripts' expects an array of objects with
// the following format...
//    {
//        scripts: [script1, script2, ...],
//        message: 'Console message displayed after loading is complete',
//        onComplete: function to call when loading is complete, may be null
//    }
//
//------------------------------------------------------------------
function loadScripts(scripts, onComplete) {
    //
    // When we run out of things to load, that is when we call onComplete.
    if (scripts.length > 0) {
        let entry = scripts[0];
        require(entry.scripts, function() {
            if (entry.onComplete) {
                entry.onComplete();
            }
            scripts.shift();    // Alternatively: scripts.splice(0, 1);
            loadScripts(scripts, onComplete);
        });
    } else {
        onComplete();
    }
}

//------------------------------------------------------------------
//
// Helper function used to load assets in the order specified by the
// 'assets' parameter.  'assets' expects an array of objects with
// the following format...
//    {
//        key: 'asset-1',
//        source: 'asset/.../asset.png'
//    }
//
// onSuccess is invoked per asset as: onSuccess(key, asset)
// onError is invoked per asset as: onError(error)
// onComplete is invoked once per 'assets' array as: onComplete()
//
//------------------------------------------------------------------
function loadAssets(assets, onSuccess, onError, onComplete) {
    //
    // When we run out of things to load, that is when we call onComplete.
    if (assets.length > 0) {
        let entry = assets[0];
        loadAsset(entry.source,
            function(asset) {
                onSuccess(entry, asset);
                assets.shift();    // Alternatively: assets.splice(0, 1);
                loadAssets(assets, onSuccess, onError, onComplete);
            },
            function(error) {
                onError(error);
                assets.shift();    // Alternatively: assets.splice(0, 1);
                loadAssets(assets, onSuccess, onError, onComplete);
            });
    } else {
        onComplete();
    }
}

//------------------------------------------------------------------
//
// This function is used to asynchronously load image and audio assets.
// On success the asset is provided through the onSuccess callback.
// Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
//
//------------------------------------------------------------------
function loadAsset(source, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

    if (fileExtension) {
        xhr.open('GET', source, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            let asset = null;
            if (xhr.status === 200) {
                if (fileExtension === 'png' || fileExtension === 'jpg') {
                    asset = new Image();
                } else if (fileExtension === 'mp3') {
                    asset = new Audio();
                } else {
                    if (onError) { onError('Unknown file extension: ' + fileExtension); }
                }
                asset.onload = function() {
                    window.URL.revokeObjectURL(asset.src);
                };
                asset.src = window.URL.createObjectURL(xhr.response);
                if (onSuccess) { onSuccess(asset); }
            } else {
                if (onError) { onError('Failed to retrieve: ' + source); }
            }
        };
    } else {
        if (onError) { onError('Unknown file extension: ' + fileExtension); }
    }

    xhr.send();
}

//------------------------------------------------------------------
//
// Called when all the scripts are loaded, it kicks off the demo app.
//
//------------------------------------------------------------------
function mainComplete() {
    main();
}

//
// Start with loading the assets, then the scripts.
loadAssets(assetOrder,
    function(source, asset) {    // Store it on success
        GameAssets[source.key] = asset;
    },
    function(error) {
        console.log(error);
    },
    function() {
        loadScripts(scriptOrder, mainComplete);
    }
);

function newScript(name) {
    return {
        scripts: [name],
        onComplete: null
    };
};
