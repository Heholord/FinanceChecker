<template>
  <el-collapse class="collapse">
    <el-collapse-item
      v-for="entryKey in Object.keys(entries)"
      :key="entryKey"
      :title="entryKey"
      :name="entryKey"
    >
      <el-table :span-method="objectSpanMethod" :data="join(entries[entryKey])">
        <el-table-column prop="day" label="Day" width="50"></el-table-column>
        <el-table-column prop="info" label="Info" width="300"></el-table-column>
        <el-table-column prop="amount" label="Value" width="120"></el-table-column>
        <el-table-column prop="category" label="Special Category" width="150"></el-table-column>
        <el-table-column label="Operations" width="120">
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template slot-scope="scope">
            <el-button type="text" size="small">Detail</el-button>
            <el-button type="text" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>


<script>
import { join } from "@/plugin/utils";
export default {
  components: {},
  name: "EntryBrowser",
  props: ["entries"],
  beforeMount() {
    this.$emit("next");
  },
  methods: {
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
      if (this.isEqualEntry(this.entries[row.month][row.day][0], row)) {
        return this.entries[row.month][row.day];
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
.collapse {
  min-width: 780px;
}
</style>
