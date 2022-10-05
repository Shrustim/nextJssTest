export const insertQuery = (obj: any,tableName:any) => {
    var col = Object.keys(obj).toString();
    var values = JSON.stringify(Object.values(obj)).slice(1, -1);
    var sql = "INSERT INTO "+tableName+" ("+col+") VALUES ("+values+") ";
    //   console.log(sql);
    return sql;
}

export const updateQuery = (obj: any,tableName:any,whereCondition: any) => {
    var values = "";
    var lastKey = Object.keys(obj)[Object.keys(obj).length-1];
    for (const key in obj) {
        var value = ""+obj[key]+"";
        if(lastKey == key){
            values+= key+ " = '"+value.replaceAll("'", "\'")+"'";
        }else{
            values+= key+ " = '"+value.replaceAll("'", "\'")+"', ";
        }
       
      }
    var sql = "UPDATE "+tableName+" SET "+values+" WHERE "+ whereCondition+"";
      console.log(sql);
    return sql;
}

export const selectQuery = (tableName:string,col:any = [],whereCondition:string ="",join:string = "" ) => {
    var columns  = '*';
    if(col.length > 0){
        columns = "";
        col.map((e:any,index:any) => {
           columns+= col.length == (index + 1) ? e :e+",";
        })
    } 
    var whereClause = "";
    if(whereCondition && whereCondition != ""){
        whereClause = "WHERE "+ whereCondition+"";
    }
    var sql = "SELECT  "+columns+" FROM  "+tableName+" " + join+ " "+ whereClause+" ";
      console.log(sql);
    return sql;
}