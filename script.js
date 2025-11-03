// ---------- script.js ----------

// 1) Find the text box and all keys
const textBox = document.getElementById('textInput');
const keys = Array.from(document.querySelectorAll('.key'));

// 2) State for CapsLock, Shift, and key-holding
let capsOn = false;
let shiftOn = false;
let holdTimer = null;

// 3) Map of characters that change when Shift is held (so we can produce symbols)
const shiftMap = {
  '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^',
  '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
  '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
};

// 4) Utility - test if a string is a single English letter
function isLetter(ch) {
  return /^[a-zA-Z]$/.test(ch);
}

// 5) Highlight/un-highlight shift keys (visual feedback)
function setShiftVisual(on) {
  document.querySelectorAll('[data-key="Shift"]').forEach(k => {
    k.classList.toggle('active', on);
  });
}

// 6) Highlight/un-highlight capslock key if present
function setCapsVisual(on) {
  const caps = document.querySelector('[data-key="CapsLock"]');
  if (caps) caps.classList.toggle('active', on);
}

// 7) Main function to type a character
function typeCharacter(raw) {
  if (raw === 'Backspace') {
    textBox.value = textBox.value.slice(0, -1);
    return;
  }

  if (raw === 'Enter') {
    textBox.value += '\n';
    return;
  }

  if (raw === 'Tab') {
    textBox.value += '\t';
    return;
  }

  if (raw === 'Spacebar') {
    textBox.value += ' ';
    return;
  }

  if (raw === 'CapsLock') {
    capsOn = !capsOn;
    setCapsVisual(capsOn);
    return;
  }

  if (raw === 'Shift') {
    shiftOn = true;
    setShiftVisual(true);
    return;
  }

  // Default: normal key
  let out = raw;

  if (isLetter(raw)) {
    // Uppercase only if one of caps or shift is active (not both)
    const makeUpper = (capsOn && !shiftOn) || (!capsOn && shiftOn);
    out = makeUpper ? raw.toUpperCase() : raw.toLowerCase();
  } else {
    // Non-letter: use symbol if shift is active
    if (shiftOn && shiftMap[raw]) {
      out = shiftMap[raw];
    }
  }

  textBox.value += out;

  // Shift only works for one press
  if (shiftOn) {
    shiftOn = false;
    setShiftVisual(false);
  }
}

// 8) Handle when a key is pressed (clicked)
function handleKeyClick(keyEl) {
  const raw = (keyEl.dataset.key || keyEl.textContent).trim();

  // Type the character
  typeCharacter(raw);

  // If user is holding the mouse, keep typing
  holdTimer = setInterval(() => {
    typeCharacter(raw);
  }, 100);
}

// 9) Stop typing when mouse is released or leaves the key
function stopTyping() {
  clearInterval(holdTimer);
  holdTimer = null;
  // Reset shift visual (if shift was pressed)
  if (shiftOn) {
    shiftOn = false;
    setShiftVisual(false);
  }
}

// 10) Attach event listeners to each key
keys.forEach(key => {
  key.addEventListener('mousedown', () => handleKeyClick(key));
  key.addEventListener('mouseup', stopTyping);
  key.addEventListener('mouseleave', stopTyping);
});

// 11) Optional: glow effect when using real keyboard keys
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const match = keys.find(k => {
    const dk = k.dataset.key;
    if (dk && dk.toLowerCase() === key.toLowerCase()) return true;
    return k.textContent.trim().toLowerCase() === key.toLowerCase();
  });

  if (match) {
    match.classList.add('pressed');
    setTimeout(() => match.classList.remove('pressed'), 120);
  }

  // Prevent default Tab behavior
  if (key === 'Tab') e.preventDefault();
});
