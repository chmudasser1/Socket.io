import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, Stack, TextField, Typography } from "@mui/material"

const App = () => {
  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [roomname, setRoomName] = useState("")
  const [socketid, setSocketid] = useState("")
  const [massages, setMassages] = useState([])
  const socket = useMemo((() => io('http://localhost:3000')), [])

  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room })
    setMessage("")
  }
  const handleRoomName = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomname)
    setRoomName("")
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketid(socket.id)
      console.log("connected", socket.id);
    })
    socket.on("recive-message", (data) => {
      console.log(data);
      setMassages((massages) => [...massages, data])
    })
    socket.on("welcome", (e) => {
      console.log(e)
    })
  }, [])

  return (
    <Container maxWidth="sm">
      <Typography variant='h6'>  {
        socketid
      }</Typography>
      <form onSubmit={handleRoomName}>
        <h5>Join Room</h5>
        <TextField value={roomname} onChange={(e) => setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined' />
        <Button type="submit" variant='contained' color='primary'>Join</Button>
      </form>
      <form onSubmit={handlesubmit}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined' />
        <TextField value={room} onChange={(e) => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' />
        <Button type="submit" variant='contained' color='primary'>Send</Button>
      </form>
      <Stack>
        {
          massages.map((m, i) => (
            <Typography key={i} variant='h6' component='div' gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App