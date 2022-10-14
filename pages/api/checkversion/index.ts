import jwt from 'jsonwebtoken';
import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import {JWTSecret} from "../../../constants"
import { updateQuery,selectQuery } from "../../../helpers/sqlquerys"
const md5 = require('md5');
export default apiHandler(handler);

function handler(req: any, res: any) {
   

    const checkSoftwareVersion = async() => {
        const { softwareCode, version } = req.body;
        const isValidate = dataValidation();
        if(isValidate === true){
          const querySqlCheck = await selectQuery("softwares",["id","softwareCode","version","apiCallsCount","description"],
            "softwareCode = '"+softwareCode+"'  AND currentVersionFlag = 1")
          const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
          if (dataCheck.length != 0) {
            const today = new Date();
            var updateObj = {
                "apiCallsCount": dataCheck[0].apiCallsCount ? dataCheck[0].apiCallsCount + 1 : 1,
                "updatedDttm":today.getTime()
            }
            const querySql = await updateQuery(updateObj,"softwares","id = '"+dataCheck[0].id+"'")
            await query({ querys: querySql, values: [] });

            if( version === dataCheck[0].version){
                return res.status(200).json({flag : 0,currentVersion:dataCheck[0].version,description:dataCheck[0].description});
            }else{
                return res.status(200).json({flag : 1,currentVersion:dataCheck[0].version,description:dataCheck[0].description});
            }
           
          }else{
            throw 'Invalid data.';
          }          
          
        }else{
                throw isValidate;
        }
    }
    const dataValidation = ()=>{
        const { softwareCode, version } = req.body;
        if(softwareCode && version ){
            return true;
        }else{
            
            if(!softwareCode){
                return "Invalid software code.";
            }
            if(!version){
                return "Invalid version.";
            }
           
        }
    }
    switch (req.method) {
        case 'POST':
            return checkSoftwareVersion();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
