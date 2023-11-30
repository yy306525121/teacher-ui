<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['course:course:add']"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="courseList">
      <el-table-column label="科目" align="center" prop="name" />
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:course:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:course:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="Course">
import { list} from "@/api/course/course";

const loading = ref(false)
const courseList = ref([])

function getList() {
  loading.value = true
  list().then(response => {
    courseList.value = response.data
    loading.value = false
  })
}

function handleUpdate(data) {

}

function handleDelete(data) {

}

function handleAdd() {

}

getList()
</script>

<style scoped lang="scss">

</style>
