<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['course:grade:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="gradeList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children'}"
    >

      <el-table-column prop="name" label="年级名称"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button v-if="scope.row.parentId == 0" link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup name="Grade">
import { tree } from "@/api/course/grade";

const loading = ref(false)
const isExpandAll = ref(true);
const refreshTable = ref(true);
const gradeList = ref([])

function getTree() {
  loading.value = true
  tree().then(response => {
    gradeList.value = response.data
    loading.value = false;
  })
}

function handleAdd() {

}

function handleUpdate(data) {

}

function handleDelete(data) {

}

getTree()
</script>

<style scoped lang="scss">

</style>
