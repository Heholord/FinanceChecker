<template>
  <div class="split">
    <button @click="routeTo('/inquire')">
      <el-card>
        <img src="@/assets/inquire.png" class="image">
        <div style="padding: 14px;">
          <span>Inquire data</span>
          <div class="bottom clearfix">
            <span class="sub">Start your journey</span>
          </div>
        </div>
      </el-card>
    </button>
    <button @click="routeTo('/display')">
      <el-card>
        <img src="@/assets/display.jpg" class="image">
        <div style="padding: 14px;">
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
.split {
  display: grid;
  grid-template: auto / auto auto;
  max-height: 500px;
  height: 100%;
  button {
    justify-self: center;
    align-self: center;
    background: none;
    border: none;
    height: 80%;
    width: 80%;
    .box-card {
      height: 100%;
    }
  }
  .sub {
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
