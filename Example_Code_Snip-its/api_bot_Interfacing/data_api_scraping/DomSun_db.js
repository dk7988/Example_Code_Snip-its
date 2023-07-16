const sql = require('mssql');

const sqlConfig = {
    port: 1445,
    user: 'DomSun_Bot',
    password: 'p@ssw00rd',
    server: 'DESKTOP-PEOKU13',
    database: 'DomSun',
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
        sql_db('CONG_IDS',sqlConfig, function(db_data){
            //console.log("db_here_2");
            //console.log(db_data);
            //cb(GetFromJSON_Obj(db_data,"PLGS"));
        });
    } catch (error) {
        console.log(error);
    }
    
}








exports.get_mem_ids = function(cb){
    try {
        console.log("db_here_1");
        // sql_db('CONG_IDS',sqlConfig, function(db_data){
        //     //console.log("db_here_2");
        //     //console.log(db_data);
        //     cb(GetFromJSON_Obj(db_data,"MEM_ID"));
        //     //cb(db_data);
        // });

      //var q_strg= "select a.MEM_ID from CONG_IDS as A LEFT join MEM_DETAILS as b on a.MEM_ID=b.MEM_ID where B.MEM_ID IS NULL and not a.MEM_ID = 'K000376'"
      var q_strg= "select a.MEM_ID from CONG_IDS as A LEFT join MEM_DETAILS as b on a.MEM_ID=b.MEM_ID where B.MEM_ID IS NULL"

        _sql_db(q_strg,sqlConfig, function(db_data){
            cb(GetFromJSON_Obj(db_data,"MEM_ID"));
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


exports.POST_HOUSE_REPS_VOTE_BILL_DATA = async function (ar,cb){
    // var chk1 = chk_inpt_sql_inj(arg1);
    // var chk2 = chk_inpt_sql_inj(arg2);
    // var chk3 = chk_inpt_sql_inj(arg3);
    try {
        //if (chk1 && chk2 && chk3){
// PROC POST_HOUSE_REPS_VOTE_BILL_DATA @_cong_num int, @_cong_sesn varchar(50), @_roll_num int, @_legis_num varchar(MAX), @_mem_id varchar(25),
//                                     @_mem_name varchar(MAX), @_prty varchar(35), @_st varchar(15), @_vote varchar(25)

    sql_db("ADMIN~EXEC POST_HOUSE_REPS_VOTE_BILL_DATA '"+
            ar[0]+"','"+ar[1]+"','"+ar[2]+"','"+ar[3]+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"' ",sqlConfig,
                function(db_data){
                    if (cb != null) cb(db_data[0]);
            });
        // } else{
        //     cb("Exception_db: db pre check rejected user input")
        // }
    } catch (error) {
        console.log(error);
    }
    
}










exports.POST_MEM_DETAILS = async function (ar,cb){
    // var chk1 = chk_inpt_sql_inj(arg1);
    // var chk2 = chk_inpt_sql_inj(arg2);
    // var chk3 = chk_inpt_sql_inj(arg3);
    try {
        //if (chk1 && chk2 && chk3){
//PROC POST_MEM_DETAILS @_MEM_ID varchar(15),@_FNAME varchar(75),@_MNAME varchar(75), @_LNAME varchar(75),@_SUFX varchar(7),@_CURRENT_PARTY varchar(5),@_DOB date,
//                      @_GENDER bit,@_GOVTRACK_ID int,@_CSPAN_ID int,@_VOTESMART_ID int,@_ICPSR_ID int,@_CRP_ID int,@_GOOGLE_ID varchar(25),@_MOST_RECNT_VOTE date,
//                      @_LAST_UPDATED datetime,@_URL varchar(MAX),@_IN_OFFICE bit             =18

//ar[0]+"','"+ar[1]+"','"+ar[2].replace("'","").replace("'","")+"','"+ar[3].replace("'","''")+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','"+ar[9]+"','"+
            sql_db("ADMIN~EXEC POST_MEM_DETAILS '"+
            ar[0]+"','"+ar[1]+"','"+((ar[2] == null)?ar[2]: ar[2].replace("'","").replace("'",""))+"','"+ar[3].replace("'","''")+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','"+ar[9]+"','"+
            ar[10]+"','"+ar[11]+"','"+ar[12]+"','"+ar[13]+"','"+ar[14]+"','"+ar[15]+"','"+ar[16]+"','"+ar[17]+"' ",sqlConfig,
                function(db_data){
                    if (cb != null) cb(db_data[0]);
            });
        // } else{
        //     cb("Exception_db: db pre check rejected user input")
        // }
    } catch (error) {
        console.log(error);
    }
    
}

exports.POST_ROLES = async function (ar,hb,cb){
    // var chk1 = chk_inpt_sql_inj(arg1);
    // var chk2 = chk_inpt_sql_inj(arg2);
    // var chk3 = chk_inpt_sql_inj(arg3);
    try {
       // if (chk1 && chk2 && chk3){
//PROC POST_ROLES @_MEM_ID varchar(15),@_CONG_NUM int,@_CHAMBER varchar(25),@_TITLE varchar(50),@_STATE varchar(5),@_PARTY varchar(5),@_LEADERSHIP_ROLE varchar(MAX),
//                @_FEC_CANDIDATE_ID varchar(500),@_SENIORITY int,     @_DISTRICT varchar(25),@_AT_LARGE bit,     @_OCD_ID varchar(500),@_START_DATE date,@_END_DATE date,@_OFFICE varchar(500),
//                @_PHONE varchar(25),@_COOK_PVI varchar(50),@_DW_NOMINATE decimal(8, 5),@_IDEAL_POINT varchar(MAX),@_NEXT_ELECTION int,@_TOTAL_VOTES int,@_MISSED_VOTES int,
//                @_TOTAL_PRESENT decimal(8, 5),@_SENATE_CLASS varchar(MAX),@_STATE_RANK varchar(MAX),@_LIS_ID varchar(MAX),@_BILLS_SPONSORED decimal(8, 5),@_BILLS_COSPONSORED decimal(8, 5),
//                @_MISSED_VOTES_PCT decimal(8, 5),@_VOTES_WITH_PARTY_PCT decimal(8, 5),@_VOTES_AGAINST_PARTY_PCT decimal(8, 5)                   =31

//console.log('role_dtls_ar:' + ar + '      length: '+ar.length );

var db_str='';
        if(ar.length==29){
            //console.log('running ar.length=29');
            db_str= ar[0]+"','"+ar[1]+"','"+ar[2]+"','"+ar[3]+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','null','null"+"','"+ar[9]+"','"+
                    ar[10]+"','"+ar[11]+"','"+ar[12]+"','"+ar[13]+"','"+ar[14]+"','"+ar[15]+"','"+ar[16]+"','"+ar[17]+"','"+ar[18]+"','"+ar[19]+"','"+
                    ar[20]+"','"+ar[21]+"','"+ar[22]+"','"+ar[23]+"','"+ar[24]+"','"+ar[25]+"','"+ar[26]+"','"+ar[27]+"','"+ar[28]+"' "
        }else if(ar.length==31){
            //console.log('running ar.length=31');
            db_str= ar[0]+"','"+ar[1]+"','"+ar[2]+"','"+ar[3]+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','"+ar[29]+"','"+ar[30]+"','"+ar[9]+"','"+
                    ar[10]+"','"+ar[11]+"','"+ar[12]+"','"+ar[13]+"','"+ar[14]+"','"+ar[15]+"','"+ar[16]+"','"+ar[17]+"','"+ar[18]+"','"+ar[19]+"','"+
                    ar[20]+"','"+ar[21]+"','"+ar[22]+"','"+ar[23]+"','"+ar[24]+"','"+ar[25]+"','"+ar[26]+"','"+ar[27]+"','"+ar[28]+"' "
        }

        //console.log('db_str: '+db_str);

        sql_db("ADMIN~EXEC POST_ROLES '"+db_str ,sqlConfig,
                        function(db_data){
                            cb(hb);
                        });

        // } else{
        //     cb("Exception_db: db pre check rejected user input")
        // }
    } catch (error) {
        console.log(error);
    }
    
}

exports.POST_COMMITTEES = async function (ar,cb){
    // var chk1 = chk_inpt_sql_inj(arg1);
    // var chk2 = chk_inpt_sql_inj(arg2);
    // var chk3 = chk_inpt_sql_inj(arg3);
    try {
        //if (chk1 && chk2 && chk3){
//PROC POST_COMMITTEES @_CONG_NUM int,@_MEM_ID varchar(15),@_PARTY varchar(5),@_COMTEE_NAME varchar(500),@_CODE varchar(7),@_SIDE varchar(500),@_TITLE varchar(250),@_RANK_IN_PARTY int,@_START_DATE date,@_END_DATE date       =8
            sql_db("ADMIN~EXEC POST_COMMITTEES '"+ ar[0]+"','"+ar[1]+"','"+ar[2]+"','"+ar[3].replace("'","''")+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','"+ar[9]+"' ",sqlConfig,
                function(db_data){
                    if (cb != null) cb(db_data[0]);
            });
        // } else{
        //     cb("Exception_db: db pre check rejected user input")
        // }
    } catch (error) {
        console.log(error);
    }
    
}

exports.POST_SUB_COMMITTEES = async function (ar,cb){
    // var chk1 = chk_inpt_sql_inj(arg1);
    // var chk2 = chk_inpt_sql_inj(arg2);
    // var chk3 = chk_inpt_sql_inj(arg3);
    try {
        //if (chk1 && chk2 && chk3){
//PROC POST_SUB_COMMITTEES @_CONG_NUM int,@_MEM_ID varchar(15),@_PARTY varchar(5),@_SUB_COMTEE_NAME varchar(500),@_PRNT_COMTEE_CODE  varchar(7),@_CODE varchar(10),@_SIDE varchar(500),@_TITLE varchar(250),@_RANK_IN_PARTY int,@_START_DATE date,@_END_DATE date       =9
            sql_db("ADMIN~EXEC POST_SUB_COMMITTEES '"+ ar[0]+"','"+ar[1]+"','"+ar[2]+"','"+ar[3].replace("'","''")+"','"+ar[4]+"','"+ar[5]+"','"+ar[6]+"','"+ar[7]+"','"+ar[8]+"','"+ar[9]+"','"+ar[10]+"' ",sqlConfig,
                function(db_data){
                    if (cb != null) cb(db_data[0]);
            });
        // } else{
        //     cb("Exception_db: db pre check rejected user input")
        // }
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
