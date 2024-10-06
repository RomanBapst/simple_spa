
<template>
    <button
    type="button"
    class="text-lg py-2 focus:outline-none bg-green-100 text-green-900 fill w-full rounded"
    @click="handleButtonClicked()"
    >
    {{ props.buttonText }}
</button>
</template>

<script setup lang="ts">
import { defineEmits} from "vue";
const emits = defineEmits(["buttonClicked"]);

const props = defineProps({
    buttonText : {
        type: String,
        default: "Hey"
    }
});


function handleButtonClicked() {
    emits('buttonClicked', props.buttonText)
}


</script>