import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { selectQuery,selectCountQuery} from "../../../helpers/sqlquerys"
const handler = async  (
  req: NextApiRequest,
  res: NextApiResponse
) =>{
   
    if(req.method === 'GET'){
        const {  offset, count, limit} = req.query;
        var querySql ="";
        let search = "";
        let offsetValue:any = offset;
        let limitValue:any = limit;
console.log("limitValue",limitValue)
        if(count){
           
            var querySql = await selectCountQuery(
                "book",
                ["count(id) as count"],
                "",
                "",
                search
                )
        }else{
            let pagination = '';
            if(offsetValue && offsetValue > 0 || offsetValue == 0 && limitValue && limitValue > 0) {
                pagination = " LIMIT "+limitValue+" OFFSET "+offsetValue+" ";
            }
            var querySql = await selectQuery(
                "book",
                ["id","created_at","ending_at"],
                "",
                "",
                pagination,
                search
                )
        }
        const data = await query({ querys: querySql, values: [] });
        res.status(200).json(data)
    }
    
}


export default apiHandler(handler);