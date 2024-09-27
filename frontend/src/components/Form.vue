<template>
  <div class="form-container">
    <form v-if="!submitted" class="form">
      <div class="form-group">
        <label for="name">First Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          placeholder="Enter your first name"
          required
        />
      </div>

      <div class="form-group">
        <label for="surname">Surname:</label>
        <input
          type="text"
          id="surname"
          v-model="surname"
          placeholder="Enter your surname"
          required
        />
      </div>

      <div class="form-group">
        <label for="instagram">Instagram Handle:</label>
        <input
          type="text"
          id="instagram"
          v-model="instagram"
          placeholder="Enter your Instagram handle"
          required
        />
      </div>

      <div>
        <p>Are we already in touch?</p>
        <div
          v-for="option in inTouchOptions"
          :key="option"
          class="option-container"
        >
          <div
            class="circle"
            :class="{ filled: inTouchOption === option }"
            @click="setInTouchOption(option)"
          ></div>
          <button
            type="button"
            class="option-button"
            @click="setInTouchOption(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Two buttons: one for redirecting, one for showing options -->
      <div v-if="!questionAsked">
        <p>Are you ready to watch the 27 minutes Webclass now?</p>
        <button
          type="button"
          class="action-button"
          @click="handleRedirect"
          :disabled="!isFormValid"
        >
          Yes, I am ready now!
        </button>
        <button
          type="button"
          class="action-button"
          @click="handleShowTimeOptions"
          :disabled="!isFormValid"
        >
          No, I need more time
        </button>
      </div>

      <!-- Show options if user clicks "No, I need more time" -->
      <div v-if="showTimeOptions">
        <p>When will you prioritise the time to watch the Webclass?</p>
        <div v-for="option in timeOptions" :key="option" class="option-container">
          <div
            class="circle"
            :class="{ filled: selectedTimeOption === option }"
            @click="setTimeOption(option)"
          ></div>
          <button
            type="button"
            class="option-button"
            @click="setTimeOption(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- Show spinner while loading -->
      <div v-if="loading" class="spinner">
        <div class="loader"></div>
      </div>

    <!-- Final message shown after an option is selected -->
    <div v-if="submitted" class="final-message">
      <p>
        Once you are ready to watch the webclass, please use this link again and submit
        your data.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";

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
  return new Date().toISOString(); // Use ISO string format for timestamp
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

const setInTouchOption = (option: string): void => {
  inTouchOption.value = option;
};

const handleSubmit = async () : Promise<void> => {

    return axios.post("http://localhost:" + import.meta.env.VITE_BACKEND_PORT + "/api/submit-data", {
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

<style scoped>


.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.loader {
  border: 8px solid #f3f3f3; /* Light gray */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


/* Styling the form container */
.form-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

/* Styling the form groups */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* Styling buttons */
.action-button,
.option-button {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  text-align: center;
}

.action-button:disabled,
.option-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled),
.option-button:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Error message styling */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 15px;
}

/* Option container */
.option-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

/* Circle for option selection */
.circle {
  width: 20px;
  height: 20px;
  border: 2px solid #007bff;
  border-radius: 50%;
  margin-right: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.filled {
  background-color: #007bff;
}

/* Final message styling */
.final-message {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #333;
}
</style>
