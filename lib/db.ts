import * as mysql from 'mysql2/promise';

export async function query({ querys, values = [] } : any) {
    let connection = await mysql.createConnection({
        // host: 'localhost',
        // user: 'root',
        // password: '',
        // port:3308,
        // database:"my_software_updates"

        host: 'www.remotemysql.com',
        user: '6br4O9SyPX',
        password: 'BY5gM7x7Tm',
        port:3306,
        database:"6br4O9SyPX"
    });
  try {
    var data;
    await connection.connect()
    .then(() => connection.query(querys))
    .then(([rows, fields]) => {
        // console.log('The solution is: ', rows);
        data = rows;
    });
    await connection.end();
    return data;
  } catch (error: any) {
    throw Error("error");
    return { error };
  }
}