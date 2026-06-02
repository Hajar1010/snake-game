document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    
    // Create 100 layout squares dynamically
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
    let speed = 0.9
    let intervalTime = 0
    let interval = 0

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
        //  Check for collisions first
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || // hits bottom
            (currentSnake[0] % width === width - 1 && direction === 1) ||         // hits right wall
            (currentSnake[0] % width === 0 && direction === -1) ||                // hits left wall
            (currentSnake[0] - width < 0 && direction === -width) ||               // hits top
            (squares[currentSnake[0] + direction]?.classList.contains("snake"))   // hits self
        ) {
            alert("Game Over!") // alerts the player the game ended
            return clearInterval(interval) // Stops execution 
        }

    
        const tail = currentSnake.pop()
        squares[tail].classList.remove("snake")
        currentSnake.unshift(currentSnake[0] + direction)

        // Handle eating apples
        if (squares[currentSnake[0]].classList.contains("apple")) {
            squares[currentSnake[0]].classList.remove("apple")
            squares[tail].classList.add("snake")
            currentSnake.push(tail)
            randomApple()
            score++
            scoreDisplay.textContent = score
            clearInterval(interval)
            intervalTime = intervalTime * speed
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

    function control(e) {
        if (e.keyCode === 39 && direction !== -1) { // Right 
            direction = 1
        } else if (e.keyCode === 38 && direction !== width) { // Up
            direction = -width
        } else if (e.keyCode === 37 && direction !== 1) { // Left
            direction = -1
        } else if (e.keyCode === 40 && direction !== -width) { // Down
            direction = width
        }
    }

    document.addEventListener("keydown", control)
    startBtn.addEventListener("click", startGame)
})
