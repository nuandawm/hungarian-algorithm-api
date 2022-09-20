const express = require('express')
const path = require('path')
const apiRouter = require('../api/index')

const app = express()
const port = 3000

// Serve our static build files
app.use(express.static(path.join(__dirname, '../spa/build')));

// Serve APIs on /api
app.use('/api', apiRouter)

// Serve react on routes unused by previous routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../spa/build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})