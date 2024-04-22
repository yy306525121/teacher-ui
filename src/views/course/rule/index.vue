<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :rules="queryRules" :inline="true">
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
        >添加规则
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['course:feeRule:remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-tabs v-model="tabType">
      <el-tab-pane label="放假规则" name="holiday">
        <HolidayRuleList ref="holidayRuleListRef" :search-date="queryParams.date" @clickEdit="handleEdit"/>
      </el-tab-pane>
      <el-tab-pane label="考试规则" name="exam">
        <ExamRuleList ref="examRuleListRef" :search-date="queryParams.date" @clickEdit="handleEdit"/>
      </el-tab-pane>
      <el-tab-pane label="临时调课规则" name="transfer">
        <TransferRuleList ref="transferRuleListRef" :search-date="queryParams.date" @clickEdit="handleEdit"/>
      </el-tab-pane>
    </el-tabs>

    <HolidayRuleForm ref="holidayRuleFormRef" @ok="formOk"/>
    <ExamRuleForm ref="examRuleFormRef" @ok="formOk"/>
  </div>
</template>

<script setup name="RuleIndex">
import { parseTime } from '@/utils/ruoyi'
import HolidayRuleList from './component/HolidayRuleList.vue'
import ExamRuleList from './component/ExamRuleList.vue'
import TransferRuleList from './component/TransferRuleList.vue'
import HolidayRuleForm from './form/HolidayRuleForm.vue'
import ExamRuleForm from './form/ExamRuleForm.vue'

const tabType = ref('holiday')
const queryRef = ref()
const ids = ref([]);
const multiple = ref(true);
const holidayRuleListRef = ref(null)
const examRuleListRef = ref(null)
const transferRuleListRef = ref(null)
const holidayRuleFormRef = ref(null)
const examRuleFormRef = ref(null)


const queryParams = ref({
  date: parseTime(new Date(), '{y}-{m}-{d}')
})
const queryRules = reactive({
  date: [{ required: true, message: '课时月份不能为空', trigger: 'blur' }]
})

function handleQuery() {
  queryRef.value.validate(valid => {
    if (valid) {
      holidayRuleListRef.value.getPage()
      examRuleListRef.value.getPage()
      transferRuleListRef.value.getPage()
    }
  })
}

function handleAdd() {
  if (tabType.value === 'holiday') {
    holidayRuleFormRef.value.open()
  } else if (tabType.value === 'exam') {
    examRuleFormRef.value.open()
  }
}

function handleEdit(id) {
  if (tabType.value === 'holiday') {
    holidayRuleFormRef.value.open(id)
  } else if (tabType.value === 'exam') {
    examRuleFormRef.value.open(id)
  }
}

function resetQuery() {
  queryParams.value.date = parseTime(new Date(), '{y}-{m}-{d}')
  handleQuery()
}

function handleDelete() {

}

function formOk() {
  if (tabType.value === 'holiday') {
    holidayRuleListRef.value.getPage()
  } else if (tabType.value === 'exam') {
    examRuleListRef.value.getPage()
  }
}

</script>

<style scoped>

</style>
