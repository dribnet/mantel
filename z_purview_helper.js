// const canvasWidth = 960;
// const canvasHeight = 960;

// helper functions below for supporting blocks/purview/screencap

function saveBlocksImages(doZoom) {
  if(doZoom == null) {
    doZoom = false;
  }

  // generate 960x500 preview.jpg of entire canvas
  // TODO: should this be recycled?
  var offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvasWidth;
  offscreenCanvas.height = canvasHeight;
  var context = offscreenCanvas.getContext('2d');
  // background is flat white
  context.fillStyle="#FFFFFF";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(this.canvas, 0, 0, canvasWidth, canvasHeight);
  // save to browser
  var downloadMime = 'image/octet-stream';
  var imageData = offscreenCanvas.toDataURL('image/png');
  imageData = imageData.replace('image/png', downloadMime);
  p5.prototype.downloadFile(imageData, 'mantel.png', 'png');
}
