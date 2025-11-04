// script.js
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const keyboardKeys = document.querySelectorAll('.keyboard_key');
    
    // Focus on textarea when clicking anywhere on the page
    document.addEventListener('click', function() {
        textInput.focus();
    });
    
    // Handle keyboard key clicks
    keyboardKeys.forEach(key => {
        key.addEventListener('mousedown', function(e) {
            e.preventDefault();
            handleKeyPress(this);
            this.classList.add('keyboard_key--active');
        });
        
        key.addEventListener('mouseup', function() {
            this.classList.remove('keyboard_key--active');
            this.classList.add('keyboard_key--pressed');
            setTimeout(() => {
                this.classList.remove('keyboard_key--pressed');
            }, 150);
        });
        
        key.addEventListener('mouseleave', function() {
            this.classList.remove('keyboard_key--active');
        });
        
        // Touch support for mobile devices
        key.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleKeyPress(this);
            this.classList.add('keyboard_key--active');
        });
        
        key.addEventListener('touchend', function() {
            this.classList.remove('keyboard_key--active');
            this.classList.add('keyboard_key--pressed');
            setTimeout(() => {
                this.classList.remove('keyboard_key--pressed');
            }, 150);
        });
    });
    
    function handleKeyPress(keyElement) {
        const keyText = keyElement.textContent;
        const keyboardAction = keyElement.getAttribute('data-keyboard');
        const startPos = textInput.selectionStart;
        const endPos = textInput.selectionEnd;
        const currentValue = textInput.value;
        
        // Handle special keys
        if (keyboardAction) {
            switch (keyboardAction) {
                case 'Backspace':
                    if (startPos === endPos && startPos > 0) {
                        // Delete character before cursor
                        textInput.value = currentValue.substring(0, startPos - 1) + currentValue.substring(endPos);
                        textInput.selectionStart = textInput.selectionEnd = startPos - 1;
                    } else if (startPos !== endPos) {
                        // Delete selected text
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
                case 'CapsLock':
                case 'Ctrl':
                case 'Alt':
                case 'Fn':
                    // These are modifier keys - you can add functionality later
                    console.log(`${keyboardAction} key pressed`);
                    break;
            }
        } else {
            // Regular character keys
            insertTextAtCursor(keyText);
        }
        
        // Trigger input event for any real-time processing
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    function insertTextAtCursor(text) {
        const startPos = textInput.selectionStart;
        const endPos = textInput.selectionEnd;
        const currentValue = textInput.value;
        
        // Replace selected text or insert at cursor position
        textInput.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);
        
        // Move cursor to position after inserted text
        textInput.selectionStart = textInput.selectionEnd = startPos + text.length;
    }
    
    // Optional: Add physical keyboard support that highlights virtual keys
    document.addEventListener('keydown', function(e) {
        // Find and highlight corresponding virtual key
        const virtualKey = findVirtualKey(e);
        if (virtualKey) {
            virtualKey.classList.add('keyboard_key--active');
        }
    });
    
    document.addEventListener('keyup', function(e) {
        // Remove highlight from virtual key
        const virtualKey = findVirtualKey(e);
        if (virtualKey) {
            virtualKey.classList.remove('keyboard_key--active');
            virtualKey.classList.add('keyboard_key--pressed');
            setTimeout(() => {
                virtualKey.classList.remove('keyboard_key--pressed');
            }, 150);
        }
    });
    
    function findVirtualKey(e) {
        const key = e.key;
        const code = e.code;
        
        // Special case for spacebar
        if (key === ' ') {
            return document.querySelector('[data-keyboard="Spacebar"]');
        }
        
        // Look for data-keyboard attribute first
        if (['Tab', 'Enter', 'Backspace', 'Shift', 'Control', 'Alt', 'CapsLock'].includes(key)) {
            return document.querySelector(`[data-keyboard="${key}"]`);
        }
        
        // Look for regular keys by text content
        return Array.from(keyboardKeys).find(k => 
            !k.getAttribute('data-keyboard') && k.textContent === key
        );
    }
    
    // Keep focus on textarea and prevent default behavior for some keys
    textInput.addEventListener('keydown', function(e) {
        if (['Tab', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
});