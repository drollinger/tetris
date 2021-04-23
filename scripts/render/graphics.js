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
       context.save();
       context.imageSmoothingEnabled = false;
       context.drawImage(GameAssets['background'], 0, 0,
           canvas.width + 0.5, canvas.height + 0.5
       );
       context.restore();
    };

    let RenderGamePlay = function(spec) {
        let info = spec.gamePlay.Info;
        if (info.gameOver) {
            context.save();
            context.fillStyle = settings.colors.cover;
            context.fillRect(bWidth*SG.startX, bHeight*SG.startY, bWidth*SG.cols, bHeight*SG.rows);
            context.font = getFont(settings.fonts.gameOver);
            screenText(settings.colors.gameOver,
                "Game Over", "", 
                {x:SG.startX+SG.cols/2, y:SG.startY+SG.rows/3},
                0, true,
            );
            context.font = getFont(settings.fonts.ejection);
            screenText(settings.colors.plainText,
                "Ejecting to Menu in:", "", 
                {x:SG.startX+SG.cols/2, y:SG.startY+SG.rows/2},
                0, true,
            );
            if (info.endCount < 3000) {
                context.font = getFont(settings.fonts.countDown);
                screenText(`rgba(252, 257, 252,${(info.endCount%1000)/1000})`,
                    Math.floor(info.endCount/1000)+1, "", 
                    {x:SG.startX+SG.cols/2, y:SG.startY+SG.rows/1.25},
                    0, true,
                );
            }
            context.restore();
        }
    };

    let RenderGameInfo = function(spec) {
        let info = spec.gamePlay.Info;
        let color = settings.colors.plainText;
        context.font = getFont(settings.fonts.plainText);
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
        context.save();
        context.imageSmoothingEnabled = false;
        for (let block of spec.blocks.Info.blocks) {
            if (block.loc.y >= 0) {
                let x = gridX + bWidth*block.loc.x;
                let y = gridY + bHeight*block.loc.y;
                let w = bWidth;
                let h = bHeight;
                context.fillStyle = block.color;
                //Rect needs to fit inside block
                context.fillRect(x+1, y+1, w-2, h-2);
                context.drawImage(GameAssets['block'], x, y, w, h);
            };
        };
        for (let block of spec.blocks.Info.nextShape) {
                let nw = bWidth*SL.next.scale;
                let nh = bHeight*SL.next.scale;
                let x = bWidth*(SL.next.x+(SL.next.scale*block.rLoc.x)+2.25);
                let y = bHeight*(SL.next.y+(SL.next.scale*block.rLoc.y));
                context.fillStyle = block.color;
                //Rect needs to fit inside block
                context.fillRect(x+1, y+1, nw-2, nh-2);
                context.drawImage(GameAssets['block'], x, y, nw, nh);
        };
        context.restore();
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

    function screenText(color, lText, rText, loc, width, centered=false) {
        context.save();
        context.fillStyle = color;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 5;
        context.shadowColor = color;
        context.textAlign = centered ? "center" : "left";
        context.fillText(lText, bWidth*loc.x, bHeight*loc.y);
        context.textAlign = "right";
        context.fillText(rText, bWidth*(loc.x+width), bHeight*loc.y);
        context.shadowBlur = 0;
        context.textAlign = centered ? "center" : "left";
        context.fillText(lText, bWidth*loc.x, bHeight*loc.y);
        context.textAlign = "right";
        context.fillText(rText, bWidth*(loc.x+width), bHeight*loc.y);
        context.restore();
    };

    function getFont(font) {
        let fontSize =  Math.floor(font.size*Math.min(bWidth, bHeight));
        return fontSize.toString()+"px "+font.font;
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
