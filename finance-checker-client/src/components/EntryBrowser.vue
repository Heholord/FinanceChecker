<template>
  <el-collapse class="collapse">
    <el-collapse-item
      v-for="entryKey in Object.keys(entries)"
      :key="entryKey"
      :title="entryKey"
      :name="entryKey"
    >
      <el-table :data="join(entries[entryKey])">
        <el-table-column prop="info" label="Info" width="300"></el-table-column>
        <el-table-column prop="amount" label="Value" width="120"></el-table-column>
        <el-table-column prop="category" label="Special Category" width="150"></el-table-column>
        <el-table-column label="Operations" width="120">
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
export default {
  components: {},
  name: "EntryBrowser",
  props: ["entries"],
  methods: {
    join(obj) {
      let array = [];
      Object.keys(obj).forEach(key => {
        array.push(...obj[key]);
      });
      return array;
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.collapse {
  min-width: 500px;
}
</style>
