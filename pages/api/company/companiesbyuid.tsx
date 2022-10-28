import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery,selectCountQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);
 
function handler(req: any, res: any) {
    const getCompaniesByUserId = async() =>  {
        if(req.method === 'POST'){
            const { userId, offset, count, companyName, contactPerson, email,limit } = req.body;
            var limitValue = limit && limit > 0 ? limit : 10;
            if(userId && userId > 0 ) {
                var querySql ="";
                let search = "";
                if(companyName){
                    search += " AND companyName LIKE '%"+companyName+"%' ";
                }
                if(contactPerson){
                    search += " AND contactPerson LIKE '%"+contactPerson+"%' ";
                }
                if(email){
                    search += " AND email LIKE '%"+email+"%' ";
                }

                if(count){
                   
                    var querySql = await selectCountQuery(
                        "companies",
                        ["COUNT(id) as count"],
                        "userId ='"+userId+"' AND isActive = 1 AND isDeleted = 0",
                        "",
                        search
                        )
                }else{
                    let pagination = '';
                    if(offset && offset > 0 || offset == 0) {
                        pagination = " LIMIT "+limitValue+" OFFSET "+offset+" ";
                    }
                    var querySql = await selectQuery(
                        "companies",
                        ["id","companyName","contactPerson","email","websiteUrl","phoneNumber","userId"],
                        "userId ='"+userId+"' AND isActive = 1 AND isDeleted = 0",
                        "",
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
            return getCompaniesByUserId();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
