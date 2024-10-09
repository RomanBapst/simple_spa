
<template>
    <div class="relative inline-block rounded-md">
        <div @click="toggleDropdown" class="py-2 px-2 w-full h-full border rounded-md cursor-pointer flex justify-between items-center">
            {{ selectedOption || "Select an option" }}
            <span :class="{'transform rotate-180': dropdownOpen}">
                &#9662; <!-- This is a down arrow character -->
            </span>
        </div>
        
        <ul v-if="dropdownOpen" class="absolute w-full left-0 bg-white border rounded-md shadow-lg z-10">
            <li
            v-for="option in props.options"
            :key="option"
            @click="selectOption(option)"
            class="cursor-pointer py-2"
            >
            {{ option }}
        </li>
    </ul>
</div>
</template>


<script setup lang="ts">

import { defineEmits, ref} from "vue";
const emits = defineEmits(["selectionChanged"]);

const dropdownOpen = ref(false);
const selectedOption = ref("");

const props = defineProps({
    options : {
        type: Array,
        default: []
    },
});

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const selectOption = (option : string) => {
    selectedOption.value = option;
    dropdownOpen.value = false;
    emits('selectionChanged', option)
}


</script>