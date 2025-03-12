import "./style.css";

// import { 
//   QWERTY_LAYOUT, 
//   DVORAK_LAYOUT, 
//   createKeyboard, 
//   highlightKey 
// } from './components/keyboard.js';

import {
  calculateStats,
  prepareTextForDisplay,
  getRandomTextSnippet,
  createCompletionMessage
} from './utils/typing.js';

import {
  par1, par2, par3, 
  par4, par5, par6, par7, par8, par9, par10,
  par11, par12, par13, par14, par15, par16, par17, par18, par19, par20,
  par21, par22, par23, par24, par25, par26, par27, par28, par29, par30,
  par31, par32, par33, par34, par35, par36, par37, par38, par39, par40,
  par41, par42, par43, par44, par45, par46, par47, par48, par49, par50
} from './paragraphs.js';

// DOM elements
const textDisplay = document.getElementById('text-display');
// const keyboardDisplay = document.getElementById('keyboard-display');
const resetBtn = document.getElementById('reset-btn');
const dvorakToggle = document.getElementById('dvorak-toggle');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const textSizeSelect = document.getElementById('text-size');

// State variables
// let currentLayout = QWERTY_LAYOUT;
let startTime = null;
let currentText = '';
let currentPosition = 0;
let mistakes = 0;
let isTyping = false;
let incorrectPositions = []; // Track positions of incorrectly typed characters

// Initialize the application
function init() {
  // const keyboardCreated = createKeyboard(keyboardDisplay, currentLayout);
  
  // Wait for next tick to ensure keyboard is in DOM
  setTimeout(() => {
    // Remove the check for keyboard elements since they won't exist
    generateNewText();
    setupEventListeners();
    loadSettings();
  }, 0);
}

// Generate new text for typing practice
function generateNewText() {
  // Get all paragraphs
  const paragraphs = [
    par1, par2, par3, par4, par5, par6, par7, par8, par9, par10,
    par11, par12, par13, par14, par15, par16, par17, par18, par19, par20,
    par21, par22, par23, par24, par25, par26, par27, par28, par29, par30,
    par31, par32, par33, par34, par35, par36, par37, par38, par39, par40,
    par41, par42, par43, par44, par45, par46, par47, par48, par49, par50
  ];
  
  currentText = getRandomTextSnippet(paragraphs);
  
  // Reset state
  currentPosition = 0;
  startTime = null;
  mistakes = 0;
  isTyping = false;
  incorrectPositions = []; // Reset incorrect positions array
  
  // Display the text
  displayText();
  updateStats();
}

// Display the text with appropriate highlighting
function displayText() {
  textDisplay.innerHTML = '';
  
  // Create a container with highlighted text
  const textContainer = prepareTextForDisplay(currentText, currentPosition, incorrectPositions);
  
  // Set the data-key attribute for the first character
  if (currentText.length > 0) {
    const firstChar = currentText[currentPosition] || '';
    textDisplay.setAttribute('data-key', firstChar.toLowerCase());
  } else {
    textDisplay.setAttribute('data-key', '');
  }
  
  textDisplay.appendChild(textContainer);
  
  // Comment out or remove keyboard highlighting
  // if (currentPosition < currentText.length) {
  //   highlightKey(currentText[currentPosition], keyboardDisplay);
  // }
}

// Setup event listeners
function setupEventListeners() {
  document.addEventListener('keydown', handleKeyPress);
  resetBtn.addEventListener('click', generateNewText);
  dvorakToggle.addEventListener('change', handleLayoutChange);
  darkModeToggle.addEventListener('change', handleDarkModeChange);
  textSizeSelect.addEventListener('change', handleTextSizeChange);
}

