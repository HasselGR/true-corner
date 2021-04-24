import browser from 'webextension-polyfill'

export const sendCommand = async (message) => {
  const sending = await browser.runtime.sendMessage({ message })
  return sending
}

export const setStorage = async (field, data) => {
  await browser.storage.local.set({ [field]: data })
}

export const getStorage = async (field) => {
  try {
    return (await browser.storage.local.get(field))[field]
  } catch (error) {
    throw new Error(error)
  }
}
