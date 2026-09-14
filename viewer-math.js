export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function fitImage(stageWidth, stageHeight, imageWidth, imageHeight) {
  if (!imageWidth || !imageHeight) return { width: 0, height: 0 };
  const ratio = Math.min(stageWidth / imageWidth, stageHeight / imageHeight);
  return { width: imageWidth * ratio, height: imageHeight * ratio };
}
export function boundPan(x, y, scale, stageWidth, stageHeight, imageWidth, imageHeight) {
  const fit = fitImage(stageWidth, stageHeight, imageWidth, imageHeight);
  const limitX = Math.max(0, (fit.width * scale - stageWidth) / 2);
  const limitY = Math.max(0, (fit.height * scale - stageHeight) / 2);
  return { x: clamp(x, -limitX, limitX), y: clamp(y, -limitY, limitY) };
}
export function zoomAt(current, nextScale, pointX = 0, pointY = 0) {
  const scale = clamp(nextScale, 1, 4);
  const ratio = scale / current.scale;
  return { scale, x: pointX - (pointX - current.x) * ratio, y: pointY - (pointY - current.y) * ratio };
}
