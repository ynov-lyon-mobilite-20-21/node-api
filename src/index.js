const express = require('express');
const app = express();
const router = require('./routes/router');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(express.json())
app.use(router)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started. PORT : ${port}`)
});
