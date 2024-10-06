          <template>
            <div class="flex flex-col space-y-2">
                <label for="surname" class="font-bold text-lg text-green-900">{{props.label}}</label>
                <input
                type="text"
                id="surname"
                v-model="valueModel"
                placeholder="Enter your "
                class="p-2 border rounded-md focus:ring focus:ring-blue-300 bg-green-100 placeholder-green-900 h-max"
                required
                />
            </div>
        </template>


        <script setup lang="ts">
        
        const valueModel = defineModel("value", { default: "" });

        const props = defineProps({
            label : {
                type: String,
                default: "Hey"
            }
        });
        
        
        </script>