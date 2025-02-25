import "./style.css";

import {
  par1, par2, par3, 
  par4, par5, par6, par7, par8, par9, par10,
  par11, par12, par13, par14, par15, par16, par17, par18, par19, par20,
  par21, par22, par23, par24, par25, par26, par27, par28, par29, par30,
  par31, par32, par33, par34, par35, par36, par37, par38, par39, par40,
  par41, par42, par43, par44, par45, par46, par47, par48, par49, par50
} from './paragraphs.js'


// Keyboard layouts
const QWERTY_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

const DVORAK_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']'],
  ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
  ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-'],
  [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z']
];

// Sample text for typing practice
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow."
];

// DOM elements
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const keyboardDisplay = document.getElementById('keyboard-display');
const resetBtn = document.getElementById('reset-btn');
const dvorakToggle = document.getElementById('dvorak-toggle');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

let currentLayout = QWERTY_LAYOUT;
let startTime = null;
let currentText = '';
let mistakes = 0;

// Initialize the application
function init() {
  generateNewText();
  createKeyboard();
  setupEventListeners();
}

// Generate new text for typing practice
function generateNewText() {
  currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  textDisplay.textContent = currentText;
  typingInput.value = '';
  startTime = null;
  mistakes = 0;
  updateStats();
}

// Create keyboard visualization
function createKeyboard() {
  keyboardDisplay.innerHTML = '';
  currentLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(key => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key';
      keyDiv.textContent = key;
      rowDiv.appendChild(keyDiv);
    });
    keyboardDisplay.appendChild(rowDiv);
  });
}

// Setup event listeners
function setupEventListeners() {
  typingInput.addEventListener('input', handleTyping);
  resetBtn.addEventListener('click', generateNewText);
  dvorakToggle.addEventListener('change', handleLayoutChange);
}

// Handle typing input
function handleTyping(e) {
  if (!startTime) startTime = new Date();
  
  const inputText = e.target.value;
  const targetText = currentText.substring(0, inputText.length);
  
  if (inputText !== targetText) {
    mistakes++;
    typingInput.classList.add('error');
  } else {
    typingInput.classList.remove('error');
  }
  
  // Highlight current key on keyboard
  const currentKey = currentText[inputText.length - 1];
  highlightKey(currentKey);
  
  // Check if typing is complete
  if (inputText.length === currentText.length) {
    finishTyping();
  }
  
  updateStats();
}

// Handle keyboard layout change
function handleLayoutChange(e) {
  currentLayout = e.target.checked ? DVORAK_LAYOUT : QWERTY_LAYOUT;
  createKeyboard();
}

// Highlight the current key on the keyboard
function highlightKey(key) {
  const keys = document.querySelectorAll('.key');
  keys.forEach(k => k.classList.remove('active'));
  
  if (key) {
    const keyElement = Array.from(keys).find(k => k.textContent.toLowerCase() === key.toLowerCase());
    if (keyElement) keyElement.classList.add('active');
  }
}

// Calculate WPM and accuracy
function updateStats() {
  if (!startTime) {
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 100%';
    return;
  }
  
  const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
  const wordsTyped = typingInput.value.length / 5; // assume average word length of 5
  const wpm = Math.round(wordsTyped / timeElapsed);
  
  const accuracy = Math.max(0, Math.round(100 - (mistakes / currentText.length * 100)));
  
  wpmDisplay.textContent = `WPM: ${wpm}`;
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

// Handle completion of typing
function finishTyping() {
  setTimeout(() => {
    alert(`Completed! WPM: ${wpmDisplay.textContent}, ${accuracyDisplay.textContent}`);
    generateNewText();
  }, 100);
}

// Initialize the application
init();
