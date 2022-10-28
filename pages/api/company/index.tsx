import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery,updateQuery,selectCountQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getCompanies = async() =>  {
        if(req.method === 'GET'){
            if(req.auth.role === "admin"){
                const {  offset, count, companyName, userName, email,limit } = req.query;
                var limitValue = limit && limit > 0 ? limit : 10;
                var querySql ="";
                let search = "";
                if(companyName &&  companyName!=""){
                    search += " AND companyName LIKE '%"+companyName+"%' ";
                }
                if(userName &&  userName!=""){
                    search += " AND (u.firstName LIKE '%"+userName+"%' OR u.lastName LIKE '%"+userName+"%') ";
                }
                if(email &&  email!="" ){
                    search += " AND companies.email LIKE '%"+email+"%' ";
                }

                if(count){
                   
                    var querySql = await selectCountQuery(
                        "companies",
                        ["count(companies.id) as count"],
                        "companies.isDeleted = 0",
                        "LEFT JOIN users u ON companies.userId = u.id",
                        search
                        )
                }else{
                    let pagination = '';
                    if(offset && offset > 0 || offset == 0) {
                        pagination = " LIMIT "+limitValue+" OFFSET "+offset+" ";
                    }
                    var querySql = await selectQuery(
                        "companies",
                        ["companies.id","companyName","contactPerson","companies.email as companyEmail",
                        "websiteUrl","phoneNumber","userId","u.firstName","u.lastName","u.email"],
                        "companies.isDeleted = 0",
                        "LEFT JOIN users u ON companies.userId = u.id",
                        pagination,
                        search
                        )
                }
                const data = await query({ querys: querySql, values: [] });
                res.status(200).json(data)
               




                //  const querySql = await selectQuery(
                    //     "companies",
                    //     ["companies.id","companyName","contactPerson","companies.email as companyEmail",
                    //     "websiteUrl","phoneNumber","userId","u.firstName","u.lastName","u.email"],
                    //     "companies.isDeleted = 0",
                    //     "LEFT JOIN users u ON companies.userId = u.id"
                    //     ) 
                    // const data = await query({ querys: querySql, values: [] });
                    // res.status(200).json(data)
                }
                else{
                    res.status(200).json({})
                }
        }
    }
    const CompanyValidation = () => {
        const { companyName, contactPerson,email,userId } = req.body;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(companyName && regex.test(email) && contactPerson && email && userId && userId > 0){
            return true
        }else{
            if(!email || !regex.test(email)){
                return "Invalid email.";
            }
            if(!contactPerson){
                return "Invalid contact person.";
            }
            if(!userId || userId < 0){
                return "Invalid user Id.";
            }
            if(!companyName){
                return "Invalid company name.";
            }
        }
        
    }
    const insertCompany = async () => {
        const { companyName, contactPerson,email,websiteUrl,phoneNumber,userId } = req.body;
        const isValidate = CompanyValidation();
        if(isValidate === true){
            const querySqlCheck = await selectQuery("companies",["id"],
                                  "companyName = '"+companyName+"'")
            const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
            if (dataCheck.length == 0) {
                const today = new Date();
                const insertObj = {
                  "companyName":companyName,
                  "contactPerson":contactPerson,
                  "email":email,
                  "websiteUrl":websiteUrl == "null" || websiteUrl == "NULL" || websiteUrl === null ? "" : websiteUrl,
                  "phoneNumber": phoneNumber == "null" || phoneNumber == "NULL" || phoneNumber === null ? "" : phoneNumber,
                  "userId": userId,
                  "createdDttm":today.getTime(),
                  "createdBy": req.auth.sub
                }
                const querySql = await insertQuery(insertObj,"companies")
                const data:any = await query({ querys: querySql, values: [] });
                
                if (!data.insertId) throw 'Information is incorrect';

              
                return res.status(200).json({});
            }
            else{
                throw 'Company is already exits.'
            };
        } 
        else{
            throw isValidate;
        };
    }
    const updateCompany =async () => {
        const { companyName, contactPerson,email,websiteUrl,phoneNumber,userId,id } = req.body;
        const isValidate = CompanyValidation();
        if(isValidate === true ){
            if(id && id > 0){
                    const querySqlCheck = await selectQuery("companies",["id"],
                    "companyName = '"+companyName+"' AND id != '"+id+"'")
                    const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
                    if (dataCheck.length == 0) {
                            const today = new Date();
                            const updateObj = {
                            "companyName":companyName,
                            "contactPerson":contactPerson,
                            "email":email,
                            "websiteUrl":websiteUrl == "null" || websiteUrl == "NULL"  || websiteUrl === null? "" : websiteUrl,
                            "phoneNumber": phoneNumber == "null" || phoneNumber == "NULL" || phoneNumber === null ? "" : phoneNumber,
                            "userId": userId,
                            "updatedDttm":today.getTime(),
                            "updatedBy": req.auth.sub
                        }
                        const querySql = await updateQuery(updateObj,"companies","id = '"+id+"'")
                        const data:any = await query({ querys: querySql, values: [] });

                        return res.status(200).json({});
                    }
                    else{
                         throw 'Company is already exits.'
                    };
            }else{
                throw 'Invalid Id';
            }
            
        } 
        else{
            throw isValidate;
        };
    }
    
    switch (req.method) {
        case 'GET':
            return getCompanies();
        case 'POST':
            return insertCompany();
        case 'PATCH':
            return updateCompany();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
