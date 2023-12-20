<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级部门" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择年级">
          <el-option
            v-for="grade in gradeList"
            :key="grade.id"
            :label="grade.name"
            :value="grade.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0"/>
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

<script setup name="GradeForm">
import { getList, addClass, updateClass } from "@/api/course/class";
const { proxy } = getCurrentInstance();
const emit = defineEmits([ "get-tree" ]);

const title = ref("");
const open = ref(false);
// 年级列表
const gradeList = ref([])

const data = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: "班级名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
  },
});

const { form, rules } = toRefs(data);


function show(data) {
  getGradeList()

  if (data) {
    title.value = '修改'
    form.value = {
      id: data.id,
      name: data.name,
      sort: data.sort
    }
    if (data.parentId != 0) {
      form.value.parentId = data.parentId
    }
  } else {
    title.value = '新增'
  }

  open.value = true
}

function cancel() {
  open.value = false
  reset()
}
function reset() {
  form.value = {
    id: undefined,
    parentId: undefined,
    name: undefined,
    sort: 0
  };
  proxy.resetForm("formRef");
}

function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit('get-tree')
        })
      } else {
        addClass(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit('get-tree')
        })
      }
    }
  });
}

function getGradeList() {
  let params = { 'parentId': 0 }
  getList(params).then(response => {
    gradeList.value = response.data
  }).finally(() => {
  })
}



defineExpose({
  show
})
</script>

<style scoped lang="scss">

</style>
