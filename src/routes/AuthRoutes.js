const router = require('express').Router();

const authenticationRoute = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //  @TODO UserService GetOneBy Function (Check if user already exist in bdd)

    if (!user || username !== user.username || password !== user.password) {
        res.statusCode = 401;
        res.json({
            message: 'Bad password or mail'
        });
        return
    }

    //  @TODO AuthService CreateToken function

    res.json({
        token: 'le token' // token récupéré par la fonction précédente
    })
};

const refreshTokenRoute = async (req, res) => {
    //  @TODO: AuthService GetOneBy (token)
    const token = await AuthHelper.getRefreshTokenBy({ token: req.body.refreshToken })

    if (!token.active || !AuthHelper.refreshTokenIsValid(token)) {
        JSONResponse({
            res,
            statusCode: 401,
            dataObject: {
                message: "Invalid Refresh Token"
            }
        })

        return
    }

    const user = await UserHelper.getOneUserBy({ _id: token.userId })
    const tokens = await AuthHelper.createTokens(user)

    JSONResponse({
        res,
        statusCode: 200,
        dataObject: tokens
    })
}


router.post('/refresh-token', refreshTokenRoute)
router.post('/auth', authenticationRoute);

module.exports = router;
