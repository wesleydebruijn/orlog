const PAD = 40
const SHIP_VOYAGE = 240

function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function valueNoise(random, size = 512) {
  const lattice = Array.from({ length: size }, random)
  const at = i => lattice[((i % size) + size) % size]
  return x => {
    const i = Math.floor(x)
    const f = x - i
    return at(i) + (at(i + 1) - at(i)) * f * f * (3 - 2 * f)
  }
}

function fractal(noise, x, octaves) {
  let sum = 0
  let amplitude = 0.5
  let norm = 0
  for (let octave = 0; octave < octaves; octave++) {
    sum += noise(x * 2 ** octave + octave * 31.7) * amplitude
    norm += amplitude
    amplitude *= 0.5
  }
  return sum / norm
}

function offscreen(width, height, ratio) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(width * ratio)
  canvas.height = Math.ceil(height * ratio)
  const ctx = canvas.getContext("2d")
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  return { canvas, ctx, width, height }
}

function pineSide(random, height, tiers) {
  return Array.from({ length: tiers }, (_, i) => {
    const t = (i + 1) / tiers
    return { reach: height * 0.3 * t * (0.75 + random() * 0.5), drop: height * 0.85 * t }
  })
}

function drawPine(ctx, random, x, base, height) {
  const tiers = 5 + Math.floor(random() * 4)
  const top = base - height
  const notch = height * 0.05
  const right = pineSide(random, height, tiers)
  const left = pineSide(random, height, tiers)

  ctx.beginPath()
  ctx.moveTo(x, top)
  right.forEach(({ reach, drop }) => {
    ctx.lineTo(x + reach, top + drop)
    ctx.lineTo(x + reach * 0.35, top + drop - notch)
  })
  ctx.lineTo(x + height * 0.02, base)
  ctx.lineTo(x - height * 0.02, base)
  left.reverse().forEach(({ reach, drop }) => {
    ctx.lineTo(x - reach * 0.35, top + drop - notch)
    ctx.lineTo(x - reach, top + drop)
  })
  ctx.closePath()
  ctx.fill()
}

function fillProfile(ctx, width, bottom, profile, fill) {
  ctx.beginPath()
  ctx.moveTo(0, bottom)
  for (let x = 0; x <= width; x += 4) ctx.lineTo(x, profile(x))
  ctx.lineTo(width, bottom)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

function paintSky(width, height, horizon, ratio) {
  const layer = offscreen(width, height, ratio)
  const { ctx } = layer

  const sky = ctx.createLinearGradient(0, 0, 0, horizon)
  sky.addColorStop(0, "#050c10")
  sky.addColorStop(0.55, "#0d2024")
  sky.addColorStop(1, "#2a4746")
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, horizon)

  const water = ctx.createLinearGradient(0, horizon, 0, height)
  water.addColorStop(0, "#1f3a3a")
  water.addColorStop(1, "#040a0b")
  ctx.fillStyle = water
  ctx.fillRect(0, horizon, width, height - horizon)

  return layer
}

function paintMountains(width, height, horizon, ratio, random) {
  const layer = offscreen(width, height, ratio)
  const { ctx } = layer
  const noise = valueNoise(random)
  const ridged = x => 1 - Math.abs(fractal(noise, x, 5) * 2 - 1)

  const far = ctx.createLinearGradient(0, horizon - height * 0.4, 0, horizon)
  far.addColorStop(0, "#28403f")
  far.addColorStop(1, "#3a5655")
  fillProfile(ctx, width, horizon, x => horizon - height * 0.08 - ridged(x / 260) * height * 0.3, far)

  const near = ctx.createLinearGradient(0, horizon - height * 0.2, 0, horizon)
  near.addColorStop(0, "#142727")
  near.addColorStop(1, "#203837")
  const ridge = x => horizon - height * 0.02 - fractal(noise, x / 180 + 90, 4) * height * 0.12
  fillProfile(ctx, width, horizon, ridge, near)

  ctx.fillStyle = "#132525"
  for (let x = 0; x < width; x += 6 + random() * 14) {
    drawPine(ctx, random, x, ridge(x) + 4, height * (0.025 + random() * 0.035))
  }

  return layer
}

function paintForeground(width, height, horizon, ratio, random) {
  const layer = offscreen(width, height, ratio)
  const { ctx } = layer
  const noise = valueNoise(random)
  const edge = x => Math.abs(x / width - 0.5) * 2
  const ground = x =>
    height * 1.02 - edge(x) ** 2.4 * (height - horizon) * 1.4 - fractal(noise, x / 90, 4) * height * 0.06

  const fill = ctx.createLinearGradient(0, horizon, 0, height)
  fill.addColorStop(0, "#0b1717")
  fill.addColorStop(1, "#030707")
  fillProfile(ctx, width, height, ground, fill)

  ctx.fillStyle = "#050c0c"
  for (let x = 0; x < width; x += 10 + random() * 30) {
    if (edge(x) < 0.45) continue
    const size = height * (0.12 + random() * 0.3) * edge(x)
    drawPine(ctx, random, x, ground(x) + size * 0.08, size)
  }

  return layer
}

