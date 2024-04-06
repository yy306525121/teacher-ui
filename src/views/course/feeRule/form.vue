<template>
  <el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="reset">
    <el-form ref="feeRuleRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="规则类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择" clearable style="width: 300px">
          <el-option
            v-for="dict in fee_rule_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="班级" prop="classInfoIds">
        <el-select v-model="form.classInfoIds" multiple placeholder="请选择" clearable style="width: 300px">
          <el-option
              v-for="item in gradeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="请选择课时月份"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="开始节次" prop="startTimeSlotId">
        <el-select v-model="form.startTimeSlotId" placeholder="请选择" clearable style="width: 300px">
          <el-option
              v-for="item in timeSlotList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
                style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                    "
            >
              <span v-if="item.sortInDay === 1">早自习</span>
              <span v-if="item.sortInDay >= 2 && item.sortInDay <= 6">上午</span>
              <span v-if="item.sortInDay >= 7 && item.sortInDay <= 10">下午</span>
              <span v-if="item.sortInDay >= 11">夜自习</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="请选择课时月份"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="开始节次" prop="endTimeSlotId">
        <el-select v-model="form.endTimeSlotId" placeholder="请选择" clearable style="width: 300px">
          <el-option
              v-for="item in timeSlotList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
                style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                    "
            >
              <span v-if="item.sortInDay === 1">早自习</span>
              <span v-if="item.sortInDay >= 2 && item.sortInDay <= 6">上午</span>
              <span v-if="item.sortInDay >= 7 && item.sortInDay <= 10">下午</span>
              <span v-if="item.sortInDay >= 11">夜自习</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {getList} from "@/api/course/class";
import {list as listTimeSlot} from '@/api/course/timeSlot'
import { add as feeRuleAdd, getFeeRule, edit as feeRuleEdit } from '@/api/course/fee-rule'

const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);
const { fee_rule_type } = proxy.useDict("fee_rule_type");

const  title = ref('添加规则')
const open = ref(false)
const loading = ref(false)
const gradeList = ref([])
const timeSlotList = ref([])

const data = reactive({
  form: {
    id: '',
    type: '',
    classInfoId: '',
    classInfoIds: '',
    startDate: '',
    startTimeSlotId: '',
    endDate: '',
    endTimeSlotId: ''
  },
  rules: {
    type: [{ required: true, message: "规则类型", trigger: "blur" }]
  }
})
const { form, rules} = toRefs(data)

function show(id) {
  if (id) {
    title.value = '修改规则'
    getFeeRule(id).then(rsp => {
      form.value.id = rsp.data.id
      form.value.type = rsp.data.type + ''
      form.value.classInfoIds = JSON.parse(rsp.data.classInfoId)
      form.value.startDate = rsp.data.startDate
      form.value.startTimeSlotId = rsp.data.startTimeSlotId
      form.value.endDate = rsp.data.endDate
      form.value.endTimeSlotId = rsp.data.endTimeSlotId
    })
  } else {
    title.value = '新增规则'
  }
  open.value = true
}

function getGradeList() {
  getList({parentId: 0}).then(response => {
    gradeList.value = response.data
  })
}

function getTimeSlotList() {
  listTimeSlot().then(rsp => {
    timeSlotList.value = rsp.data
    timeSlotList.value.forEach(function(item) {
      item.label = '第' + item.sortInDay + '节'
    })
  })
}

function submitForm() {
  proxy.$refs['feeRuleRef'].validate(valid => {
    if (valid) {
      debugger
      loading.value = true
      form.value.classInfoId = JSON.stringify(form.value.classInfoIds)
      if (form.value.id) {
        // 修改
        feeRuleEdit(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          loading.value = false
          emit('ok')
        })
      } else {
        feeRuleAdd(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          loading.value = false
          emit('ok')
        })
      }
    }
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    id: '',
    type: '',
    classInfoId: '',
    classInfoIds: '',
    startDate: '',
    startTimeSlotId: '',
    endDate: '',
    endTimeSlotId: ''
  }
  proxy.resetForm('feeRuleRef')
}

getGradeList()
getTimeSlotList()
defineExpose({
  show
})
</script>

<style scoped>

</style>
