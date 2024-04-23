<template>
  <el-table v-loading="loading" :data="ruleList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="调课日期" align="center" prop="overrideDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.overrideDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="调课日期" align="center" prop="overrideTimeSlot" width="180">
      <template #default="scope">
        <span>{{ scope.row.overrideTimeSlot.sortInDay }}</span>
      </template>
    </el-table-column>
    <el-table-column label="教师" align="center">
      <template #default="scope">
        <span>{{ scope.row.overrideFromTeacher.name }} -> {{ scope.row.overrideToTeacher.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="课程" align="center">
      <template #default="scope">
        <span>{{ scope.row.overrideFromSubject.name }} -> {{ scope.row.overrideToSubject.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="课程类型" align="center">
      <template #default="scope">
        <span>{{ scope.row.overrideFromCourseType.name }} -> {{ scope.row.overrideToCourseType.name }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['course:teacher:edit']">修改</el-button>
        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:teacher:remove']">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.page.current"
      v-model:limit="queryParams.page.size"
      @pagination="getPage"
  />
</template>

<script setup name="TransferRuleList">
import { page, del } from '@/api/course/transfer-rule'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance();

const emit = defineEmits(["clickEdit"]);
const props = defineProps({
  searchDate: {
    type: String,
    default: () => {
      return parseTime(new Date(), '{y}-{m}-{d}')
    }
  }
})

const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const showSearch = ref(true);

const loading = ref(true);
const ruleList = ref([]);
const searchDate = toRefs(props).searchDate


const data = reactive({
  queryParams: {
    page: {
      current: 1,
      size: 10,
    },
    searchDate: searchDate
  },
  rules: {
  },
});
const { queryParams, rules } = toRefs(data);


function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


function getPage() {
  loading.value = true;
  page(queryParams.value).then(response => {
    ruleList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
}

function handleEdit(row) {
  emit('clickEdit', row.id)
}

function handleDelete(row) {
  const ids = row.id || ids.value;
  debugger
  proxy.$modal.confirm('确定删除吗？').then(() => {
    return del(ids)
  }).then(() => {
    getPage()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

defineExpose({getPage})
getPage()
</script>

<style scoped>

</style>