// Handle key press
function handleKeyPress(e) {
  // Always prevent default for all key presses to avoid scrolling
  e.preventDefault();
  
  // Ignore all modifier keys alone - they shouldn't count as mistakes
  if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || 
      e.key === 'CapsLock' || e.key === 'Tab' || e.key === 'Escape') {
    return;
  }
  
  // Ignore other combinations with modifier keys or if we don't have any text to type
  if ((e.ctrlKey || e.altKey || e.metaKey) || !currentText) return;
  
  // Start timing on first keypress
  if (!isTyping) {
    isTyping = true;
    startTime = new Date();
  }
  
  // Skip if we've reached the end of the text
  if (currentPosition >= currentText.length) return;
  
  // Get the expected character in its original case
  const expectedChar = currentText[currentPosition];
  let pressedKey = e.key;
  
  console.log('pressedKey: ', pressedKey);
  console.log('expectedChar: ', expectedChar);
  
  // Handle space key and other special keys
  if (e.code === 'Space' || pressedKey === ' ' || pressedKey === 'space') {
    pressedKey = ' ';
  }
  
  // Check if the pressed key matches the expected character (case sensitive)
  if (pressedKey === expectedChar) {
    // Correct key press
    currentPosition++;
    
    // Check if typing is complete
    if (currentPosition >= currentText.length) {
      finishTyping();
      return;
    }
  } else {
    // Incorrect key press
    mistakes++;
    
    // Record the position of the incorrect character
    if (!incorrectPositions.includes(currentPosition)) {
      incorrectPositions.push(currentPosition);
    }
    
    console.log('mistakes: ', mistakes);
  }
  
  // Update display
  displayText();
  updateStats();
  
  // Comment out or remove keyboard highlighting
  // if (currentPosition < currentText.length) {
  //   highlightKey(currentText[currentPosition], keyboardDisplay);
  // }
}

// Handle keyboard layout change
function handleLayoutChange(e) {
  if (e.target.checked) {
    // currentLayout = DVORAK_LAYOUT;
    localStorage.setItem('keyboardLayout', 'dvorak');
  } else {
    // currentLayout = QWERTY_LAYOUT;
    localStorage.setItem('keyboardLayout', 'qwerty');
  }
  // createKeyboard(keyboardDisplay, currentLayout);
}

// Calculate WPM and accuracy
function updateStats() {
  const { wpm, accuracy } = calculateStats(currentPosition, mistakes, startTime, isTyping);
  wpmDisplay.textContent = `WPM: ${wpm}`;
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

// Handle completion of typing
function finishTyping() {
  isTyping = false;
  
  // Calculate final stats
  updateStats();
  
  // Show completion message in the text display
  const { wpm, accuracy } = calculateStats(currentPosition, mistakes, startTime, true);
  textDisplay.innerHTML = '';
  textDisplay.appendChild(createCompletionMessage(wpm, accuracy));
  
  // Add an event listener for the next keypress to reset
  document.addEventListener('keydown', resetAfterCompletion, { once: true });
}

// Reset after completion
function resetAfterCompletion(e) {
  e.preventDefault();
  generateNewText();
}

// Handle dark mode toggle
function handleDarkModeChange(e) {
  if (e.target.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Handle text size change
function handleTextSizeChange(e) {
  const size = e.target.value;
  textDisplay.className = 'text-display';
  textDisplay.classList.add(`text-size-${size}`);
  localStorage.setItem('textSize', size);
}

// Load saved settings
function loadSettings() {
  // Load dark mode setting
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
  }
  
  // Load text size setting
  const textSize = localStorage.getItem('textSize');
  if (textSize) {
    textSizeSelect.value = textSize;
    textDisplay.classList.add(`text-size-${textSize}`);
  }
  
  // Load keyboard layout setting
  // const layout = localStorage.getItem('keyboardLayout');
  // if (layout === 'dvorak') {
  //   dvorakToggle.checked = true;
  //   currentLayout = DVORAK_LAYOUT;
  //   createKeyboard(keyboardDisplay, currentLayout);
  // }
}

// Initialize the application
init(); 