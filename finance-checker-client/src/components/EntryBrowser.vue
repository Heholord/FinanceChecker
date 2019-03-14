<template>
  <div class="entrybrowser">
    <el-dialog v-if="editEntry" :visible.sync="editEntry" width="50%" center>
      <div class="edit-elem">
        <fieldset>
          <legend>
            <span class="number">1</span>
            General infos
          </legend>
          <el-input v-model="selectedEntity.new.info" placeholder="How is the entry called?"></el-input>
          <label for="date">When did that happen?</label>
          <el-date-picker
            id="date"
            v-model="selectedEntity.new.date"
            placeholder="Choose a date"
            format="yyyy-MMM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <label>About how much are we talking here?</label>
          <el-input v-model="selectedEntity.new.amount" placeholder="Quanta costa?" class="money"></el-input>
        </fieldset>
        <fieldset>
          <legend>
            <span class="number">2</span>
            Optional
          </legend>
          <label>Select a special category</label>
          <category-tree
            :categories="[{path: 'in', data: getTree()}]"
            :activeCategories="[this.selectedCategory]"
            :filterMode="false"
            @onSelect="selectCategory"
          ></category-tree>
        </fieldset>
        <el-button type="primary" @click="updateEntity()">Update</el-button>
      </div>
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
import { join, clone, isEqualEntry, getCategoryTree } from "@/plugin/utils";
import { mapGetters } from "vuex";
import CategoryTree from "@/components/CategoryTree";

export default {
  components: { CategoryTree },
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
    ...mapGetters({ storeEntries: "data", categories: "categories" }),
    isEditable() {
      return this.$isEmpty(this.entries);
    }
  },
  methods: {
    getTree() {
      return getCategoryTree("in", this.categories);
    },
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
.edit-elem {
  padding: 20px 20px;
  background: #f4f7f8;
  margin: 0;
  border-radius: 8px;
  font-family: Georgia, "Times New Roman", Times, serif;
  display: grid;
  grid-template-rows: auto auto auto;

  fieldset {
    border: none;
    margin: 10px;
    legend {
      font-size: 1.2em;
      margin-bottom: 10px;
      .number {
        background: #409eff;
        color: white;
        height: 30px;
        width: 30px;
        display: inline-block;
        font-size: 0.8em;
        margin-right: 4px;
        line-height: 30px;
        text-align: center;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
        border-radius: 50% 50% 50% 0;
      }
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    .el-input {
      margin: 0 0 0 00px;
      background: rgba(255, 255, 255, 0.2);
      margin-bottom: 30px;
      max-width: 500px;

      & > input {
        margin: 0;
      }

      &.money {
        max-width: 150px;
      }
    }
  }
  .primary {
    width: 90%;
    justify-self: center;
  }
}
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
