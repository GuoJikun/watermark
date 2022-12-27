import { Component, Host, h, Prop, State, Watch, writeTask } from '@stencil/core';
import { rotateWatermark, getPixelRatio } from '../../utils/utils';

@Component({
  tag: 'ivy-watermark',
  styleUrl: 'ivy-watermark.css',
  shadow: true,
})
export class IvyWatermark {
  BaseSize = 2;
  FontGap = 3;

  watermarkRef!: HTMLElement;
  @State() image: string = null;
  @State() waterSrc: string = '';
  @State() backgroundSize: string = null;

  @Prop() width: string;
  @Prop() height: string;
  @Prop() content: string = '';

  @Prop() rotate: string = '-22';

  @Prop() zIndex: string = '1000';
  @Prop() fontSize: string = '16px';
  @Prop() fontWeight: string = 'normal';
  @Prop() fontStyle: string = 'normal';
  @Prop({
    attribute: 'font-color',
  })
  fontColor: string = 'rgba(0,0,0,0.15)';
  @Prop() fontFamily: string = 'PingFang SC, sans-serif';

  @Prop() gapX: string = '100';
  @Prop() gapY: string = '100';

  @Prop() offsetY: string = '0';
  @Prop() offsetX: string = '0';

  @State() watermarkIndex: string = '1000';

  @Watch('zIndex')
  watchZIndexHandler(val: string) {
    this.watermarkIndex = parseInt(val).toFixed(0);
  }

  render() {
    return (
      <Host>
        <div
          class="watermark"
          ref={el => (this.watermarkRef = el as HTMLElement)}
          tabindex="-1"
          style={{ zIndex: this.watermarkIndex, backgroundImage: `url(${this.waterSrc})`, backgroundSize: this.backgroundSize }}
        ></div>
        <slot></slot>
      </Host>
    );
  }

  getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = 120;
    let defaultHeight = 64;
    if (!this.image && ctx.measureText) {
      ctx.font = `${parseFloat(this.fontSize)}px ${this.fontFamily}`;
      const contents = [this.content];
      const widths = contents.map(item => ctx.measureText(item!).width);
      defaultWidth = Math.ceil(Math.max(...widths));
      defaultHeight = parseFloat(this.fontSize) * contents.length + (contents.length - 1) * this.FontGap;
    }
    return [this.width ? parseFloat(this.width) : defaultWidth, this.height ? parseFloat(this.height) : defaultHeight] as const;
  };

  fillTexts = (ctx: CanvasRenderingContext2D, drawX: number, drawY: number, drawWidth: number, drawHeight: number) => {
    const ratio = getPixelRatio();
    const mergedFontSize = parseFloat(this.fontSize) * ratio;
    ctx.font = `${this.fontStyle} normal ${this.fontWeight} ${mergedFontSize}px/${drawHeight}px ${this.fontFamily}`;
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.translate(drawWidth / 2, 0);
    const contents = [this.content];
    contents?.forEach((item, index) => {
      const y = drawY + index * (mergedFontSize + this.FontGap * ratio);
      ctx.fillText(item ?? '', drawX, y);
    });
  };

  appendWatermark = (base64Url: string, markWidth: number) => {
    if (this.watermarkRef) {
      this.waterSrc = base64Url;
      this.backgroundSize = `${(parseFloat(this.gapX) + markWidth) * this.BaseSize}px`;
    }
  };

  renderWatermark = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const ratio = getPixelRatio();
      const [markWidth, markHeight] = this.getMarkSize(ctx);
      const canvasWidth = (parseFloat(this.gapX) + markWidth) * ratio;
      const canvasHeight = (parseFloat(this.gapY) + markHeight) * ratio;
      canvas.setAttribute('width', `${canvasWidth * this.BaseSize}px`);
      canvas.setAttribute('height', `${canvasHeight * this.BaseSize}px`);

      const drawX = (parseFloat(this.gapX) * ratio) / 2;
      const drawY = (parseFloat(this.gapY) * ratio) / 2;
      const drawWidth = markWidth * ratio;
      const drawHeight = markHeight * ratio;
      const rotateX = (drawWidth + parseFloat(this.gapX) * ratio) / 2;
      const rotateY = (drawHeight + parseFloat(this.gapY) * ratio) / 2;
      /** Alternate drawing parameters */
      const alternateDrawX = drawX + canvasWidth;
      const alternateDrawY = drawY + canvasHeight;
      const alternateRotateX = rotateX + canvasWidth;
      const alternateRotateY = rotateY + canvasHeight;

      ctx.save();
      rotateWatermark(ctx, rotateX, rotateY, parseFloat(this.rotate));

      if (this.image) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          /** Draw interleaved pictures after rotation */
          ctx.restore();
          rotateWatermark(ctx, alternateRotateX, alternateRotateY, parseFloat(this.rotate));
          ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          this.appendWatermark(canvas.toDataURL('image/png'), markWidth);
        };
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = this.image;
      } else {
        this.fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
        /** Fill the interleaved text after rotation */
        ctx.restore();
        rotateWatermark(ctx, alternateRotateX, alternateRotateY, parseFloat(this.rotate));
        this.fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
        this.appendWatermark(canvas.toDataURL('image/png'), markWidth);
      }
    }
  };

  componentDidLoad() {
    // this.image = createImgBase({
    //   width: 100,
    //   height: 100,
    //   content: '水印',
    //   font: '14px PingFang SC, sans-serif',
    //   color: 'rgba(156, 162, 169, 0.3)',
    //   rotateDegree: (-14 * Math.PI) / 180,
    //   x: 80,
    //   y: 80,
    // });
    writeTask(() => {
      this.renderWatermark();
    });
  }
}
