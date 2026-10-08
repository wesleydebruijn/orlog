// Procedural textures. Everything on the table is generated on a canvas so the game
// needs no binary assets beyond the backdrops; glyphs reuse the SVG paths in icons.js.
import * as THREE from "three"
import { ICONS } from "./icons"

export const FONT = '"Cinzel", "Trajan Pro", "Palatino Linotype", Palatino, Georgia, serif'

export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanvas(w, h) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  return [canvas, canvas.getContext("2d")]
}

function toTexture(canvas, { repeat, color = true } = {}) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.anisotropy = 8
  if (repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeat[0], repeat[1])
  }
  return texture
}

/** Fill an SVG icon (see icons.js) centered at cx, cy, fitted into a size x size box. */
export function drawIcon(ctx, name, cx, cy, size) {
  const icon = ICONS[name]
  const [w, h] = icon.size
  const scale = size / Math.max(w, h)

  ctx.save()
  ctx.translate(cx - (w * scale) / 2, cy - (h * scale) / 2)
  ctx.scale(scale, scale)
  icon.paths.forEach(d => ctx.fill(new Path2D(d)))
  ctx.restore()
}

function speckle(ctx, w, h, amount, random) {
  const image = ctx.getImageData(0, 0, w, h)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    const n = (random() - 0.5) * amount
    data[i] += n
    data[i + 1] += n
    data[i + 2] += n
  }
  ctx.putImageData(image, 0, 0)
}

const cache = {}
function cached(key, build) {
  return (cache[key] ??= build())
}

// --- cloth ------------------------------------------------------------------

export function feltTextures() {
  return cached("felt", () => {
    const size = 1024
    const random = rng(7)
    const [canvas, ctx] = makeCanvas(size, size)
    ctx.fillStyle = "#2a6c72"
    ctx.fillRect(0, 0, size, size)

    // woven fibres
    for (let i = 0; i < 2600; i++) {
      ctx.strokeStyle = `rgba(${random() > 0.5 ? "170,215,205" : "10,40,40"},${0.05 + random() * 0.06})`
      ctx.lineWidth = 1
      ctx.beginPath()
      const x = random() * size
      const y = random() * size
      const horizontal = random() > 0.5
      ctx.moveTo(x, y)
      ctx.lineTo(horizontal ? x + 18 + random() * 40 : x, horizontal ? y : y + 18 + random() * 40)
      ctx.stroke()
    }
    speckle(ctx, size, size, 26, random)

    const [bumpCanvas, bump] = makeCanvas(size, size)
    bump.drawImage(canvas, 0, 0)
    bump.globalCompositeOperation = "saturation"
    bump.fillStyle = "#808080"
    bump.fillRect(0, 0, size, size)

    return {
      map: toTexture(canvas, { repeat: [7, 5] }),
      bump: toTexture(bumpCanvas, { repeat: [7, 5], color: false })
    }
  })
}

// --- wood -------------------------------------------------------------------

export function woodTexture(base = "#7b4a22", seed = 3) {
  return cached(`wood-${base}-${seed}`, () => {
    const w = 512
    const h = 512
    const random = rng(seed)
    const [canvas, ctx] = makeCanvas(w, h)
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)

    for (let i = 0; i < 220; i++) {
      const y = random() * h
      const amp = 2 + random() * 8
      const freq = 0.004 + random() * 0.01
      const phase = random() * 6
      ctx.strokeStyle = random() > 0.5 ? `rgba(30,14,4,${0.05 + random() * 0.14})` : `rgba(255,214,150,${0.03 + random() * 0.07})`
      ctx.lineWidth = 0.6 + random() * 2.2
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const yy = y + Math.sin(x * freq * 6.28 + phase) * amp
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
      }
      ctx.stroke()
    }
    speckle(ctx, w, h, 16, random)
    return toTexture(canvas, { repeat: [1, 1] })
  })
}

