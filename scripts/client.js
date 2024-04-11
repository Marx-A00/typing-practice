function captureKeypress() {
    document.addEventListener('keypress', function(event) {
        console.log('Key pressed:', event.key);
    });
}
