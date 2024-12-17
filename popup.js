// Update the color result and display a color box
function updateColorDisplay (color, textColor) {
  const colorhex = rgbToHex(color)
  const textcolorhex = rgbToHex(textColor)
  const colorbox = document.getElementById('color-display')
  const textcolorbox = document.getElementById('textcolor-display')
  console.log('hex: ' + colorhex)
  console.log('text hex: ' + textcolorhex)
  document.getElementById('color-result').textContent = `Color: ${colorhex}`
  document.getElementById(
    'text-color-result'
  ).textContent = `Text Color: ${textcolorhex}`
  colorbox.style.backgroundColor = colorhex
  textcolorbox.style.backgroundColor = textcolorhex
}

// Convert RGB to HEX
function rgbToHex (rgb) {
  // Extract RGB values as an array
  const match = rgb.match(/\d+/g)
  if (!match || match.length < 3) return null

  const [r, g, b] = match.map(Number)
  // HEX conversion
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// Listen for 'pick color' button to be clicked
document.getElementById('pick').addEventListener('click', () => {
  console.log('Popup button clicked!')
  browser.runtime.sendMessage({ type: 'ACTIVATE_COLOR_PICKER' })
})

// Listen for a response from the background or content script
browser.runtime.onMessage.addListener(message => {
  if (message.type === 'COLOR_PICKED') {
    console.log('Colors received:', message.color, message.textColor)
  }
})

// Fetch the last picked color when the popup opens
browser.storage.local
  .get(['pickedColor', 'textColor'])
  .then(data => {
    const color = data.pickedColor || 'rgb(0, 0, 0)'
    const textColor = data.textColor || 'rgb(255, 255, 255)'

    console.log('Fetched colors from storage:', color, textColor)
    updateColorDisplay(color, textColor)
  })
  .catch(error => console.error('Error fetching color:', error))
