import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getCompaniesByUserId = async() =>  {
        if(req.method === 'POST'){
            const { userId } = req.body;
            if(userId && userId > 0) {
                const querySql = await selectQuery(
                    "companies",
                    ["id","companyName","contactPerson","email","websiteUrl","phoneNumber","userId"],
                    "userId ='"+userId+"' AND isActive = 1 AND isDeleted = 0"
                    )
                const data = await query({ querys: querySql, values: [] });
                res.status(200).json(data)
            }else{
                throw "Invalid Data";
            }
        }
    }
   
    switch (req.method) {
        case 'POST':
            return getCompaniesByUserId();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
