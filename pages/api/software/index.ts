import { apiHandler } from '../../../helpers/api';
import { query } from "../../../lib/db";
import { selectQuery,insertQuery,updateQuery,selectCountQuery} from "../../../helpers/sqlquerys"
export default apiHandler(handler);

function handler(req: any, res: any) {
    const getSoftwares = async() =>  {
        if(req.method === 'GET'){
            if(req.auth.role === "admin"){
                const { offset, count,version, softwareCode, softwareName,limit, startDate, endDate } = req.query;
                var limitValue = limit && limit > 0 ? limit : 10;
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
                        ["count(softwares.id) as count"],
                        "softwares.isDeleted = 0 AND softwares.currentVersionFlag = 1",
                        "",
                        search
                        )
                }else{
                    let pagination = '';
                    if(offset && offset > 0 || offset == 0 && limitValue > 0) {
                        pagination = " LIMIT "+limitValue+" OFFSET "+offset+" ";
                    }
                    var querySql = await selectQuery(
                        "softwares",
                        ["softwares.id","softwareName","softwareCode","releaseDttm","software_types.softwareTypeName","companies.companyName","version",
                        "softwares.description","softwares.userId","u.firstName","u.lastName","u.email"],
                        "softwares.isDeleted = 0 AND softwares.currentVersionFlag = 1",
                        "LEFT JOIN users u ON softwares.userId = u.id LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  LEFT JOIN companies ON softwares.companyId = companies.id",
                        pagination,
                        search
                        )
                }
                const data = await query({ querys: querySql, values: [] });
                res.status(200).json(data)
            //    const querySql = await selectQuery(
            //     "softwares",
            //     ["softwares.id","softwareName","releaseDttm","software_types.softwareTypeName","companies.companyName","version",
            //     "softwares.description","softwares.userId","u.firstName","u.lastName","u.email"],
            //     "softwares.isDeleted = 0",
            //     "LEFT JOIN users u ON softwares.userId = u.id LEFT JOIN software_types ON softwares.softwareTypeId = software_types.id  LEFT JOIN companies ON softwares.companyId = companies.id"
                
            //         ) 
            //     const data = await query({ querys: querySql, values: [] });
            //     res.status(200).json(data)
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
                  "currentVersionFlag": 1,
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
        const { softwareName, releaseDttm,softwareTypeId,version,description,userId,id ,companyId,softwareCode} = req.body;
        const isValidate = SoftwareValidation();
        if(isValidate === true ){
            if(id && id > 0){
                    const querySqlCheck = await selectQuery("softwares",["id"],
                    "softwareName = '"+softwareName+"' AND id != '"+id+"' AND softwareCode != '"+softwareCode+"'")
                    const dataCheck:any = await query({ querys: querySqlCheck, values: [] });
                    if (dataCheck.length == 0) {
                        const softwareDataSQL = await selectQuery("softwares",["version","softwareCode","apiCallsCount"]," id = '"+id+"'")
                        const softwareData:any = await query({ querys: softwareDataSQL, values: [] });
                        if(softwareData[0].version === version ){ 
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
                        }else{

                            const softwareVersionSQL = await selectQuery("softwares",["version"],"version = '"+version+"' AND softwareCode = '"+softwareData[0].softwareCode +"'")
                            const softwareVersion:any = await query({ querys: softwareVersionSQL, values: [] });
                            if(softwareVersion.length >= 1){
                                     throw 'Software version is old version.It is already used.'
                            }else{
                                    const today = new Date();
                                    let releaseDttmT =  new Date(releaseDttm);
                                    const updateObj = {
                                        "currentVersionFlag": 0,
                                        "updatedDttm":today.getTime(),
                                        "updatedBy": req.auth.sub
                                    }
                                    const querySql = await updateQuery(updateObj,"softwares","id = '"+id+"'")
                                    const data:any = await query({ querys: querySql, values: [] });
                                    const insertObj = {
                                        "softwareName":softwareName,
                                        "releaseDttm":releaseDttmT.getTime(),
                                        "softwareTypeId":softwareTypeId,
                                        "version":version,
                                        "description": description == "null" || description == "NULL" || description === null ? "" : description,
                                        "userId": userId,
                                        "companyId":companyId,
                                        "softwareCode":softwareData[0].softwareCode,
                                        "createdDttm":today.getTime(),
                                        "currentVersionFlag": 1,
                                        "apiCallsCount":softwareData[0].apiCallsCount,
                                        "createdBy": req.auth.sub
                                    }
                                    const querySql1 = await insertQuery(insertObj,"softwares")
                                    const data1:any = await query({ querys: querySql1, values: [] });
                                    return res.status(200).json({});
                            }
                        }
                       
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
