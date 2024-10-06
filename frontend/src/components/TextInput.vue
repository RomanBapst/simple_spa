          <template>
            <div class="flex flex-col space-y-2">
                <label for="surname" class="font-bold text-lg text-fiona-dark-green font-cardo">{{props.label}}</label>
                <input
                type="text"
                id="surname"
                v-model="valueModel"
                :placeholder="props.placeholderText"
                class="p-2 border rounded-md focus:ring focus:ring-blue-300 bg-fiona-light-green placeholder-fiona-dark-green h-max font-cardo"
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
            },
            placeholderText: {
                type: String,
                default: ""
            }
        });
        
        
        </script>