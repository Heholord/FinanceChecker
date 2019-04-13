<template>
  <div class="selection">
    <ul>
      <li
        v-for="selection in selections"
        :key="selection.key"
        @click="select(selection.key)"
        @mouseover="over"
        @mouseleave="leave"
        :class="{active: isSelected(selection.key)}"
      >
        <i v-if="selection.icon" :class="selection.icon"></i>
        {{selection.text}}
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: "Selection",
  props: {
    selections: {
      type: Array,
      required: true
    },
    default: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      selected: this.default,
      isOver: false
    };
  },
  methods: {
    over() {
      this.isOver = true;
    },
    leave() {
      this.isOver = false;
    },
    isSelected(tab) {
      if (this.isOver === false) {
        return tab === this.selected;
      }
      return false;
    },
    select(key) {
      this.selected = key;
      this.$emit("selected", key);
    }
  }
};
</script>


<style lang="scss" scoped>
@import "@/variables.scss";

.selection {
  display: inline-block;
  margin: $space2;
  ul {
    list-style: none;
    display: flex;
    height: $size2;
    justify-content: space-between;
    background-color: white;
    border-radius: 20px;
    box-shadow: $flying-shadow1;
    overflow: visible;
    padding: 0;
    transition: width 0.2s ease-out;

    > li {
      cursor: pointer;
      position: relative;
      max-width: $size7;
      padding: $space1;
      color: $neutral7;
      padding: $space1 $space2;
      border-radius: 20px;
      transition: width 0.1s ease-out, height 0.1s ease-out,
        background-color 0.1s ease-out, box-shadow 0.1s ease-out;

      > i {
        color: $neutral4;
      }

      &:hover,
      &.active {
        height: $size2 + 10px;
        top: -$space1;
        background-color: $neutral6;
        color: $neutral1;
        box-shadow: $flying-shadow2;
        padding: ($space2 - 3px) $space2;
        margin: 0;
        > i {
          color: $primary3;
        }
      }
    }
  }
}
</style>
