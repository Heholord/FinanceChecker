<template>
  <!-- from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_flip_card -->
  <div
    class="flip-card visual-content"
    @mouseenter="hoverFlipCard()"
    @mouseleave="hoverFlipCard()"
    :class="{flip:flip, preview:flipPreview}"
  >
    <div class="flip-card-front">
      <div class="front-container" :class="{paddingtop: buttonFlip}">
        <div
          class="flip-button"
          @mouseenter="toggleFlipPreview()"
          @mouseleave="toggleFlipPreview()"
        >
          <el-button circle v-if="buttonFlip" @click="flipCard()">
            <span class="mdi mdi-36px mdi-swap-horizontal" />
          </el-button>
        </div>

        <slot name="front"></slot>
      </div>
    </div>
    <div class="flip-card-back">
      <div class="back-container" :class="{paddingtop: buttonFlip}">
        <div
          class="flip-button"
          @mouseenter="toggleFlipPreview()"
          @mouseleave="toggleFlipPreview()"
        >
          <el-button circle v-if="buttonFlip" @click="flipCard()">
            <span class="mdi mdi-36px mdi-swap-horizontal" />
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
  perspective: 10000px;
  margin-right: $space3;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;

  $flip-preview: 12deg;

  &.flip {
    transform: rotateY(180deg);

    .flip-card-front {
      display: none;
    }
    .flip-card-back {
      display: block;
    }

    &.preview {
      transform: rotateY(180deg - $flip-preview);
    }
  }

  &.preview {
    transform: rotateY($flip-preview);
  }

  .flip-card-front,
  .flip-card-back {
    backface-visibility: hidden;

    > .front-container,
    > .back-container {
      position: relative;
    }

    .flip-button {
      position: absolute;
      right: 0;
      top: -$space3;
      border: none;
      background: none;

      .el-button {
        background: none;
        box-shadow: none;
        border: none;
      }
    }
  }

  .flip-card-back {
    transform: rotateY(180deg);
    display: none;
  }

  .paddingtop {
    padding-top: $space2;
  }
}
</style>
