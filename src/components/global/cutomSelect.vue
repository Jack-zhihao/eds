<template>
    <a-select v-modal:value="props.value" :filterOption="filterOption">
        <a-select-option v-for="item in options" :value="item[props.valueKey]" >{{ item[props.labelKey] }}</a-select-option>
    </a-select>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        default: () => []
    },
    valueKey: {
        type: String,
        default: 'id'
    },
    labelKey: {
        type: String,
        default: 'name'
    }
})
const filterOption = (inputValue, option) => {
    console.log(inputValue, option)
}

</script>