/** Bump map for the carved rim of a bowl: u wraps around the bowl, v runs up the profile. */
export function bowlBumpTexture() {
  return cached("bowl-bump", () => {
    const [canvas, ctx] = makeCanvas(1024, 256)
    ctx.fillStyle = "#6a6a6a"
    ctx.fillRect(0, 0, 1024, 256)

    // rim band: knotwork-ish zigzag and dots
    const bandTop = 98
    const bandBottom = 156
    const step = 1024 / 32
    ctx.strokeStyle = "#f2f2f2"
    ctx.lineWidth = 7
    ctx.lineJoin = "round"
    ctx.beginPath()
    for (let i = 0; i <= 32; i++) {
      const x = i * step
      const y = i % 2 === 0 ? bandTop + 8 : bandBottom - 8
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.beginPath()
    for (let i = 0; i <= 32; i++) {
      const x = i * step
      const y = i % 2 === 0 ? bandBottom - 8 : bandTop + 8
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.fillStyle = "#101010"
    for (let i = 0; i < 32; i++) {
      ctx.beginPath()
      ctx.arc(i * step + step / 2, (bandTop + bandBottom) / 2, 4, 0, 6.3)
      ctx.fill()
    }
    ctx.fillStyle = "#e0e0e0"
    ctx.fillRect(0, bandBottom + 8, 1024, 5)
    return toTexture(canvas, { color: false })
  })
}

// --- dice -------------------------------------------------------------------

const FACE_SIZE = 256
const GOLD = "#c98a14"

/** Texture for one dice face. `blank` is an unrolled die, nothing carved yet. */
export function faceTexture({ type, stance, tokens = false, disabled = false, blank = false }) {
  const key = `face-${blank ? "blank" : `${type}-${stance}-${tokens}-${disabled}`}`
  return cached(key, () => {
    const S = FACE_SIZE
    const random = rng(11)
    const [canvas, ctx] = makeCanvas(S, S)

    const base = ctx.createRadialGradient(S / 2, S / 2, 20, S / 2, S / 2, S * 0.78)
    base.addColorStop(0, "#f3e8cf")
    base.addColorStop(1, "#cdbb94")
    ctx.fillStyle = base
    ctx.fillRect(0, 0, S, S)
    speckle(ctx, S, S, 18, random)

    if (!blank) {
      const name = `${type}_${stance}`
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      drawIcon(ctx, name, S / 2 + 2, S / 2 + 3, 150)
      ctx.fillStyle = tokens ? GOLD : "#33241a"
      drawIcon(ctx, name, S / 2, S / 2, 150)

      if (tokens) {
        ctx.strokeStyle = GOLD
        ctx.lineWidth = 7
        ctx.beginPath()
        ctx.arc(S / 2, S / 2, 112, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (disabled) {
        ctx.strokeStyle = "rgba(160,30,20,0.85)"
        ctx.lineWidth = 16
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(48, 48)
        ctx.lineTo(S - 48, S - 48)
        ctx.moveTo(S - 48, 48)
        ctx.lineTo(48, S - 48)
        ctx.stroke()
      }
    }

    // worn edge
    ctx.strokeStyle = "rgba(90,60,25,0.35)"
    ctx.lineWidth = 10
    ctx.strokeRect(0, 0, S, S)

    return toTexture(canvas)
  })
}

// --- favor plaques ----------------------------------------------------------

export const PLAQUE_SIZE = [256, 560]

export function plaqueTexture(name, slot) {
  return cached(`plaque-${name}-${slot}`, () => {
    const [W, H] = PLAQUE_SIZE
    const random = rng(slot * 13 + name.length)
    const [canvas, ctx] = makeCanvas(W, H)

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, "#6e4322")
    grad.addColorStop(1, "#4d2d15")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(20,8,0,${0.05 + random() * 0.12})`
      ctx.lineWidth = 1 + random() * 2
      const x = random() * W
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.bezierCurveTo(x + 14, H / 3, x - 14, (H * 2) / 3, x + 4, H)
      ctx.stroke()
    }
    speckle(ctx, W, H, 14, random)

    // carved border, double line with notched corners
    ctx.strokeStyle = "#241207"
    ctx.lineWidth = 6
    ctx.strokeRect(16, 16, W - 32, H - 32)
    ctx.strokeStyle = "rgba(235,190,120,0.45)"
    ctx.lineWidth = 2
    ctx.strokeRect(26, 26, W - 52, H - 52)

    // emblem
    ctx.fillStyle = "rgba(235,190,120,0.35)"
    drawIcon(ctx, "god_favor", W / 2 + 2, 188 + 3, 150)
    ctx.fillStyle = "#1e0f05"
    drawIcon(ctx, "god_favor", W / 2, 188, 150)

    ctx.strokeStyle = "rgba(20,8,0,0.8)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(48, 330)
    ctx.lineTo(W - 48, 330)
    ctx.stroke()

    // name, wrapped over lines
    ctx.fillStyle = "#e9c98f"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = `700 34px ${FONT}`
    const words = name.split(" ")
    const lines = words.length > 1 ? [words[0], words.slice(1).join(" ")] : [name]
    lines.forEach((line, i) => {
      ctx.shadowColor = "rgba(0,0,0,0.8)"
      ctx.shadowBlur = 3
      ctx.fillText(line.toUpperCase(), W / 2, 385 + i * 44, W - 70)
    })

    return toTexture(canvas)
  })
}

// --- effects ----------------------------------------------------------------

/** An arrow pointing up the texture, drawn white with a soft glow. */
export function arrowTexture() {
  return cached("arrow", () => {
    const [canvas, ctx] = makeCanvas(64, 256)
    ctx.shadowColor = "rgba(255,255,255,0.9)"
    ctx.shadowBlur = 10
    ctx.strokeStyle = "#fff"
    ctx.fillStyle = "#fff"
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(32, 236)
    ctx.lineTo(32, 56)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(32, 8)
    ctx.lineTo(54, 66)
    ctx.lineTo(32, 54)
    ctx.lineTo(10, 66)
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 3
    for (const y of [214, 232]) {
      ctx.beginPath()
      ctx.moveTo(32, y)
      ctx.lineTo(18, y + 14)
      ctx.moveTo(32, y)
      ctx.lineTo(46, y + 14)
      ctx.stroke()
    }
    return toTexture(canvas)
  })
}

/** A white glyph with glow, used for the melee and steal projectiles. */
export function glyphTexture(name, color = "#ffffff") {
  return cached(`glyph-${name}-${color}`, () => {
    const [canvas, ctx] = makeCanvas(128, 128)
    ctx.shadowColor = color
    ctx.shadowBlur = 14
    ctx.fillStyle = color
    drawIcon(ctx, name, 64, 64, 92)
    return toTexture(canvas)
  })
}

/** Embossed god-favor emblem for the top of a token plate. */
export function tokenPlateTexture() {
  return cached("token-plate", () => {
    const [canvas, ctx] = makeCanvas(128, 128)
    const grad = ctx.createLinearGradient(0, 0, 128, 128)
    grad.addColorStop(0, "#e5b04a")
    grad.addColorStop(1, "#a8731a")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 128)
    ctx.strokeStyle = "rgba(60,30,0,0.6)"
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 112, 112)
    ctx.fillStyle = "rgba(255,235,170,0.6)"
    drawIcon(ctx, "god_favor", 65, 66, 70)
    ctx.fillStyle = "rgba(60,30,0,0.85)"
    drawIcon(ctx, "god_favor", 64, 64, 70)
    return toTexture(canvas)
  })
}

/** Small DOM-free text label for counters hovering over the table. */
export function labelTexture(text, color = "#f6e7c4") {
  const [canvas, ctx] = makeCanvas(128, 64)
  ctx.font = `700 46px ${FONT}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.shadowColor = "rgba(0,0,0,0.9)"
  ctx.shadowBlur = 6
  ctx.fillStyle = color
  ctx.fillText(text, 64, 34)
  return toTexture(canvas)
}
