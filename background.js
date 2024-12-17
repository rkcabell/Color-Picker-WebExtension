// Background service worker for Firefox

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTIVATE_COLOR_PICKER') {
    console.log('Pick button selected...')
    browser.tabs
      .executeScript({ file: 'content.js' })
      .then(() => {
        console.log('Content script injected successfully')
        sendResponse({ status: 'Content script injected' })
      })
      .catch(error => {
        console.error('Error injecting content script:', error)
        sendResponse({ status: 'Error', message: error.message })
      })
    return true
  }

  if (message.type === 'COLOR_PICKED') {
    console.log('Background color picked:', message.color)
    console.log('Text color picked:', message.textColor)

    browser.storage.local
      .set({
        pickedColor: message.color,
        textColor: message.textColor
      })
      .then(() => console.log('Colors saved to storage'))
      .catch(error => console.error('Error saving color:', error))

    browser.runtime
      .sendMessage({
        type: 'COLOR_PICKED',
        color: message.color,
        textColor: message.textColor
      })
      .then(() => {
        console.log('Relayed picked colors to popup')
        sendResponse({ status: 'Colors relayed successfully' })
      })
      .catch(error => {
        console.error('Error relaying colors:', error)
        sendResponse({ status: 'Error', message: error.message })
      })
  }
  return true
})
