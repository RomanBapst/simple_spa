<template>
  <!-- <div class="min-h-screen bg-cover bg-center flex flex-col justify-between items-center" style="background-image: url('/test/images/image3.jpg')"> -->
  <div class="min-h-screen bg-cover bg-center flex flex-col justify-between items-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white bg-opacity-0 my-4">

      <div class="mb-10 font-cardo">
        <p class="text-6xl text-amber-950">DISCOVER A</p>
        <p class="text-6xl text-amber-950">NEW</p>
        <p class="text-4xl text-amber-700 ">WORLD OF</p>
        <p class="text-6xl text-amber-950 ">OPPORTUNITY</p>
      
      </div>

      <div class="mb-10 font-cardo text-fiona-dark-green">
        <p class="mb-4">
          Watch this 20-minute webinar to learn how you can build an online business alongside a community of digital nomads, without any previous experience!

        </p>
          <p>Enter Your Details Below To Watch The Webinar.</p>
      
      </div>


      <div v-if="!submitted" class="space-y-6">
        <form class="space-y-4">
          <TextInput
          v-model:value="name"
          label="First Name"
          placeholderText="Enter your first name"
          class="text-fiona-dark-green"
          />
          <TextInput
          v-model:value="surname"
          label="Surname"
          placeholderText="Enter your surname"
          class="text-fiona-dark-green"
          />
          <TextInput
          v-model:value="instagram"
          label="Instagram Handle"
          placeholderText="Enter your instagram handle"
          class="text-fiona-dark-green"
          />
          
          <div class="relative inline-block w-full">
            <p class="text-lg font-semibold mb-2 font-cardo text-fiona-dark-green">How did you get in touch?</p>
            <Dropdown
            :options="inTouchOptions"
            @selectionChanged="selectOption"
            class=" w-full bg-fiona-light-green text-fiona-dark-green font-cardo"
            />
          </div>
          
          
          <!-- Two buttons: one for redirecting, one for showing options -->
          <div v-if="isFormValid">
            <p class="text-lg font-semibold mb-2 font-cardo text-fiona-dark-green">Are you ready to watch the 27 minutes Webclass now?</p>
            <Button
            buttonText="Yes, I am ready now!"
            @buttonClicked="handleRedirect"
            class="mb-2"
            :disabled="!isFormValid"
            />
            <Button
            buttonText="No, I need more time."
            @buttonClicked="handleShowTimeOptions"
            :disabled="!isFormValid"
            />
          </div>
          
          <div v-if="questionAsked" class="relative inline-block w-full">
            <p class="text-lg font-semibold mb-2 font-cardo text-fiona-dark-green">When are you going to prioritise watching the Webclass?</p>
            <Dropdown
            :options="timeOptions"
            @selectionChanged="selectTimeOption"
            class=" w-full bg-fiona-light-green text-fiona-dark-green font-cardo"
            />
          </div>
          
          <Button
          v-if="selectedTimeOption !== ''"
          buttonText="Submit"
          @buttonClicked="submitPressed"
          />
        </form>
      </div>
      
      <!-- Show spinner while loading -->
      <div v-if="loading" class="flex justify-center items-center mt-4">
        <div class="w-10 h-10 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
      </div>
      
      <!-- Final message shown after an option is selected -->
      <div v-if="submitted" class="text-center mt-4">
        <p class="text-lg text-fiona-dark-green font-cardo">
          Once you're ready to watch the webclass, please use this link again and submit your data.
        </p>
      </div>
      
      <!-- Error message -->
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
    </div>
    
    <footer class="text-gray-500 text-xs py-4">
      <p class="text-lg text-fiona-dark-green">&copy; Plasticfreefi</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed} from "vue";
import axios from "axios";

import TextInput from "./TextInput.vue";
import Button from "./Button.vue";
import Dropdown from "./Dropdown.vue";

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
const timeDropdownOpen = ref(false);
const selectedOption = ref("");

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const toggleTimeDropdown = () => {
  timeDropdownOpen.value = !timeDropdownOpen.value;
};

const selectOption = (option : any) => {
  selectedOption.value = option;
  inTouchOption.value = option
  dropdownOpen.value = false;
};
const selectTimeOption = (option : any) => {
  selectedTimeOption.value = option
  timeDropdownOpen.value = false;
};

// Computed property to check if the form is valid (all fields filled)
const isFormValid = computed(() => {
  return (
  name.value.trim() !== "" &&
  surname.value.trim() !== "" &&
  instagram.value.trim() !== "" &&
  inTouchOption.value !== ""
  );
});

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

const submitPressed = async (): Promise<void> => {
  console.log("Submit button pressed");
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
