<template>
  <el-dialog :title="title" v-model="open" width="700px" append-to-body @closed="reset">
    <el-form ref="changePlanRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="年级" prop="classInfoId">
        <el-tree-select v-model="form.classInfoId" :data="gradeList" :props="props"
                        :render-after-expand="false" default-expand-all/>
      </el-form-item>

      <el-form-item label="日期" prop="date">
        <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择换课日期"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="固定周" prop="week">
        <el-select
            v-model="form.week"
            placeholder="Select"
            style="width: 240px"
        >
          <el-option :key="1" label="周一" :value="1"/>
          <el-option :key="2" label="周二" :value="2"/>
          <el-option :key="3" label="周三" :value="3"/>
          <el-option :key="4" label="周四" :value="4"/>
          <el-option :key="5" label="周五" :value="5"/>
          <el-option :key="6" label="周六" :value="6"/>
          <el-option :key="7" label="周日" :value="7"/>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-form-item label="固定节次" prop="overrideTimeSlotId">
            <el-select v-model="form.timeSlotId" placeholder="请选择" clearable style="width: 300px">
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
          <el-form-item label="调课教师">
            <el-select v-model="form.fromTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" class="transfer-icon">
          <el-icon><ArrowRight /></el-icon>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-select v-model="form.toTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="调课课程">
            <el-select v-model="form.fromSubjectId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" class="transfer-icon">
          <el-icon><ArrowRight /></el-icon>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-select v-model="form.toSubjectId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"/>
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

<script setup>
import { list as listTeacher } from '@/api/course/teacher'
import { change as changeCoursePlan } from '@/api/course/plan'
import { tree } from "@/api/course/class";
import {list as listSubject} from "@/api/course/subject";
import {list as listTimeSlot} from "@/api/course/timeSlot";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);

const  title = ref('添加规则')
const open = ref(false)
const loading = ref(false)
const gradeList = ref([])
const timeSlotList = ref([])
const teacherList = ref([])
const subjectList = ref([])
const courseTypeList = ref([])

const props = {
  label: 'name',
  value: 'id',
  children: 'children',
}

const data = reactive({
  form: {
    classInfoId: undefined,
    date: undefined,
    week: undefined,
    timeSlotId: undefined,
    fromTeacherId: undefined,
    toTeacherId: undefined,
    fromSubjectId: undefined,
    toSubjectId: undefined
  },
  rules: {
    type: [{ required: true, message: "规则类型", trigger: "blur" }]
  }
})
const { form, rules} = toRefs(data)

function show() {
  title.value = '课程计划修改'
  getAllTeacher()
  getAllSubject()
  getTimeSlotList()
  getGradeTree()
  open.value = true
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

function getTimeSlotList() {
  listTimeSlot().then(rsp => {
    timeSlotList.value = rsp.data
    timeSlotList.value.forEach(function(item) {
      item.label = '第' + item.sortInDay + '节'
    })
  })
}

function getGradeTree() {
  tree().then(response => {
    gradeList.value = response.data
  })
}

function submitForm() {
  proxy.$refs['changePlanRef'].validate(valid => {
    if (valid) {
      loading.value = true
        // 修改
      changeCoursePlan(form.value).then(() => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        loading.value = false
        emit('ok')
      })
    }
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    classInfoId: undefined,
    date: undefined,
    week: undefined,
    timeSlotId: undefined,
    fromTeacherId: undefined,
    toTeacherId: undefined,
    fromSubjectId: undefined,
    toSubjectId: undefined
  }
  proxy.resetForm('changePlanRef')
}
defineExpose({
  show
})
</script>

<style scoped>
.transfer-icon {
  text-align: center;
}
.transfer-icon i {
  margin-top: 30%;
}
</style>
