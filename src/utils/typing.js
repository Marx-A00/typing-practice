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
    
    if (i === currentPosition) {
      // Current character to type should always be highlighted, regardless of past mistakes
      charSpan.classList.add('text-display-highlight');
    } else if (incorrectPositions.includes(i) && i < currentPosition) {
      // Only mark characters as incorrect if they've been typed (passed) already
      charSpan.classList.add('text-display-incorrect');
    } else if (i < currentPosition) {
      // Correctly typed characters
      charSpan.classList.add('text-display-correct');
    }
    
    textContainer.appendChild(charSpan);
  }
  
  return textContainer;
}

// Get a random snippet of text from a list of paragraphs
export function getRandomTextSnippet(paragraphs, maxLength = 150) {
  const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  
  // Get the raw text and trim leading/trailing whitespace
  let rawText = randomParagraph.text.trim();
  
  // If the raw text is already smaller than the max length, just return it
  if (rawText.length <= maxLength) {
    return rawText;
  }
  
  // Get a portion of text up to the max length
  let text = rawText.substring(0, maxLength);
  
  // Find the last complete sentence within our text
  // Look for period, exclamation mark, or question mark followed by a space or end of text
  const sentenceEndRegex = /[.!?](?=\s|$)/g;
  const matches = [...text.matchAll(sentenceEndRegex)];
  
  if (matches.length > 0) {
    // Get the position of the last sentence ending
    const lastSentenceEnd = matches[matches.length - 1].index + 1;  // +1 to include the punctuation
    
    // Ensure we have at least one full sentence
    if (lastSentenceEnd > maxLength * 0.4) {  // Make sure we're not just getting a tiny snippet
      text = text.substring(0, lastSentenceEnd);
    } else {
      // If the sentence is too short, try to find the next sentence ending in the raw text
      const extendedText = rawText.substring(0, maxLength * 1.5);  // Look a bit further
      const extendedMatches = [...extendedText.matchAll(sentenceEndRegex)];
      
      // Find the first sentence ending after our minimum threshold
      for (const match of extendedMatches) {
        if (match.index > maxLength * 0.4 && match.index < maxLength * 1.5) {
          text = extendedText.substring(0, match.index + 1);  // +1 to include the punctuation
          break;
        }
      }
    }
  } else {
    // If no sentence endings found, fall back to ending at a word boundary
    const lastSpaceIndex = text.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
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