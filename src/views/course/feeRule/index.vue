<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :rules="rules" :inline="true">
      <el-form-item label="课时月份" prop="date">
        <el-date-picker
            v-model="queryParams.date"
            type="month"
            placeholder="请选择课时月份"
            value-format="YYYY-MM-DD"
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
            v-hasPermi="['course:feeRule:add']"
            @click="handleAdd"
        >添加规则</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['course:feeRule:remove']"
        >删除</el-button>
      </el-col>
    </el-row>
    <Form ref="formRef" @ok="getPage"/>


    <el-table v-loading="loading" :data="feeRuleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="规则类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="fee_rule_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate"/>
      <el-table-column label="开始节次" align="center" prop="startSortInDay"/>
      <el-table-column label="结束日期" align="center" prop="endDate"/>
      <el-table-column label="结束节次" align="center" prop="endSortInDay"/>

      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:feeRule:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:feeRule:remove']">删除</el-button>
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
  </div>


</template>

<script setup name="FeeRuleIndex">
import Form from './form.vue'
import { listFeeRule, delFeeRule } from '@/api/course/fee-rule'

const { proxy } = getCurrentInstance();
const { fee_rule_type } = proxy.useDict("fee_rule_type");

const formRef = ref(null)
const loading = ref(false)
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    date: undefined
  },
  rules: {

  },
});
const { queryParams, rules } = toRefs(data);

const feeRuleList = ref([])
const total = ref(0);


function handleQuery() {
  proxy.$refs['queryRef'].validate(valid => {
    if (valid) {
      queryParams.value.pageNum = 1;
      getPage()
    }
  })
}

function handleUpdate(data) {
  formRef.value.show(data.id)
}

function handleDelete(row) {
  const feeRuleIds = row.userId || ids.value;
  proxy.$modal.confirm('确定删除吗？').then(() => {
    return delFeeRule(feeRuleIds)
  }).then(() => {
    getPage()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleAdd() {
  formRef.value.show()
}

function getPage() {
  loading.value = true;
  listFeeRule(queryParams.value).then(rsp => {
    feeRuleList.value = rsp.rows
    total.value = rsp.total;
    loading.value = false;
  })
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

function resetQuery() {
  queryParams.value.date = ''
  getPage()
}

getPage()
</script>

<style scoped>

</style>
