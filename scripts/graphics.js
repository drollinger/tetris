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

    let bWidth = canvas.width/SD.width;
    let bHeight = canvas.height/SD.height;
    let gridX = bWidth*SG.startX;
    let gridY = bHeight*SG.startY;

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

    let RenderGameInfo = function(spec) {
        let info = spec.gamePlay.Info;
        let color = settings.colors.plainText;
        let fontSize = Math.floor(settings.fonts.plainText.size*Math.min(bWidth, bHeight));
        context.font = fontSize.toString()+"px "+settings.fonts.plainText.font;
        screenText(color,
            "Score:", info.score, 
            SL.score, SL.widths.gameInfo,
        );
        screenText(color,
            "Lines:", info.lines, 
            SL.lines, SL.widths.gameInfo, 
        );
        screenText(color,
            "Next:", "", 
            SL.next, SL.widths.gameInfo,
        );
        screenText(color,
            "Level:", info.level,
            SL.level, SL.widths.gameInfo,
        );
    };

    let RenderBlocks = function(spec) {
        if (imgs.block.isReady) {
            context.save();
            context.imageSmoothingEnabled = false;
            let blocks = spec.blocks.Info.blocks;
            for (let block of blocks) {
                if (block.loc.y >= 0) {
                    let x = gridX + bWidth*block.loc.x;
                    let y = gridY + bHeight*block.loc.y;
                    let w = bWidth;
                    let h = bHeight;
                    context.fillStyle = block.color;
                    //Rect needs to fit inside block
                    context.fillRect(x+1, y+1, w-2, h-2);
                    context.drawImage(imgs.block, x, y, w, h);
                };
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

    function screenText(color, lText, rText, loc, width) {
            context.save();
            context.fillStyle = color;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 5;
            context.shadowColor = color;
            context.textAlign = "left";
            context.fillText(lText, bWidth*loc.x, bHeight*loc.y);
            context.textAlign = "right";
            context.fillText(rText, bWidth*(loc.x+width), bHeight*loc.y);
            context.shadowBlur = 0;
            context.textAlign = "left";
            context.fillText(lText, bWidth*loc.x, bHeight*loc.y);
            context.textAlign = "right";
            context.fillText(rText, bWidth*(loc.x+width), bHeight*loc.y);
            context.restore();
        };

    return {
        Clear,
        RenderBackground,
        RenderGamePlay,
        RenderGameInfo,
        RenderBlocks,
        RenderCustomControls,
        RenderHighscores,
    }; 
};
