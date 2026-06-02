document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    
    for (let i = 0; i < 100; i++) {
        const square = document.createElement("div")
        grid.appendChild(square)
    }

    const squares = document.querySelectorAll(".grid div")
    const scoreDisplay = document.querySelector("span")
    const startBtn = document.querySelector(".start")

    const width = 10
    let appleIndex = 0
    let currentSnake = [2, 1, 0] 
    let direction = 1
    let score = 0
    let intervalTime = 0
    let interval = 0

    // Coordinate variables for swipe tracking
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove("snake"))
        squares[appleIndex].classList.remove("apple")
        clearInterval(interval)
        
        score = 0
        direction = 1
        scoreDisplay.innerText = score
        intervalTime = 1000
        currentSnake = [2, 1, 0]
        
        currentSnake.forEach(index => squares[index].classList.add("snake"))
        randomApple()
        interval = setInterval(moveOutComes, intervalTime)
    }

    function moveOutComes() {
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || 
            (currentSnake[0] % width === width - 1 && direction === 1) ||         
            (currentSnake[0] % width === 0 && direction === -1) ||                
            (currentSnake[0] - width < 0 && direction === -width) ||               
            (squares[currentSnake[0] + direction]?.classList.contains("snake"))   
        ) {
            scoreDisplay.innerHTML = `${score} <b style="color: #ff3366; margin-left: 10px;">- Game Over! Click Start/Restart to play again</b>`
            return clearInterval(interval)
        }

        const tail = currentSnake.pop()
        squares[tail].classList.remove("snake")
        currentSnake.unshift(currentSnake[0] + direction)

        if (squares[currentSnake[0]].classList.contains("apple")) {
            squares[currentSnake[0]].classList.remove("apple")
            squares[tail].classList.add("snake")
            currentSnake.push(tail)
            randomApple()
            score++
            scoreDisplay.textContent = score
            clearInterval(interval)
            intervalTime = Math.max(100, intervalTime - 50)
            interval = setInterval(moveOutComes, intervalTime)
        }
        squares[currentSnake[0]].classList.add("snake")
    }

    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
        } while (squares[appleIndex].classList.contains("snake"))
        squares[appleIndex].classList.add("apple")
    }

    // Desktop Keyboard controls
    function control(e) {
        if (e.keyCode === 39 && direction !== -1) direction = 1 
        else if (e.keyCode === 38 && direction !== width) direction = -width 
        else if (e.keyCode === 37 && direction !== 1) direction = -1 
        else if (e.keyCode === 40 && direction !== -width) direction = width 
    }
    document.addEventListener("keydown", control)

    // Mobile Swipe Control Handler logic
    function handleSwipe() {
        const diffX = touchEndX - touchStartX
        const diffY = touchEndY - touchStartY

        // Determine if movement was primarily horizontal or vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement
            if (diffX > 0 && direction !== -1) {
                direction = 1 // Swipe Right
            } else if (diffX < 0 && direction !== 1) {
                direction = -1 // Swipe Left
            }
        } else {
            // Vertical movement
            if (diffY > 0 && direction !== -width) {
                direction = width // Swipe Down
            } else if (diffY < 0 && direction !== width) {
                direction = -width // Swipe Up
            }
        }
    }

    // Capture initial touch coords on screen surface
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX
        touchStartY = e.changedTouches[0].screenY
    }, { passive: true })

    // Capture endpoint coords on finger lift and compute swipe vector
    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX
        touchEndY = e.changedTouches[0].screenY
        handleSwipe()
    }, { passive: true })

    startBtn.addEventListener("click", startGame)
})
