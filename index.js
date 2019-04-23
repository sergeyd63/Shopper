const express = require('express');

const app = express();
const server = app.listen(4040, () => {
    console.log('Listening on 4040');
});

app.use(express.static('client'));
