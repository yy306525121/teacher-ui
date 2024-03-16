<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['course:class:add']"
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
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:class:edit']">修改</el-button>
          <el-button v-if="scope.row.parentId == 0" link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['course:class:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:class:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Form ref="formRef" @get-tree="getTree"/>
  </div>
</template>

<script setup name="ClassInfo">
import { tree } from "@/api/course/class";
import Form from './form.vue'

const loading = ref(false)
const isExpandAll = ref(false);
const refreshTable = ref(true);
const gradeList = ref([])
const formRef = ref(null)

function getTree() {
  loading.value = true
  tree().then(response => {
    gradeList.value = response.data
    loading.value = false;
  })
}

function handleAdd(data) {
  let parentId = undefined
  if (data) {
    parentId = data.id
  }
  formRef.value.show(undefined, parentId)
}

function handleUpdate(data) {
  formRef.value.show(data)
}

function handleDelete(data) {

}

getTree()
</script>

<style scoped lang="scss">

</style>
