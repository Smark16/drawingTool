let canvas = document.getElementById("mycanvas")
    let c = canvas.getContext("2d")
    let colors = document.querySelectorAll(".colors")
    let draw = document.querySelectorAll(".draw li")
    let pull = document.querySelector("#pull")
    let shapes = document.querySelectorAll(".shapes li")
    let check = document.getElementById("check")
    let colorPicker = document.getElementById("randcolor")
    let clear = document.querySelector(".clear")
    let save = document.querySelector(".save")

    let isdrawing = false
    let brushWidth = 5, pulled, toolindx, shapeindx, snapshot, selectedColor
    let prevX;
    let prevY;

    window.addEventListener("load", () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })

    let drawing = (e) => {
      if (!isdrawing) return
      c.putImageData(snapshot, 0, 0)
      if (toolindx === 0) {
        c.lineTo(e.offsetX, e.offsetY)
        c.lineWidth = pulled
        c.strokeStyle = selectedColor
        c.stroke()
      } else if (toolindx === 1) {
        c.lineTo(e.offsetX, e.offsetY)
        c.lineWidth = pulled
        c.strokeStyle = "white"
        c.stroke()
      } else if (shapeindx === 0) {
        drawRect(e)
      } else if (shapeindx === 2) {
        drawCircle(e)
      } else if (shapeindx === 1) {
        drawTriangle(e)
      }
    }

    let drawTriangle = (e) => {
      c.beginPath()
      c.moveTo(prevX, prevY)
      c.lineTo(e.offsetX, e.offsetY)
      c.lineTo(prevX * 2 - e.offsetX, e.offsetY)
      c.closePath()
      c.fillStyle = selectedColor
      c.stroke()
      check.checked ? c.fill() : c.stroke()
    }

    let drawCircle = (e) => {
      c.beginPath()
      let radius = Math.sqrt(Math.pow((prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2));

      c.arc(prevX, prevY, radius, 0, Math.PI * 2)
      c.fillStyle = selectedColor
      c.stroke()
      check.checked ? c.fill() : c.stroke()
    }

    let drawRect = (e) => {
      x = prevX - e.offsetX
      y = prevY - e.offsetY
      if (!check.checked) {
        return c.strokeRect(e.offsetX, e.offsetY, x, y)
      }
      c.fillStyle = selectedColor
      c.fillRect(e.offsetX, e.offsetY, x, y)
    }

    let startdraw = (e) => {
      isdrawing = true
      prevX = e.offsetX
      prevY = e.offsetY
      c.beginPath()
      snapshot = c.getImageData(0, 0, canvas.width, canvas.height)
      console.log(prevX, prevY)
    }
    let stopdraw = () => {
      isdrawing = false
    }

    let erase = () => {
      c.fillStyle = "white"
    }

    draw.forEach((tool, index) => {
      tool.addEventListener("click", () => {
        tool.id = toolindx
        toolindx = index

        for (let i = 0; i < draw.length; i++) {
          draw[i].classList.remove("active")
        }
        tool.classList.add("active")
      })
    })

    pull.addEventListener("input", (e) => {
      pulled = Math.floor(e.target.value)
      console.log(pulled)
    })

    shapes.forEach((shape, index) => {
      shape.addEventListener("click", () => {
        shape.id = shapeindx
        shapeindx = index
        console.log(shapeindx)
        for (let i = 0; i < shapes.length; i++) {
          shapes[i].classList.remove("active")
        }
        shape.classList.add("active")

      })
    })

    colors.forEach(color => {
      color.addEventListener("click", (e) => {
        selectedColor = e.target.dataset.color
        console.log(selectedColor)
      })
    })

    colorPicker.addEventListener("change", (e) => {
      selectedColor = e.target.value
      colorPicker.parentElement.style.backgroundColor = selectedColor
      colorPicker.parentElement.click()
    })

    clear.addEventListener("click", () => {
      c.clearRect(0, 0, canvas.width, canvas.height)
    })

    save.addEventListener("click", () => {
      let link = document.createElement("a")
      link.download = `${Date.now}.jpg`
      link.href = canvas.toDataURL()
      link.style.display = "none"
      document.body.appendChild(link)

      link.click()

      link.remove()
    })

    canvas.addEventListener("mousemove", drawing)
    canvas.addEventListener("mousedown", startdraw)
    canvas.addEventListener("mouseup", stopdraw)
    canvas.addEventListener("mouseout", () => isdrawing = false)