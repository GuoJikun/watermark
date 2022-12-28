/**获取缩放 */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * 旋转水印
 * @param ctx canvas对象
 * @param translateX x轴的偏移量
 * @param translateY y轴偏移量
 * @param rotate 旋转角度
 */
export function rotateWatermark(ctx: CanvasRenderingContext2D, translateX: number, translateY: number, rotate: number) {
  ctx.translate(translateX, translateY);
  ctx.rotate((Math.PI / 180) * Number(rotate));
  ctx.translate(-translateX, -translateY);
}
