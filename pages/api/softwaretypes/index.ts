import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getSoftwareTypes = async() =>  {
        if(req.method === 'GET'){
            const querySql = await selectQuery("software_types",["id","softwareTypeName"])
                
            // const querySql ="SELECT * FROM users";
            const data = await query({ querys: querySql, values: [] });
            res.status(200).json(data)
        }
    }
    switch (req.method) {
        case 'GET':
            return getSoftwareTypes();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
