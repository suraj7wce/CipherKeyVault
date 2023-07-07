const express=require('express')
const app=express() 
const mysql=require('mysql')
const cors = require('cors')

const {encrypt,decrypt} = require('./EncryptionHandler')

app.use(cors())
app.use(express.json())

const db=mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '2020btecs00081',
    database: 'password_manager'
})

app.post("/addpassword",(req,res)=>{
    const {password,website}=req.body
    const hashedPassword=encrypt(password)

    db.query("INSERT INTO mytable (password,website,iv) VALUES (?,?,?)",[hashedPassword.password,website,hashedPassword.iv],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send('success!')
        }
    })
})

app.get('/showpasswords',(req,res)=>{
    db.query('SELECT * FROM mytable;',(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
        
    })
})

app.post('/decryptpassword',(req,res)=>{
    res.send(decrypt(req.body))
})

app.listen(3001,()=>{
    console.log('server running on port 3001')
}) 