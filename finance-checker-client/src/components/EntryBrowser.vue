<template>
  <div class="entrybrowser">
    <!-- <el-dialog
      v-if="shouldUse"
      title="I found a similar entry"
      :visible.sync="editEntry"
      width="50%"
      center
    >
      <span>
        The entry {{activeEntry.info}} has similarities with a categorized entry {{shouldUse.elem}} ({{shouldUse.similarity}}% similarity). Sould the new entry be placed in path
        <el-tag type="info">{{shouldUse.categoryPath.split(".").join(" > ")}}</el-tag>as well?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="use(false)">No</el-button>
        <el-button type="primary" @click="use(true)">Yes</el-button>
      </span>
    </el-dialog>-->
    <el-button
      class="jump-down"
      icon="el-icon-arrow-down"
      plain
      circle
      @click="scrollMeTo('navctrl')"
    ></el-button>
    <el-collapse class="collapse">
      <el-collapse-item
        class="collapse-item"
        v-for="entryKey in Object.keys(getEntries)"
        :key="entryKey"
        :title="entryKey"
        :name="entryKey"
      >
        <el-table class="table" :span-method="objectSpanMethod" :data="join(getEntries[entryKey])">
          <el-table-column prop="day" label="Day" width="50"></el-table-column>
          <el-table-column prop="info" label="Info" width="300"></el-table-column>
          <el-table-column prop="amount" label="Value" width="120"></el-table-column>
          <el-table-column prop="category" label="Special Category" width="150"></el-table-column>
          <el-table-column v-if="isEditable" label="Operations" align="right" width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
import { join } from "@/plugin/utils";
import { mapGetters } from "vuex";

export default {
  components: {},
  name: "EntryBrowser",
  props: {
    entries: {
      default: () => {
        return {};
      },
      type: Object
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("loaded");
      this.$emit("next");
      // console.log("entry browser mounted");
    });
  },
  computed: {
    getEntries() {
      if (!this.$isEmpty(this.entries)) {
        return this.entries;
      } else {
        return this.storeEntries;
      }
    },
    ...mapGetters({ storeEntries: "data" }),
    isEditable() {
      return this.$isEmpty(this.entries);
    }
  },
  methods: {
    // handleEdit(index, row) {},
    objectSpanMethod({ row, columnIndex }) {
      if (columnIndex === 0) {
        const dayEntry = this.isFirst(row);
        if (dayEntry) {
          return {
            rowspan: dayEntry.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    isFirst(row) {
      const entries = this.getEntries;
      if (this.isEqualEntry(entries[row.month][row.day][0], row)) {
        return entries[row.month][row.day];
      }
      return false;
    },
    isEqualEntry(entry, row) {
      if (
        entry.month === row.month &&
        entry.day === row.day &&
        entry.info === row.info &&
        entry.amount === row.amount
      ) {
        return true;
      }
      return false;
    },
    join(obj) {
      return join(obj);
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.entrybrowser {
  height: 50vh;
  overflow-y: scroll;
  .collapse {
    min-width: 780px;
    .collapse-item {
      .table {
        margin-top: 20px;
        margin-left: 30px;
      }
    }
  }
  .jump-down {
    position: sticky;
    top: 10px;
    float: right;
    margin: 20px;
  }
}
</style>
