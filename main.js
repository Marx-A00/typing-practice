import "./style.css";

import {
  par1, par2, par3, 
  par4, par5, par6, par7, par8, par9, par10,
  par11, par12, par13, par14, par15, par16, par17, par18, par19, par20,
  par21, par22, par23, par24, par25, par26, par27, par28, par29, par30,
  par31, par32, par33, par34, par35, par36, par37, par38, par39, par40,
  par41, par42, par43, par44, par45, par46, par47, par48, par49, par50
} from './paragraphs.js'

/**
 * What im thinking is that first I will need to write a function 
 * that prepares the text for the display:
 * - spans and shit 
 * - Underline the first letter
 * - gray out the rest of the text
 * -  add dots for the spaces 
 */
console.log(par1.text);

function onStart(){
    // call prepare paragraph function with randomly chosen paragraph
    prepareParagraph(par1);
    
    let textElement = document.querySelector("#text");
    let index = 5;
    let spans = Array.from(textElement.querySelectorAll('span'));
    console.log("spans:",spans);
    document.addEventListener('keypress', function(event) {
	let key = event.key;
	if (index < spans.length && key === spans[index].innerText) {
            console.log("correct");
            spans[index].classList.remove('currentLetter');
            index++; // Increment index only if it's correct
            if (index < spans.length) {
		spans[index].classList.add('currentLetter');
            }
	} else {
            console.log("incorrect");
	}
    });

    // document.addEventListener('keypress', function(event) {
    // 	// Get the key that was pressed
    // 	let key = event.key;
	
    // 	if (key === spans[index].innerText) {
    // 	    console.log("correct");
    // 	    index++;
    // 	    spans[index - 1].classList.remove('currentLetter');
    // 	    spans[index].classList.add('currentLetter');
	    
    // 	}
    // 	else {
    // 	    console.log("incorrect");
    // 	}
	
    // })
    
}
			     

function prepareParagraph(paragraph){
    let text = paragraph.text;
    
    let textElement = document.querySelector("#text");

    textElement.innerHTML += text;

    // Split the text into an array of characters
    let characters = textElement.textContent.split('');

// Wrap each character in a span
    characters = characters.map(char => `<span>${char}</span>`);

// Update the text element with the new HTML
    textElement.innerHTML = characters.join('');
    let spans = Array.from(textElement.querySelectorAll('span'));
    spans[5].classList.add('currentLetter');

}

// // Get the text element
// let textElement = document.querySelector("#text");

// // Split the text into an array of characters
// let characters = textElement.textContent.split('');

// // Wrap each character in a span
// characters = characters.map(char => `<span>${char}</span>`);

// // Update the text element with the new HTML
// textElement.innerHTML = characters.join('');
// let spans = Array.from(textElement.querySelectorAll('span'));
// spans[7].classList.add('currentLetter');



// Add an event listener for keypress events

// document.addEventListener('keypress', function(event) {
//   // Get the key that was pressed
//   let key = event.key;

//   if (key === spans[index].innerText) {
//     console.log("correct");
//     index++;
//     spans[index-1].classList.remove('currentLetter');
//     spans[index].classList.add('currentLetter');

//   }
//   else{
//     console.log("incorrect");
//   }


  // Find the span elements that contain the pressed key

  // let spans = Array.from(textElement.querySelectorAll('span')).filter(span => span.textContent === key);

  // Add a class to the spans
  // spans.forEach(span => span.classList.add('typedCorrectly'));
//});






// solution if hardcoding [5] doesn't work anymore

// document.addEventListener('DOMContentLoaded', function() {
//     let textElement = document.querySelector('#yourTextElementId');
//     let spans = Array.from(textElement.querySelectorAll('span'));
//     let firstNonEmptySpan = findFirstNonEmptySpan(spans);

//     if (firstNonEmptySpan) {
//         firstNonEmptySpan.classList.add('currentLetter');
//     }
// });
onStart();
