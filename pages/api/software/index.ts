import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery,updateQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getSoftwares = async() =>  {
        if(req.method === 'GET'){
            if(req.auth.role === "admin"){
               const querySql = await selectQuery(
                "softwares",
                ["softwares.id","softwareName","releaseDttm","software_types.softwareTypeName","companies.companyName","version",
                "softwares.description","softwares.userId","u.firstName","u.lastName","u.email"],
                "softwares.isDeleted = 0",
                "LEFT JOIN users u ON softwares.userId = u.id LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  LEFT JOIN companies ON softwares.companyId = companies.id"
                
                    )
                const data = await query({ querys: querySql, values: [] });
                res.status(200).json(data)
            }
            else{
                res.status(200).json({})
            }
        }
    }
    const SoftwareValidation = () => {
        const { softwareName, releaseDttm,softwareTypeId,userId } = req.body;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(softwareName && releaseDttm && softwareTypeId && userId && userId > 0){
            return true
        }else{
            if(!softwareTypeId ){
                return "Invalid softwareTypeId.";
            }
            if(!releaseDttm){
                return "Invalid release date.";
            }
            if(!userId || userId < 0){
                return "Invalid user Id.";
            }
            if(!softwareName){
                return "Invalid software name.";
            }
        }
        
    }
    const insertSoftware = async () => {
        const { softwareName, releaseDttm,softwareTypeId,version,description,userId,companyId } = req.body;
        const isValidate = SoftwareValidation();
        if(isValidate === true){
            const querySqlCheck = await selectQuery("softwares",["id"],
                                  "softwareName = '"+softwareName+"'")
            const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
            if (dataCheck.length == 0) {
                const today = new Date();
                let releaseDttmT =  new Date(releaseDttm);
                const insertObj = {
                  "softwareName":softwareName,
                  "releaseDttm":releaseDttmT.getTime(),
                  "softwareTypeId":softwareTypeId,
                  "version":version,
                  "description": description == "null" || description == "NULL" || description === null ? "" : description,
                  "userId": userId,
                  "companyId":companyId,
                  "softwareCode":"SC"+Math.floor(10000 + Math.random() * 90000)+req.auth.sub+"",
                  "createdDttm":today.getTime(),
                  "createdBy": req.auth.sub
                }
                const querySql = await insertQuery(insertObj,"softwares")
                const data:any = await query({ querys: querySql, values: [] });
                
                if (!data.insertId) throw 'Information is incorrect';

              
                return res.status(200).json({});
            }
            else{
                throw 'Software is already exits.'
            };
        } 
        else{
            throw isValidate;
        };
    }
    const updateSoftware =async () => {
        const { softwareName, releaseDttm,softwareTypeId,version,description,userId,id ,companyId} = req.body;
        const isValidate = SoftwareValidation();
        if(isValidate === true ){
            if(id && id > 0){
                    const querySqlCheck = await selectQuery("softwares",["id"],
                    "softwareName = '"+softwareName+"' AND id != '"+id+"'")
                    const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
                    if (dataCheck.length == 0) {
                            const today = new Date();
                            let releaseDttmT =  new Date(releaseDttm);
                            const updateObj = {
                            "softwareName":softwareName,
                            "releaseDttm":releaseDttmT.getTime(),
                            "softwareTypeId":softwareTypeId,
                            "version":version,
                            "description":  description == "null" || description == "NULL" || description === null ? "" : description,
                            "userId": userId,
                            "companyId":companyId,
                            "updatedDttm":today.getTime(),
                            "updatedBy": req.auth.sub
                        }
                        const querySql = await updateQuery(updateObj,"softwares","id = '"+id+"'")
                        const data:any = await query({ querys: querySql, values: [] });

                        return res.status(200).json({});
                    }
                    else{
                         throw 'Software is already exits.'
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
            return getSoftwares();
        case 'POST':
            return insertSoftware();
        case 'PATCH':
            return updateSoftware();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  
}
