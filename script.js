// script.js
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const keyboardKeys = document.querySelectorAll('.keyboard_key');
    
    // Track modifier keys state
    let isShiftPressed = false;
    let isCapsLock = false;
    
    // Focus on textarea when clicking anywhere on the page except keyboard keys
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('keyboard_key')) {
            textInput.focus();
        }
    });
    
    // Handle keyboard key clicks
    keyboardKeys.forEach(key => {
        key.addEventListener('mousedown', function(e) {
            e.preventDefault();
            // Add active class immediately for visual feedback
            this.classList.add('keyboard_key--active');
            
            // Handle the key press
            handleKeyPress(this);
        });
        
        key.addEventListener('mouseup', function() {
            // Remove active class and add pressed effect
            this.classList.remove('keyboard_key--active');
            this.classList.add('keyboard_key--pressed');
            
            // Remove pressed effect after animation
            setTimeout(() => {
                this.classList.remove('keyboard_key--pressed');
            }, 150);
        });
        
        key.addEventListener('mouseleave', function() {
            // Remove active class if mouse leaves while pressed
            this.classList.remove('keyboard_key--active');
        });
    });
    
    function handleKeyPress(keyElement) {
        const keyboardAction = keyElement.getAttribute('data-keyboard');
        const normalChar = keyElement.getAttribute('data-normal');
        const shiftChar = keyElement.getAttribute('data-shift');
        const startPos = textInput.selectionStart;
        const endPos = textInput.selectionEnd;
        const currentValue = textInput.value;
        
        // Ensure textarea has focus
        textInput.focus();
        
        // Handle special keys
        if (keyboardAction) {
            switch (keyboardAction) {
                case 'Backspace':
                    if (startPos === endPos && startPos > 0) {
                        textInput.value = currentValue.substring(0, startPos - 1) + currentValue.substring(endPos);
                        textInput.selectionStart = textInput.selectionEnd = startPos - 1;
                    } else if (startPos !== endPos) {
                        textInput.value = currentValue.substring(0, startPos) + currentValue.substring(endPos);
                        textInput.selectionStart = textInput.selectionEnd = startPos;
                    }
                    break;
                    
                case 'Tab':
                    insertTextAtCursor('\t');
                    break;
                    
                case 'Enter':
                    insertTextAtCursor('\n');
                    break;
                    
                case 'Spacebar':
                    insertTextAtCursor(' ');
                    break;
                    
                case 'Shift':
                    isShiftPressed = !isShiftPressed;
                    updateShiftKeysVisual();
                    break;
                    
                case 'CapsLock':
                    isCapsLock = !isCapsLock;
                    keyElement.classList.toggle('keyboard_key--pressed', isCapsLock);
                    break;
            }
        } else if (normalChar) {
            // Regular character keys with shift support
            let textToInsert = normalChar;
            
            if (isShiftPressed && shiftChar) {
                textToInsert = shiftChar;
            } else if (isCapsLock && /[a-z]/.test(normalChar)) {
                textToInsert = normalChar.toUpperCase();
            }
            
            insertTextAtCursor(textToInsert);
            
            // Reset shift after single use
            if (isShiftPressed && !isCapsLock) {
                isShiftPressed = false;
                updateShiftKeysVisual();
            }
        }
        
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    function updateShiftKeysVisual() {
        const shiftKeys = document.querySelectorAll('.keyboard_key--shift');
        shiftKeys.forEach(key => {
            key.classList.toggle('keyboard_key--shift-active', isShiftPressed);
        });
    }
    
    function insertTextAtCursor(text) {
        const startPos = textInput.selectionStart;
        const endPos = textInput.selectionEnd;
        const currentValue = textInput.value;
        
        textInput.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);
        textInput.selectionStart = textInput.selectionEnd = startPos + text.length;
    }
});