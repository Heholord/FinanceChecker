<template>
  <div class="choices">
    <h1 v-if="title" class="title fs6">{{ title }}</h1>
    <div class="choice-container">
      <el-card
        v-for="choice in choices"
        :key="choice.text"
        :class="{ big: big, small: small, info: choice.info }"
        class="box br-softer"
      >
        <img v-if="getImage(choice)" v-lazy="getImage(choice)" class="image padding2" />
        <div class="textarea">
          <span class="title">{{ choice.text }}</span>
          <div class="bottom clearfix">
            <span class="sub">{{ choice.subtext }}</span>
          </div>
        </div>
        <button @click="$emit('select', choice)" v-if="!choice.info" />
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Choices",
  props: {
    choices: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    big: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getImage(choice) {
      if (choice.image) {
        return require("@/assets/" + choice.image);
      } else if (choice.info) {
        return require("@/assets/avatars/waiting_i.svg");
      }
      return undefined;
    }
  }
};
</script>

<style lang="scss">
.choices {
  h1.title {
    @include label;
    margin-bottom: $space3;
  }
  .choice-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
    height: 100%;

    > .box {
      border: none;
      height: 100%;
      @include square($size7);
      max-height: $size8;
      max-width: $size8;
      padding: 0;
      margin: $space1;

      &.big {
        @include square($size8);
        margin: $space2;
        font-size: $fs6;

        .image {
          width: $size8;
          height: $size7;
        }
      }

      &.small {
        width: $size5;
        height: $size3;
        .image {
          width: 0;
          height: 0;
        }
      }

      & > .el-card__body {
        position: relative; // needed 4 button
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        padding: 0px;

        .textarea {
          text-align: left;
          flex: 1 1 auto;
          margin: $space2;
          display: grid;
          grid-template-rows: 0.5fr 0.8fr 2fr;
          > span {
            grid-row: 2;
          }
          > div.bottom {
            grid-row: 3;
          }
        }

        > button {
          position: absolute;
          background: none;
          border: none;
          padding: 0;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          &:hover {
            cursor: pointer;
          }
        }
      }

      &.info {
        background: $background;
        border: dotted 2px $neutral4;
        box-shadow: none;
      }
    }

    .sub {
      margin-top: $space1;
      font-size: $fs2;
      color: $neutral5;
    }

    .image {
      width: $size7;
      height: $size6;
    }

    .bottom {
      position: relative;
      bottom: 10px;
      margin-top: 13px;
      line-height: 12px;
    }
  }
}
</style>
