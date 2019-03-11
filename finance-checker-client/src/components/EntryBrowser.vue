<template>
  <div class="entrybrowser">
    <el-dialog v-if="editEntry" :visible.sync="editEntry" width="50%" center>
      <span slot="title">
        <i class="el-icon-edit" style="margin-right:15px;"/>
        {{selectedEntity.new.title}}
      </span>
      <div class="edit-elem">
        <input v-model="selectedEntity.new.info">
        <el-date-picker
          v-model="selectedEntity.new.date"
          placeholder="Pick a day"
          format="yyyy-MMM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editEntry = false">cancle</el-button>
        <el-button type="primary" @click="updateEntity()">Update</el-button>
      </span>
    </el-dialog>
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
          <el-table-column prop="day" label="Day" width="50" header-align="center"></el-table-column>
          <el-table-column prop="info" label="Info" width="330" header-align="center"></el-table-column>
          <el-table-column
            prop="category"
            label="Special Category"
            width="150"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="amount"
            label="Value"
            width="140"
            align="right"
            header-align="center"
          ></el-table-column>
          <el-table-column
            v-if="isEditable"
            label="Operations"
            align="right"
            width="150"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
import { join, clone, isEqualEntry } from "@/plugin/utils";
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
  data() {
    return {
      selectedEntity: {
        old: undefined,
        new: undefined
      }
    };
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
    editEntry: {
      get: function() {
        return this.selectedEntity.old !== undefined;
      },
      set: function(newValue) {
        if (newValue === false) {
          this.selectedEntity.old = undefined;
          this.selectedEntity.new = undefined;
        }
      }
    },
    ...mapGetters({ storeEntries: "data" }),
    isEditable() {
      return this.$isEmpty(this.entries);
    }
  },
  methods: {
    updateEntity() {
      let newEntry = clone(this.selectedEntity.new);
      let date = this.$moment(this.selectedEntity.new.date, "YYYY-MM-DD");
      newEntry.month = date.format("MMMMYYYY");
      newEntry.day = date.format("D");
      delete newEntry.date;
      delete newEntry.title;

      this.$store.commit("updateEntriy", {
        oldEntry: this.selectedEntity.old,
        newEntry: newEntry
      });
      this.editEntry = false;
    },
    handleEdit(row) {
      this.selectedEntity.old = row;
      this.selectedEntity.new = clone(row);
      this.selectedEntity.new.date = this.$moment(
        row.month + row.day,
        "MMMMYYYYD"
      ).format("YYYY-MM-DD");
      this.selectedEntity.new.title =
        this.selectedEntity.new.date + " " + row.info;
    },
    handleDelete(row) {
      this.$store.commit("updateEntriy", {
        oldEntry: row
      });
    },
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
      if (isEqualEntry(entries[row.month][row.day][0], row)) {
        return entries[row.month][row.day];
      }
      return false;
    },
    join(obj) {
      return join(obj);
    }
  }
};
</script>

<style lang="scss">
.entrybrowser {
  .collapse {
    min-width: 500px;
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
