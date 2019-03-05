<template>
  <div class="choices">
    <h1>{{title}}</h1>
    <div class="choice-container">
      <button @click="$emit('selected', choice)" v-for="choice in choices" :key="choice">
        <el-card class="box">
          <img v-if="choice.image" :src="getImage(choice)" class="image">
          <div style="margin-top: 20px; padding: 14px;">
            <span>{{choice.text}}</span>
            <div class="bottom clearfix">
              <span class="sub">{{choice.subtext}}</span>
            </div>
          </div>
        </el-card>
      </button>
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
    }
  },
  computed: {
    getImage(choice) {
      return "@/assets/" + choice.image + ".png";
    }
  }
};
</script>


<style lang="scss" scoped>
.choices {
  .choice-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    button {
      justify-self: center;
      align-self: center;
      background: none;
      border: none;
      width: 200px;
      height: 200px;
      max-height: 500px;
      max-width: 500px;
      margin: 0;
      .el-card.box {
        height: 100%;
        border-radius: 20px;
      }
    }
    .sub {
      margin-top: 20px;
      font-size: 13px;
      color: #999;
    }

    .image {
      max-width: 300px;
      max-height: 300px;
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }
  }
}
</style>
