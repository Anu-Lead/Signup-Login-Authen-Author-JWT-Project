const JWT = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Failed! No Token Found"
                }
            ]
        })
    }

try {
    let user = await JWT.verify(token, "hhwefkjsjhweofifsdlmdjhbssksms")
    req.user = user.email;
    next()
} catch (error) {
    return res.status(400).json({
        "error": [
            {
                "msg": "Token Invalid, Input Correct Token",
            }
        ]
    })
}
}