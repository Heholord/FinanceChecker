<template>
  <div class="entrybrowser">
    <el-dialog v-if="hasEdit" :visible.sync="hasEdit" width="50%" center>
      <edit-entry :entry="entryMarkedForEdit" @update="updateEntity"></edit-entry>
    </el-dialog>
    <el-collapse class="collapse" accordion @change="setOpen">
      <el-collapse-item
        v-for="yearKey in Object.keys(getEntries)"
        :key="yearKey"
        class="collapse-item"
        :title="yearKey"
        :name="yearKey"
      >
        <el-collapse class="collapse" accordion @change="addOpen">
          <el-collapse-item
            v-for="monthKey in Object.keys(getEntries[yearKey])"
            :key="monthKey"
            class="collapse-item"
            :title="monthKey"
            :name="monthKey"
          >
            <el-table
              v-if="openMonth === yearKey+monthKey"
              class="table"
              :span-method="objectSpanMethod"
              :data="join(getEntries[yearKey][monthKey])"
            >
              <el-table-column prop="day" label="Day" width="50" header-align="center"></el-table-column>
              <el-table-column prop="info" label="Info" width="330" header-align="center"></el-table-column>
              <el-table-column
                prop="category"
                label="Special Category"
                width="150"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    v-if="scope.row.category"
                    type="info"
                  >{{$readableCategoryPath(scope.row.category)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                label="Value"
                width="140"
                align="right"
                header-align="center"
              ></el-table-column>
              <el-table-column
                v-if="edit"
                label="Operations"
                align="right"
                width="150"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="entryMarkedForEdit = scope.row">Edit</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
import {
  join,
  clone,
  isEqualEntry,
  updateElem,
  deleteElem
} from "@/plugin/utils";
import { mapGetters } from "vuex";
import EditEntry from "./EditEntry";

export default {
  components: { EditEntry },
  name: "EntryBrowser",
  props: {
    entries: {
      default: () => {
        return {};
      },
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      entryMarkedForEdit: false,
      openMonth: "",
      fromStore: false
    };
  },
  computed: {
    hasEdit: {
      get: function() {
        return this.entryMarkedForEdit ? true : false;
      },
      set: function(newValue) {
        this.entryMarkedForEdit = newValue;
      }
    },
    getEntries() {
      if (!this.fromStore) {
        return this.entries;
      } else {
        return this.storeEntries;
      }
    },
    ...mapGetters({ storeEntries: "data" })
  },
  methods: {
    setOpen(year) {
      this.openMonth = year;
    },
    addOpen(month) {
      this.openMonth.length === 4
        ? (this.openMonth += month)
        : (this.openMonth = this.openMonth.substring(0, 4) + month);
    },
    handleDelete(row) {
      if (this.fromStore) {
        this.$store.commit("updateEntriy", {
          oldEntry: row
        });
      } else {
        deleteElem(this.entries, row);
      }
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
      if (isEqualEntry(entries[row.year][row.month][row.day][0], row)) {
        return entries[row.year][row.month][row.day];
      }
      return false;
    },
    join(obj) {
      return join(obj);
    },
    updateEntity(updatedEntity) {
      if (this.fromStore) {
        this.$store.commit("updateEntriy", {
          oldEntry: this.entryMarkedForEdit,
          newEntry: clone(updatedEntity)
          // clone because when object is changed again we don't want to autoupdate on change
          //(because withoud clone it would be linked to the store now), but on clicking on update again
        });
      } else {
        updateElem(this.entries, this.entryMarkedForEdit, updatedEntity);
      }
      this.entryMarkedForEdit = false;
    }
  },
  mounted() {
    if (this.$isEmpty(this.entries)) this.fromStore = true;
  }
};
</script>

<style lang="scss">
.entrybrowser {
  .collapse {
    min-width: $size7;
    .collapse-item {
      .collapse {
        margin-top: $space3;
        margin-left: $space4;
        .table {
          margin-top: $space3;
          margin-left: $space4;
        }
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
