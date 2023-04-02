# SOCKET SERVER

- Send event to client use **io**
- To send every client use **io.emit**
- To send one client use **io.to(socketID).emit**
- Take event from client use **socket.on**

# SOCKET CLIENT

- Send event to server use **socket.emit**
- Take event from server use **socket.on**