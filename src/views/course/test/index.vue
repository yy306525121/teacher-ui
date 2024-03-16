<template>
  <div class="app-container">
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent='arg'>
        <b>{{ arg.event.title }}</b>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup name="Test">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { reactive } from "vue";

const calendarOptions = reactive({
  plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin],
  locale: 'zh',
  // initialView: 'timeGridWeek',
  initialView: 'dayGridMonth',
})
</script>

<style scoped>

</style>
