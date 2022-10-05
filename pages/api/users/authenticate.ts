import jwt from 'jsonwebtoken';
import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import {JWTSecret} from "../../../constants"
import { updateQuery,selectQuery } from "../../../helpers/sqlquerys"
const md5 = require('md5');
export default apiHandler(handler);

function handler(req: any, res: any) {
   

    const authenticate = async() => {
        const { email, password } = req.body;
        const isValidate = UserValidation();
        if(isValidate === true){
                const today = new Date();
                const whereConditionS = "email='"+email+"' AND password='"+md5(password)+"' AND isActive = 1 AND isDeleted = 0";
                const querySql = await selectQuery("users",["id","role"],whereConditionS)
                // const querySql ="SELECT id FROM users WHERE email='"+email+"' AND password='"+password+"' AND isActive = 1 AND isDeleted = 0";
                const data:any = await query({ querys: querySql, values: [] });
                if (data.length == 0) throw 'Email or password is incorrect';
                const updateData = {
                    "lastLoggedDttm": today.getTime()
                };
                const whereCondition = 'id = '+data[0].id+'';
                const querySql2 = await updateQuery(updateData,"users",whereCondition)
                // const querySql2 ='UPDATE users SET lastLoggedDttm = "'+ today.getTime()+'"  WHERE id = '+data[0].id+'';
                 await query({ querys: querySql2, values: [] });
                // create a jwt token that is valid for 7 days
                const token = jwt.sign({ sub: data[0].id, "role": data[0].role }, JWTSecret, { expiresIn: '7d' });
            
                // return basic user details and token
                return res.status(200).json({
                token
                });
        }else{
                throw isValidate;
        }
    }
    const UserValidation = ()=>{
        const { email, password } = req.body;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(email && regex.test(email) && password && password.length >= 6){
            return true;
        }else{
            if(!email || !regex.test(email)){
                return "Invalid email.";
            }
            if(!password){
                return "Invalid password.";
            }
            if(password.length <= 5){
                return "Password must have more than 6 characters.";
            }
           
        }
    }
    switch (req.method) {
        case 'POST':
            return authenticate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
