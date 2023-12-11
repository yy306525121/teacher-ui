<script setup>
import { addTeacher, updateTeacher, getTeacherInfo } from "@/api/course/teacher";
import { list as listSubject } from '@/api/course/subject'

const { proxy } = getCurrentInstance();
const title = ref('')
const open = ref(false)
const emit = defineEmits(["ok"]);
const { job_status } = proxy.useDict("job_status");
const subjectList = ref([])

const data = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: "科目名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
  }
})
const { form, rules} = toRefs(data)


function show(id) {
  getSubjectList()
  if(id) {
    getTeacherInfo(id).then(rsp => {
      let data = rsp.data
      let subjectIds = []
      if (data.subjectList) {
        subjectIds = data.subjectList.map(obj => {return obj.id})
      }

      form.value.id = data.id
      form.value.name = data.name
      form.value.status = data.status
      form.value.basicSalary = data.basicSalary
      form.value.subjectIds = subjectIds
    })
    title.value = '修改'
    open.value = true
  } else {
    title.value = '新增'
    open.value = true
  }
}

function getSubjectList() {
  let params = {}
  listSubject(params).then(rsp => {
    subjectList.value = rsp.data
  })
}

function submitForm() {
  proxy.$refs["teacherRef"].validate(valid => {
    if (valid) {
      if (form.value.id !== undefined) {
        updateTeacher(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit('ok')
        });
      } else {
        addTeacher(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit('ok')
        });
      }
    }
  })
}

function cancel() {
  open.value = false;
  reset();
}

function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    status: undefined,
    basicSalary: 0,
    subjectIds: []
  }
  proxy.resetForm('teacherRef')
}

defineExpose({
  show
})
</script>

<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="reset">
    <el-form ref="teacherRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="教师姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入教师姓名" />
      </el-form-item>
      <el-form-item label="基本工资" prop="basicSalary">
        <el-input v-model="form.basicSalary" placeholder="请输入基本工资">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="授课科目">
        <el-select v-model="form.subjectIds" multiple placeholder="请选择">
          <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在职状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
              v-for="dict in job_status"
              :key="dict.value"
              :label="dict.value"
          >{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
