import * as THREE from "three"

const FOV = 35
const ELEVATION = THREE.MathUtils.degToRad(58)
const TARGET = new THREE.Vector3(0, 0, 2)

// The area of the table that always has to be in view (world units)
const HALF_WIDTH = 47
const HALF_DEPTH = 35

/** Renderer, camera, lights and the frame loop. */
export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x070d0d)

  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 500)

  // Soft teal sky, warm key light from the front left like a hearth fire
  scene.add(new THREE.HemisphereLight(0xcfeee8, 0x3a4a44, 1.0))

  const key = new THREE.DirectionalLight(0xfff0dc, 2.3)
  key.position.set(-30, 80, 40)
  key.target.position.set(0, 0, 0)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -60
  key.shadow.camera.right = 60
  key.shadow.camera.top = 50
  key.shadow.camera.bottom = -50
  key.shadow.camera.near = 20
  key.shadow.camera.far = 200
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.04
  key.shadow.radius = 4
  scene.add(key, key.target)

  const fill = new THREE.PointLight(0xff9a4a, 3500, 140, 2)
  fill.position.set(18, 22, -6)
  scene.add(fill)

  const parallax = { x: 0, y: 0, tx: 0, ty: 0 }
  window.addEventListener("pointermove", event => {
    parallax.tx = (event.clientX / window.innerWidth - 0.5) * 2
    parallax.ty = (event.clientY / window.innerHeight - 0.5) * 2
  })

  let distance = 100

  function resize() {
    const parent = canvas.parentElement
    const width = parent.clientWidth
    const height = parent.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // Pull back until the play area fits both horizontally and vertically
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const fitWidth = HALF_WIDTH / (tan * camera.aspect)
    const fitDepth = (HALF_DEPTH * Math.sin(ELEVATION) + 5) / tan
    distance = Math.max(fitWidth, fitDepth)
  }

  function positionCamera() {
    parallax.x += (parallax.tx - parallax.x) * 0.04
    parallax.y += (parallax.ty - parallax.y) * 0.04

    camera.position.set(
      TARGET.x + parallax.x * 3,
      TARGET.y + Math.sin(ELEVATION) * distance + parallax.y * -1.5,
      TARGET.z + Math.cos(ELEVATION) * distance
    )
    camera.lookAt(TARGET)
  }

  const listeners = []
  const clock = new THREE.Clock()

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05)
    listeners.forEach(fn => fn(dt, clock.elapsedTime))
    positionCamera()
    renderer.render(scene, camera)
    requestAnimationFrame(frame)
  }

  window.addEventListener("resize", resize)
  resize()
  requestAnimationFrame(frame)

  return {
    renderer,
    scene,
    camera,
    resize,
    onFrame: fn => listeners.push(fn)
  }
}
