const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(express.json())

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started. PORT : ${port}`)
});
