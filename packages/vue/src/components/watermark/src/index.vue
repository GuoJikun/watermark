<template>
  <div class="watermark">
    <div
      class="watermark-bg"
      ref="watermarkRef"
      tabindex="-1"
      :style="{
        zIndex: zIndex,
        backgroundImage: `url(${waterSrc})`,
        backgroundSize: backgroundSize,
        ...getMarkStyle(),
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { CSSProperties, onMounted, reactive, ref, watch } from "vue";
import { getPixelRatio, rotateWatermark } from "./utils";

export default {
  name: "watermarkVue",
  props: {
    width: {
      type: Number,
      default: 120,
    },
    height: {
      type: Number,
      default: 64,
    },
    zIndex: {
      type: Number,
      default: 9,
    },
    rotate: {
      type: Number,
      default: -22,
    },
    image: String,
    content: [String, Array],
    font: {
      type: Object,
      default() {
        return {};
      },
    },
    gap: {
      type: Array,
      default() {
        return [100, 100];
      },
    },
    offset: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const BaseSize = 2,
      FontGap = 3,
      waterSrc = ref<string>(""),
      watermarkRef = ref(null),
      backgroundSize = ref<string>();

    const { offset } = props;

    let font = {
      color: "rgba(0,0,0,0.15)",
      fontSize: 14,
      fontWeight: "normal",
      fontStyle: "normal",
      fontFamily: "sans-serif",
      ...props.font,
    };

    const gapX = ref<number>((props.gap[0] as number) || 100);
    const gapY = ref<number>((props.gap[1] as number) || 100);
    const gapXCenter = ref<number>(gapX.value / 2);
    const gapYCenter = ref<number>(gapY.value / 2);
    const offsetLeft = ref((offset?.[0] as number) ?? gapXCenter.value);
    const offsetTop = ref((offset?.[1] as number) ?? gapYCenter.value);

    const getMarkStyle = () => {
      const markStyle: CSSProperties = {
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
      };

      /** 计算 offset */
      let positionLeft = offsetLeft.value - gapXCenter.value;
      let positionTop = offsetTop.value - gapYCenter.value;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

      return markStyle;
    };

    const getMarkSize = (ctx: CanvasRenderingContext2D) => {
      let defaultWidth = 120;
      let defaultHeight = 64;
      if (!props.image && ctx.measureText) {
        ctx.font = `${font.fontSize}px ${font.fontFamily}`;
        const contents = Array.isArray(props.content)
          ? props.content
          : [props.content];
        const widths = contents.map((item) => ctx.measureText(item!).width);
        defaultWidth = Math.ceil(Math.max(...widths));
        defaultHeight =
          font.fontSize * contents.length + (contents.length - 1) * FontGap;
      }
      return [
        props.width ?? defaultWidth,
        props.height ?? defaultHeight,
      ] as const;
    };

    const fillTexts = (
      ctx: CanvasRenderingContext2D,
      drawX: number,
      drawY: number,
      drawWidth: number,
      drawHeight: number
    ) => {
      const ratio = getPixelRatio();
      const mergedFontSize = font.fontSize * ratio;
      ctx.font = `${font.fontStyle} normal ${font.fontWeight} ${mergedFontSize}px/${drawHeight}px ${font.fontFamily}`;
      ctx.fillStyle = font.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.translate(drawWidth / 2, 0);
      const contents = Array.isArray(props.content)
        ? props.content
        : [props.content];
      contents?.forEach((item, index) => {
        const y = drawY + index * (mergedFontSize + FontGap * ratio);
        ctx.fillText(item ?? "", drawX, y);
      });
    };

    const setWatermark = (base64Url: string, markWidth: number) => {
      if (watermarkRef.value) {
        waterSrc.value = base64Url;
        backgroundSize.value = `${(gapX.value + markWidth) * BaseSize}px`;
      }
    };

    const renderWatermark = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const ratio = getPixelRatio();
        const [markWidth, markHeight] = getMarkSize(ctx);
        const canvasWidth = (gapX.value + markWidth) * ratio;
        const canvasHeight = (gapY.value + markHeight) * ratio;
        canvas.setAttribute("width", `${canvasWidth * BaseSize}px`);
        canvas.setAttribute("height", `${canvasHeight * BaseSize}px`);

        const drawX = (gapX.value * ratio) / 2;
        const drawY = (gapY.value * ratio) / 2;
        const drawWidth = markWidth * ratio;
        const drawHeight = markHeight * ratio;
        const rotateX = (drawWidth + gapX.value * ratio) / 2;
        const rotateY = (drawHeight + gapY.value * ratio) / 2;

        const alternateDrawX = drawX + canvasWidth;
        const alternateDrawY = drawY + canvasHeight;
        const alternateRotateX = rotateX + canvasWidth;
        const alternateRotateY = rotateY + canvasHeight;

        ctx.save();
        rotateWatermark(ctx, rotateX, rotateY, props.rotate);

        if (props.image) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
            rotateWatermark(
              ctx,
              alternateRotateX,
              alternateRotateY,
              props.rotate
            );
            ctx.drawImage(
              img,
              alternateDrawX,
              alternateDrawY,
              drawWidth,
              drawHeight
            );
            setWatermark(canvas.toDataURL("image/png"), markWidth);
          };
          img.crossOrigin = "anonymous";
          img.referrerPolicy = "no-referrer";
          img.src = props.image;
        } else {
          fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          rotateWatermark(
            ctx,
            alternateRotateX,
            alternateRotateY,
            props.rotate
          );
          fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          setWatermark(canvas.toDataURL("image/png"), markWidth);
        }
      }
    };

    onMounted(() => {
      renderWatermark();
    });

    watch(
      props,
      (val) => {
        font = { ...font, ...val.font };
        renderWatermark();
      },
      { deep: true }
    );

    return {
      waterSrc,
      backgroundSize,
      watermarkRef,
      getMarkStyle,
    };
  },
};
</script>

<style scoped>
.watermark {
  position: relative;
}
.watermark-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
