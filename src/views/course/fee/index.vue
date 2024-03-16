<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :rules="rules" :inline="true" v-show="showSearch">
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
            icon="Cpu"
            @click="handleCalculate"
            v-hasPermi="['course:fee:calculate']"
        >计算课时</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="lessonFeeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="教师" align="center" prop="teacherName" />
      <el-table-column label="课时" align="center" prop="lessonCount" />
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)" v-hasPermi="['course:fee:list']">明细</el-button>
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

    <Detail ref="detailRef"/>
  </div>
</template>


<script setup name="LessonFee">
import { page, calculate } from '@/api/course/fee'
import Detail from './detail.vue'
const { proxy } = getCurrentInstance();

const showSearch = ref(true);
const loading = ref(false)
const calculateLoading = ref(false)
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const detailRef = ref(null)
const lessonFeeList = ref([])

const data = reactive({
  queryParams: {
    page: {
      current: 1,
      size: 10,
    },
    date: undefined
  },
  rules: {
    date: [{ required: true, message: "课时月份不能为空", trigger: "blur" }],
  },
});
const {queryParams, rules} = toRefs(data);

function getPage() {
  loading.value = true;
  page(queryParams.value).then(response => {
    lessonFeeList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
}


function handleQuery() {
  proxy.$refs['queryRef'].validate(valid => {
    if (valid) {
      getPage()
    }
  })

}

function resetQuery() {}

function handleDetail(data) {
  // detailRef.value.show(data.teacherId)
    detailRef.value.show(data.teacherId, queryParams.value.date)
}

function handleCalculate() {
  let showDate = queryParams.value.date
  showDate = showDate.substring(0, 7)
  proxy.$modal.confirm('确认重新计算"' + showDate + '"的课时吗?').then(() => {
    calculateLoading.value = true
    calculate(queryParams.value).then(response => {
      proxy.$modal.msg('计算完成')
    }).finally(() => {
      calculateLoading.value = false
    })
  })
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
</script>

<style scoped lang="scss">
</style>
