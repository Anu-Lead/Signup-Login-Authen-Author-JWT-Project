const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post("/signup", [
    check("email", "Please, Provide a valid email address")
    .isEmail(),
    check("password", "Your password must be minimum of 8 characters")
    .isLength({
        min: 8
    })
], async (req, res) => {
    const { password, email} = req.body;

    // This below line of code is to validate Users Signup Input
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
  
    // Validate if User Does Not Already Exist
    let user = users.find((user) => {
        return user.email === email
    });

    if(user){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "This User is Already Exists"
                }
            ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     users.push({
        email,
        password: hashedPassword  
    });

    const token = await JWT.sign({
        email
    }, "hhwefkjsjhweofifsdlmdjhbssksms", {
        expiresIn: 3600000
    }) 

    res.json({
        token
    });

    router.post("/login", async (req, res) => {
        const { password, email } = req.body;

        let user = users.find((user) => {
            return user.email === email
        });

        if(!user){
            return res.status(400).json({
                "errors": [
                    {
                        "msg": "Invalid Email",
                    }
                ]
            })
        };

        let isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                "errors": [
                    {
                        "msg": "Invalid Password, Recheck!"
                    }
                ]
            })
        };

        const token = await JWT.sign({
            email
        }, "hhwefkjsjhweofifsdlmdjhbssksms", {
            expiresIn: 3600000
        }) 
    
        res.json({
            token
        });

    })
    // // console.log(hashedPassword);
    //   res.send("Congratulations, Your Validation Checks is Passed!")
    })

router.get("/all", (req, res) =>{
    res.json(users)
})

module.exports = router