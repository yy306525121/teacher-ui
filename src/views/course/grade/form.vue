<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">

    </el-form>
  </el-dialog>
</template>

<script setup name="GradeForm">
const title = ref("");
const open = ref(false);

const data = reactive({
  form: {},
  rules: {
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  },
});

const { form, rules } = toRefs(data);


</script>

<style scoped lang="scss">

</style>
