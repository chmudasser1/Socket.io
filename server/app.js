import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
import cors from "cors";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

const port = 3000;

const secretkey = "asasasasasas";

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
app.get('/login', (req, res) => {
    const token = jwt.sign({ _id: "asfadsfsfewfeqfc" }, secretkey)
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
        .json("Login suceccfully")
})

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)
        const token = socket.request.cookies.token;
        if (!token) return (new Error("Authentication Error"))
        const decode = jwt.verify(token, secretkey)
        next();
    })
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