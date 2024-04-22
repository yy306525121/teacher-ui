<template>
  <el-table v-loading="loading" :data="holidayRuleList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="班级" align="center">
      <template #default="scope">
        <el-tag type="success" v-for="classInfo in scope.row.classInfoList">{{classInfo.name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="开始日期" align="center" prop="startDate"/>
    <el-table-column label="开始节次" align="center">
      <template #default="scope">
        {{scope.row.startTimeSlot.sortInDay}}
      </template>
    </el-table-column>
    <el-table-column label="结束日期" align="center" prop="endDate"/>
    <el-table-column label="结束节次" align="center" prop="endSortInDay">
      <template #default="scope">
        {{scope.row.endTimeSlot.sortInDay}}
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" prop="createTime" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
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

<script setup name="HolidayRule">
import { page, delHolidayRule } from '@/api/course/holiday-rule'
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
const holidayRuleList = ref([]);
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
    holidayRuleList.value = response.data.records;
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
    return delHolidayRule(ids)
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
