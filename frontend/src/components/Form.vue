<template>
  <div class="min-h-screen bg-cover bg-center flex flex-col justify-between items-center" style="background-image: url('/test/images/image3.jpg')">
    <div class="w-full max-w-md p-8 bg-white bg-opacity-0 my-4">
      <div v-if="!submitted" class="space-y-6">
        <form class="space-y-4">
          <TextInput
          v-model:value="name"
          label="First Name"
          placeholderText="Enter your first name"
          />
          <TextInput
          v-model:value="surname"
          label="Surname"
          placeholderText="Enter your surname"
          />
          <TextInput
          v-model:value="instagram"
          label="Surname"
          placeholderText="Enter your instagram handle"
          />
          
          <div class="relative inline-block w-full">
          <p class="text-lg font-semibold mb-2 font-cardo text-fiona-dark-green">Are we already in touch?</p>
            <div @click="toggleDropdown" class="w-full px-4 py-2 border rounded-md bg-fiona-light-green text-fiona-dark-green cursor-pointer">
              {{ selectedOption || "Select an option" }}
            </div>
            
            <ul v-if="dropdownOpen" class="absolute left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10">
              <li
              v-for="option in inTouchOptions"
              :key="option"
              @click="selectOption(option)"
              class="px-4 py-2 hover:bg-green-100 cursor-pointer text-fiona-dark-green"
              >
              {{ option }}
            </li>
          </ul>
        </div>
      
      <!-- Two buttons: one for redirecting, one for showing options -->
      <div v-if="!questionAsked">
        <p class="text-lg font-semibold mb-2 text-fiona-dark-green">Are you ready to watch the 27 minutes Webclass now?</p>
      <Button
        buttonText="Yes, I am ready now!"
        @buttonClicked="handleRedirect"
        class="mb-2"
      />
      <Button
        buttonText="No, I need more time."
        @buttonClicked="handleShowTimeOptions"
      />
  </div>
  
  <!-- Show options if user clicks "No, I need more time" -->
  <div v-if="showTimeOptions">
    <p class="text-lg font-semibold mb-2">When will you prioritize time to watch the Webclass?</p>
    <div v-for="option in timeOptions" :key="option" class="flex items-center mb-2 space-x-3">
      <div
      class="w-5 h-5 border rounded-full cursor-pointer"
      :class="{ 'bg-blue-600': selectedTimeOption === option }"
      @click="setTimeOption(option)"
      ></div>
      <button
      type="button"
      class="text-lg focus:outline-none"
      @click="setTimeOption(option)"
      >
      {{ option }}
    </button>
  </div>
</div>
</form>
</div>

<!-- Show spinner while loading -->
<div v-if="loading" class="flex justify-center items-center mt-4">
  <div class="w-10 h-10 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
</div>

<!-- Final message shown after an option is selected -->
<div v-if="submitted" class="text-center mt-4">
  <p class="text-lg">
    Once you're ready to watch the webclass, please use this link again and submit your data.
  </p>
</div>

<!-- Error message -->
<p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
</div>

<footer class="text-gray-500 text-xs py-4">
  <p>&copy; Plasticfreefi</p>
</footer>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";

import TextInput from "./TextInput.vue";
import Button from "./Button.vue";

// Form fields
const name = ref<string>("");
const surname = ref<string>("");
const instagram = ref<string>("");

// Options data
const inTouchOptions = ref([
"Yes-Instagram Messages",
"Yes-Linkedin Messages",
"Yes-Whatsapp Messages",
"Yes-We met in person",
"No-I found your link on your profile"
]);

const timeOptions = ref(["Tomorrow", "Next Week", "Next Month"]);

// State
const submitted = ref<boolean>(false);
const questionAsked = ref<boolean>(false);
const showTimeOptions = ref<boolean>(false);
const inTouchOption = ref<string>("");
const selectedTimeOption = ref<string>("");
const errorMessage = ref<string | null>(null);

const loading = ref<boolean>(false); // New loading state

const dropdownOpen = ref(false);
const selectedOption = ref("");

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (option : any) => {
  selectedOption.value = option;
  dropdownOpen.value = false;
};

// Computed property to check if the form is valid (all fields filled)
// const isFormValid = computed(() => {
//   return (
//   name.value.trim() !== "" &&
//   surname.value.trim() !== "" &&
//   instagram.value.trim() !== "" &&
//   inTouchOption.value !== ""
//   );
// });

const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) {
    return "Mobile";
  } else {
    return "Desktop";
  }
};

const getCurrentTimestamp = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Handle button clicks
const handleRedirect = async (): Promise<void> => {
  loading.value = true; // Show spinner
  errorMessage.value = ""
  try {
    await handleSubmit();
  } catch (error) {
    console.log(error)
    errorMessage.value = "Submission failed. Please refresh the page and try again.";
    loading.value = false
    return
  }
  window.location.href = import.meta.env.VITE_REDIRECT_URL;
};

const handleShowTimeOptions = async (): Promise<void> => {
  showTimeOptions.value = true;
  questionAsked.value = true;
  errorMessage.value = null; // Clear error message if handle exists
};

const setTimeOption = async (option: string): Promise<void> => {
  selectedTimeOption.value = option;
  errorMessage.value = ""
  loading.value = true; // Show spinner
  try {
    await handleSubmit();
  } catch (error) {
    console.log(error)
    errorMessage.value = "Submission failed. Please refresh the page and try again.";
    loading.value = false
    return
  }
  submitted.value = true; // Hide the form and show final message
  loading.value = false; // Show spinner
  showTimeOptions.value = false;
  
};

// const setInTouchOption = (option: string): void => {
//   inTouchOption.value = option;
// };

const handleSubmit = async () : Promise<void> => {
  
  return axios.post(import.meta.env.VITE_SERVER_URL, {
    name: name.value,
    surname: surname.value,
    instagram: instagram.value,
    inTouchOption: inTouchOption.value,
    watchTimeOption: selectedTimeOption.value,
    timestamp: getCurrentTimestamp(),
    device: getDeviceType()
  });
};
</script>
