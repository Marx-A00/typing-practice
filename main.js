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

// DOM elements
const textDisplay = document.getElementById('text-display');
const keyboardDisplay = document.getElementById('keyboard-display');
const resetBtn = document.getElementById('reset-btn');
const dvorakToggle = document.getElementById('dvorak-toggle');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

// State variables
let currentLayout = QWERTY_LAYOUT;
let startTime = null;
let currentText = '';
let currentPosition = 0;
let mistakes = 0;
let isTyping = false;

// Initialize the application
function init() {
  generateNewText();
  createKeyboard();
  setupEventListeners();
}

// Generate new text for typing practice
function generateNewText() {
  // Get a random paragraph from the imported paragraphs
  const paragraphs = [
    par1, par2, par3, par4, par5, par6, par7, par8, par9, par10,
    par11, par12, par13, par14, par15, par16, par17, par18, par19, par20,
    par21, par22, par23, par24, par25, par26, par27, par28, par29, par30,
    par31, par32, par33, par34, par35, par36, par37, par38, par39, par40,
    par41, par42, par43, par44, par45, par46, par47, par48, par49, par50
  ];
  
  const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  
  // Get the raw text and trim leading/trailing whitespace
  let rawText = randomParagraph.text.trim();
  
  // Limit text length to ensure it fits on screen without scrolling
  // Get only first 100 characters (or fewer if the paragraph is shorter)
  const maxLength = 100;
  currentText = rawText.substring(0, maxLength);
  
  // Make sure we're not cutting off in the middle of a word
  if (currentText.length === maxLength && rawText.length > maxLength) {
    const lastSpaceIndex = currentText.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) { // Only trim if we're not losing too much text
      currentText = currentText.substring(0, lastSpaceIndex);
    }
  }
  
  // Reset state
  currentPosition = 0;
  startTime = null;
  mistakes = 0;
  isTyping = false;
  
  // Display the text
  displayText();
  updateStats();
}

// Display the text with appropriate highlighting
function displayText() {
  textDisplay.innerHTML = '';
  
  // Create a container to hold all the characters
  const textContainer = document.createElement('div');
  textContainer.className = 'text-container';
  
  // Set the data-key attribute for the first character
  if (currentText.length > 0) {
    const firstChar = currentText[currentPosition] || '';
    textDisplay.setAttribute('data-key', firstChar.toLowerCase());
  } else {
    textDisplay.setAttribute('data-key', '');
  }
  
  for (let i = 0; i < currentText.length; i++) {
    const charSpan = document.createElement('span');
    // Make spaces visible with a special character or styling
    if (currentText[i] === ' ') {
      charSpan.textContent = '␣'; // Unicode symbol for space
      charSpan.classList.add('space-char');
    } else {
      charSpan.textContent = currentText[i];
    }
    
    if (i < currentPosition) {
      // Already typed characters
      charSpan.classList.add('text-display-correct');
    } else if (i === currentPosition) {
      // Current character to type
      charSpan.classList.add('text-display-highlight');
    }
    
    textContainer.appendChild(charSpan);
  }
  
  textDisplay.appendChild(textContainer);
  
  // Highlight the current key on the keyboard
  if (currentPosition < currentText.length) {
    highlightKey(currentText[currentPosition]);
  }
}

// Create keyboard visualization
function createKeyboard() {
  keyboardDisplay.innerHTML = '';
  
  // Only show the most relevant keys to save space
  const compactLayout = currentLayout.map(row => {
    // Filter out special characters that are less commonly used for typing practice
    return row.filter(key => {
      // Keep letters, numbers, space, and common punctuation
      return /^[a-z0-9,\.;'\s]$/i.test(key);
    });
  });
  
  // Create regular keys
  compactLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(key => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key';
      keyDiv.textContent = key;
      keyDiv.setAttribute('data-key', key.toLowerCase());
      rowDiv.appendChild(keyDiv);
    });
    keyboardDisplay.appendChild(rowDiv);
  });
  
  // Add space bar row
  const spaceBarRow = document.createElement('div');
  spaceBarRow.className = 'keyboard-row';
  
  const spaceBar = document.createElement('div');
  spaceBar.className = 'key space-bar';
  spaceBar.textContent = 'Space';
  spaceBar.setAttribute('data-key', ' ');
  
  spaceBarRow.appendChild(spaceBar);
  keyboardDisplay.appendChild(spaceBarRow);
}

