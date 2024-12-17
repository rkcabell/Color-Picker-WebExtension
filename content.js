// Content script to pick a color from the webpage

// Change the cursor to a crosshair
document.body.style.cursor = 'crosshair'
// document.body.style.pointerEvents = 'none'

console.log('Color picker activated. Click on any element to pick its color.')

function pickColor (event) {
  // Prevent the default behavior
  event.preventDefault()
  event.stopPropagation()

  // Get the background color of the clicked element
  const element = event.target
  const computedStyle = window.getComputedStyle(element)
  const color = computedStyle.backgroundColor || 'none'
  const textColor = computedStyle.color || 'none'

  console.log('Picked element:', element)
  console.log('Background color:', color)
  console.log('Text color:', textColor)

  // Send the color back to the background script
  browser.runtime
    .sendMessage({ type: 'COLOR_PICKED', color: color, textColor: textColor })
    .then(() => console.log('Colors sent to background script'))
    .catch(error => console.error('Error sending message:', error))

  // Reset the cursor to default
  document.body.style.cursor = 'default'
  // document.body.style.pointerEvents = 'auto'

  // Remove the event listener to stop picking
  document.removeEventListener('click', pickColor, { capture: true })
}

// click listener
document.addEventListener('click', pickColor, { capture: true })
