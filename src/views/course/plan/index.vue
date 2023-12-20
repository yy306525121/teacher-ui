<script setup name="CoursePlan">
import { list } from '@/api/course/course-plan'
import { tree } from "@/api/course/class";

const { proxy } = getCurrentInstance();

const loading = ref(false)
const gradeList = ref([])
const showSearch = ref(true);
const coursePlanList = ref([])
const props = {
  label: 'name',
  value: 'id',
  children: 'children',
}


const data = reactive({
  queryParams: {
    classInfoId: undefined
  }
})
const { queryParams } = toRefs(data);


function objectSpanMethod(row, column, rowIndex, columnIndex) {

}

function getTree() {
  loading.value = true
  tree().then(response => {
    gradeList.value = response.data
    loading.value = false;
  })
}

function getList() {
  list(queryParams.value).then(rsp => {
    coursePlanList.value = rsp.data
  })
}

function handleQuery() {
  getList()
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

getTree()
</script>

<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="年级" prop="classInfoId">
        <el-tree-select v-model="queryParams.classInfoId" :data="gradeList" :props="props" :render-after-expand="false" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :span-method="objectSpanMethod" :data="coursePlanList" :border="true">
      <el-table-column label="" align="center" prop="time"/>
      <el-table-column label="" align="center">
        <template #default="scope">
          第{{scope.row.numInDay}}节
        </template>
      </el-table-column>
      <el-table-column label="星期一" align="center">
        <template #default="scope">
          {{scope.row.monday?.subjectName}}
          <br>
          <br>
          {{scope.row.monday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期二" align="center">
        <template #default="scope">
          {{scope.row.tuesday?.subjectName}}
          <br>
          <br>
          {{scope.row.tuesday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期三" align="center">
        <template #default="scope">
          {{scope.row.wednesday?.subjectName}}
          <br>
          <br>
          {{scope.row.wednesday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期四" align="center">
        <template #default="scope">
          {{scope.row.thursday?.subjectName}}
          <br>
          <br>
          {{scope.row.thursday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期五" align="center">
        <template #default="scope">
          {{scope.row.friday?.subjectName}}
          <br>
          <br>
          {{scope.row.friday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期六" align="center">
        <template #default="scope">
          {{scope.row.saturday?.subjectName}}
          <br>
          <br>
          {{scope.row.saturday?.teacherName}}
        </template>
      </el-table-column>
      <el-table-column label="星期日" align="center">
        <template #default="scope">
          {{scope.row.sunday?.subjectName}}
          <br>
          <br>
          {{scope.row.sunday?.teacherName}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>
