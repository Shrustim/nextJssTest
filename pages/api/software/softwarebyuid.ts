import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery,selectCountQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getsoftwaresByUserId = async() =>  {
        if(req.method === 'POST'){
            const { userId, offset, count,version, softwareCode, softwareName,limit , startDate, endDate} = req.body; 
            var limitValue = limit && limit > 0 ? limit : 10;
            if(userId && userId > 0) {
                        var querySql ="";
                        let search = "";
                            search += version ? " AND version LIKE '%"+version+"%' " : "";
                            search += softwareCode ? " AND softwareCode LIKE '%"+softwareCode+"%' ": "";
                            search += softwareName ? " AND softwareName LIKE '%"+softwareName+"%' ": "";
                            search += startDate && endDate && new Date(startDate).getTime() > 0 && new Date(endDate).getTime() > 0 ? 
                            "AND releaseDttm BETWEEN "+new Date(startDate).getTime()+" AND "+new Date(endDate).getTime()+" " : "";
                        if(count){
                        
                            var querySql = await selectCountQuery(
                                "softwares",
                                ["COUNT(softwares.id) as count"],
                                "softwares.userId ='"+userId+"' AND softwares.currentVersionFlag = 1 AND softwares.isActive = 1 AND softwares.isDeleted = 0",
                                "",
                                search
                                )
                        }else{
                            let pagination = '';
                            if(offset && offset > 0 || offset == 0) {
                                pagination = " LIMIT "+limitValue+" OFFSET "+offset+" ";
                            }
                            var querySql = await selectQuery(
                                "softwares",
                                ["softwares.id","softwareName","releaseDttm","softwareCode","software_types.softwareTypeName","companies.companyName","version","softwares.description","softwares.userId","softwares.apiCallsCount"],
                                "softwares.userId ='"+userId+"' AND softwares.currentVersionFlag = 1 AND softwares.isActive = 1 AND softwares.isDeleted = 0",
                                "LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  LEFT JOIN companies ON softwares.companyId = companies.id",          
                                pagination,
                                search
                                )
                        }
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
