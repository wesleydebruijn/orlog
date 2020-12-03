(() => {
    class myWebsocketHandler {
        setupSocket() {

            this.socket = new WebSocket(`ws://localhost:4000/ws/df7dffa9-8d4c-4e22-989a-8f9796df58de/${Math.random()}`)

            this.socket.addEventListener("message", (event) => {
                const pTag = document.createElement("p")
                pTag.innerHTML = event.data

                document.getElementById("main").append(pTag)
            })

            this.socket.addEventListener("close", () => {
                this.setupSocket()
            })
        }

        submit(event) {
            event.preventDefault()
            const input = document.getElementById("message")
            const message = input.value
            input.value = ""

            this.socket.send(
                JSON.stringify({
                    data: { message: message },
                })
            )
        }
    }

    const websocketClass = new myWebsocketHandler()
    websocketClass.setupSocket()

    document.getElementById("button")
        .addEventListener("click", (event) => websocketClass.submit(event))
})()
