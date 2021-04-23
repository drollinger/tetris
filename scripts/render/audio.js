function loadSound(source) {
    let sound = new Audio();
    sound.src = source;
    return sound;
}

var ShipSounds = {};
ShipSounds['audio/sound-1'] = loadSound('audio/sound-1.mp3');
ShipSounds['audio/sound-2'] = loadSound('audio/sound-2.mp3');