function paintFog(width, height, random) {
  const layer = offscreen(width, height, 1)
  const { ctx } = layer

  for (let i = 0; i < 26; i++) {
    const x = random() * width
    const y = height * (0.35 + random() * 0.4)
    const radius = height * (0.25 + random() * 0.4)
    ;[x, x - width, x + width].forEach(cx => {
      const blob = ctx.createRadialGradient(cx, y, 0, cx, y, radius)
      blob.addColorStop(0, "rgba(150, 190, 185, 0.12)")
      blob.addColorStop(1, "rgba(150, 190, 185, 0)")
      ctx.fillStyle = blob
      ctx.fillRect(cx - radius, y - radius, radius * 2, radius * 2)
    })
  }

  return layer
}

function auroraRibbon() {
  const layer = offscreen(1, 128, 1)
  const ribbon = layer.ctx.createLinearGradient(0, 0, 0, 128)
  ribbon.addColorStop(0, "rgba(140, 90, 200, 0)")
  ribbon.addColorStop(0.45, "rgba(90, 160, 190, 0.35)")
  ribbon.addColorStop(0.85, "rgba(110, 255, 190, 1)")
  ribbon.addColorStop(1, "rgba(110, 255, 190, 0)")
  layer.ctx.fillStyle = ribbon
  layer.ctx.fillRect(0, 0, 1, 128)
  return layer.canvas
}

