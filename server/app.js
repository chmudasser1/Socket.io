import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
)
app.get('/', (req, res) => {
    res.send("hello socket")
})

io.on('connection', (socket) => {
    console.log("User Connected", socket.id)
    socket.on("message", ({ message, room }) => {
        console.log({ message, room })
        io.to(room).emit("recive-message", message)
    })
    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`User is join ${room}`)
    })
    socket.on("disconnect", () => {
        console.log(`User Disconnected ${socket.id}`)
    })
})

server.listen(port, () => {
    console.log(`Server is starting at ${port}`)
})