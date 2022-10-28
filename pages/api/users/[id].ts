import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next'
import { selectQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: NextApiRequest,
    res: NextApiResponse) {
    const getUserById = async() =>  {
        if(req.method === 'GET'){
            const columns :any = ["id","email","firstName","lastName","role","lastLoggedDttm"];
            const whereCondition = "id ='"+req.query.id+"' AND isActive = 1 AND isDeleted = 0";
            const querySql = await selectQuery("users",columns,whereCondition)
            // const querySql ="SELECT id,email,firstName,lastName,role FROM users where id ='"+req.query.id+"' AND isActive = 1 AND isDeleted = 0";
            const data = await query({ querys: querySql, values: [] });
            res.status(200).json(data)
        }
    }
    switch (req.method) {
        case 'GET':
            return getUserById();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
