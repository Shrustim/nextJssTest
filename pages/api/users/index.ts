import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getUsers = async() =>  {
        if(req.method === 'GET'){
            if(req.auth.role === "admin"){
            const querySql = await selectQuery("users",
            ["id","firstName","lastName","email","role","lastLoggedDttm"])
                
            // const querySql ="SELECT * FROM users";
            const data = await query({ querys: querySql, values: [] });
            res.status(200).json(data)
            }
            else{
                res.status(200).json({})
            }
        }
    }
    switch (req.method) {
        case 'GET':
            return getUsers();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
