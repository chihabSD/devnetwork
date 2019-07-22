require("dotenv").config(); // use dotenv (.env)
const app = require("./src/app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
