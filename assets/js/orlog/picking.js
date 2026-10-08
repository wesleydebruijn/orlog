import * as THREE from "three"

/**
 * Pointer interaction with the table: hover highlights and clicks on dice and plaques.
 * `onPick` gets the userData of the clicked mesh ({kind: "die" | "plaque", ...}).
 */
export function createPicking({ canvas, camera, table, onPick }) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let hovered = null

  function pick(event) {
    const rect = canvas.getBoundingClientRect()
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)

    const [hit] = raycaster.intersectObjects(table.pickables(), false)
    return hit ? hit.object.userData : null
  }

  canvas.addEventListener("pointermove", event => {
    const data = pick(event)
    const same = data && hovered && data.kind === hovered.kind && data.id === hovered.id && data.slot === hovered.slot && data.seat === hovered.seat
    if (same || (!data && !hovered)) return

    hovered = data
    table.setHover(data)
    canvas.style.cursor = table.clickable(data) ? "pointer" : "default"
  })

  canvas.addEventListener("pointerleave", () => {
    hovered = null
    table.setHover(null)
    canvas.style.cursor = "default"
  })

  canvas.addEventListener("click", event => {
    onPick(pick(event))
  })
}
