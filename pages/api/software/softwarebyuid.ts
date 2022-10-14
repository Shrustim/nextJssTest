import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getsoftwaresByUserId = async() =>  {
        if(req.method === 'POST'){
            const { userId } = req.body;
            if(userId && userId > 0) {
                const querySql = await selectQuery(
                    "softwares",
                    ["softwares.id","softwareName","releaseDttm","softwareCode","software_types.softwareTypeName","companies.companyName","version","softwares.description","softwares.userId","softwares.apiCallsCount"],
                    "softwares.userId ='"+userId+"' AND softwares.currentVersionFlag = 1 AND softwares.isActive = 1 AND softwares.isDeleted = 0",
                    "LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  LEFT JOIN companies ON softwares.companyId = companies.id"
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
            return getsoftwaresByUserId();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
