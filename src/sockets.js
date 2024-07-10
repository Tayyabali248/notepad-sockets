const fs = require("fs");
const path = require("path");
const { io } = require("../server");

let users = [];

io.on("connection", (socket) => {
  console.log(socket?.id);
  socket.on("addUser", (chatId) => {
    console.log("addUser connected", chatId);

    // const isUserExist = users.find((user) => user.userId === userId);
    // if (!isUserExist) {
    const user = { chatId, socketId: socket.id };
    users.push(user);
    io.emit("getUsers", users);
    console.log(users);
    // }
  });

  socket?.on(
    "sendMessage",
    async ({ message, isText, chatId, imageBase64 }) => {
      if (!isText) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const imageName = `${Date.now()}_${chatId}.jpeg`;
        const folderPath = path.join(__dirname, "../../public/chat");

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const imagePath = path.join(folderPath, imageName);

        await new Promise((resolve, reject) => {
          fs.writeFile(imagePath, buffer, (err) => {
            if (err) {
              console.error("Error saving the image:", err);
              reject(err);
              return;
            }
            message = imageName;
            resolve(message);
          });
        });
      }
      //   let isRead = false;
      //   if (receiver?.inChat?.inChat && receiver?.inChat?.withUser === senderId) {
      //     isRead = true;
      //   }

      const formattedMessage = isText
        ? message
        : `${process.env.Base_Url}/chat/${message}`;
      const createdAt = Date.now();

      users.map((user) => {
        if (chatId == user?.chatId) {
          io.to(user.socketId).emit("getMessage", {
            message: formattedMessage,
            isText,
            chatId,
            createdAt,
          });
        }
      });
    }
  );

  socket.on("getPreviousMessage", (chatId) => {
    
  })

  const sendError = (message) => {
    io.emit("responseError", message);
  };

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});
