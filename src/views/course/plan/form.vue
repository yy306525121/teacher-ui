<template>
  <el-dialog :title="title" v-model="open" width="700px" append-to-body @closed="reset">
    <el-form ref="changePlanRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="年级" prop="classInfoId">
        <el-tree-select v-model="form.classInfoId" :data="gradeList" :props="props"
                        :render-after-expand="false" default-expand-all/>
      </el-form-item>

      <el-form-item label="换课日期" prop="date">
        <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择换课日期"
            value-format="YYYY-MM-DD"
            style="width: 300px"
        />
      </el-form-item>


      <el-row>
        <el-col :span="12">
          <el-form-item label="调课教师">
            <el-select v-model="form.fromTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="=>">
            <el-select v-model="form.toTeacherId" placeholder="请选择" clearable filterable>
              <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
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
    fromTeacherId: undefined,
    toTeacherId: undefined
  },
  rules: {
    type: [{ required: true, message: "规则类型", trigger: "blur" }]
  }
})
const { form, rules} = toRefs(data)

function show() {
  title.value = '课程计划修改'
  getAllTeacher()
  getGradeTree()
  open.value = true
}


function getAllTeacher() {
  listTeacher().then(rsp => {
    teacherList.value = rsp.data
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
    fromTeacherId: undefined,
    toTeacherId: undefined
  }
  proxy.resetForm('changePlanRef')
}
defineExpose({
  show
})
</script>

<style scoped>

</style>
