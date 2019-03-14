<template>
  <div class="choices">
    <h1 v-if="title">{{title}}</h1>
    <div class="choice-container">
      <el-card
        v-for="choice in choices"
        :key="choice.title"
        :class="{big:big, info:choice.info}"
        class="box"
      >
        <img v-if="choice.image" v-lazy="getImage(choice)" class="image">
        <div class="textarea">
          <span>{{choice.text}}</span>
          <div class="bottom clearfix">
            <span class="sub">{{choice.subtext}}</span>
          </div>
        </div>
        <button @click="$emit('select', choice)" v-if="!choice.info"/>
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
    }
  },
  methods: {
    getImage(choice) {
      return require("@/assets/" + choice.image);
    }
  }
};
</script>


<style lang="scss">
.choices {
  .choice-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: center;
    > .box {
      border-radius: 15px;
      height: 100%;
      width: 300px;
      height: 300px;
      max-height: 500px;
      max-width: 500px;
      margin: 5px;
      padding: 0;

      &.big {
        width: 500px;
        height: 500px;
        margin: 10px;

        .image {
          width: 500px;
          height: 333px;
        }
      }

      & > .el-card__body {
        position: relative; // needed 4 button
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        padding: 0px;

        .textarea {
          flex: 1 1 auto;
          display: grid;
          grid-template-rows: 1.5fr 0.3fr 0.4fr 0.8fr;
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
        background: #fcfcfc;
        border: dotted 2px lightgray;
        box-shadow: none;
      }
    }

    .sub {
      margin-top: 20px;
      font-size: 13px;
      color: #999;
    }

    .image {
      width: 300px;
      height: 200px;
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
