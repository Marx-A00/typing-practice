// Calculate WPM and accuracy
export function calculateStats(currentPosition, mistakes, startTime, isTyping) {
  if (!startTime || !isTyping) {
    return { wpm: 0, accuracy: 100 };
  }
  
  const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
  const wordsTyped = currentPosition / 5; // assume average word length of 5
  const wpm = Math.round(wordsTyped / timeElapsed) || 0;
  
  const totalKeystrokes = currentPosition + mistakes;
  const accuracy = totalKeystrokes > 0 
    ? Math.max(0, Math.round(100 - (mistakes / totalKeystrokes * 100)))
    : 100;
  
  return { wpm, accuracy };
}

// Process text for display
export function prepareTextForDisplay(text, currentPosition, incorrectPositions) {
  const textContainer = document.createElement('div');
  textContainer.className = 'text-container';
  
  for (let i = 0; i < text.length; i++) {
    const charSpan = document.createElement('span');
    // Make spaces visible with a special character or styling
    if (text[i] === ' ') {
      charSpan.textContent = '␣'; // Unicode symbol for space
      charSpan.classList.add('space-char');
    } else {
      charSpan.textContent = text[i];
    }
    
    if (incorrectPositions.includes(i)) {
      // Character was typed incorrectly at some point
      charSpan.classList.add('text-display-incorrect');
    } else if (i < currentPosition) {
      // Correctly typed characters
      charSpan.classList.add('text-display-correct');
    } else if (i === currentPosition) {
      // Current character to type
      charSpan.classList.add('text-display-highlight');
    }
    
    textContainer.appendChild(charSpan);
  }
  
  return textContainer;
}

// Get a random snippet of text from a list of paragraphs
export function getRandomTextSnippet(paragraphs, maxLength = 100) {
  const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  
  // Get the raw text and trim leading/trailing whitespace
  let rawText = randomParagraph.text.trim();
  
  // Limit text length to ensure it fits on screen without scrolling
  // Get only first 100 characters (or fewer if the paragraph is shorter)
  let text = rawText.substring(0, maxLength);
  
  // Make sure we're not cutting off in the middle of a word
  if (text.length === maxLength && rawText.length > maxLength) {
    const lastSpaceIndex = text.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) { // Only trim if we're not losing too much text
      text = text.substring(0, lastSpaceIndex);
    }
  }
  
  return text;
}

// Create completion message element
export function createCompletionMessage(wpm, accuracy) {
  const completionDiv = document.createElement('div');
  completionDiv.className = 'completion-message';
  
  completionDiv.innerHTML = `
    <p>Good job! You've completed the text.</p>
    <p>WPM: ${wpm}, Accuracy: ${accuracy}%</p>
    <p>Press the Reset button or any key to continue.</p>
  `;
  
  return completionDiv;
} 