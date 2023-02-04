const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
// Json web token 
const jwt = require('jsonwebtoken');
const userModel = require('./Models/userSchema');
const middlewares = require('./middleware/middleware');
const app = express();

const BASE_URL = 'mongodb+srv://userauth:userauth123456@authapi.8c4ukua.mongodb.net/user'

mongoose.connect(BASE_URL)
.then((response) => {
    console.log('MongoDB connected')
})
.catch((error) => console.log('erorr:', error))


const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors())




//starting rest api 


app.post('/api/signup', async (request, response) => {
    const {name, email, password, mobileNumber} = request.body

    if (!name || !email || !password || !mobileNumber) {
        response.json({message: "Fields are empty"})
        return
    }

    // using hashing password technique
    const hashpassword = await  bcrypt.hash(password, 10)

    // console.log(password,"password")
    // console.log(hashpassword, "PASSWORD")
 
    const objToSend ={
    // you can also use that
    // ...request.body
    //? other way to do the same thing
        name,
        email,
        password: hashpassword,
        mobile_number:mobileNumber
    }

    userModel.findOne({email}, (error, user) => {
        if (error) {
            console.log('erorr:', error)
                    response.json({
                        message : "something went wrong"
                    })
                }else{
                    console.log(user, "user")
                    if (user) {
                        response.json({
                            message: "email already exists"
                        })
                    }else{
           
                        userModel.create(objToSend, (error, data) => {
                    // db error handling
                        if (error) {
                            response.json({
                                message : "User creation failed"
                            })
                        }else{
                            response.json({
                                message: "User created successfully",
                                data: data,
                                status: true
                            })
                        }
                    })
                    }
                // nested if
                }
    })


    // userModel.create(objToSend, (error, data) => {
    // // db error handling
    //     if (error) {
    //         response.json({
    //             message : "User creation failed"
    //         })
    //     }else{
    //         response.json({
    //             message: "User created successfully",
    //             data: data,
    //             status: true
    //         })
    //     }
    // })


    // response.send('successfully sign up')
    // console.log('Body', body)
})


// process of making login api

app.post("/api/login", async(request, response)=>{

  const {email, password} = request.body

    if (!email || !password) {
        response.json({message: "Field are empty"})
        return
    }

    userModel.findOne({email}, async (error, user) => {
        if (error) {
            response.json({
                message : "something went wrong"
            })
        }
        else{
            
            if (user) {
                console.log(user.password, "password")    
                const isPasswordMatch = await bcrypt.compare(password, user.password)
                //console.log(isPasswordMatch)
                if(isPasswordMatch){


                    const tokeobj = {
                        ...user
                    }

                    // token generating process
                    const token = jwt.sign(tokeobj, "bombworld")
                    //console.log(token)


                    response.json(
                        {
                            message:"user successfully login",
                        data: user ,
                        status: true,
                        token
                    }

                        )
                }
            }
            else{
                response.json({message: "User not found"})
            }
        }
    })

})


app.get('/api/check', middlewares.authMiddleWare, (request, response) => {
    response.send('Api hitting')
})



app.listen(PORT, ()=>{
    console.log(`The server is runing on this ${PORT}`);
})