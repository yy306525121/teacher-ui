<template>
  <el-table v-loading="loading" :data="holidayRuleList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="姓名" align="center" prop="name" />
    <el-table-column label="基本工资" align="center" prop="basicSalary" />
    <el-table-column label="创建时间" align="center" prop="createTime" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:teacher:edit']">修改</el-button>
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
import { page } from '@/api/course/holiday-rule'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance();

const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const showSearch = ref(true);

const loading = ref(true);
const holidayRuleList = ref([]);

const props = defineProps({
  searchDate: {
    type: String,
    default: () => {
      return parseTime(new Date(), '{y}-{m}-{d}')
    }
  }
})


const data = reactive({
  queryParams: {
    page: {
      current: 1,
      size: 10,
    },
    searchDate: props.searchDate
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

getPage()
</script>

<style scoped>

</style>
