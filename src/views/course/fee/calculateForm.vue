<template>
  <el-dialog :title="title" v-model="open" width="400px" append-to-body>
    <div style="text-align: center">
      <el-date-picker
          v-model="calculateForm.date"
          type="month"
          placeholder="选择计算月份"
          value-format="YYYY-MM-DD"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="isSubmiting">开始计算</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(["ok"]);

const title = ref('课时计算')
const open = ref(false)
const isSubmiting = ref(false)

const data = reactive({
  calculateForm: {
    date: ''
  }
})
const { calculateForm, rules} = toRefs(data)

function show() {
  open.value = true
}

function handleAdd() {

}

function submitForm() {
  isSubmiting.value = true
}

function cancel() {
  open.value = false;
  reset();
}

function reset() {

}

defineExpose({
  show
})
</script>

<style scoped>

</style>
