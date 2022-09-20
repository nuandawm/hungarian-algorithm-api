const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    data: 'Hello Worldddd'
  })
})

module.exports = router