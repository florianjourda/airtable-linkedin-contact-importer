var iconManager = {
    _animationIntervalId: null,
    _settingsImageSrc: 'icons/settings-icon.svg',
    _uploadImageSrc: 'icons/upload-icon.svg',
    _refreshImageSrc: 'icons/refresh-icon.svg',
    _successImageSrc: 'icons/success-icon.svg',
    _errorImageSrc: 'icons/error-icon.svg',
    _loadingImageSrc: 'icons/loading-icon.svg',

    _clearAnimations: function() {
        clearInterval(this._animationIntervalId);
    },

    setIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc);
    },

    setSettingsIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, this._settingsImageSrc);
    },

    setUploadIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, this._uploadImageSrc);
    },

    setRefreshIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, this._refreshImageSrc);
    },

    setSuccessIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, this._successImageSrc);
    },

    setErrorIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        this._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, this._errorImageSrc);
    },

    setLoadingIcon: function(tabId, backgroundImageSrc) {
        this._clearAnimations();
        var rotationInDegree = 0,
            me = this;
        this._animationIntervalId = setInterval(function() {
            rotationInDegree += 10;
            me._setBackgroundImageAndForegroundImage(tabId, backgroundImageSrc, me._loadingImageSrc, rotationInDegree);
        }, 30);
    },

    _setBackgroundImageAndForegroundImage: function (tabId, backgroundImageSrc, foregroundImageSrc, foregroundImageRotationInDegree) {
        if (!foregroundImageRotationInDegree) {
            foregroundImageRotationInDegree = 0;
        }
        var iconSize = 38,
            iconCanvasContext = this._createIconCanvasContext(iconSize),
            me = this,
            setCanvasImageAsPageActionIcon = function () {
                var iconImageData = me._getImageData(iconCanvasContext);
                chrome.pageAction.setIcon({tabId: tabId, imageData: {'38': iconImageData}});
            };

        this._addImageAsStretchedBackground(iconCanvasContext, backgroundImageSrc, function() {
            if (foregroundImageSrc) {
                this._addImageAtCenterWithRotation(iconCanvasContext, foregroundImageSrc, foregroundImageRotationInDegree, setCanvasImageAsPageActionIcon);
            } else {
                setCanvasImageAsPageActionIcon();
            }
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

    _addImageAtCenterWithRotation: function (canvasContext, imageSrc, rotationInDegree, callback) {
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

