/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: This contains the Graphics function
 *   needed to render any objects on the screen.
 *************************************************/
'use strict';

let Graphics = function(spec) {
    let canvas = document.getElementById(settings.elements.canvas);
    let context = canvas.getContext('2d');

    //Load all images
    let imgs = {};
    imgs.background = createImg(spec.background);
    imgs.block = createImg(spec.block);

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    let Clear = function() {
        context.clear();
    };

    let RenderBackground = function() {
        if (imgs.background.isReady) {
            context.save();
            context.imageSmoothingEnabled = false;
            context.drawImage(imgs.background, 0, 0,
                canvas.width + 0.5, canvas.height + 0.5
            );
            context.restore();
        };
    };

    let RenderGamePlay = function(spec) {
        let info = spec.gamePlay.Info;
    };

    let RenderBlocks = function(spec) {
        if (imgs.block.isReady) {
            context.save();
            context.imageSmoothingEnabled = false;
            let blocks = spec.blocks.Info.blocks;
            for (let block of blocks) {
                let x = 100 + 50*block.loc.x;
                let y = 100 + 50*block.loc.y;
                let d = 50;
                context.fillStyle = block.color;
                context.fillRect(x+1, y+1, d-2, d-2);
                context.drawImage(imgs.block, x, y, d, d);
            };
            context.restore();
        };
    };

    let RenderCustomControls = function(spec) {
        let msg;
        if (spec.gettingNextKey) msg = settings.messages.customize;
        else msg = '';
        document.getElementById(SE.customizeMsg).innerHTML = msg;
        for (let id of [
                SE.left, SE.right, SE.ccwRot,
                SE.cwRot, SE.sDrop, SE.hDrop
            ]) {
            let key = spec.buttons[id];
            if (key === ' ') key = 'Space';
            document.getElementById(id).innerHTML = key;
        }
    };

    let RenderHighscores = function(spec) {
        let highscoreList = document.getElementById(SE.highscoresList);
        highscoreList.innerHTML = '';
        for (let i=0; i < 5; i++) {
            let text = spec.scores.highscores[i] ?? 'None';
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(text));
            highscoreList.appendChild(e);
        };
    };

    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    };

    function createImg(src) {
        let newImg = new Image();
        newImg.isReady = false;
        newImg.onload = function() {
            this.isReady = true;
        };
        newImg.src = src;
        return newImg;
    };

    return {
        Clear,
        RenderBackground,
        RenderGamePlay,
        RenderBlocks,
        RenderCustomControls,
        RenderHighscores,
    }; 
};
