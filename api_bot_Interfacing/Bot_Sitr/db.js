const sql = require('mssql');

const sqlConfig = {
    port: 1445,
    user: 'BOT_SITR',
    password: 'P@ssw0rd',
    server: 'DESKTOP-PEOKU13',
    database: 'gpu_bot_sitr',
    stream: false,
//   arrayRowMode: true
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: true,
    abortTransactionOnError: false
  },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}


exports.test_db = function(){
    try {
        console.log("db_here_1");
        sql_db('PLGS',sqlConfig, function(db_data){
            //console.log("db_here_2");
            //console.log(db_data);
            //cb(GetFromJSON_Obj(db_data,"PLGS"));
        });
    } catch (error) {
        console.log(error);
    }
    
}



exports.post_plug_data = async function (arg1,arg2,arg3,cb){
    var chk1 = chk_inpt_sql_inj(arg1);
    var chk2 = chk_inpt_sql_inj(arg2);
    var chk3 = chk_inpt_sql_inj(arg3);
    try {
        if (chk1 && chk2 && chk3){
            sql_db("ADMIN~EXEC POST_PLUG_PWR '"+arg1+"','"+arg2+"','"+arg3+"' ",sqlConfig,
                function(db_data){
                    if (cb != null) cb(db_data[0]);
            });
        } else{
            cb("Exception_db: db pre check rejected user input")
        }
    } catch (error) {
        console.log(error);
    }
    
}





exports._chk_inpt_sql_inj = function (db_arg){
    return chk_inpt_sql_inj
}

function chk_inpt_sql_inj(db_arg){
    var rtn_val = true;
    switch (true){
        case db_arg.match(/EXEC /g):
            if (!(db_arg.match(/ADMIN~EXEC /g))){
                rtn_val=false;
            }
            break;
        case ((1+1) == 3):
                rtn_val=false;
            break;
    }
    return rtn_val
}

function sql_db (strg_2_exe,db_config, cb){
    //console.log("Started sql_db");
    var q_strg = "";
    if (strg_2_exe.match(/ADMIN~EXEC /g)){
        q_strg = strg_2_exe.replace(/ADMIN~/g, "");
    } else {
        q_strg = "select * from "+strg_2_exe;
    }
    _sql_db(q_strg,db_config,cb);
}

function _sql_db (strg_2_exe,db_config, cb){
    //console.log("Started sql_db");
    try {
        sql_exe(strg_2_exe,db_config, function(db_rcds){
            if (db_rcds == "" || db_rcds == null){
                console.log(strg_2_exe + " did NOT return any records from sql_exe");
            } else{
                cb(db_rcds);
            }
        });
        //console.log("Finished sql_db");
    } catch (err) {
        // ... error checks
        console.log("1_Ran into problems processing sql cmd: "+ q_str);
        console.log(err);
    }
}


async function sql_exe (strg_to_exe,db_config, cb){
    //console.log("Started sql_exe");
    //console.log(strg_to_exe);
    var rcds = [];
    try {

        const _pool = await new sql.ConnectionPool(db_config).connect().then(pool => {
            return pool.query(strg_to_exe)
        }).then(rslts => {
            //console.log(rslts);//<<<<<<<-----------------------------------------------
            rcds.push(rslts);
            sql.close();
        }).catch(err => {
            // ... error checks
            console.log(err);
        })
        cb(GetDataFromRows(rcds));
    } catch (err) {
        // ... error checks
        console.log("2_Ran into problems processing sql cmd: "+ strg_to_exe);
        console.log(err);
        sql.close();
        cb(null);
    }
    //console.log(rcds);
    //console.log("Finished sql_exe");
    //console.log(rcds[0]["recordset"]);
    
}

function GetFromJSON_Obj(db_data,col_name){
    var rtn_val = [];
    for (i = 0; i < db_data.length ; i++) {
        //console.log(db_data[i][col_name]);
        rtn_val[i]=db_data[i][col_name];
      }
      return rtn_val;
}

function GetDataFromRows(db_data){
    var rtn_val = [];
    try {
        for (i = 0; i < db_data[0]["recordset"].length ; i++) {
            //console.log(db_data[0]["recordset"][i]);
            rtn_val[i]=db_data[0]["recordset"][i];
        }
        return rtn_val;
    } catch (err) {
        console.log("3_Ran into problems processing sql data: "+ db_data);
        console.log(err)
    }
}







//-----------------------test this later--------------------
// function goto_db(){

// mssql.connect(sqlConfig).then((pool) => {
//   console.log('Connected to SQL server')
//   const request = pool.request()
//   request.stream = true
//   request.on('error', (err) => {
//     console.error('good', err)
//   })
//   return request.query('SELECT * FROM PLGS')
// }).catch((err) => {
//   console.error('bad', err)
// }).then(() => {
//   console.log('Disconnecting from SQL server')
//   return mssql.close()
// }).then(() => console.log('Disconnected'))


// }