function drawLongship(ctx) {
  ctx.beginPath()
  ctx.moveTo(-50, -4)
  ctx.bezierCurveTo(-58, -10, -62, -22, -56, -30)
  ctx.bezierCurveTo(-52, -34, -47, -31, -51, -26)
  ctx.bezierCurveTo(-54, -18, -48, -10, -40, -8)
  ctx.lineTo(40, -8)
  ctx.bezierCurveTo(50, -10, 56, -20, 54, -30)
  ctx.bezierCurveTo(53, -37, 60, -41, 65, -37)
  ctx.lineTo(60, -34)
  ctx.bezierCurveTo(58, -28, 62, -14, 50, -4)
  ctx.bezierCurveTo(30, 6, -30, 6, -50, -4)
  ctx.fillStyle = "#081211"
  ctx.fill()

  ctx.fillRect(-1.2, -62, 2.4, 56)

  ctx.beginPath()
  ctx.moveTo(-22, -58)
  ctx.lineTo(22, -58)
  ctx.quadraticCurveTo(27, -40, 22, -22)
  ctx.lineTo(-22, -22)
  ctx.quadraticCurveTo(-17, -40, -22, -58)
  ctx.fillStyle = "#1c2826"
  ctx.fill()
  ctx.save()
  ctx.clip()
  ctx.fillStyle = "rgba(130, 45, 32, 0.55)"
  for (let x = -18; x < 22; x += 12) ctx.fillRect(x, -60, 6, 40)
  ctx.restore()

  ctx.fillStyle = "rgba(214, 162, 58, 0.35)"
  for (let x = -36; x <= 36; x += 9) {
    ctx.beginPath()
    ctx.arc(x, -8, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** A misty northern fjord under the aurora, with a longship sailing past. */
export function createBackdrop(canvas, { reducedMotion = false } = {}) {
  const ctx = canvas.getContext("2d")
  const random = seeded(0x0de1)
  const ribbon = auroraRibbon()
  const auroraNoise = [valueNoise(random), valueNoise(random), valueNoise(random)]
  let width = 0
  let height = 0
  let horizon = 0
  let layers = {}
  let aurora = null
  let stars = []
  let ripples = []
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let running = true

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    horizon = height * 0.66
    canvas.width = width * ratio
    canvas.height = height * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    const scene = seeded(0x0de1)
    const padded = width + PAD * 2
    layers = {
      sky: paintSky(width, height, horizon, ratio),
      mountains: paintMountains(padded, height, horizon, ratio, scene),
      foreground: paintForeground(padded, height, horizon, ratio, scene),
      fog: paintFog(Math.ceil(width), Math.ceil(height * 0.5), scene)
    }
    aurora = offscreen(Math.ceil(width / 4), Math.ceil(height / 4), 1)
    stars = Array.from({ length: 200 }, () => ({
      x: scene() * width,
      y: scene() ** 1.6 * horizon * 0.85,
      size: 0.6 + scene() * 1.2,
      phase: scene() * Math.PI * 2,
      speed: 0.5 + scene() * 2
    }))
    ripples = Array.from({ length: 60 }, () => {
      const depth = scene()
      return {
        x: scene() * width,
        y: horizon + depth ** 1.5 * (height - horizon),
        length: 10 + depth * 70,
        phase: scene() * Math.PI * 2,
        speed: 0.6 + scene() * 1.4
      }
    })

    if (reducedMotion) render(0)
  }

  function drawAurora(time) {
    const { ctx: actx, width: aw, height: ah } = aurora
    actx.clearRect(0, 0, aw, ah)
    actx.globalCompositeOperation = "lighter"
    const [shape, reach, glow] = auroraNoise

    for (let band = 0; band < 2; band++) {
      const drift = time * (0.025 + band * 0.015)
      for (let x = 0; x < aw; x++) {
        const u = x / aw
        const base =
          ah * (0.2 + band * 0.12) +
          fractal(shape, u * 3 + drift + band * 7, 3) * ah * 0.22 +
          Math.sin(u * 9 + time * 0.3 + band) * ah * 0.03
        const tall = ah * (0.1 + fractal(reach, u * 5 - drift * 2 + band * 3, 2) * 0.2)
        const fade = Math.sin(u * Math.PI)
        actx.globalAlpha = fractal(glow, u * 4 + time * 0.06 + band * 11, 3) ** 2.2 * fade * (0.9 - band * 0.3)
        actx.drawImage(ribbon, x, base - tall, 1, tall)
      }
    }
    actx.globalAlpha = 1
  }

  function drawLayer(layer, depth, y = 0) {
    const x = -PAD + pointer.x * depth * PAD
    ctx.drawImage(layer.canvas, x, y + pointer.y * depth * 12, layer.width, layer.height)
  }

  function drawFog(time, y, speed, alpha) {
    const { canvas: fog, width: fw, height: fh } = layers.fog
    const offset = (time * speed) % fw
    ctx.globalAlpha = alpha
    ctx.drawImage(fog, offset - fw, y, fw, fh)
    ctx.drawImage(fog, offset, y, fw, fh)
    ctx.globalAlpha = 1
  }

  function drawShip(time) {
    const scale = Math.max(height / 900, 0.45)
    const travel = ((time / SHIP_VOYAGE + 0.3) % 1) * (width + 300 * scale) - 150 * scale
    const y = horizon + (height - horizon) * 0.22 + Math.sin(time * 1.2) * 1.5

    ctx.save()
    ctx.translate(travel + pointer.x * 0.5 * PAD, y)
    ctx.scale(scale, scale)
    ctx.rotate(Math.sin(time * 0.9) * 0.02)
    ctx.save()
    ctx.scale(1, -0.45)
    ctx.globalAlpha = 0.18
    drawLongship(ctx)
    ctx.restore()
    drawLongship(ctx)
    ctx.restore()
  }

  function render(time) {
    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04

    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(layers.sky.canvas, 0, 0, width, height)

    stars.forEach(star => {
      const twinkle = 0.55 + 0.45 * Math.sin(time * star.speed + star.phase)
      ctx.fillStyle = `rgba(220, 235, 230, ${twinkle * (1 - star.y / horizon) * 0.8})`
      ctx.fillRect(star.x, star.y, star.size, star.size)
    })

    drawAurora(time)
    ctx.globalCompositeOperation = "lighter"
    ctx.drawImage(aurora.canvas, 0, 0, width, height)
    ctx.globalCompositeOperation = "source-over"

    drawLayer(layers.mountains, 0.15)
    drawFog(time, horizon - height * 0.3, 6, 0.9)

    ripples.forEach(ripple => {
      const shimmer = Math.max(0, Math.sin(time * ripple.speed + ripple.phase))
      ctx.fillStyle = `rgba(120, 230, 190, ${shimmer * 0.12})`
      ctx.fillRect(ripple.x - ripple.length / 2, ripple.y, ripple.length, 1)
    })

    drawShip(time)
    drawFog(time, horizon - height * 0.12, 14, 0.7)
    drawLayer(layers.foreground, 1)
  }

  function frame(now) {
    if (!running) return
    render(now / 1000)
    requestAnimationFrame(frame)
  }

  function start() {
    running = true
    requestAnimationFrame(frame)
  }

  window.addEventListener("resize", resize)
  resize()
  if (reducedMotion) return

  window.addEventListener("pointermove", event => {
    pointer.tx = (event.clientX / width) * 2 - 1
    pointer.ty = (event.clientY / height) * 2 - 1
  })
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false
    else start()
  })
  start()
}
