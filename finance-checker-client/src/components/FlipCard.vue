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
        <div
          class="flip-button"
          @mouseenter="toggleFlipPreview()"
          @mouseleave="toggleFlipPreview()"
        >
          <el-button circle v-if="buttonFlip" @click="flipCard()">
            <span class="mdi mdi-swap-horizontal"/>
          </el-button>
        </div>
        <slot name="front"></slot>
      </div>
      <div class="flip-card-back">
        <div
          class="flip-button"
          @mouseenter="toggleFlipPreview()"
          @mouseleave="toggleFlipPreview()"
        >
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
  margin: $space3;

  .flip-card-inner {
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    flex-grow: 1;

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

      .flip-button {
        position: absolute;
        top: 5px;
        right: 20px;
        border: none;
        .el-button {
          background-color: $neutral2;
          box-shadow: make-in-shadow($neutral2);
        }
      }
    }

    .flip-card-back {
      transform: rotateY(180deg);
      display: none;
    }
  }
}
</style>
