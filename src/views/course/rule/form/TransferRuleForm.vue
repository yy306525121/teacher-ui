<template>
  <el-dialog :title="title" v-model="dialogVisible" width="600px" append-to-body @closed="resetForm">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="调课日期" prop="overrideDate">
            <el-date-picker
                v-model="formData.overrideDate"
                type="date"
                placeholder="请选择课时日期"
                value-format="YYYY-MM-DD"
                style="width: 300px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="调课节次" prop="overrideTimeSlotId">
            <el-select v-model="formData.overrideTimeSlotId" placeholder="请选择" clearable style="width: 300px">
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
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="调课教师" prop="overrideFromTeacherId">
            <el-select v-model="formData.overrideFromTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" class="transfer-icon">
            <el-icon><ArrowRight /></el-icon>
        </el-col>
        <el-col :span="6">
          <el-form-item class="transfer-right" label-width="0" prop="overrideToTeacherId">
            <el-select v-model="formData.overrideToTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="调课课程">
            <el-select v-model="formData.overrideFromSubjectId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" class="transfer-icon">
          <el-icon><ArrowRight /></el-icon>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-select v-model="formData.overrideToSubjectId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="课程类型">
            <el-select v-model="formData.overrideFromCourseTypeId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in courseTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" class="transfer-icon">
          <el-icon><ArrowRight /></el-icon>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-select v-model="formData.overrideToCourseTypeId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in courseTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="ExamRuleForm">
import {list as listTimeSlot} from '@/api/course/timeSlot'
import { list as listTeacher } from '@/api/course/teacher'
import { list as listSubject } from '@/api/course/subject'
import { list as listCourseType } from '@/api/course/course-type'
import { add as ruleAdd, getInfo, edit as ruleEdit } from '@/api/course/transfer-rule'


const { proxy } = getCurrentInstance();

const emit = defineEmits(["ok"]);

const title = ref('添加考试规则')
const dialogVisible = ref(false)
const loading = ref(false)

const teacherList = ref([])
const timeSlotList = ref([])
const subjectList = ref([])
const courseTypeList = ref([])

const formRef = ref()

const formData = ref({
  id: undefined,
  overrideDate: undefined,
  overrideTimeSlotId: undefined,
  overrideFromTeacherId: undefined,
  overrideToTeacherId: undefined,
  overrideFromSubjectId: undefined,
  overrideToSubjectId: undefined,
  overrideFromCourseTypeId: undefined,
  overrideToCourseTypeId: undefined
})

const formRules = reactive({
  overrideDate: [{ required: true, message: "调课日期不能为空", trigger: "blur" }],
  overrideTimeSlotId: [{ required: true, message: "调课节次不能为空", trigger: "blur" }],
  overrideFromTeacherId: [{ required: true, message: "调课教师不能为空", trigger: "blur" }],
  overrideToTeacherId: [{ required: true, message: "调课教师不能为空", trigger: "blur" }],
})

function open(id) {
  resetForm()
  getTimeSlotList()
  getAllTeacher()
  getAllSubject()
  getAllCourseType()

  if (id) {
    title.value = '修改临时调课规则'
    getInfo(id).then(rsp => {
      formData.value.id = rsp.data.id
      formData.value.overrideDate = rsp.data.overrideDate
      formData.value.overrideTimeSlotId = rsp.data.overrideTimeSlotId
      formData.value.overrideFromTeacherId = rsp.data.overrideFromTeacherId
      formData.value.overrideToTeacherId = rsp.data.overrideToTeacherId
      formData.value.overrideFromSubjectId = rsp.data.overrideFromSubjectId
      formData.value.overrideToSubjectId = rsp.data.overrideToSubjectId
      formData.value.overrideFromCourseTypeId = rsp.data.overrideFromCourseTypeId
      formData.value.overrideToCourseTypeId = rsp.data.overrideToCourseTypeId
    })
  } else {
    title.value = '新增临时调课规则'
  }

  dialogVisible.value = true
}

function resetForm() {
  formData.value = {
    id: undefined,
    overrideDate: undefined,
    overrideTimeSlotId: undefined,
    overrideFromTeacherId: undefined,
    overrideToTeacherId: undefined,
    overrideFromSubjectId: undefined,
    overrideToSubjectId: undefined,
    overrideFromCourseTypeId: undefined,
    overrideToCourseTypeId: undefined
  }
  proxy.resetForm('formRef')
}

function getTimeSlotList() {
  listTimeSlot().then(rsp => {
    timeSlotList.value = rsp.data
    timeSlotList.value.forEach(function(item) {
      item.label = '第' + item.sortInDay + '节'
    })
  })
}

function getAllTeacher() {
  listTeacher().then(rsp => {
    teacherList.value = rsp.data
  })
}
function getAllSubject() {
  listSubject({}).then(rsp => {
    subjectList.value = rsp.data
  })
}
function getAllCourseType() {
  listCourseType().then(rsp => {
    courseTypeList.value = rsp.data
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
.transfer-icon {
  text-align: center;
}
.transfer-icon i {
  margin-top: 30%;
}
</style>
