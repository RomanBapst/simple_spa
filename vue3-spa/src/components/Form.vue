<template>
  <div class="form-container">
    <form v-if="!submitted" @submit.prevent="submitForm" class="form">
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

// Computed property to check if the form is valid (all fields filled)
const isFormValid = computed(() => {
  return (
    name.value.trim() !== "" &&
    surname.value.trim() !== "" &&
    instagram.value.trim() !== "" &&
    inTouchOption.value !== ""
  );
});

// Handle button clicks
const handleRedirect = async (): Promise<void> => {
  window.location.href = "https://www.google.com";
};

const handleShowTimeOptions = async (): Promise<void> => {
  showTimeOptions.value = true;
  questionAsked.value = true;
  errorMessage.value = null; // Clear error message if handle exists
};

const setTimeOption = (option: string): void => {
  selectedTimeOption.value = option;
  submitted.value = true; // Hide the form and show final message
  showTimeOptions.value = false;
};

const setInTouchOption = (option: string): void => {
  inTouchOption.value = option;
};
</script>

<style scoped>
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
