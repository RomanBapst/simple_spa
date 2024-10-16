<template>
  <!-- <div class="min-h-screen bg-cover bg-center flex flex-col justify-between items-center" style="background-image: url('/test/images/image3.jpg')"> -->
  <div class="min-h-screen bg-cover bg-center flex flex-col justify-between items-center bg-gray-100">
  <div v-if="!initialMessageRead" class="max-w-md p-8 text-fiona-dark-green">
  <p class=" text-center mb-4">Hello, I'm Fiona, and I divide my time between Tanzania, Scotland and Traveling.
  My journey as an independent distributor began with a passion for reducing single-use plastic, and I am now well
  on the way to making this my full-time occupation.
It wasn't easy. I followed the conventional path, working for a multinational real estate firm and later for
Microsoft, before taking a leap into the world of carbon accounting with a startup. But after the loss of my best friend,
 I realized I needed more than the 9-to-5 grind. I wanted to live on my terms — working remotely, free from rigid
  schedules, and fully experiencing life.
In September 2023, I found a game-changing opportunity: a high-ticket network marketing business perfectly aligned with
 my passions for health, sustainability, and zero waste. If you're ready to explore a sustainable, purpose-driven way to earn online, I invite you to check out my FREE WEBCLASS
 and take the first step towards what’s possible for you!
</p>
<Button button-text="Signup to watch Webclass" @button-clicked="initialMessageRead = true">
</Button>
  </div>
    <div v-if="initialMessageRead" class="w-full max-w-md p-8 bg-white bg-opacity-0 my-4">
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
            <p class="text-lg font-semibold mb-2 font-cardo text-fiona-dark-green">Are we already in touch?</p>
            <div
            @click="toggleDropdown"
            class="w-full px-4 py-2 border rounded-md bg-fiona-light-green font-cardo text-fiona-dark-green cursor-pointer flex justify-between items-center"
            >
            <span>{{ selectedOption || "Select an option" }}</span>
            <!-- Arrow Icon aligned to the right -->
            <span :class="{'transform rotate-180': dropdownOpen}" class="ml-2">
              &#9662; <!-- Down arrow character -->
            </span>
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
        <div @click="toggleTimeDropdown" class="w-full px-4 py-2 border rounded-md bg-fiona-light-green text-fiona-dark-green cursor-pointer flex justify-between items-center">
          {{ selectedTimeOption || "Select an option" }}
          <span :class="{'transform rotate-180': dropdownOpen}">
            &#9662; <!-- This is a down arrow character -->
          </span>
        </div>
        
        <ul v-if="timeDropdownOpen" class="absolute left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10">
          <li
          v-for="option in timeOptions"
          :key="option"
          @click="selectTimeOption(option)"
          class="px-4 py-2 hover:bg-green-100 cursor-pointer font-cardo text-fiona-dark-green"
          >
          {{ option }}
        </li>
      </ul>
    </div>
    
    <Button
    v-if="selectedTimeOption !== ''"
    buttonText="Submit"
    @buttonClicked="submitPressed"
    />
    
    <!-- Show options if user clicks "No, I need more time" -->
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
const initialMessageRead = ref(false)

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
