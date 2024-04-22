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
    </el-form>
  </el-dialog>
</template>

<script setup name="HolidayRuleForm">
import {getList} from "@/api/course/class";

const title = ref('添加放假规则')
const dialogVisible = ref(false)

const gradeList = ref([])

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
  if (id) {
    title.value = '修改放假规则'
  } else {
    title.value = '新增放假规则'
  }
  dialogVisible.value = true
}

function resetForm() {
  form.value = {
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

getGradeList()
</script>

<style scoped>

</style>
