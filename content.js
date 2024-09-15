// Function to highlight the word under the mouse pointer
function highlightWord(e) {
    // Remove any previous highlights
    removeHighlight();

    const range = document.caretRangeFromPoint(e.clientX, e.clientY);

    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = range.startContainer;
        const offset = range.startOffset;
        const text = textNode.textContent;

        // Identify the start and end of the word under the cursor
        const start = text.slice(0, offset).search(/\S+$/);
        const end = text.slice(offset).search(/\s/);

        if (start !== -1) {
            const wordStart = start;
            const wordEnd = end === -1 ? text.length : offset + end;

            const wordRange = document.createRange();
            wordRange.setStart(textNode, wordStart);
            wordRange.setEnd(textNode, wordEnd);

            // Create a span element to wrap the highlighted word
            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'highlight'; // Use a class instead of inline styles
            wordRange.surroundContents(highlightSpan);
        }
    }
}

// Function to remove the highlight
function removeHighlight() {
    const highlightedElements = document.querySelectorAll('span.highlight');
    highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
        parent.normalize(); // Merge adjacent text nodes
    });
}

// Event listener to handle mouse movement and apply highlighting
document.addEventListener('mousemove', highlightWord);

// Handle theme change
function updateHighlightColor() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const highlightColor = isDarkMode ? 'rgba(255, 255, 0, 0.7)' : 'yellow'; // Adjust color for dark mode

    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            position: relative;
            background-color: ${highlightColor} !important;
            display: inline;
            transform: scale(1.2); /* Zoom in effect */
            transform-origin: center; /* Center the zoom */
        }
    `;
    document.head.appendChild(style);
}

// Update highlight color on load and theme change
updateHighlightColor();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateHighlightColor);
