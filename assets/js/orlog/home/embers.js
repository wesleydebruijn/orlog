const COUNT = 70
const COLORS = ["214, 162, 58", "255, 154, 74", "255, 196, 110"]

function spawn(width, height, anywhere) {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    size: 0.8 + Math.random() * 2.2,
    rise: 20 + Math.random() * 50,
    drift: (Math.random() - 0.5) * 20,
    wobble: Math.random() * Math.PI * 2,
    life: 0,
    lifespan: 5 + Math.random() * 7,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }
}

/** Sparks drifting up the page, like the embers of a longhouse fire. */
export function createEmbers(canvas) {
  const ctx = canvas.getContext("2d")
  let width = 0
  let height = 0
  let embers = []
  let last = 0
  let running = true

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = width * ratio
    canvas.height = height * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  function draw(ember) {
    const fade = Math.sin((ember.life / ember.lifespan) * Math.PI)
    const flicker = 0.7 + Math.random() * 0.3
    const glow = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 4)
    glow.addColorStop(0, `rgba(${ember.color}, ${fade * flicker})`)
    glow.addColorStop(1, `rgba(${ember.color}, 0)`)
    ctx.fillStyle = glow
    ctx.fillRect(ember.x - ember.size * 4, ember.y - ember.size * 4, ember.size * 8, ember.size * 8)
  }

  function frame(time) {
    if (!running) return
    const dt = Math.min((time - last) / 1000, 0.05)
    last = time

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = "lighter"

    embers = embers.map(ember => {
      ember.life += dt
      ember.wobble += dt * 1.5
      ember.y -= ember.rise * dt
      ember.x += (ember.drift + Math.sin(ember.wobble) * 12) * dt
      return ember.life > ember.lifespan || ember.y < -10 ? spawn(width, height, false) : ember
    })
    embers.forEach(draw)

    requestAnimationFrame(frame)
  }

  function start() {
    running = true
    last = performance.now()
    requestAnimationFrame(frame)
  }

  window.addEventListener("resize", resize)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false
    else start()
  })

  resize()
  embers = Array.from({ length: COUNT }, () => spawn(width, height, true))
  start()
}
