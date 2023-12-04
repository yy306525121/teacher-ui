<template>
  <el-dialog :title="title" v-model="open" width="700px" append-to-body @closed="reset">
    <el-form ref="subjectRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="科目名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入科目名称"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="10"/>
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

<script setup>
import { addSubject, updateSubject } from "@/api/course/subject";

const { proxy } = getCurrentInstance();

const title = ref('')
const open = ref(false)
const emit = defineEmits(["ok"]);

const data = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: "科目名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
  }
})
const { form, rules } = toRefs(data)


function show(data) {
  if (data) {
    // 修改
    title.value = '修改'
    form.value.id = data.id
    form.value.name = data.name
    form.value.sort = data.sort
    open.value = true
  } else {
    title.value = '新增'
    open.value = true
  }
}

function submitForm() {
  proxy.$refs["subjectRef"].validate(valid => {
    if (valid) {
      if (form.value.id !== undefined) {
        updateSubject(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit('ok')
        });
      } else {
        addSubject(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit('ok')
        });
      }
    }
  });
}

function cancel() {
  open.value = false;
  reset();
}

function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    sort: 0
  }
  proxy.resetForm('subjectRef')
}

defineExpose({
  show
})
</script>

<style scoped>

</style>
