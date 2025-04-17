import usersRouter from "./routes/usersRouter";
import loginRouter from "./routes/loginRouter";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRouter);
app.use("/login", loginRouter);

app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
