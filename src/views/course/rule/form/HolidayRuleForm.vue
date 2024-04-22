<template>
  <el-dialog :title="title" v-model="dialogVisible" width="700px" append-to-body @closed="resetForm">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="班级" prop="classInfoIds">
        <el-select v-model="formData.classInfoIds" multiple placeholder="请选择" clearable style="width: 300px">
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
            v-model="formData.startDate"
            type="date"
            placeholder="请选择课时月份"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="开始节次" prop="startTimeSlotId">
        <el-select v-model="formData.startTimeSlotId" placeholder="请选择" clearable style="width: 300px">
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
            v-model="formData.endDate"
            type="date"
            placeholder="请选择课时日期"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="结束节次" prop="endTimeSlotId">
        <el-select v-model="formData.endTimeSlotId" placeholder="请选择" clearable style="width: 300px">
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

<script setup name="HolidayRuleForm">
import {getList} from "@/api/course/class";
import {list as listTimeSlot} from '@/api/course/timeSlot'
import { add as ruleAdd, getInfo, edit as ruleEdit } from '@/api/course/holiday-rule'


const { proxy } = getCurrentInstance();

const emit = defineEmits(["ok"]);

const title = ref('添加放假规则')
const dialogVisible = ref(false)
const loading = ref(false)

const gradeList = ref([])
const timeSlotList = ref([])

const formRef = ref()

const formData = ref({
  id: undefined,
  classInfoId: undefined,
  classInfoIds: undefined,
  startDate: undefined,
  startTimeSlotId: undefined,
  endDate: undefined,
  endTimeSlotId: undefined
})

const formRules = reactive({
  type: [{ required: true, message: "规则类型", trigger: "blur" }]
})

function open(id) {
  resetForm()
  getTimeSlotList()
  getGradeList()

  if (id) {
    title.value = '修改放假规则'
    getInfo(id).then(rsp => {
      formData.value.id = rsp.data.id
      formData.value.classInfoIds = JSON.parse(rsp.data.classInfoId)
      formData.value.startDate = rsp.data.startDate
      formData.value.startTimeSlotId = rsp.data.startTimeSlotId
      formData.value.endDate = rsp.data.endDate
      formData.value.endTimeSlotId = rsp.data.endTimeSlotId
    })
  } else {
    title.value = '新增放假规则'
  }

  dialogVisible.value = true
}

function resetForm() {
  formData.value = {
    id: undefined,
    classInfoId: undefined,
    classInfoIds: undefined,
    startDate: undefined,
    startTimeSlotId: undefined,
    endDate: undefined,
    endTimeSlotId: undefined
  }
  proxy.resetForm('formRef')
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

function cancel() {
  dialogVisible.value = false
  resetForm()
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true

      formData.value.classInfoId = JSON.stringify(formData.value.classInfoIds)
      if (formData.value.id) {
        // 修改
        ruleEdit(formData.value).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          dialogVisible.value = false;
          loading.value = false
          emit('ok')
        }).catch(err => {
          loading.value = false
        })
      } else {
        // 新增
        ruleAdd(formData.value).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          dialogVisible.value = false;
          loading.value = false
          emit('ok')
        }).catch(err => {
          loading.value = false
        })
      }

    }
  })
}


defineExpose({open})


</script>

<style scoped>

</style>
