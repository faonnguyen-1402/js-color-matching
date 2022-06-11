import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants2.js'
import {
    getColorBackground,
    getColorElementList,
    getColorListElement,
    getInActiveColorList,
    getPlayAgainButton,
} from './selectors2.js'
import {
    createTimer,
    getRandomColorPairs,
    hidePlayAgainButton,
    setTimerText,
    showPlayAgainButton,
} from './utils2.js'

// Global variables
let selections = []
let dataForBackground
let gameStatus = GAME_STATUS.PLAYING
let count = 0
let timer = createTimer({
    seconds: 45,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish,
})

function handleTimerChange(seconds) {
    const second = `0${seconds}`.slice(-2)
    setTimerText(second)
}

function handleTimerFinish() {
    gameStatus = GAME_STATUS.FINISHED
    const text = 'GAME OVER T_T'
    setTimerText(text)
    showPlayAgainButton()
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

// console.log(getRandomColorPairs(PAIRS_COUNT))

function handleColorList(liElement) {
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
    const isClicked = liElement.classList.contains('active')
    if (!liElement || shouldBlockClick || isClicked) return

    liElement.classList.add('active')

    selections.push(liElement)

    if (selections.length < 2) return

    const firstColor = selections[0].dataset.color
    const secondColor = selections[1].dataset.color
    const isMatch = firstColor === secondColor
    if (isMatch) {
        count++
        dataForBackground = firstColor
        changeBackground()
        if (count === PAIRS_COUNT) {
            showPlayAgainButton()
            setTimerText('YOU WIN!!! 😤')
            timer.clear()
            gameStatus = GAME_STATUS.FINISHED
        }
        selections = []

        return
    }

    gameStatus = GAME_STATUS.BLOCKING

    setTimeout(() => {
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
        selections = []

        if (gameStatus !== GAME_STATUS.FINISHED) {
            gameStatus = GAME_STATUS.PLAYING
        }
    }, 500)
}

function changeBackground() {
    const background = getColorBackground()

    if (background) background.style.background = dataForBackground
}

function initColors() {
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    const liList = getColorElementList()

    liList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index]

        const overplayElement = liElement.querySelector('.overlay')
        if (overplayElement) overplayElement.style.backgroundColor = colorList[index]
    })
}

function attachEventForColorList() {
    const ulElement = getColorListElement()

    if (!ulElement) return

    ulElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return
        handleColorList(event.target)
    })
}

function resetGame() {
    gameStatus = GAME_STATUS.PLAYING
    selections = []
    const elementsList = getColorElementList()

    for (const elements of elementsList) {
        elements.classList.remove('active')
    }

    hidePlayAgainButton()
    setTimerText('START')
    initColors()
    startTimer()
}

function attachEventForPlayButton() {
    const playButton = getPlayAgainButton()
    if (!playButton) return

    playButton.addEventListener('click', resetGame)
}

function startTimer() {
    timer.start()
}

;
(() => {
    initColors()
    attachEventForColorList()
    attachEventForPlayButton()
    startTimer()
})()