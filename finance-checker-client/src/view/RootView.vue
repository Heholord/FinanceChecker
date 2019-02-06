<template>
  <div class="root split">
    <button @click="routeTo('/manage')">
      <el-card class="box">
        <img src="@/assets/inquire.png" class="image">
        <div style="margin-top: 20px; padding: 14px;">
          <span>Manage data</span>
          <div class="bottom clearfix">
            <span class="sub">Start your journey</span>
          </div>
        </div>
      </el-card>
    </button>
    <button @click="routeTo('/visualize')">
      <el-card class="box">
        <img src="@/assets/display.jpg" class="image">
        <div style="margin-top: 20px; padding: 14px;">
          <span>View data</span>
          <div class="bottom clearfix">
            <span class="sub">Enjoy what you have earned</span>
          </div>
        </div>
      </el-card>
    </button>
  </div>
</template>

<script>
export default {
  name: "RootView",
  components: {},
  data() {
    return {};
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss">
.root.split {
  position: relative;
  background-color: #f5f7fa;
  height: 100%;
  button {
    justify-self: center;
    align-self: center;
    background: none;
    border: none;
    height: 80%;
    width: 80%;
    margin: auto;
    .box-card {
      height: 100%;
    }
    .box {
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

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
}
</style>
