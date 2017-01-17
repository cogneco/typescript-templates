const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")


let x = 0
let y = 0
let deltaX = 1
let deltaY = 1

function draw() {

	context.fillStyle = "rgb(200, 200, 200)"
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.fillStyle = "rgb(200, 0, 0)"
	context.fillRect(x, y, 5, 5)
	x += deltaX
	y += deltaY
	if (x > canvas.width - 5 || x < 0)
		deltaX *= -1
	if (y > canvas.height - 5 || y < 0)
		deltaY *= -1
}

setInterval(draw, 20)