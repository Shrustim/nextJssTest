import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,updateQuery,selectCountQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getUsers = async() =>  {
        if(req.method === 'GET'){
            if(req.auth.role === "admin"){
            const { offset, count,userName, email,limit } = req.query;
            var limitValue = limit && limit > 0 ? limit : 10;
            var querySql ="";
            let search = "";
                search += userName ? " AND (firstName LIKE '%"+userName+"%' OR lastName LIKE '%"+userName+"%') ": "";
                search += email ? " AND email LIKE '%"+email+"%' ": "";
             
            if(count){
            
                var querySql = await selectCountQuery(
                    "users",
                     ["id","firstName","lastName","email","role","lastLoggedDttm"],
                    "isDeleted = 0 ",
                    "",
                    search
                    )
            }else{
                let pagination = '';
                if(offset && offset > 0 || offset == 0 && limitValue > 0) {
                    pagination = " LIMIT "+limitValue+" OFFSET "+offset+" ";
                }
                var querySql = await selectQuery(
                    "users",
                     ["id","firstName","lastName","email","role","lastLoggedDttm"],
                    "isDeleted = 0",
                    "",
                    pagination,
                    search
                    )
            }
            const data = await query({ querys: querySql, values: [] });
            res.status(200).json(data)
            // const querySql = await selectQuery(
                // "users",
            // ["id","firstName","lastName","email","role","lastLoggedDttm"])
                
            // // const querySql ="SELECT * FROM users";
            // const data = await query({ querys: querySql, values: [] });
            // res.status(200).json(data)
            }
            else{
                res.status(200).json({})
            }
        }
    }
    const UserValidation = () => {
        const { firstName, lastName} = req.body;
        if(firstName && lastName){
            return true
        }else{
            if(!lastName){
                return "Invalid last name.";
            }
            if(!firstName){
                return "Invalid first name.";
            }
        }
        
    }
    const updateUser =async () => {
        const { firstName, lastName } = req.body;
        const isValidate = UserValidation();
        if(isValidate === true ){
            if(req.auth.sub && req.auth.sub > 0){
                    
                            const today = new Date();
                            const updateObj = {
                            "firstName":firstName,
                            "lastName":lastName,
                            "updatedDttm":today.getTime(),
                            "updatedBy": req.auth.sub
                        }
                        const querySql = await updateQuery(updateObj,"users","id = '"+req.auth.sub+"'")
                        const data:any = await query({ querys: querySql, values: [] });

                        return res.status(200).json({});
                 
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
            return getUsers();
        case 'PATCH':
            return updateUser();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
