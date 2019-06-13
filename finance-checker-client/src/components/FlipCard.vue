<template>
  <!-- from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_flip_card -->
  <div class="flip-card">
    <div
      class="flip-card-inner"
      @mouseenter="hoverFlipCard()"
      @mouseleave="hoverFlipCard()"
      :class="{flip:flip, preview:flipPreview}"
    >
      <div class="flip-card-front">
        <div @mouseenter="toggleFlipPreview()" @mouseleave="toggleFlipPreview()">
          <el-button circle v-if="buttonFlip" @click="flipCard()">
            <span class="mdi mdi-swap-horizontal"/>
          </el-button>
        </div>
        <slot name="front"></slot>
      </div>
      <div class="flip-card-back">
        <div @mouseenter="toggleFlipPreview()" @mouseleave="toggleFlipPreview()">
          <el-button circle v-if="buttonFlip" @click="flipCard()">
            <span class="mdi mdi-swap-horizontal"/>
          </el-button>
        </div>
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "FlipCard",
  props: {
    buttonFlip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flip: false,
      flipPreview: false
    };
  },
  methods: {
    hoverFlipCard() {
      if (!this.buttonFlip) {
        this.flipCard();
      }
    },
    toggleFlipPreview() {
      this.flipPreview = !this.flipPreview;
    },
    flipCard() {
      this.flip = !this.flip;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "@/variables.scss";

.flip-card {
  background-color: transparent;
  perspective: 10000px;

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    &.flip {
      transform: rotateY(180deg);

      .flip-card-front {
        display: none;
      }
      .flip-card-back {
        display: block;
      }
    }

    &.preview {
      transform: rotateY(10deg);
    }

    .flip-card-front,
    .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;

      .el-button.is-circle {
        position: absolute;
        top: 5px;
        right: 20px;
        background-color: $neutral2;
        box-shadow: make-in-shadow($neutral1);
        border: none;
      }
    }

    .flip-card-back {
      transform: rotateY(180deg);
      display: none;
    }
  }
}
</style>
