
<template>
    <button
    type="button"
    :disabled="props.disabled"
    class="text-lg font-cardo py-2 focus:outline-none bg-fiona-light-green text-fiona-dark-green fill w-full rounded"
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
    },
    disabled : {
        type: Boolean,
    }
});


function handleButtonClicked() {
    emits('buttonClicked', props.buttonText)
}


</script>