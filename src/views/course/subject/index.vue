<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="科目名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入科目名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['course:subject:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:subject:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:subject:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getPage"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="subjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:subject:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:subject:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getPage"
    />
    <Form ref="formRef" @ok="getPage"/>
  </div>
</template>

<script setup name="Course">
import { page, delSubject, getInfo } from '@/api/course/subject'
import Form from './form.vue'
import {getCurrentInstance} from "vue";

const { proxy } = getCurrentInstance();

const formRef = ref(null)

const subjectList = ref([])
const single = ref(true);
const multiple = ref(true);
const loading = ref(false)
const showSearch = ref(true);
const total = ref(0)
const ids = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined
  }
});
const { queryParams } = toRefs(data);

function handleQuery() {
  queryParams.value.pageNum = 1;
  getPage();
}

function resetQuery() {
  proxy.resetForm("queryRef")
  queryParams.value.name = undefined
  handleQuery()
}
function handleAdd() {
  formRef.value.show()
}
function handleUpdate(row) {
  const subjectId = row.id || ids.value;
  getInfo(subjectId).then(response => {
    formRef.value.show(response.data)
  })
}
function handleDelete(row) {
  const subjectIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除科目编号为"' + subjectIds + '"的数据项？').then(function() {
    return delSubject(subjectIds);
  }).then(() => {
    getPage();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function getPage() {
  loading.value = true;
  page(queryParams.value).then(response => {
    subjectList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  })
}

getPage()
</script>

<style scoped>

</style>
