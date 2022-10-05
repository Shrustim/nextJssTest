import jwt from 'jsonwebtoken';
import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import {updateQuery,selectQuery } from "../../../helpers/sqlquerys"; 
const md5 = require('md5');
export default apiHandler(handler);

function handler(req: any, res: any) {
   

    const ResetPassword = async() => {
        const { code ,isReset,password } = req.body;
        const isValidate = BodyValidation();
        if(isValidate === true){
            const today = new Date();
            const whereConditionS = "code='"+code+"'  AND isDeleted = 0";
            const querySqlCheck = await selectQuery("forgotpassword",["id","userId","createdDttm"],whereConditionS)
            
            // const querySqlCheck ="SELECT id,userId,createdDttm FROM forgotpassword WHERE code='"+code+"'  AND isDeleted = 0";
            const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
            if (dataCheck.length != 0) {
                var expireDttm = new Date(dataCheck[0].createdDttm);
                expireDttm.setDate(expireDttm.getDate() + 1);
                if(expireDttm.getTime() > today.getTime()){
                    if(isReset){
                        if(password && password != "" && password.length > 6){
                            const updateData = {
                                "isDeleted":1,
                                "updatedDttm": today.getTime()
                            };
                            const whereCondition = 'id = '+dataCheck[0].id+'';
                            const querySql2 = await updateQuery(updateData,"forgotpassword",whereCondition);
                            // const querySql2 ='UPDATE forgotpassword SET isDeleted = 1, updatedDttm = "'+ today.getTime()+'"  WHERE id = '+dataCheck[0].id+'';
                            await query({ querys: querySql2, values: [] });
                            const updateData1 = {
                                "password":md5(password),
                                "updatedDttm": today.getTime()
                            };
                            const whereCondition1 = 'id = '+dataCheck[0].userId+'';
                            const querySql1 = await updateQuery(updateData1,"users",whereCondition1)
                            // const querySql1 ='UPDATE users SET password = "'+password+'", updatedDttm = "'+ today.getTime()+'"  WHERE id = '+dataCheck[0].userId+'';
                            await query({ querys: querySql1, values: [] });  
                            return res.status(200).json({}); 
                        }else{
                            throw 'Invalid Password';
                        }
                       
                    }else{
                        return res.status(200).json({});
                    }
                }else{
                    throw 'Link is expired';
                }
                
            }else{
                throw 'Link is expired';
            }
           
        }else{
                throw isValidate;
        }
    }
    const BodyValidation = ()=>{
        const { code } = req.body;
        if(code){
            return true;
        }else{
            return "Invalid Code.";
        }
    }
    switch (req.method) {
        case 'POST':
            return ResetPassword();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
