import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getCompaniesByForDropdown = async() =>  {
        if(req.method === 'GET'){
            console.log("req",req.auth.sub)
            if(req.auth.sub && req.auth.sub > 0) {
                const querySql = await selectQuery(
                    "companies",
                    ["id","companyName"],
                    "userId = '"+req.auth.sub+"' AND isActive = 1 AND isDeleted = 0"
                    )
                const data = await query({ querys: querySql, values: [] });
                res.status(200).json(data)
            }else{
                throw "Invalid Data";
            }
        }
    }
   
    switch (req.method) {
        case 'GET':
            return getCompaniesByForDropdown();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
