const express = require('express')
const sequelize = require('./config/database')
const cors = require('cors')

const expenseRoutes = require('./routes/expenseRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', expenseRoutes)

sequelize.sync()

app.listen(4000, ()=>{
    console.log("Server listening on port 4000")
})