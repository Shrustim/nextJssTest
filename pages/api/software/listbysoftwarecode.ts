import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getsoftwaresByUserId = async() =>  {
        if(req.method === 'POST'){
            const { userId,softwareCode } = req.body;
            let condition1 = req.auth.role == "admin" ? "" : "AND softwares.userId = '"+req.auth.sub+"'";
            let condition2 = req.auth.role == "admin" ? "" : "AND userId = '"+req.auth.sub+"'";
            if(softwareCode ) {
                var output:any = {
                    "list":[],
                    "company":{
                        
                    }
                }
                const querySql = await selectQuery(
                    "softwares",
                    ["softwares.id","softwareName","releaseDttm","currentVersionFlag","softwareCode","software_types.softwareTypeName","softwares.companyId","version","softwares.description","softwares.userId","softwares.apiCallsCount"],
                    "softwares.softwareCode = '"+ softwareCode+"' "+condition1+"  AND softwares.isActive = 1 AND softwares.isDeleted = 0",
                    "LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  "
                    )
                const data:any = await query({ querys: querySql, values: [] });
                if(data.length > 0) {
                    output.list = data;
                    const querySql1 = await selectQuery(
                        "companies",
                        ["id","companyName","contactPerson","email","websiteUrl","phoneNumber","userId"],
                        "id ='"+data[0].companyId+"' "+condition2+" AND isActive = 1 AND isDeleted = 0"
                        )
                    const companyData:any = await query({ querys: querySql1, values: [] });
                    output.company = companyData[0];
                }
                res.status(200).json(output)
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
