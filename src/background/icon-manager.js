var iconManager = {
    setLoadingIcon: function(tabId) {
        console.log('setLoadingIcon', tabId);
        var iconSize = 19,
            iconCanvasContext = this._createIconCanvasContext(iconSize);
        this._addImageToCanvasContext(iconCanvasContext, 'icons/airtable-icon-32.png', function() {
            var iconImageData = this._getImageData(iconCanvasContext);
            chrome.pageAction.setIcon({tabId: tabId, imageData: iconImageData});
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

    _addImageToCanvasContext: function(canvasContext, imgSrc, callback) {
        var img = new Image();
        var me = this;
        img.onload = function() {
            canvasContext.drawImage(img,
                0, 0, img.width, img.height,
                0, 0, canvasContext.canvas.width, canvasContext.canvas.height
            );
            callback.apply(me);
        };
        img.src = imgSrc;
    },

    _getImageData: function(canvasContext) {
        return canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }
};