// Setup event listeners
function setupEventListeners() {
  document.addEventListener('keydown', handleKeyPress);
  resetBtn.addEventListener('click', generateNewText);
  dvorakToggle.addEventListener('change', handleLayoutChange);
}

// Handle key press
function handleKeyPress(e) {
  // Always prevent default for all key presses to avoid scrolling
  e.preventDefault();
  
  // Ignore modifier keys or if we don't have any text to type
  if (e.ctrlKey || e.altKey || e.metaKey || !currentText) return;
  
  // Start timing on first keypress
  if (!isTyping) {
    isTyping = true;
    startTime = new Date();
  }
  
  // Skip if we've reached the end of the text
  if (currentPosition >= currentText.length) return;
  
  const expectedKey = currentText[currentPosition].toLowerCase();
  let pressedKey = e.key.toLowerCase();
  
  // Handle space key and other special keys
  if (e.code === 'Space' || pressedKey === ' ' || pressedKey === 'space') {
    pressedKey = ' ';
  }
  
  // Check if the pressed key matches the expected key
  if (pressedKey === expectedKey) {
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
    
    // Mark the current character as incorrect
    const spans = textDisplay.querySelectorAll('span');
    if (spans.length > currentPosition) {
      spans[currentPosition].classList.remove('text-display-highlight');
      spans[currentPosition].classList.add('text-display-incorrect');
    }
  }
  
  // Update display
  displayText();
  updateStats();
}

// Handle keyboard layout change
function handleLayoutChange(e) {
  currentLayout = e.target.checked ? DVORAK_LAYOUT : QWERTY_LAYOUT;
  createKeyboard();
  highlightKey(currentText[currentPosition]);
}

// Highlight the current key on the keyboard
function highlightKey(key) {
  if (!key) return;
  
  // Remove active class from all keys
  const keys = document.querySelectorAll('.key');
  keys.forEach(k => k.classList.remove('active'));
  
  // Normalize the key to highlight
  const keyToHighlight = key.toLowerCase();
  
  let keySelector;
  
  // Special handling for different character types
  if (keyToHighlight === ' ') {
    keySelector = '.key.space-bar';
  } else {
    keySelector = `.key[data-key="${keyToHighlight}"]`;
  }
  
  const keyElement = document.querySelector(keySelector);
  
  if (keyElement) {
    keyElement.classList.add('active');
  } else {
    console.log(`Key not found in keyboard: ${keyToHighlight}`);
  }
}

// Calculate WPM and accuracy
function updateStats() {
  if (!startTime || !isTyping) {
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 100%';
    return;
  }
  
  const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
  const wordsTyped = currentPosition / 5; // assume average word length of 5
  const wpm = Math.round(wordsTyped / timeElapsed) || 0;
  
  const totalKeystrokes = currentPosition + mistakes;
  const accuracy = totalKeystrokes > 0 
    ? Math.max(0, Math.round(100 - (mistakes / totalKeystrokes * 100)))
    : 100;
  
  wpmDisplay.textContent = `WPM: ${wpm}`;
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

// Handle completion of typing
function finishTyping() {
  isTyping = false;
  
  // Calculate final stats
  updateStats();
  
  // Show completion message in the text display instead of an alert
  textDisplay.innerHTML = `<div class="completion-message">
    <p>Good job! You've completed the text.</p>
    <p>${wpmDisplay.textContent}, ${accuracyDisplay.textContent}</p>
    <p>Press the Reset button or any key to continue.</p>
  </div>`;
  
  // Add an event listener for the next keypress to reset
  document.addEventListener('keydown', resetAfterCompletion, { once: true });
}

// Reset after completion
function resetAfterCompletion(e) {
  e.preventDefault();
  generateNewText();
}

// Initialize the application
init();
