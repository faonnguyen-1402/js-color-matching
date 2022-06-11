import { getPlayAgainButton, getTimerElement } from './selectors2.js'

function shuffle(arr) {
    if (!Array.isArray(arr) || arr.length <= 2) return arr
    for (let i = arr.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * i)

        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

export const getRandomColorPairs = (count) => {
    // receive count --> return count * 2 random colors
    // using lib: https://github.com/davidmerfield/randomColor

    const colorList = []
    const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']
    for (let i = 0; i < count; i++) {
        const color = window.randomColor({
            luminosity: 'bright',
            hue: hueList[i % hueList.length],
        })
        colorList.push(color)
    }
    // double current color list
    const fullColorList = [...colorList, ...colorList]
    console.log(fullColorList)

    // shuffle it
    // shuffle(fullColorList)

    return shuffle(fullColorList)
}

export function showPlayAgainButton() {
    const showPlayAgainButton = getPlayAgainButton()
    if (showPlayAgainButton) showPlayAgainButton.classList.add('show')
}

export function hidePlayAgainButton() {
    const hidePlayAgainButton = getPlayAgainButton()
    if (hidePlayAgainButton) hidePlayAgainButton.classList.remove('show')
}

export function setTimerText(text) {
    const timerElement = getTimerElement()
    if (timerElement) timerElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
    let intervalId = null

    function start() {
        clear()
        let currentSeconds = seconds
        intervalId = setInterval(() => {
            if (onChange) onChange(currentSeconds)
            currentSeconds--
            if (currentSeconds < 0) {
                clear()
                if (onFinish) onFinish()
            }
        }, 1000)
    }

    function clear() {
        clearInterval(intervalId)
    }
    return {
        start,
        clear,
    }
}