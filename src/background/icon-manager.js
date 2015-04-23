var iconManager = {
    _animationIntervalId: null,

    setLoadingIcon: function(tabId, iconBackgroundImageSrc) {
        this._clearAnimations();
        var rotationInDegree = 0,
            me = this;
        this._animationIntervalId = setInterval(function() {
            rotationInDegree += 10;
            me._setLoadingIconWithRotation(tabId, iconBackgroundImageSrc, rotationInDegree);
        }, 30);
    },

    _clearAnimations: function() {
        clearInterval(this._animationIntervalId);
    },

    _setLoadingIconWithRotation: function (tabId, iconBackgroundImageSrc, rotationInDegree) {
        var iconSize = 38,
            iconCanvasContext = this._createIconCanvasContext(iconSize);
        this._addImageAsStretchedBackground(iconCanvasContext, iconBackgroundImageSrc, function() {
            this._addImageAtCenterWithRotation(iconCanvasContext, rotationInDegree, 'icons/loading-icon.svg', function() {
                var iconImageData = this._getImageData(iconCanvasContext);
                chrome.pageAction.setIcon({tabId: tabId, imageData: {'38': iconImageData}});
            });
        });
    },

    _createIconCanvasContext: function(iconSize) {
        var iconWidth = iconSize,
            iconHeight = iconSize,
            canvas = document.createElement("canvas");
        canvas.width = iconWidth;
        canvas.height = iconHeight;
        var canvasContext = canvas.getContext('2d');
        return canvasContext;
    },

    _addImageAsStretchedBackground: function(canvasContext, imageSrc, callback) {
        var image = new Image(),
            me = this;
        image.onload = function() {
            var size = canvasContext.canvas.width;
            canvasContext.drawImage(image,
                0, 0, image.width, image.height,
                0, 0, size, size
            );
            callback.apply(me);
        };
        image.src = imageSrc;
    },

    _addImageAtCenterWithRotation: function(canvasContext, rotationInDegree, imageSrc, callback) {
        var image = new Image(),
            me = this;
        image.onload = function() {
            var size = canvasContext.canvas.width,
                canvasCenterX = canvasContext.canvas.width / 2,
                canvasCenterY = canvasContext.canvas.height / 2;
            canvasContext.globalAlpha = 0.7;
            canvasContext.save();
            canvasContext.translate(canvasCenterX , canvasCenterY);
            canvasContext.rotate(rotationInDegree / 180 * Math.PI); //rotate in origin
            canvasContext.translate(-canvasCenterX , -canvasCenterY); //put it back
            canvasContext.drawImage(image,
                0, 0, image.width, image.height,
                0, 0, size, size
            );
            canvasContext.restore();
            callback.apply(me);
        };
        image.src = imageSrc;
    },

    _getImageData: function(canvasContext) {
        return canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }
};

