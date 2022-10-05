import { expressjwt} from 'express-jwt';
import util from 'util';
import {JWTSecret} from "../../constants"
export { jwtMiddleware };

function jwtMiddleware(req: any, res: any) {
    const middleware = expressjwt({ secret: JWTSecret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/authenticate',
            '/api/users/signup',
            '/api/users/forgotpasswordemail',
            '/api/users/resetpassword',
            '/api/checkversion'
            

        ]
    });

    return util.promisify(middleware)(req, res);
}