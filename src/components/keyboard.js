import keyboardSvg from '../assets/keyboard-layout.svg?raw';

// Keyboard layouts
export const QWERTY_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export const DVORAK_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']'],
  ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
  ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-'],
  [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z']
];

// Create keyboard visualization
export function createKeyboard(keyboardDisplay, currentLayout) {
  keyboardDisplay.innerHTML = '';
  
  // Load the SVG keyboard layout directly
  keyboardDisplay.innerHTML = keyboardSvg;
  
  // Add data-key attributes to the keycaps for highlighting
  const keycaps = keyboardDisplay.querySelectorAll('.keycap');
  
  // Map of key positions to characters for QWERTY layout
  const qwertyKeyMap = {
    // Row 1 (number row)
    '82,75.25': 'q', '136,61.75': 'w', '190,55': 'e', '244,61.75': 'r', '298,68.5': 't',
    '352,68.5': 'y', '406,68.5': 'u', '460,68.5': 'i', '514,68.5': 'o', '568,68.5': 'p',
    
    // Row 2 (home row)
    '82,129.25': 'a', '136,115.75': 's', '190,109': 'd', '244,115.75': 'f', '298,122.5': 'g',
    '352,122.5': 'h', '406,122.5': 'j', '460,122.5': 'k', '514,122.5': 'l', '568,122.5': ';', '622,122.5': "'",
    
    // Row 3 (shift row)
    '82,183.25': 'z', '136,169.75': 'x', '190,163': 'c', '244,169.75': 'v', '298,176.5': 'b',
    '352,176.5': 'n', '406,176.5': 'm', '460,176.5': ',', '514,176.5': '.', '568,176.5': '/',
    
    // Space bar
    '406,237.25': ' '
  };
  
  // Map of key positions to characters for DVORAK layout
  const dvorakKeyMap = {
    // Row 1
    '82,75.25': "'", '136,61.75': ',', '190,55': '.', '244,61.75': 'p', '298,68.5': 'y',
    '352,68.5': 'f', '406,68.5': 'g', '460,68.5': 'c', '514,68.5': 'r', '568,68.5': 'l',
    
    // Row 2 (home row)
    '82,129.25': 'a', '136,115.75': 'o', '190,109': 'e', '244,115.75': 'u', '298,122.5': 'i',
    '352,122.5': 'd', '406,122.5': 'h', '460,122.5': 't', '514,122.5': 'n', '568,122.5': 's', '622,122.5': '-',
    
    // Row 3
    '82,183.25': ';', '136,169.75': 'q', '190,163': 'j', '244,169.75': 'k', '298,176.5': 'x',
    '352,176.5': 'b', '406,176.5': 'm', '460,176.5': 'w', '514,176.5': 'v', '568,176.5': 'z',
    
    // Space bar
    '406,237.25': ' '
  };
  
  // Add data-key attributes to keycaps
  keycaps.forEach((keycap, index) => {
    // Get the position of the keycap
    const rect = keycap.querySelector('rect');
    if (rect) {
      const x = rect.getAttribute('x');
      const y = rect.getAttribute('y');
      const position = `${x},${y}`;
      
      // Get the key character based on the current layout
      const keyMap = currentLayout === QWERTY_LAYOUT ? qwertyKeyMap : dvorakKeyMap;
      const key = keyMap[position];
      
      if (key) {
        // Add data-key attribute
        keycap.setAttribute('data-key', key.toLowerCase());
        
        // Add text label to the key
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute('x', parseInt(x) + 26); // Center of key
        textElement.setAttribute('y', parseInt(y) + 30); // Center of key
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('font-size', '14');
        textElement.setAttribute('fill', '#333');
        textElement.setAttribute('class', 'key-label');
        textElement.textContent = key === ' ' ? 'Space' : key;
        
        keycap.appendChild(textElement);
      }
    }
  });

  return document.querySelector('.keycap') !== null;
}

// Fallback keyboard creation method (original implementation)
export function createFallbackKeyboard(keyboardDisplay, currentLayout) {
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

// Highlight the current key on the keyboard
export function highlightKey(key, keyboardElement) {
  if (!key) return;
  
  // Normalize the key to highlight
  const keyToHighlight = key.toLowerCase();
  
  // Check if we're using the SVG keyboard
  const isSvgKeyboard = keyboardElement.querySelector('.keycap') !== null;

  if (isSvgKeyboard) {
    // Remove active class from all keycaps
    const keycaps = keyboardElement.querySelectorAll('.keycap');
    keycaps.forEach(k => {
      k.classList.remove('active');
    });
    
    // Find the keycap with the matching data-key attribute
    const keyElement = keyboardElement.querySelector(`.keycap[data-key="${keyToHighlight}"]`);
    
    if (keyElement) {
      // Add active class for animation and styling
      keyElement.classList.add('active');
      
      // The CSS will handle the color changes via the .active class
    } else {
      console.log(`Key not found in keyboard: ${keyToHighlight}`);
    }
  } else {
    // Original implementation for the fallback keyboard
    // Remove active class from all keys
    const keys = keyboardElement.querySelectorAll('.key');
    keys.forEach(k => k.classList.remove('active'));
    
    let keySelector;
    
    // Special handling for different character types
    if (keyToHighlight === ' ') {
      keySelector = '.key.space-bar';
    } else {
      keySelector = `.key[data-key="${keyToHighlight}"]`;
    }
    
    const keyElement = keyboardElement.querySelector(keySelector);
    
    if (keyElement) {
      keyElement.classList.add('active');
    } else {
      console.log(`Key not found in keyboard: ${keyToHighlight}`);
    }
  }
} 