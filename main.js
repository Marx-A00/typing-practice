import "./style.css";

/**
 * What im thinking is that first I will need to write a function 
 * that prepares the text for the display:
 * - spans and shit 
 * - Underline the first letter
 * - gray out the rest of the text
 * -  add dots for the spaces 
 */

// Get the text element
let textElement = document.querySelector("#text");

// Split the text into an array of characters
let characters = textElement.textContent.split('');

// Wrap each character in a span
characters = characters.map(char => `<span>${char}</span>`);

// Update the text element with the new HTML
textElement.innerHTML = characters.join('');
let spans = Array.from(textElement.querySelectorAll('span'));
spans[7].classList.add('currentLetter');
let index = 7;


// Add an event listener for keypress events

document.addEventListener('keypress', function(event) {
  // Get the key that was pressed
  let key = event.key;

  if (key === spans[index].innerText) {
    console.log("correct");
    index++;
    spans[index-1].classList.remove('currentLetter');
    spans[index].classList.add('currentLetter');

  }
  else{
    console.log("incorrect");
  }

  // Find the span elements that contain the pressed key

  // let spans = Array.from(textElement.querySelectorAll('span')).filter(span => span.textContent === key);

  // Add a class to the spans
  // spans.forEach(span => span.classList.add('typedCorrectly'));
});

