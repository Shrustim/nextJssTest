import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import type { NextApiRequest, NextApiResponse } from 'next'
const handler = async  (
  req: NextApiRequest,
  res: NextApiResponse
) =>{
    // let connection = await mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     port:3308,
    //     database:"my_software_updates"
    // });
 // connection.connect()
    // .then(() => connection.query('SELECT * FROM users'))
    // .then(([rows, fields]) => {
    //     console.log('The solution is: ', rows);
    //     res.status(200).json(rows)
    // });

    if(req.method === 'GET'){
    //     var sql    = SqlString.format('SELECT * FROM users WHERE id = ?', [1]);
    //     console.log("sql",sql)
    //     var post  = {id: 1, title: 'Hello MySQL'};
    //     sql = SqlString.format('INSERT INTO users VALUES ?', post);
    //    console.log("sqla",sql)
    //    sql = SqlString.format('UPDATE  users SET  ? ', post);
    //    var sql1 = SqlString.format('WHERE  ?', post);
    //    console.log("sqlu",sql + sql1)
        const querySql ="SELECT * FROM users";
        const data = await query({ querys: querySql, values: [] });
        res.status(200).json(data)
    }
    if(req.method === 'POST'){
        const querySql ='INSERT INTO users (email, password, firstName, lastName)'+
            'VALUES ("'+req.body.email+'", "'+req.body.password+'", "'+req.body.firstName+'", "'+req.body.lastName+'")';
        const data = await query({ querys: querySql, values: [] });
        res.status(200).json(data)
    }
    if(req.method === 'PATCH'){
        const querySql ='UPDATE users SET email="'+req.body.email+'", password="'+req.body.password+'",'+
        ' firstName="'+req.body.firstName+'", lastName="'+req.body.lastName+'"  WHERE id="'+req.body.id+'"';
        const data = await query({ querys: querySql, values: [] });
        res.status(200).json(data)
    }

    if(req.method === 'DELETE'){
        const querySql ='DELETE FROM users   WHERE id="'+req.body.id+'"';
        const data = await query({ querys: querySql, values: [] });
        res.status(200).json(data)
    }

        //     if(req.method !== 'GET'){
        //         res.status(500).json({ message: 'Sorry!!! Invalid request.' })
        //     }
}


export default apiHandler(handler);