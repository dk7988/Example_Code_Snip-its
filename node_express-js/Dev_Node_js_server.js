const cluster = require('cluster');
const numCPUs = 3; //require('os').cpus().length;
var usb = require('usb');
var sql_db = require('./Dev_sql_db');
const { select } = require('underscore');
var wrkr_id = 0;
var AR_waiting_4_usb_attached_event= [];


class usb_wait_ar_elem{
    wrk_id=0;
    wrkr_usb_wait_ar_idx_num = 0;
    constructor(wrk_id, idx_num){
        this.wrk_id=wrk_id;
        this.wrkr_usb_wait_ar_idx_num = idx_num;
    }
}



if (cluster.isMaster) {
    console.log('Master %s is running', process.pid);
  
   
    function messageHandler(msg) {
        if (msg.cmd != undefined && msg.cmd != null && msg.cmd != '') {
            switch (msg.cmd) {
                case 'wrkr_id':
                    wrkr_id = msg.data;
                    break;

                case 'add_2_usb_wait_ar':
                    AR_waiting_4_usb_attached_event.push(new usb_wait_ar_elem(msg.wrk_id,msg.wrkr_usb_wait_ar_idx_num))

                    //console.log('edit_usb_wait_ar -- AR_waiting_4_usb_attached_event: ');
                    //console.log("%o",AR_waiting_4_usb_attached_event);
                    
                    break;
            
                default:
                    console.log("incoming message from a worker: \n"+msg)
                    break;
            }
        }
    }


    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }



    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }


  
    //Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker,
        // we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });




    usb.on('attach', (device) => {
        //console.log("%o",cluster.workers);
        try {
            console.log('process.pid: '+process.pid);

            //console.log('usb.on("attach") -- AR_waiting_4_usb_attached_event: ');
            //console.log("%o",AR_waiting_4_usb_attached_event);

            if (Array.isArray(AR_waiting_4_usb_attached_event) && AR_waiting_4_usb_attached_event.length > 0) {
                var worker = cluster.workers[AR_waiting_4_usb_attached_event[0].wrk_id];
                //console.log('usb.on("attach") -- worker: ');
                //console.log("%o",worker);
                worker.send({ cmd: 'usb.attached' , data:{obj: device, usb_waiter_ar_idx: AR_waiting_4_usb_attached_event[0].wrkr_usb_wait_ar_idx_num}});
                AR_waiting_4_usb_attached_event.splice(0,1);

            } else cluster.workers[0].send({ cmd: 'usb.attached' , obj: device});    

        } catch (error) {
            console.log("blew up on usb.on('attach')");
            console.log(error);
        }
        
      });





    
      usb.on('detach', () => {
        //console.log("%o",cluster.workers);
        try {
            //if (wrkr_id != 0) cluster.workers[wrkr_id].send({ cmd: 'usb.detached' });
            cluster.workers[1].send({ cmd: 'usb.detached' });
        } catch (error) {
            console.log("blew up on usb.on('detach')");
        }
      });




} else {

    var https = require('https');
    //var sql_db = require('./Dev_sql_db');
    var url = require('url');
    var express = require('express');
    var app = express();
    var fs = require("fs");
    const { exec, spawn } = require('child_process');
    var client = require('smartsheet');
    var smartsheet = client.createClient({ "accessToken": "auth_code" });
    var fileManager = require('<fullpath_network_location>');
    var wrk_id = cluster.worker.id;



    app.use(express.json({inflate: true,limit: '100mb',reviver: null,strict: false,type: 'application/json',verify: undefined}));
    app.use(express.urlencoded({limit: '100mb', extended: true }));

    app.use(express.static('<network_location>'));
    app.use(express.static('<network_location>'));// location of EZ nav. for UI file manager
    
    var loc_of_bat_2_exec;
    var sht_html_pg;
    var loc_of_pblc_srvr_files;
    var proj_dash_file_name;
    var static_proj_sht_html_pgs;
    var DEV_index_file;
    var proj_dash_file;
    var static_new_proj_frms;
    var new_proj_frm_file;
    var static_url_shrtcts;
    var contd_drvs; 
    var srvr_globl_vars;



    function msg_master(msg){
        process.send(msg);
        //process.send({ cmd: 'notifyRequest' });
    }

    function log_wrkr_id(wrkr_id){
        process.send({ cmd: 'wrkr_id' ,data: wrkr_id});
    }


    function get_var(data, var_name){
        for (i = 0; i < data.length ; i++) {
            if (data[i][0].toString().toUpperCase() == var_name.toUpperCase()){
                return data[i][1].toString();
            }
        }
    }


    sql_db.GET_WEB_SERVER_VARS( function(data){
        //returning: 
        //      [
        //        ["loc_of_bat_files","<network_location>"],
        //        ["loc_of_sht_html_pg","<fullpath_network_location>"]
        //      ]
        //console.log("returning: "+JSON.stringify(data)+"\n");
        srvr_globl_vars = data;
        for (i = 0; i < data.length ; i++) {
            if (data[i][0].toString().toUpperCase() == "LOC_OF_BAT_FILES"){
                 loc_of_bat_2_exec = data[i][1].toString();
                 loc_of_pblc_srvr_files = loc_of_bat_2_exec;
            } else if (data[i][0].toString().toUpperCase() == "LOC_OF_SHT_HTML_PG"){
                 sht_html_pg = data[i][1].toString();
            }
          }

     proj_dash_file_name = "DEV_ID_Project_Dashboard.html";
     static_proj_sht_html_pgs = loc_of_pblc_srvr_files+'<network_location>';
     DEV_index_file = loc_of_pblc_srvr_files+ "<file_name>";
     DEV_index_templt_file = loc_of_pblc_srvr_files+ "<file_name>";
     proj_dash_file = loc_of_pblc_srvr_files + proj_dash_file_name;
     static_new_proj_frms = loc_of_pblc_srvr_files+'<network_location>';
     new_proj_frm_file = "<file_name>"; // static_new_proj_frms+
     static_url_shrtcts = loc_of_pblc_srvr_files+'url_shortcuts';
     login_dia_frm = '<file_name>';
     login_dia_test_frm = '<file_name>';
     fileexplr_file='<file_name>';
     usr_notes_file='<file_name>';



     
     app.use('/BB', express.static(static_proj_sht_html_pgs));
     app.use(express.static(static_new_proj_frms));
     app.use(express.static(static_url_shrtcts));

    app.get("/",(req, res) => res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm)));
    app.get("/p2",(req, res) => res.end(fs.readFileSync(sht_html_pg)));
    app.get("/PRO_DASH", (req, res) => res.end(fs.readFileSync(proj_dash_file)));
    app.get("/ADD_NEW_PROJECT",(req, res) => res.end(fs.readFileSync(static_new_proj_frms+new_proj_frm_file)));
    app.get("/NEW_PROJECT_FORM",(req, res) => res.end(new_proj_frm_file));
    app.get("/FILEEXPLR",function (req, res) {
         var auth_code = req.headers.cookie.split("=")[1];
         sql_db.DOES_USR_GET_FILE_EXPLR(auth_code, function(db_res_1){
             if (db_res_1 == 1){
                res.end(fileexplr_file);
            } else {
                res.end("User doesn't have the correct permissions for this File Explr");
            }
        })
    })
    app.get("/FILE_EXPLR",function (req, res) {
        try {
            var auth_code = req.headers.cookie.split("=")[1];
            sql_db.DOES_USR_GET_FILE_EXPLR(auth_code, function(db_res_1){
                if (db_res_1 == 1){
                    res.end(fs.readFileSync(loc_of_pblc_srvr_files+fileexplr_file));
               } else {
                   res.end("User doesn't have the correct permissions for this File Explr");
               }
           }) 
        } catch (error) {
            res.end('<iframe style="display:none" onload="top.parent.chld_2_prnt_chk_usr();" ></iframe>');
        }

   })
     
     app.get("/login_form",(req, res) => res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_frm)));
     app.get("/login",(req, res) => res.end(login_dia_frm));
     app.get("/usrnts",(req, res) => res.end(usr_notes_file));

     console.log('login_file: '+login_dia_frm);
     console.log('proj_dash_file_name: '+proj_dash_file_name);
     console.log('static_proj_sht_html_pgs: '+static_proj_sht_html_pgs);
     console.log('DEV_index_file: '+DEV_index_file);
     console.log('proj_dash_file: '+proj_dash_file);
     console.log('static_new_proj_frms: '+static_new_proj_frms);
     console.log('new_proj_frm_file: '+new_proj_frm_file);
     console.log('static_url_shrtcts: '+static_url_shrtcts);
     console.log('usr_notes_file: '+usr_notes_file);
     console.log(' ');
     console.log(' ');

    
    global.btoa = function (str) {return new Buffer.from(str, 'binary').toString('base64');};
    global.atob = function (str) {return new Buffer.from(str, 'base64').toString('binary');};


function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}

app.get("/GET_PG_DATA/:id", function (req, res){
    var arg = fix_arg_strg(req.url.split("/")[2]);
    var file_2_get = __dirname + "<network_location>"+arg;
    var other_file_2_delete = __dirname + "<network_location>"+arg.toString().split(".")[0]+'.html';
    res.end(btoa(btoa(btoa(fs.readFileSync(file_2_get)))));
    if (arg.toString().toUpperCase() != 'DEFAULT.JSON'){
        fs.unlink(file_2_get, (err) => {
            if (err) throw err;
            //console.log(file_2_get+ ' was deleted');
          });
          fs.unlink(other_file_2_delete, (err) => {
            if (err) throw err;
            //console.log(other_file_2_delete+ ' was deleted');
          });
    }
});

app.get('/SITES/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    sql_db.GET_SITES( function (data){
        if (data == null){
            res.end("Error 1: No results found");
        } else {
            //console.log("returning: "+JSON.stringify(data));
            try{
                res.end(btoa(btoa(btoa(JSON.stringify(data)))));
            } catch (err) {
                console.log(err);
            }
        }          
    });
})


app.get("/get_utilites",function (req, res) {
    try {


        system_user_check(req, res, function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){

                sql_db.GET_UTILITIES(snt_dta[0],snt_dta[1], function(db_res){
                    //console.log("%o",db_res);
                    switch(db_res){
                        case "Exception_db: db pre check rejected user input" :
                            res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_res);
                            break;
                        case undefined :
                            res.end("Error 4: No results found or you don't have permission to view this content");
                            break;
                        case null :
                            res.end("Error 4: No results found or you don't have permission to view this content");
                            break;
                        case "" :
                            res.end("Error 4: No results found or you don't have permission to view this content");
                            break;
                        default:
                            //console.log("returning: "+JSON.stringify(db_res));
                            try{
                                res.end(btoa(btoa(btoa(JSON.stringify(db_res)))));
                            } catch (err) {
                                console.log(err);
                            }
                        }
                })
            }else
                res.status(401).end("<h1>GETTING_UPLD_DWNLD_INFO_2:<br> Looks like you don't have permission for this action and or to view this page </h1>");
        });


    } catch (error) {
        res.status(500).end("<h1>GETTING_UTILITIES_FROM_BD_2:<br> OoOpPsS..!! Either permissions are incorrect or Nick messed up again :/ my bad </h1>");
        console.log(error);
    }

})



app.get('/LEVELS/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var db_arg = fix_arg_strg(req.url.split("/")[2]);
    sql_db.GET_LEVELS(db_arg, function (data){
        switch(data){
            case "Exception_db: db pre check rejected user input" :
                res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                break;
            case null :
                res.end("Error 5: No results found");
                break;
            default:
                //console.log("returning: "+JSON.stringify(data));
                try{
                    //res.end(JSON.stringify(data));
                    res.end(btoa(btoa(btoa(JSON.stringify(data)))));
                } catch (err) {
                    console.log(err);
                }
            }
        });
})

app.get('/SHEET_TYPES/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var db_arg = fix_arg_strg(req.url.split("/")[2]);
    //console.log("Going to db with Get_Sheet_Types('"+db_arg+"')");
    sql_db.GET_SHEET_TYPES(db_arg, function (data){
        switch(data){
            case "Exception_db: db pre check rejected user input" :
                res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                break;
            case null :
                res.end("Error 7: No results found");
                break;
            default:
                //console.log("returning: "+JSON.stringify(data));
                try{
                    res.end(btoa(btoa(btoa(JSON.stringify(data)))));
                } catch (err) {
                    console.log(err);
                }
            }
        });
})

app.post('/CALC_SHEET_NAME/:data', function (req, res){
    //console.log("Post connection received");
    res.header("Access-Control-Allow-Origin", "*");
    var db_arg = fix_arg_strg(req.params['data']);
    console.log(db_arg);
    if ((1+1) == 2) {
    sql_db.CALC_SHT_NAME(db_arg, function (data){
        switch(data){
            case "Exception_db: db pre check rejected user input" :
                res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                break;
            case null :
                res.end("Error 14: No results found");
                break;
            default:
                //console.log("returning: "+JSON.stringify(data));
                try{
                    res.end(btoa(btoa(btoa(JSON.stringify(data)))));
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
})


app.post('/auth',function(req, res){
    //console.log("Post connection received");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Auth", "");
    sql_db.CHECK_LOGIN(req.body.DATA,function(db_data){
        res.setHeader("Auth", db_data[0]._KEY);
        res.end(btoa(btoa(btoa(db_data[0]._AUTH.toString()))));
    });
})

function Buf_2_key(bufr){
    var bufdataAR = JSON.parse(JSON.stringify(bufr)).data
    var rtn = '';
    for(i=0;bufdataAR.length>i;i++){
        rtn = rtn + bufdataAR[i].toString();
        //console.log(rtn);
    }
    return rtn;
}



app.get("/HOME",function (req, res) {
    res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm));
})

app.get("/HOME/",function (req, res) {
    res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm));
})

app.post("/HOME",function (req, res) {
    var auth_code = req.body.strg;
    try {
        //console.log("auth_code = " + auth_code.toString());
        sql_db.CHECK_AUTH_CODE(auth_code, function(db_res){
            //console.log("auth_code = " + auth_code.toString());
            //console.log('DB responce = '+db_res);
            if (db_res == 'true'){
                sql_db.GET_USER_ID(auth_code, function(db_res_1){
                    console.log('user_id = '+db_res_1);
                    make_home_page(auth_code,function(html_strg){
                        var mod_idx_pg = DEV_index_file.split(".")[0]+db_res_1.toString()+".html"
                        fs.writeFile(mod_idx_pg, html_strg, function (err) {
                            if (err) {
                                res.end(fs.readFileSync(DEV_index_file));
                                throw err;
                            }else{
                                res.end(fs.readFileSync(mod_idx_pg));
                                fs.unlink(mod_idx_pg, (err) => {
                                    if (err) {
                                      console.error(err)
                                      return
                                    }
                                })
                            }
                        });
                    });
                })
            } else{
                res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm));
            }
        })
    } catch (error) {
        res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm));
    }
})

app.get("/usrnts",function (req, res) {
    var auth_code = req.headers.cookie.split("=")[1];
    try {
        sql_db.CHECK_AUTH_CODE(auth_code, function(db_res){
            try {
                if (db_res == 'true'){
                    res.end(usr_notes_file);
                } else{
                    res.status(401).end("<h1>USER_UPDATES_1:<br> Looks like you don't have permission to this page </h1>");
                }
            } catch (error) {
                res.status(500).end("<h1> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
                console.log(error);
            }
        })
    } catch (error) {
        res.status(500).end("<h1>USER_UPDATES_2:<br> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
        console.log(error);
    }
})






app.get("/fil_dwnld_rqsts",function (req, res) {
    var auth_code = req.headers.cookie.split("=")[1];
    try {
        sql_db.CHECK_AUTH_CODE(auth_code, function(db_res){
            try {
                //console.log("auth_code = " + auth_code.toString());
                //console.log('DB responce = '+db_res);
                if (db_res == 'true'){
                    sql_db.GET_USER_ID(auth_code, function(db_res_1){
                        try {
                            console.log('user '+db_res_1+' is requesting the list of available SCAN DOWNLOAD REQUESTS ');
                            sql_db.GET_SCN_DWNLD_FILL_RQSTs(db_res_1.toString(),function(dwld_fil_rests){
                                console.log("dwld_fil_rests:");
                                console.log("%o",dwld_fil_rests)
                                res.end(btoa(btoa(btoa(JSON.stringify(dwld_fil_rests)))));
                            })
                        } catch (error) {
                            res.end();
                            console.log(error);
                        }
                    })
                } else{
                    res.end();
                }
            } catch (error) {
                res.end();
                console.log(error);
            }
        })
    } catch (error) {
        res.end("auth not accepted");
    }    

})








app.get("/usr_updts",function (req, res) {
    //var auth_code = req.body.strg;
    var auth_code = req.headers.cookie.split("=")[1];
    try {
        sql_db.CHECK_AUTH_CODE(auth_code, function(db_res){
            try {
                //console.log("auth_code = " + auth_code.toString());
                //console.log('DB responce = '+db_res);
                if (db_res == 'true'){
                    sql_db.GET_USER_ID(auth_code, function(db_res_1){
                        try {
                            console.log('user '+db_res_1+' requesting user notification(s) refresh');
                            sql_db.get_user_notfcts(db_res_1.toString(),function(notes){
//build page on server or sent DB results to user and have client page manage data?
                                var sc_rqst=[];
                                var pj_nts=[];
                                var up_pj_evts=[];
                                var i_tbl=-1;
                                for (let i = 0; i < notes.length; i++) {
                                    if (notes[i].DB_IDX_NUM == null){
                                        switch (notes[i].NOFCTN_STRG) {
                                            case 'START-SCAN_REQSTs':
                                                i_tbl=0;
                                                break;
                                            case 'START-PROJ_NOTES':
                                                i_tbl=1;
                                                break;
                                            case 'START-UPCMG_PROJ_EVNTS':
                                                i_tbl=2;
                                                break;
                                            default:
                                                i_tbl=-1
                                                break;
                                        }
                                    } else{
                                        switch (i_tbl) {
                                            case 0:
                                                sc_rqst.push(notes[i]);
                                                break;
                                            case 1:
                                                pj_nts.push(notes[i]);
                                                break;
                                            case 2:
                                                up_pj_evts.push(notes[i]);
                                                break;
                                            default:
                                                break;
                                        }

                                    }
                                }
                                res.end(btoa(btoa(btoa(JSON.stringify([sc_rqst,pj_nts,up_pj_evts])))));

                            })
                        } catch (error) {
                            res.end();
                            console.log(error);
                        }
                    })
                } else{
                    res.end();
                }
            } catch (error) {
                res.end();
                console.log(error);
            }
        })
    } catch (error) {
        res.end("auth not accepted");
    }
})



//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function get_vals_from_cookies(vals_2_lk_4, cookie_ar){
    var rtn_ar=[];
    for (let i = 0; i < vals_2_lk_4.length; i++) {
        var re = new RegExp(vals_2_lk_4[i].toUpperCase(), 'g');
        for (let ix = 0; ix < cookie_ar.length; ix++) {
            if(cookie_ar[ix].toUpperCase().match(re))
                if(cookie_ar[ix].split("=")[1]!=undefined&&cookie_ar[ix].split("=")[1]!=null&&cookie_ar[ix].split("=")[1]!='')
                    rtn_ar.push(cookie_ar[ix].split("=")[1]);
        }
    }
    return JSON.parse(JSON.stringify(rtn_ar));
}

app.get("/can_dwld_rqst",function (req, res) {
    try {
        system_user_check(req, res, function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                ///-----------start of develop block-------------------------------
                console.log('user '+usr_id+' has sent a cancel download request');
                //console.log("snt_dta.data");
                //console.log("%o",snt_dta);
                var req_id = snt_dta.data.toString();
                console.log("req_id="+req_id);
                sql_db.CAN_DWNL_FIL_REQST(usr_id.toString(), req_id,function(){
                    res.end("cancelled request completed");
                })
            }
        })
    }catch(err){

    }
});


app.get("/scan_req_info",function (req, res) {
    thingy_3(req, res);
});

async function thingy_3(req, res){
    try {
        system_user_check(req, res,async function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                ///-----------start of develop block-------------------------------
                console.log('user '+usr_id+' is trying to fill a scan download request');
                var req_id = snt_dta;
                var scn_req = new scan_dwnld();//(req_id,usr_id,res);
                scn_req = await scn_req._new(req_id,usr_id,res);

                console.log("here_1- scn_req: ");
                scn_req.toString();

                scn_req.check_drv_spce(false,function(rtn_val){
                //if (scn_req.chk2==false){//<-- the selected "copy_to" drive DOES NOT have enough free space on it for the download
                if (scn_req.drv_has_spce_4_cmplt_dwnld==false){//<-- the selected "copy_to" drive DOES NOT have enough free space on it for the download
                    //console.log("Some error happed while checking drive space")
                    //scn_req.toString();
                    if (scn_req.srvr_exe_rslts_msg.match(/MISSING FROM SYSTEM/g)&& scn_req.srvr_exe_rslts_msg.match(/DRIVE/g))
                        scn_req.slctd_drvs_hvng_comm_prob_wth_systm();//<-- selected drives are having comm issuses with system or drive(s) are NOT attached to system
                    else if (scn_req.srvr_exe_rslts_msg.match(/NOT ENOUGH/g) && scn_req.srvr_exe_rslts_msg.match(/SPACE/g))
                        chk_for_new_usb_drvs(function(){
                            scn_req.user_slct_drv();//<-- "copy_to" drive HAS NOT been selected and IS NOT the db... have user select a "copy_to" drive
                        })
                    else
                        chk_for_new_usb_drvs(function(){
                            scn_req.user_slct_drv();//<-- "copy_to" drive HAS NOT been selected and IS NOT the db... have user select a "copy_to" drive
                        })
                }else{
                    console.log("rtn_val: ");
                    console.log("%o", rtn_val);
                    console.log("here_2- scn_req: ");
                    scn_req.toString();
                    if (rtn_val) scn_req.fill_scan_dwnld_req();//<-- "copy_to" drive is selected and in the db and has enough free space 4 download
                    else scn_req.user_slct_drv();//<-- "copy_to" drive HAS NOT been selected and IS NOT the db... have user select a "copy_to" drive
                  
                  
                    // to do:
                    // still have to send message to user saying the download as started
                    //      "scn_req.fill_scan_dwnld_req()" send 'Download started' status.. make sure page both the "User_Notcfns.html" and "FileExplr.html" are in sync for this type of responce






                }
            });

                ///-----------end of develop block-------------------------------
            }else
                res.status(401).end("<h1>USER_UPDATES_1:<br> Looks like you don't have permission to this page </h1>");
        });
    } catch (error) {
        res.status(500).end("<h1>USER_UPDATES_2:<br> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
        console.log(error);
    }
}






//----------------as of 1/4/2021--VVV this needs to be retested--- code modified on 1/4/2021 to make code more modular-----
async function thingy_5(req, res){
    try {
        system_user_check(req, res, async function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                ///-----------start of develop block-------------------------------
                console.log('user '+usr_id+' is trying to update scan download request data and is getting scan request data from DB');
                //console.log('user '+usr_id+' is getting scan request data from DB');
                
                console.log('snt_dta: ');
                console.log('%o',snt_dta);


                var req_id = snt_dta[0];
                var cpy_2_drv = snt_dta[1]//.split('\/')[0];


                //---------------------------------------------------------------------------------------------------------------------------------------
                if(cpy_2_drv.match(/,/g)){
                    var ar = cpy_2_drv.split(",");
                    var slctn_drvs =''
                    cpy_2_drv ='';
                    for (let i = 0; i < ar.length; i++) {
                        slctn_drvs= slctn_drvs + ar[i].split(":")[0]+":\\"
                        cpy_2_drv = cpy_2_drv + ar[i].split(":")[0]
                        if (i+1 < ar.length){
                            slctn_drvs=slctn_drvs+','
                            cpy_2_drv=cpy_2_drv+','
                        }
                    }
                }else {
                    slctn_drvs = cpy_2_drv.split(":")[0]+":\\";
                    cpy_2_drv = cpy_2_drv.split(":")[0];
                }

                console.log("req_id: "+req_id.toString());
                console.log("cpy_2_drv: "+cpy_2_drv.toString());
                //var admin_id = db_res_1;
                sql_db.CHK_DRVS(cpy_2_drv, async function(rtn_val){
                    if (rtn_val!=0){


                        var scn_req_2 = new scan_dwnld();//(req_id,usr_id,res);
                        //scn_req_2 = await scn_req_2._new(req_id,usr_id,res,cpy_2_drv.toString()+":\\");
                        scn_req_2 = await scn_req_2._new(req_id,usr_id,res,slctn_drvs);
                        //scn_req_2.slctd_drv = cpy_2_drv.toString()+":\\";


                        console.log("here_1- scn_req_2: ")
                        scn_req_2.toString()


                        await scn_req_2.check_drv_spce(false, async function(rtn_val){
                            console.log("rtn_val: ");
                            console.log("%o",rtn_val);

                            console.log("here_2- scn_req_2: ")
                            scn_req_2.toString()


                            if (scn_req_2.chk2==false||rtn_val==false){//<-- A "copy_to" drive has NOT been selected OR "check_drv_spce" returned false (meaning the selected "copy_to" drive dosen't have enough room for download)
                                 //the selected "copy_to" drive dosen't have enough room for download and as been denied being used

                                if (snt_dta[2]==undefined){
                                    // this path is execuated when the UI form/page that made this call is NOT the "Dwnlod_Rqst_Drv_Spc_Err.html" form/page
                                    // to do:
                                    // Execute PATH A.2.6 here
                                    //    make another html page that manages Ui functions and Ui to system functions of/for PATH A.2.6.a-d
                                    //  when this path is executed it will return the above ^^ html page ("Dwnlod_Rqst_Drv_Spc_Err.html") to the ID Employee trying to fill the request



                                    console.log("here_3- scn_req_2: ")
                                    scn_req_2.toString()

                                    scn_req_2.user_slct_drv();
                                }else{
                                    // the ui form/page that made this call was "Dwnlod_Rqst_Drv_Spc_Err.html" form/page  <--- this is the only way this path can be execuated
                                    console.log("Dwnlod_Rqst_Drv_Spc_Err.html made this call and the user selected drive(s) that are still to small for the download request")
                                    var obj = new Object;
                                    obj.msg="the selected drive or group of drives are still to small for the download to be completed";
                                    obj.rtn_code=0;
                                    res.status(500).end(btoa(btoa(btoa(JSON.stringify(JSON.parse(JSON.stringify(obj)))))));
                                }


                            }else{//<-- the selected "copy_to" drive(s) has enough room for download
                                //console.log("rtn_val: ");
                                //console.log("%o", rtn_val);
                                
                                //if (rtn_val) scn_req.fill_scan_dwnld_req(); //<-- "copy_to" drive is selected and in the db and has enough free space 4 download
                                //else scn_req.user_slct_drv(); //<-- "copy_to" drive HAS NOT been selected and IS NOT the db... have user select a "copy_to" drive
                              
//                        scn_req_2.slctd_drv = cpy_2_drv.toString();
//                        console.log('\nrunning scn_req_2.check_drv_spce(false)\n');
//                        if (scn_req_2.check_drv_spce(false)){

                        if (snt_dta[3]==1){
                            sql_db.REPLACE_SCAN_DWNLD_REQST_DRV_LTR(usr_id.toString(),req_id.toString(),cpy_2_drv.toString(),
                                function(rtn_val){do_this_after_db(rtn_val);})
                        } else{
                            sql_db.UPDATE_SCAN_DWNLD_REQST_DRV_LTR(usr_id.toString(),req_id.toString(),cpy_2_drv.toString(),
                            function(rtn_val){
                                if (rtn_val.toString().match(/COPY_TO DRIVE HAS ALREADY/g)){
                                    sql_db.UPDATE_SCAN_DWNLD_REQST_MULTI_DRV_LTR(usr_id.toString(),req_id.toString(),cpy_2_drv.toString(),
                                    function(rtn_val){do_this_after_db(rtn_val);})
                                }else do_this_after_db(rtn_val);
                            })
                                //function(rtn_val){
                                //    if (rtn_val=='1'){
                                //        console.log('user '+usr_id+': db accepted scan download request update');
                                //        console.log('now trying to fill a scan download request');
                                //        scn_req_2.fill_scan_dwnld_req();
                                //        //fill_scan_dwnld_req(req_id,usr_id,res);
                                //    } 
                                //    else {
                                //        console.log('user '+usr_id+
                                //            ' is trying to update scan request data but the the DB returned: \n'+
                                //             rtn_val);
                                //             res.status(500).end("<h1>UPDATE_SCAN_REQUEST_DATA_2:<br> "+rtn_val+" </h1>");
                                //    }
                                //})
//          ----VVVVV--3/5/21 this "else" path should not be executed.. 'scn_req_2.check_drv_spce' should now be managing this but leaving just in case------VVVV-------
//       ----- -2/22/2021 -----left off here  VVV trying to figure out how to reture drive space problem 
//                        } //else res.end("selected drive can't be used as it doesn't have enough free space on it");
                        }


                        function do_this_after_db(rtn_val){
                            if (rtn_val=='1'){
                                console.log('user '+usr_id+': db accepted scan download request update');
                                console.log('now trying to fill a scan download request');
                                scn_req_2.fill_scan_dwnld_req();
                                //fill_scan_dwnld_req(req_id,usr_id,res);
                            } 
                            else {
                                console.log('user '+usr_id+
                                    ' is trying to update scan request data but the the DB returned: \n'+
                                     rtn_val);
                                     res.status(500).end("<h1>UPDATE_SCAN_REQUEST_DATA_2:<br> "+rtn_val+" </h1>");
                            }
                        }
                        

                    }

                });

                    } else {
                    // the selected drive is not a valid "copt_to" drive
                    res.status(404).end("<h1>UPDATE_SCAN_REQUEST_DATA_3:<br> selected drive is not a valid 'copt_to' drive or the selected drive can NOT be found</h1>");    
                    }
                });

//---------------------------------------------------------------------------------------------------------------------------------------



                ///-----------end of develop block-------------------------------
            }else
                res.status(403).end("<h1>UPDATE_SCAN_REQUEST_DATA_4:<br> Looks like you don't have permission for this action and or to view this page </h1>");
        });
    } catch (error) {
        res.status(500).end("<h1>UPDATE_SCAN_REQUEST_DATA_2:<br> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
        console.log(error);
    }
};





//-------data for client side status bar--------
app.get("/get_upld_dwnld_stats",function (req, res) {
    try {
        system_user_check(req, res, function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                console.log('user '+usr_id+' is requesting to view upload and download stats data');
                sql_db.GET_DWNLD_UPLD_STATS(usr_id.toString(), function(db_res){
                    //console.log("%o",db_res);
                    if (db_res!=undefined&&db_res!=null&&db_res!=''){
                        res.end(btoa(btoa(btoa( JSON.stringify(JSON.parse(JSON.stringify(db_res))) ))));
                    } else {
                        res.status(403).end("<h1>Looks like you don't have permission to view this content</h1>");
                    }

                })
            }else
                res.status(401).end("<h1>GETTING_UPLD_DWNLD_INFO_2:<br> Looks like you don't have permission for this action and or to view this page </h1>");

        });
    } catch (error) {
        res.status(500).end("<h1>GETTING_UPLD_DWNLD_INFO_2:<br> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
        console.log(error);
    }
})





function system_user_check(req, res, cb) {
    //console.log("req: ");
    //console.log("%o",req);

    var auth_code ='';
    var snt_dta ='';
    try {
        if (req.headers.cookie.split(";").length>=1)
        var cookie_vals = get_vals_from_cookies(['authcode','data'],req.headers.cookie.split(";"));
        
        //console.log("cookie_vals: ");
        //console.log("%o",cookie_vals);

        if(req.get('data')==undefined){
            auth_code = cookie_vals[0];
            snt_dta = cookie_vals[1];
            res.clearCookie('data');
        }else{
            //auth_code = req.headers.cookie.split("=")[1];
            auth_code = cookie_vals[0];
            try {
                snt_dta = fix_arg_strg(req.headers.data);   
                snt_dta = JSON.parse(JSON.stringify(JSON.parse(snt_dta)));
            } catch (error) {
                snt_dta = JSON.parse(JSON.stringify(JSON.parse(fix_arg_strg(req.headers.data)))); 
            }
        }
    } catch (error) {
        try {
            auth_code = req.headers.cookie.split("=")[1];
            snt_dta = JSON.parse(JSON.stringify(JSON.parse(fix_arg_strg(req.headers.data)))); 
            //    console.log("snt_dta:");
            //    console.log("%o",snt_dta);                    
        } catch (error) {
            console.log(error);
        }
    }

    console.log("auth_code: "+auth_code);
    console.log("snt_dta: "+snt_dta);

    var req_id = snt_dta;
    try {
        sql_db.CHECK_AUTH_CODE(auth_code, function(db_res){
            try {
                //console.log("auth_code = " + auth_code.toString());
                //console.log('DB responce = '+db_res);
                if (db_res == 'true'){
                    sql_db.GET_USER_ID(auth_code, function(db_res_1){
                        try {
            // user has passed security check and system as id.ed user (this could be an ID or non-ID employee)
                            //if (cb) cb(req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta);
                            if (cb) cb(req, res, auth_code, 1, db_res_1, snt_dta);
                            else return 1;
            //----------------------------------------------------               
            //----------------------------------------------------
            //----------------------------------------------------
                        } catch (error) {
                            res.end();
                            console.log(error);
                        }
                    })
                } else{
                    // user has NOT passed the security check and the system does NOT know who the user is
                    if (cb) cb(req, res, auth_code, 0, undefined, snt_dta);
                }
            } catch (error) {
                res.status(500).end("<h1> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
                console.log(error);
            }
        })
    } catch (error) {
        res.status(500).end("<h1>system_user_check_1:<br> OoOpPsS..!! Nick must have messed up again :/ my bad </h1>");
        console.log(error);
    }
}



//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------




app.use("/EXPLR",function (req, res) {
        var auth_code = req.headers.cookie.split("=")[1]; 
        sql_db.DOES_USR_GET_FILE_EXPLR(auth_code, function(db_res_1){
            if (db_res_1 == 1){
                req.originalUrl = req.originalUrl.replace(/\/EXPLR/,'/E/browse/')
                req.originalUrl = req.originalUrl.replace(/%5C/g,'');
                req._parsedUrl.pathname = req.originalUrl;
                req._parsedUrl.path=req.originalUrl;
                req._parsedUrl.href=req.originalUrl;
                req._parsedUrl._raw=req.originalUrl;

                chk_for_new_usb_drvs();
                res.end();
               
            } else {
                response.end("User doesn't have the correct permissions for this File Explr")
            }
        })  
    //}
})




function make_home_page(usr_auth,cb){
    //console.log("usr_auth = " + usr_auth.toString());
    var json_conf_file="";
    sql_db.GET_USR_UI_VIEW(usr_auth,function(db_res){
        try {
            var usr_view_code = db_res;
            //console.log("usr_view_code = " + usr_view_code.toString());
            switch (db_res.toString()) {
                //BASIC UI VIEW
                case "1":
                    json_conf_file="index_suprt_basic.json";
                    break;
                //TEAM LEAD UI VIEW
                case "2":
                    json_conf_file="index_suprt_team_lead.json";
                    break;
                //HR UI VIEW
                case "3":
                    json_conf_file="index_suprt_hr.json";
                    break;
                //ADMIN UI VIEW - BRITTANY (WILL PROBABLY NEED BOTH SCAN BUT NOT REPORTS)
                case "4":
                    json_conf_file="index_suprt_admin.json";
                    break;
                //OWNER UI VIEW
                case "5":
                    json_conf_file="index_suprt_owner.json";
                    break;
                //WIZARD UI VIEW
                case "6":
                    json_conf_file="index_suprt_wizard.json";
                    break;
                //PT_CLD_SCANS
                case "7":
                    json_conf_file="index_suprt_pt_cld_scans.json";
                    break;
                case "8":
                    json_conf_file="index_suprt_non_emp_view.json";
                    break;
                default:
                    json_conf_file="index_suprt_basic.json";
                    break;
                }
                //console.log("json_conf_file = " + json_conf_file.toString());
            edit_home_pg_sidebar(JSON.parse(JSON.stringify(JSON.parse(fs.readFileSync(loc_of_pblc_srvr_files+json_conf_file)))), 
                function(html_strg,nav_locs_ar,sprt_file){
                    cb(fs.readFileSync(DEV_index_templt_file).toString().replace(/_10001/,html_strg).replace(/_10002/,"["+nav_locs_ar+"]").replace(/_10003/,sprt_file) );
                });
        } catch (error) {
            console.log(error);
        }
    })
}

async function edit_home_pg_sidebar(ui_view, cb){
    var html_strg = "";
    var sprt_file=ui_view.sprt_file;
    //console.log("%o",ui_view);
    for (let i = 0; i < ui_view.sidebar_objs.length; i++) {
        //console.log("@ i = "+ i.toString());
        html_strg = html_strg + await make_div_wrpr(ui_view.sidebar_objs[i]);
    }
    var sidebar_locs = "";
    for (let i = 0; i < ui_view.sidebar_locs.length; i++) {
        var argm_ar="";
        for (let ix = 0; ix < ui_view.sidebar_locs[i].length; ix++) {
            if (ix==0){
                argm_ar='"'+ui_view.sidebar_locs[i][ix]+'"';
            }else{
                argm_ar=argm_ar+',"' + ui_view.sidebar_locs[i][ix]+'"';
            }
        }
        if (i==0){
            sidebar_locs = '['+argm_ar+']';
        }else{
            sidebar_locs = sidebar_locs+',['+ argm_ar+']';
        }
    }

    cb(html_strg,sidebar_locs,sprt_file);
}

async function make_div_wrpr(json_wrpr_obj){
    //console.log("json_wrpr_obj = ");
    //console.log("%o",json_wrpr_obj);
    var html_strg = '<div id="'+json_wrpr_obj.wrpr_obj.div_wrpr_id+'">'+
        '<'+json_wrpr_obj.wrpr_obj.hdr_obj.obj_type+
        ' id="'+json_wrpr_obj.wrpr_obj.hdr_obj.id+'" class="'+json_wrpr_obj.wrpr_obj.hdr_obj.class+'" >';
            html_strg = html_strg + await add_hdr_objs_2_wrpr(json_wrpr_obj.wrpr_obj.hdr_obj.hdr_objs);
    html_strg = html_strg +'</'+json_wrpr_obj.wrpr_obj.hdr_obj.obj_type+'>'
            html_strg = html_strg + await make_lst_obj(json_wrpr_obj.lst_obj);
    html_strg = html_strg+'</div>';

//    console.log("html_strg = ");
//    console.log(html_strg);
    return html_strg;
}


function chk_for_new_usb_drvs(cb){
    sql_db.GET_CNCTD_USB_DRVS(function(cnctd_usb_drvs){
        try {
            remove_file_mngrs(function(){
            contd_drvs = cnctd_usb_drvs
            for (let i = 0; i < cnctd_usb_drvs.length; i++) {
                var dir_2 = process.argv[2] || cnctd_usb_drvs[i].DRV_PATH;
                var drv_adrs = '/'+cnctd_usb_drvs[i].DRV_PATH.split(':')[0]+'/'
                ////app.use('/'+cnctd_usb_drvs[i].DRV_PATH.split(':')[0]+'/', fileManager(dir_2,{}, sql_db));
                try {
                    app.use(drv_adrs, fileManager(dir_2,{}, sql_db, drv_adrs, srvr_globl_vars));    
                } catch (error) {
                    console.log(error);
                }
                //app.use(express.static(JSON.stringify(cnctd_usb_drvs[i].DRV_PATH)));
            }
        });
        } catch (error) {
            console.log(error);
        }
        try {
            if (cb){
                cb();
            }
        } catch (error) {
            console.log(error);
        }
    })
}



app.get('/DRVS',function (req, res) {
    var auth_code = req.headers.cookie.split("=")[1];
    sql_db.DOES_USR_GET_FILE_EXPLR(auth_code, function(db_res_1){
        if (db_res_1 == 1){
            chk_for_new_usb_drvs(function(){
                var usb_drv_data_ar = JSON.parse(JSON.stringify(contd_drvs));
                for (let i = 0; i < usb_drv_data_ar.length; i++) {
                    var usb_drv_data =  {'PATH': '','CNCTED_DATE': '','NAME': '','CAPTION': ''};
                    //console.log("%o",usb_drv_data_ar[i]);
                    usb_drv_data.PATH = '/'+usb_drv_data_ar[i].DRV_PATH.toString().split(':')[0]+'/browse/';
                    usb_drv_data.CNCTED_DATE = usb_drv_data_ar[i].DRV_CNCTED_DATE;
                    usb_drv_data.NAME = usb_drv_data_ar[i].DRV_NAME;
                    usb_drv_data.CAPTION = usb_drv_data_ar[i].DRV_CAPTION;
                    usb_drv_data_ar[i] = usb_drv_data;
                    //console.log("%o",usb_drv_data_ar[i]);
                }
                //console.log("%o",usb_drv_data_ar);
                res.end(btoa(btoa(btoa(JSON.stringify(usb_drv_data_ar)))));
            });
        }
    });
})


app.post('/AA/', function (req, res){
    //console.log("Post connection received");
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var db_arg = fix_arg_strg(req.body.DATA);
    //console.log(db_arg);
    if ((1+1) == 2) {
        Process_API_CALL_A(db_arg, res);//, Process_API_CALLBACK(data));
    }
})


function res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res){
    console.log('running res_close_conn: \n'+
                '  rnme_chk ='+rnme_chk+'\n'+
                '  deacvte_chk ='+deacvte_chk+'\n'+
                '  acvte_chk ='+acvte_chk+'\n'+
                '  remv_chk ='+remv_chk+'\n'+
                '  make_chk ='+make_chk+'\n');
    if (rnme_chk && deacvte_chk && acvte_chk && remv_chk && make_chk ){
        console.log("\n completed tasks:\n - SHEET RENAME\n - SHEET DEACTIVATE\n - SHEET ACTIVATE\n - SHEET REMOVAL\n - NEW_SHEET_DATA\n");
        res.end();
    }
}



function Process_API_CALL_A(data, res, cb){
    var json_obj = JSON.parse(data);
    console.log("json_obj = ");
    console.log("%o", json_obj);
    //console.log(JSON.stringify(json_obj,null,2));
    //console.log(json_obj);
    var task = json_obj.UPLOADING;
    console.log("task = "+task);
    switch(task){
        case "NEW_SHEET_DATA":
            sht_ar = json_obj.db_post_sht_data;
            console.log("sht_ar = ");
            console.log("%o", sht_ar);
            db_post_sht_data_deactivate = [];
            db_post_sht_data_activate = [];
            db_post_sht_data_rename = [];
            db_post_sht_data_remove = [];
            db_post_sht_data_new = [];
            db_post_sht_data = [];
            var ix = [0,0,0,0,0,0];
            var data_hdr = {
                "UPLOADING":"",
                "PROJECT_NUMBER":json_obj.PROJECT_NUMBER,
                "PROJECT_NAME":json_obj.PROJECT_NAME
            }

            for(i=0;i<=sht_ar.length;i++){
              try {
                var data = JSON.parse(JSON.stringify(sht_ar[i]));
                if (data != null){
                  if (data.hasOwnProperty('sht_task') && data.hasOwnProperty('idx_num')){
                    switch (data.sht_task.toString().toUpperCase()) {
                        case "RENAME":
                            if (data.idx_num != ""){
                                db_post_sht_data_rename[ix[0]] = JSON.parse(JSON.stringify(data));
                                ix[0]++;
                            } else {
                                var pg_data = {
                                    "GENERAL_INFO":JSON.parse(JSON.stringify(data.GENERAL_INFO)),
                                    "SHEET_INFO":JSON.parse(JSON.stringify(data.SHEET_INFO)),
                                    "new_sht_name":JSON.parse(JSON.stringify(data.new_sht_name))
                                }
                                db_post_sht_data_new[ix[3]] = pg_data;
                                ix[3]++;
                            }
                            break;
                        case "DEACTIVATE": 
                            db_post_sht_data_deactivate[ix[1]] = JSON.parse(JSON.stringify(data));
                            ix[1]++;
                            break;
                        case "ACTIVATE": 
                            db_post_sht_data_activate[ix[4]] = JSON.parse(JSON.stringify(data));
                            ix[4]++;
                            break;
                        case "REMOVE": 
                            db_post_sht_data_remove[ix[5]] = JSON.parse(JSON.stringify(data));
                            ix[5]++;
                            break;



                        default:
                            db_post_sht_data[ix[2]] = JSON.parse(JSON.stringify(data));
                            ix[2]++;
                            break;
                      }
                  } else {
                    db_post_sht_data_new[ix[3]] = JSON.parse(JSON.stringify(data));
                    ix[3]++;
                  }
                }
              } catch (error) {
                //console.log(error);
              }
            }

            var rnme_chk = false;
            var deacvte_chk = false;
            var acvte_chk = false;
            var remv_chk = false;
            var make_chk = false;
            try {
                try {
                    if(db_post_sht_data_rename.length>0){
                        var rename_sht_data = JSON.parse(JSON.stringify(data_hdr));
                        rename_sht_data.UPLOADING="RENAME";
                        rename_sht_data.db_post_sht_data=db_post_sht_data_rename;
                        rename_shts(rename_sht_data,res,function(){
                            //console.log('setting rnme_chk = true');
                            rnme_chk = true;
                            res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                        });
                    } else {
                        //console.log('else: setting rnme_chk = true');
                        rnme_chk = true;
                        res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                    }
                } catch (error) {
                    rnme_chk = true;
                    var rnme_err = {
                        'task':"RENAME",
                        'error':error
                    }
                    throw new error(JSON.stringify(rnme_err));
                }


                try {
                    //DEACTIVATE -deactivate- deactivate_shts
                    if(db_post_sht_data_deactivate.length>0){
                        var deacvte_sht_data = JSON.parse(JSON.stringify(data_hdr));
                        deacvte_sht_data.UPLOADING="DEACTIVATE";
                        deacvte_sht_data.db_post_sht_data=db_post_sht_data_deactivate;
                        deactivate_shts(deacvte_sht_data,res,function(){
                            //console.log('setting deacvte_chk = true');
                            deacvte_chk = true;
                            res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                        });
                    } else {
                        //console.log('else: setting deacvte_chk = true');
                        deacvte_chk = true;
                        res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                    }
                } catch (error) {
                    deacvte_chk = true;
                    var deacvte_err = {
                        'task':"DEACTIVATE",
                        'error':error
                    }
                    throw new error(JSON.stringify(deacvte_err));
                }


                try {
                    //ACTIVATE activate_shts
                    if(db_post_sht_data_activate.length>0){
                        var acvte_sht_data = JSON.parse(JSON.stringify(data_hdr));
                        acvte_sht_data.UPLOADING="ACTIVATE";
                        acvte_sht_data.db_post_sht_data=db_post_sht_data_activate;
                        activate_shts(acvte_sht_data,res,function(){
                            //console.log('setting acvte_chk = true');
                            acvte_chk = true;
                            res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                        });
                    } else {
                        //console.log('else: setting acvte_chk = true');
                        acvte_chk = true;
                        res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                    }
                } catch (error) {
                    acvte_chk = true;
                    var acvte_err = {
                        'task':"ACTIVATE",
                        'error':error
                    }
                    throw new error(JSON.stringify(acvte_err));
                }


                try {
                    //REMOVE remove_shts
                    if(db_post_sht_data_remove.length>0){
                        var remove_shts_data = JSON.parse(JSON.stringify(data_hdr));
                        remove_shts_data.UPLOADING="REMOVE";
                        remove_shts_data.db_post_sht_data=db_post_sht_data_remove;
                        remove_shts(remove_shts_data,res,function(){
                            //console.log('setting remv_chk = true');
                            remv_chk = true;
                            res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                        });
                    } else {
                        //console.log('else: setting remv_chk = true');
                        remv_chk = true;
                        res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                    }
                } catch (error) {
                    remv_chk = true;
                    var remv_err = {
                        'task':"REMOVE",
                        'error':error
                    }
                    throw new error(JSON.stringify(remv_err));
                }




                try {
                    if(db_post_sht_data_new.length>0){
                        var new_sht_data = JSON.parse(JSON.stringify(data_hdr));
                        new_sht_data.UPLOADING="NEW_SHEET_DATA";
                        new_sht_data.db_post_sht_data=db_post_sht_data_new;
                        MAKE_NEW_SHEETS_FOR_PROJECT(JSON.stringify(new_sht_data), res,function(){
                            //console.log('setting make_chk = true');
                            make_chk = true;
                            res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                        });
                    } else {
                        //console.log('else: setting make_chk = true');
                        make_chk = true;
                        res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
                    }
                } catch (error) {
                    make_chk = true;
                    var make_err ={
                        'task':"NEW_SHEET_DATA",
                        'error':error
                    }
                    throw new error(JSON.stringify(make_err));
                }
            } catch (error) {
                //console.log('An error occurred while exectuing sheet tasks:\n'+
                //              ' - RENAME (rnme_chk ='+rnme_chk+')\n'+
                //              ' - HIDE (sheets -deacvte_chk ='+deacvte_chk+'-)\n'+
                //              ' - NEW_SHEET_DATA (make_chk ='+make_chk+')\n');
                                
                console.log('An error occurred while exectuing sheet task\n'+
                            JSON.parse(error).task.toString().toUpperCase()+'\n'+
                            '  rnme_chk ='+rnme_chk+'\n'+
                            '  deacvte_chk ='+deacvte_chk+'\n'+
                            '  acvte_chk ='+acvte_chk+'\n'+
                            '  remv_chk ='+remv_chk+'\n'+
                            '  make_chk ='+make_chk+'\n');
                console.log(JSON.parse(error).error);
                res_close_conn(rnme_chk,deacvte_chk,acvte_chk,remv_chk,make_chk,res);
            }


            break;
        case "ADD_PROJECT":
                var data_2 = json_obj.project_data;
                //post_new_project(data_2, res,function(db_reslts,db_arg,filename){
                post_new_project(data_2, function(db_reslts,db_arg,filename){
                    if (!sql_db.isObjPropEmpty(db_reslts)) {
                        ///----- make smartsheets stuff<<<--------------------------------------------------------------------------------------------
                        console.log("data_2 = "+data_2+"\n");
                        console.log("db_arg = "+db_arg+"\n");
                        make_smrtshts_4_proj(db_arg,function(rtn_data){
                                console.log("completed post")
                                make_proj_dash (db_arg,filename, true, res);
                        });
                    } else {
                        console.log("something unforseen happened with the post. check to see if the project was added\n\n"+data_2);
                        res.end(btoa(btoa(btoa("OoOpPsss!! Nick might have messed something up :/ my bad.\n"+
                        "something unforseen happened when trying to add the project. If you could,"+
                        "let Nick know so he can figure out what happened and get the project back on track.\n"+
                        "thank you for your help"))));
                    }
                });

                //res.end(btoa(btoa(btoa("the project was added to the DB"))));




                break;
            case "ADD_MILESTONE":

                //var upld_evnt_data = json_obj.project_data.evnt_data;
                try {
                    var upld_proj_data = json_obj.project_data.proj_data;
                    var milestn_2_add_2_proj = json_obj.project_data.milestns_2_add_2_proj;
                    if ((milestn_2_add_2_proj.length-1)>-1){
                        for (let i = 0; i < milestn_2_add_2_proj.length; i++) {
                            sql_db.ADD_NEW_MILE_STONE( upld_proj_data[2], milestn_2_add_2_proj[i].milestn_nme.trimEnd().trimStart(), 
                                milestn_2_add_2_proj[i].milestn_stat.trimEnd().trimStart(), 1, milestn_2_add_2_proj[i].milestn_due_date,
                                function(rntd_db_data){
                                    var db_data_ar=[];
                                    //console.log("upld_proj_data[2] =\n"+upld_proj_data[2]);
                                    sql_db.GET_PROJECT_EVENTS_2(upld_proj_data[2],db_data_ar,function(proj_event_data){
                                        //console.log("proj_event_data =\n");
                                        //console.log("%o", proj_event_data);
                                        res.end(btoa(btoa(btoa(convert_event_data_to_html_page_string(proj_event_data[0])))));
                                        //res.end(btoa(btoa(btoa("the milestone(s) have been added to the project"))));
                                    });
                            })
                        }
                    }
                    
                } catch (error) {
                    res.end(btoa(btoa(btoa("the milestone(s) have been added to the project but something happened while updating the dashboard, try refreshing the page"))));
                    console.log(error);
                }
                

                ///----- finish this part later VVVVVVVVV
                try {
                    var milestn_2_add_2_systm = json_obj.project_data.A_new_milestn_nme;
                    if ((milestn_2_add_2_systm.length-1)>-1){
                        for (let i = 0; i < milestn_2_add_2_systm.length; i++) {
                            //var mlst_2_ad_2_sys = milestn_2_add_2_systm[i].new_milestn_nme;
                            console.log("runnning to db to add milestone: "+milestn_2_add_2_systm[i].new_milestn_nme+"\n");
                        }
                    }
                ///----- finish this part later ^^^^^^^^^^^
                } catch (error) {console.log(error);}
               
                console.log("\n\n\n");
               

                break;
            case "MILESTONE_COMPLETED":
                try {
                    var upld_proj_data = json_obj.project_data.proj_data;
                    var upld_evnt_data = json_obj.project_data.evnt_data;
    
                    console.log("exectuing 'sql_db.MODFY_MILE_STONE' with \n\nsql_db.MODFY_MILE_STONE('"+
                    upld_proj_data[2]+"', '"+ upld_evnt_data[0].split(" - ")[0].trimEnd().trimStart()+
                    "', 'COMPLETED', 1, '"+new Date().toLocaleDateString().toString()+"')");
                    sql_db.MODFY_MILE_STONE( upld_proj_data[2], upld_evnt_data[0].split(" - ")[0].trimEnd().trimStart()
                    ,'COMPLETED', 1, new Date().toLocaleDateString().toString(),function(rntd_db_data){
                        var db_data_ar=[];
                        console.log("upld_proj_data[2] =\n"+upld_proj_data[2]);
                        sql_db.GET_PROJECT_EVENTS_2(upld_proj_data[2],db_data_ar,function(proj_event_data){
                            //console.log("proj_event_data =\n");
                            //console.log("%o", proj_event_data);
                            res.end(btoa(btoa(btoa(convert_event_data_to_html_page_string(proj_event_data[0])))));
                            //res.end(btoa(btoa(btoa("the milestone has been updated in the system"))));
                        });
                    })
                    
                } catch (error) {
                    res.end(btoa(btoa(btoa("the milestone has been updated in the system but something happened while updating the dashboard, try refreshing the page"))));
                    console.log(error);
                }

                console.log("\n\n\n");

                
                break;
                case "UPDATE_MILESTONE":
                    try {
                        var upld_proj_data = json_obj.project_data.proj_data;
                        var upld_evnt_data = json_obj.project_data.evnt_data;
        
                        var d_dte_strg='';
                        try {
                            var Updtd_mlstn_d_dte = upld_evnt_data[0].split("~")[1].trimEnd().trimStart().split("-");
                            d_dte_strg = Updtd_mlstn_d_dte[1]+"/"+Updtd_mlstn_d_dte[2]+"/"+Updtd_mlstn_d_dte[0]
                        } catch (error) {  }
                                               
                        

                        console.log("exectuing 'sql_db.MODFY_MILE_STONE' with \n\nsql_db.MODFY_MILE_STONE('"+
                        upld_proj_data[2]+"', '"+ upld_evnt_data[0].split("~")[0].split("-")[0].trimEnd().trimStart()+
                        "', '"+upld_evnt_data[1]+"', 1, '"+d_dte_strg+"')");
                        sql_db.MODFY_MILE_STONE( upld_proj_data[2], upld_evnt_data[0].split("~")[0].split("-")[0].trimEnd().trimStart()
                        ,upld_evnt_data[1], 1,d_dte_strg,  function(rntd_db_data){
                            var db_data_ar=[];
                            console.log("upld_proj_data[2] =\n"+upld_proj_data[2]);
                            sql_db.GET_PROJECT_EVENTS_2(upld_proj_data[2],db_data_ar,function(proj_event_data){
                                //console.log("proj_event_data =\n");
                                //console.log("%o", proj_event_data);
                                res.end(btoa(btoa(btoa(convert_event_data_to_html_page_string(proj_event_data[0])))));
                                //res.end(btoa(btoa(btoa("the milestone has been updated in the system"))));
                            });
                        })
                        
                    } catch (error) {
                        res.end(btoa(btoa(btoa("the milestone has been updated in the system but something happened while updating the dashboard, try refreshing the page"))));
                        console.log(error);
                    }
    
                    console.log("\n\n\n");
    
                    
                    break;

            case "MAKE_SMRTSHZTS_4_PROJ":
                //make_smrtshts_4_proj(json_obj.project_data.id_proj_num, json_obj.project_data.id_lead_email, function(rtnd_data){
                make_smrtshts_4_proj(json_obj.project_data.id_proj_num, function(rtnd_data){
                    res.end(btoa(btoa(btoa("to see updated smartsheets link refresh page"))));
                })
                break;
        default:
            rtn_val = "task = "+ task+". Error: No current path is setup for this task";
            res.end(btoa(btoa(btoa(rtn_val))));
    }
    //cb(rtn_val);
}


function make_acad_sht_dwgs_for_proj(db_proj_num,cb){
    //db_proj_num = 19135
    //run to db and see if making the project folder/ making sheets is ID's responsibility
    sql_db.CHECK_PROJ_RESPNSIBITY_LVL(db_proj_num,'',function(db_res){
        try {
            if (db_res == 1){
                sql_db.GET_JS_acad_sht_dwgs_EXEC_CMD_STRING(db_proj_num, function(exec_strg){
                    run_server_side_app(exec_strg,function(rtnd_val){
                        console.log("make_acad_sht_dwgs_for_proj.rtnd_val: \n");
                        console.log(rtnd_val);
                        //cb(rtnd_val)
                        cb(null)
                    });
                });
            }
            else {
                cb("Exception: Sheets were only logged in the db.\n"+
                   "No sheets could be made for this project because ID is a sub-contractor. \n"+
                   "Projects selected as sub-contractor have limited functionality.")
                }
        } catch (error) {
            console.error();
        }
        
    });
}





function MAKE_NEW_SHEETS_FOR_PROJECT(json_data,res,cb){
    console.log('MAKE_NEW_SHEETS_FOR_PROJECT:\n');
    //console.log("%o", json_data);

    sql_db.UPLOAD_NEW_SHT_DATA(json_data, function (data){
        try {
            //res.write('    Here\n\n-- '+data+' --\n\n is where we will place the sheet(s) when they are ready.');
            MAKE_ACAD_SHEETS(JSON.parse(json_data).PROJECT_NUMBER,res,cb);
            res.write('    Here\n\n-- '+data+' --\n\n is where we will place the sheet(s) when they are ready.');
        } catch (error) {
            console.log(error);
        }
    });
}


//DEACTIVATE -deactivate- deactivate_shts

function deactivate_shts(json_data,res,cb){
    ///-------- NOTE: DON'T CALL "res.end();" for timing reasons the parent function will make this
    res.write('    please wait while we deactivating the selected sheets');
    console.log('deactivate_shts:\n');
    console.log("%o", json_data);
    
    for (let i = 0; i < json_data.db_post_sht_data.length; i++) {
        //var new_sht_name = json_data.db_post_sht_data[i].new_sht_name;
        var sht_idx_num = json_data.db_post_sht_data[i].idx_num;
        console.log('RUNNING TO DB AND EXECUTING\n '+
                    'EXEC DEACTIVATE_SHEET "'+sht_idx_num+'"')
    //EXEC DEACTIVATE_SHEET 5
        if (!sql_db.isObjPropEmpty(sht_idx_num)) {
            sql_db.DEACTIVATE_SHT(sht_idx_num,function(db_res){
                try {
                    if(db_res.toString().toUpperCase().match(/UPDATE_FAILED/g)){
                        console.log(db_res.toString());
                        res.write(db_res.toString());
                    }
                } catch (error) {
                    console.log(error);
                }
                // new name = json_data.new_sht_name = new_sht_name;
                // sht task = json_data.sht_task = "DEACTIVATE";
                // if idx_num != null or undefined { do db stuff} else {do nothing}
                cb();
            })
        } else { console.log("json_data.idx_num is empty")}
    }


}


function activate_shts(json_data,res,cb){
    ///-------- NOTE: DON'T CALL "res.end();" for timing reasons the parent function will make this
    res.write('    please wait while we activate the selected sheets');
    console.log('activate_shts:\n');
    console.log("%o", json_data);
    
    for (let i = 0; i < json_data.db_post_sht_data.length; i++) {
        //var new_sht_name = json_data.db_post_sht_data[i].new_sht_name;
        var sht_idx_num = json_data.db_post_sht_data[i].idx_num;
        console.log('RUNNING TO DB AND EXECUTING\n '+
                    'EXEC ACTIVATE_SHEET "'+sht_idx_num+'"')
    //EXEC ACTIVATE_SHEET 5
        if (!sql_db.isObjPropEmpty(sht_idx_num)) {
            sql_db.ACTIVATE_SHT(sht_idx_num,function(db_res){
                try {
                    if(db_res.toString().toUpperCase().match(/UPDATE_FAILED/g)){
                        console.log(db_res.toString());
                        res.write(db_res.toString());
                    }
                } catch (error) {
                    console.log(error);
                }
                // new name = json_data.new_sht_name = new_sht_name;
                // sht task = json_data.sht_task = "ACTIVATE";
                // if idx_num != null or undefined { do db stuff} else {do nothing}
                cb();
            })
        } else { console.log("json_data.idx_num is empty")}
    }

}



function MAKE_ACAD_SHEETS(id_proj_num,res,cb){
    ///-------- NOTE: DON'T CALL "res.end();" for timing reasons the parent function will make this
    res.write('Please wait while we get the sheet(s) ready.');
    make_acad_sht_dwgs_for_proj(id_proj_num,function(rtn_msg){
        if (rtn_msg == null) {
            res.write('sheet(s) are ready');
            //res.end();
        } else { res.write("\n\n"+rtn_msg.toUpperCase()+"\n\n") }

        if (cb != null){
            cb();
        }
    });
}


//function post_new_project(proj_json_obj,res,cb){
function post_new_project(proj_json_obj,cb){
    sql_db.ADD_NEW_PROJ(JSON.stringify(proj_json_obj),function(db_id){
        if (sql_db.isObjPropEmpty(db_id)) {
            console.log("check db for addition of new project\n\n"+proj_json_obj);
            cb(db_id);
        } else{
            var db_arg = proj_json_obj[0].A;
            var filename=proj_dash_file_name.split('.')[0]+'_'+db_arg+'.'+proj_dash_file_name.split('.')[1];
            var encode_resp = true;
            //make_proj_dash(db_arg,filename,encode_resp,res);
            cb(db_id,db_arg,filename);
        }
    })
}


async function MAKE_BAT_FILE_FOR_NEW_SHTS(json_proj_data){
    //*******TO DO: */

// make bat file to have exec.ed 
    var bat_2_exe ="MAKE_NEW_SHEETS_SCRIPT_" + json_proj_data.ID_PROJ_NUM.toString();
    var path_2_bat = loc_of_bat_2_exec+bat_2_exe;
    let bat_file_exist = await fileExist(path_2_bat);

// test if sheet bat. script already exists for project
// if no {
    if (bat_file_exist){
// true: 
//    1.) return path_2_bat
        return path_2_bat
} else {
// false    
//    1.) concat. string for entire bat file contains
//        1a.) FINISH "CONSOLE APP"
//        1b.) WRITE-UP ALL OF THE BELOW
       
                ////     ---- ****** ---- *******
                //    - COMPLETE "CONSOLE APP"
                //    - GET LOC. OF "CONSOLE APP"
                //    - GET/USE "CONSOLE APP" APP NAME AND COMMAND TO BE EXECUTED
                //      - "cd" TO 'LOC. OF "CONSOLE APP"'
                //      - CALL "CONSOLE APP" COMMAND WITH ARGUMENTS
                //      - CALL "EXIT"
        
                //
                //    EX - BAT:
                //       cd <nextwork_location>
                //       ConsoleApp1.exe <proj_number>
                //       exit
                //
                ////     ---- ****** ---- *******

//    2.) place bat file in loc_of_bat_2_exec
//    3.) return path_2_bat
//    4.) DONE
    }

}




//------------start---------------------on the fly proj. dash creation-------------------------------


app.get('/PROJECT_DASHBOARD/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var db_arg = "";//fix_arg_strg(req.url.split("/")[2]);
    var filename="";
    var encode_resp = false;
    if (isNumeric(req.url.split("/")[2])){
        db_arg = req.url.split("/")[2];
        //console.log(db_arg);
    }else {
        var fix_strg = fix_arg_strg(req.url.split("/")[2]);
        filename = fix_strg.toString().replace("-","_");
        db_arg = fix_strg.toString().split("-")[1].split(".")[0];
        encode_resp = true;
        //console.log(filename);
        //console.log(db_arg);
    }
    make_proj_dash(db_arg,filename,encode_resp,res);
})

//function make_proj_dash (19418, "DEV_ID_Project_Dashboard_19418.html", true or false, res){
function make_proj_dash (db_arg,filename,encode_resp,res){
    //console.log("***********************************");
    if (!db_arg.match(/.js/g)){
        get_project_data_from_db(db_arg,['','',''])
        .then( data => { 
            switch(data){
                case "Exception_db: db pre check rejected user input" :
                    res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                    break;
                case null :
                    res.end("Error 16: No results found");
                    break;
                default:
                    //console.log("returning: "+JSON.stringify(data));
                    try {
                        var proj_fldr_loc = data[0][0]["PROJ_FILE_LOC"];
                        if (proj_fldr_loc){
                        console.log("data[0][0]['PROJ_FILE_LOC'].toString().match(/\\EXECPTION:/g) = "+
                                                                    proj_fldr_loc.toString().match(/\\EXECPTION:/g));

                        console.log("(!(data[0][0]['PROJ_FILE_LOC'].toString().match(/\\EXECPTION:/g))) = "+
                                                                (!(proj_fldr_loc.toString().match(/\\EXECPTION:/g))));

                        if (!(proj_fldr_loc.toString().match(/\\EXECPTION:/g))){
                        //console.log('data[0][0]["PROJ_FILE_LOC"] = ');
                        //console.log(data[0][0]["PROJ_FILE_LOC"]);
                        //var proj_fldr_loc = data[0][0]["PROJ_FILE_LOC"];
                        //console.log(proj_fldr_loc);
                        var prim_proj_loc = proj_fldr_loc.split('@')[0].split(':')[1].toString().trimEnd().trimStart();
                        var sec_proj_loc = proj_fldr_loc.split('@')[1].split(':')[1].toString().trimEnd().trimStart();
                        var proj_loc ='';



                        if (fs.existsSync(prim_proj_loc)){
                            proj_loc = prim_proj_loc;
                        } else if (fs.existsSync(sec_proj_loc)){
                            proj_loc = sec_proj_loc;
                        } else {
                            proj_loc = 'UNKNOWN';
                        }
                        data[0][0]["PROJ_FILE_LOC"] = proj_loc;

                        if (fs.existsSync(proj_loc)){
                        var shrt_ct_fle_nme ='\\'+data[0][0]["ID_PROJ_NUM"]+
                                            '_'+data[0][0]["PROJ_NAME"].replace(/ /g,'_')+'.bat';
                        //console.log('shrt_ct_fle_nme = ');
                        //console.log(shrt_ct_fle_nme);

                        var url_shrt_ct_fle = static_url_shrtcts+shrt_ct_fle_nme;
                            fs.writeFile(url_shrt_ct_fle,"start "+proj_loc, function (err) {
                                if (err) {
                                    console.log(err);
                                }else{
                                     console.log('made file '+url_shrt_ct_fle);
                                }
                            });
                        data[0][0].network_shrt_ct = shrt_ct_fle_nme;
                    } else {
                        data[0][0].network_shrt_ct = false;
                    }
                }} else{
                    data[0][0].network_shrt_ct = false;
                }
                        var rtnd_html_strg = edit_html_doc_with_project_data(
                            fs.readFileSync(loc_of_pblc_srvr_files + proj_dash_file_name),data[0],data[1],data[2]);
                            if (encode_resp){
                                fs.writeFile(loc_of_pblc_srvr_files+filename, rtnd_html_strg, function (err) {
                                    if (err) {
                                        res.end(btoa(btoa(btoa(false))));
                                        throw err;
                                    }else{
                                        res.end(btoa(btoa(btoa(filename))));
                                        //console.log(filename+' was replaced');
                                    }
                                });
                            }else{
                                res.end(rtnd_html_strg);
                            }
                        } catch (err) {
                            console.log(err);
                            res.end();
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
}

var get_project_data_from_db = async function (db_arg, data_ar){
    return new Promise(resolve => {
        sql_db.GET_PROJECT_INFO_ID(db_arg, data_ar, function (data){
            resolve(data);
         });
    });
}

app.get('/PROJECT_EVENTS/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var db_arg = fix_arg_strg(req.url.split("/")[2]);
    //var db_arg = req.url.split("/")[2];
    sql_db.GET_PROJECT_EVENTS(db_arg,['','',''], function (data){
        switch(data){
            case "Exception_db: db pre check rejected user input" :
                res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                break;
            case null :
                res.end("Error 17: No results found");
                break;
            default:
                //console.log("returning: "+JSON.stringify(data));
                try{
                    //res.end(JSON.stringify(data));
                    res.end(btoa(btoa(btoa(JSON.stringify(data)))));
                } catch (err) {
                    console.log(err);
                    res.end();
                }
            }
        });
})

app.get('/PROJECT_COMMENTS/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var db_arg = fix_arg_strg(req.url.split("/")[2]);
    sql_db.GET_PROJECT_COMMENTS(db_arg, ['','',''],function (data){
        switch(data){
            case "Exception_db: db pre check rejected user input" :
                res.end("User input was rejected from being entered into the system. Most likely because a KEYWORD was used that will cause un-allowable events to the system. Try using a different KEYWORD then "+db_arg);
                break;
            case null :
                res.end("Error 18: No results found");
                break;
            default:
                //console.log("returning: "+JSON.stringify(data));
                try{
                    //res.end(JSON.stringify(data));
                    res.end(btoa(btoa(btoa(JSON.stringify(data)))));
                } catch (err) {
                    console.log(err);
                    res.end();
                }
            }
        });
})


function edit_html_doc_with_project_data(html_pg, high_lvl_proj_data,proj_event_data,proj_comment_data){
try{
    var html_strg = add_project_comments(add_project_events(fill_out_project_card(html_pg,high_lvl_proj_data[0]),proj_event_data),proj_comment_data);
    //console.log("html_strg =\n"+html_strg);
} catch (err) {
    console.log(err);
}
return html_strg
}

function fill_out_project_card(html_pg, high_lvl_proj_data){
    //console.log(high_lvl_proj_data);
    var html_strg = html_pg.toString().replace(/_10001/g,high_lvl_proj_data.PROJ_NAME);
    html_strg = html_strg.replace(/_10002/g,high_lvl_proj_data.ID_PROJ_NUM.toString()+"-"+high_lvl_proj_data.P_PROJ_DB_IDX_NUM.toString());
    html_strg = html_strg.replace(/_10003/g,high_lvl_proj_data.CUSTOMER_NAME.toString());
    html_strg = html_strg.replace(/_10004/g,high_lvl_proj_data.CUST_PROJ_NUM.toString());
    html_strg = html_strg.replace(/_10005/g,high_lvl_proj_data.PROJ_TYPE.toString());
    html_strg = html_strg.replace(/_10006/g,high_lvl_proj_data.PROJ_STAGE.toString());
    html_strg = html_strg.replace(/_10007/g,high_lvl_proj_data.ID_DESIGN_LD.toString());
    html_strg = html_strg.replace(/_10008/g,high_lvl_proj_data.PROJ_LOC.toString());
    html_strg = html_strg.replace(/_10009/g,high_lvl_proj_data.PROJ_30_REVIEW.toString());
    html_strg = html_strg.replace(/_10010/g,high_lvl_proj_data.PROJ_60_REVIEW.toString());
    html_strg = html_strg.replace(/_10011/g,high_lvl_proj_data.PROJ_90_REVIEW.toString());
    html_strg = html_strg.replace(/_10012/g,high_lvl_proj_data.PROJ_IFC_REVIEW.toString());
    if (high_lvl_proj_data.network_shrt_ct){
        html_strg = html_strg.replace(/_10015/g,high_lvl_proj_data.network_shrt_ct.toString());
    } else {
        html_strg = html_strg.replace(/_10015/g,'');
    }
    if(!sql_db.isObjPropEmpty(high_lvl_proj_data.SMRT_SHZTS_LKNS)){
        var html_elmts_strg = "<a href=! target='_blank'>#</a>"
        var rplcmnt_strg='';
        var lnk_ar = high_lvl_proj_data.SMRT_SHZTS_LKNS.toString().split('+');
        for (let i = 0; i < lnk_ar.length; i++) {
            var sht_nme = lnk_ar[i].split("~")[0];
            var lnk_adrs = lnk_ar[i].split("~")[1];
            //_Meeting_Minutes=_Mt_Mnts, _ARs=_ARs, _Attendance=_Atdnc, _Design_Review_Comment_Log=_DRCLog
            if (sht_nme.toUpperCase().match(/MEETING/g) || (sht_nme.toUpperCase().match(/MT/g) && sht_nme.toUpperCase().match(/MNTS/g))) {
                sht_nme = "Meeting Minutes"
            } else if (sht_nme.toUpperCase().match(/ARS/g)) {
                sht_nme = "AR's"
            } else if (sht_nme.toUpperCase().match(/ATTENDANCE/g) || sht_nme.toUpperCase().match(/ATDNC/g)) {
                sht_nme = "Attendance"
            } else if (sht_nme.toUpperCase().match(/DRCLOG/g) || (sht_nme.toUpperCase().match(/DESIGN/g) && sht_nme.toUpperCase().match(/REVIEW/g) && sht_nme.toUpperCase().match(/COMMENT/g) )) {
                sht_nme = "Design Review Comment Log"
            }
            rplcmnt_strg = rplcmnt_strg+ html_elmts_strg.replace("#",sht_nme).replace("!",lnk_adrs)+"<br>";
            //rplcmnt_strg = rplcmnt_strg+ html_elmts_strg.replace("#",lnk_ar[i].split("~")[0]).replace("!",lnk_ar[i].split("~")[1])+"<br>";
        }
        html_strg = html_strg.replace(/_10016/g,"<p style='font-size:20px;'>"+rplcmnt_strg+'</p>');
    } else {
        html_strg = html_strg.replace(/_10016/g,'<p style="background-color:lightgray;">    NO SHEETS AND/OR LINKS CURRENTLY IN SYSTEM</p>');
    }
return html_strg
}


function add_project_events(html_pg, proj_event_data){
    //console.log(proj_event_data);
    var html_strg = html_pg;
    //console.log(strg);
    html_strg = html_strg.replace("_10013",convert_event_data_to_html_page_string(proj_event_data));
    return html_strg
}

//convert_event_data_to_html_react_page_string
function convert_event_data_to_html_page_string(proj_event_data){
    //console.log("%o", proj_event_data);
    var strg = "[ ";
    //var strg2 = "";
    var found_active_mile_stone = false;
    var found_next_up_mile_stone = false;
    for(var i=0;i<proj_event_data.length;i++){

        if (found_active_mile_stone && !found_next_up_mile_stone){
            found_next_up_mile_stone = true;
            strg = strg +" '!"+ proj_event_data[i].EVENT_TYPE.replace("'",".") +" - "+
                        monthNames[proj_event_data[i].EVENT_DATE.toString().split("/")[0] - 1] +
                            proj_event_data[i].EVENT_DATE.toString().split("/")[1]+"'";    
        } else if(proj_event_data[i].EVENT_STATUS == "ACTIVE"){
            found_active_mile_stone = true;
            strg = strg +" '@"+ proj_event_data[i].EVENT_TYPE.replace("'",".") +" - "+
                        monthNames[proj_event_data[i].EVENT_DATE.toString().split("/")[0] - 1] +
                            proj_event_data[i].EVENT_DATE.toString().split("/")[1]+"'";
        } else if (proj_event_data[i].EVENT_STATUS == "LATE"){
            strg = strg +" '~"+ proj_event_data[i].EVENT_TYPE.replace("'",".") +" - "+
            monthNames[proj_event_data[i].EVENT_DATE.toString().split("/")[0] - 1] +
                proj_event_data[i].EVENT_DATE.toString().split("/")[1]+"'";
        }  else if (proj_event_data[i].EVENT_STATUS == "COMPLETED"){
            strg = strg +" '^"+ proj_event_data[i].EVENT_TYPE.replace("'",".") +" - "+
            monthNames[proj_event_data[i].EVENT_DATE.toString().split("/")[0] - 1] +
                proj_event_data[i].EVENT_DATE.toString().split("/")[1]+"'";
        } else {
            //console.log("%o", proj_event_data[i].EVENT_TYPE);
        strg = strg +" '"+ proj_event_data[i].EVENT_TYPE.replace("'",".") +" - "+
                        monthNames[proj_event_data[i].EVENT_DATE.toString().split("/")[0] - 1] +
                            proj_event_data[i].EVENT_DATE.toString().split("/")[1]+"'";
        }

        if (!(i+1 == proj_event_data.length)){
            strg = strg + ",";
        }

    }
    strg = strg + " ]";
    return strg
}

//------------end---------------------on the fly proj. dash creation-------------------------------






//------------start---------------------smartsheets api calls-------------------------------

app.get('/TEST_SMARTSHEETS',function (req, res) {
    var rtnd_data = [];
    make_smrtshts_4_proj("<proj_number>",function(rtn_data){
        console.log(JSON.stringify(rtn_data));
        rtnd_data.push(rtn_data);
        res.end(JSON.stringify(rtnd_data).toString());
    });
});




async function make_proj_files(id_proj_num, proj_pre_file_strg,eml_prsn_2_shr_wth,cb){
    var rntd_msgs=[];
    var cntr = 0;
    smrtsht_make_sht_frm_templt(id_proj_num, proj_pre_file_strg,function(a){
        var resp = JSON.parse(a);
        var res = resp.res;
//        console.log("make_proj_files.resp = " +resp);
        add_smrtShts_links_2_systm(id_proj_num,res);
        rntd_msgs.push(resp)
        cntr = res.length;
        //for (let i = 0; i < res[0].res.length; i++) {
        for (let i = 0; i < res.length; i++) {
            var sht_id = res[i].result.id.toString();
//            console.log("sht_id = " +sht_id);
            smrtsht_share_sheet(id_proj_num,sht_id,eml_prsn_2_shr_wth,function(res_1){
                rntd_msgs.push(JSON.parse(res_1));
                smrtsht_publish_sheet(id_proj_num,sht_id,function(res_2){
                    rntd_msgs.push(JSON.parse(res_2));
                    cntr = cntr - 1;
                    //console.log("sht_id = "+sht_id+" cntr = "+cntr);
                    if(cntr == 0){
                        cb(rntd_msgs)
                    }
                });
            });
        }
    });
}


async function smrtsht_share_sheet(id_proj_num,sht_id,eml_prsn_2_shr_wth,cb){
    var api_key = "sheets/"+sht_id+"/shares?sendEmail=true "; //{shareId} ";
    //var api_key = "sheets/"+sht_id+"/shares "; //{shareId} ";
    var api_call = "POST ";
    var body = "{\"email\":\""+eml_prsn_2_shr_wth+"\",\"accessLevel\":\"ADMIN\"} "    
        Go_to_smrtShts(id_proj_num, api_key, api_call, body, function(res){
            cb(res);
        })
    }

async function smrtsht_publish_sheet(id_proj_num,sht_id,cb){
var api_key = "sheets/"+sht_id+"/publish ";
var api_call = "PUT "
var body = "{\"readOnlyLiteEnabled\":\"true\",\"readOnlyFullEnabled\":\"false\",\"readWriteEnabled\":\"false\",\"icalEnabled\":\"false\",\"readOnlyFullAccessibleBy\":\"ALL\",\"readWriteAccessibleBy\":\"ORG\"} "

    Go_to_smrtShts(id_proj_num, api_key, api_call, body, function(res){
        cb(res);
    })
}

async function Go_to_smrtShts(id_proj_num, api_key, api_call, body, cb){
    var loc_of_server_side_app = "<fullpath_network_location>";
    var url= "https://api.smartsheet.com/2.0/ "
    var hedrs = "Authorization:<auth_code>~Content-Type:application/json "
    var str_2_exe = loc_of_server_side_app + id_proj_num+" " + url + api_key + api_call+ body + hedrs
    console.log(str_2_exe);
    run_server_side_app(str_2_exe, function(resp){
        try {
            console.log("JSON.parse:\n");
            console.log(JSON.parse(resp));     
            cb(resp);
        } catch (err) {
            console.log("err.msg = "+err.message);
            console.log("JSON.stringify:\n");
            console.log(JSON.stringify(resp));
            cb(resp);
        }

    })
}

//------------end---------------------smartsheets api calls-------------------------------


//------------start---------------------server side script exec tests/dev-------------------------------

var a = 0;
app.get('/TEST_SYS/', function (req, res) {
    console.log('Worker %d running, app.get.TEST_SYS', cluster.worker.id);
    res.write('');
    console.log('HERE 1');
    const t_stmp_1 = get_time_stamp();
    //test_system(function (rtn_msg){
    test_server_side_execation(function (rtn_msg){
        const t_stmp_2 = get_time_stamp();
        var rtn_strg = "Start time: " + t_stmp_1 + "  End time: " + t_stmp_2 +"  ****  "+rtn_msg;
        console.log(rtn_strg);
        res.end('\n'+rtn_strg);
    });
    //res.write('Please wait, while some background processes are completing.\n');
});


function get_time_stamp(){
    const date_1 = new Date(Date.now());
    return date_1.toDateString() + " -- " + date_1.toLocaleTimeString('en-US');
}

function test_system(cb){
try {
    console.error("Trying to execute Test_bat.bat");
//  exec('"C:\\Users\\nleavitx\\DEV_Web_Server_Public_Files\\Test_bat.bat"', (err, stdout, stderr) => {
    exec('"<convert_event_data_to_html_page_string>"', (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          cb(err)
          return;
        } else {
            if (stdout){
                cb(stdout)
                return;
            } else {
                console.log(stdout);
                cb("completed task")
                return;
            }
        }
      });
} catch (error) {
    console.log("Well.. that didn't work..");
    console.log(error);
    cb(err)
    return;
}
console.log("Hopefully that worked..?");
}

async function test_system_concurrent_processing(a){
    var i = 0;
    delayedLog(1, 2000, i, a)
        .then(mes => {
            console.log("mes = "+mes+"."+a);
            delayedLog(2, 1000, mes, a)
                .then(mes => {
                    console.log("mes = "+mes+"."+a);
                }).catch(err => {
                    console.log(err);
                  });
        }).catch(err => {
            console.log(err)
          });

}

var delayedLog = async function (index, delay, i, a){
    i++;
    return new Promise(resolve => {
        setTimeout(function(){ 
            resolve(i);
            console.log("Logging from function call #"+index+"."+a);
        }, delay);
    });
  }




function run_server_side_app(loc_of_server_side_app, cb){
    sql_db.run_server_side_app(loc_of_server_side_app, cb);
}

//------------end---------------------server side script exec tests/dev-------------------------------





////***********************************************************SERVER USB METHODS****************************** */
////*********************************************************************************************************** */
////******************************SERVER USB METHODS*********************************************************** */
////*********************************************************************************************************** */
////*********************************************************************************************************** */
////****************************************************************SERVER USB METHODS************************* */






var usb_attached_wait_ar= [];

app.get('/notfy_usb_atchd/', function (req, res) {



    try {
        system_user_check(req, res, function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                console.log('user '+usr_id+' is requesting to be notified when a usb as been plugged in');
                console.log('process.pid: '+process.pid);
                // user has passed security check point
                // 
                // start developing in this try block
                //      TO DO:
                //  1.) 
                //  2.) 
                //  3.) 

                usb_attached_wait_ar.push(new usb_waiter(req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta));

                var msg_obj=new Object;
                msg_obj.cmd='add_2_usb_wait_ar';
                msg_obj.wrk_id = wrk_id;
                //msg_obj.process_id = process.pid;
                msg_obj.wrkr_usb_wait_ar_idx_num = usb_attached_wait_ar.length-1

                msg_master(msg_obj);

            }else
                res.status(401).end("<h1>WAITING_4_USB_EVENT_2:<br> Looks like you don't have permission for this action and or to view this page </h1>");

        });
    } catch (error) {
        res.status(500).end("<h1>WAITING_4_USB_EVENT_3:<br> OoOpPsS..!! GeEzZ Nick, you have one job... i'll let him know something unexpected happened and that this task was able to be completed. Sorry about this :/ </h1>");
        console.log(error);
        //res.end("auth not accepted");
        //res.end(fs.readFileSync(loc_of_pblc_srvr_files+login_dia_test_frm));
    }
    console.log('adding ');
});

process.on('message', (msg) => {
    switch (msg.cmd) {
        case 'usb.attached':
            usb_attached(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(msg.data)))));
            break;
        case 'usb.detached':
            usb_detached();
            break;


        default:
            break;
    }
});



function usb_attached(data){
    try {
        console.log("saw a usb drive was connected, here are some properites on it");
        console.log('process.pid: '+process.pid);

        //console.log("%o",data);
        var device = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(data.obj))));
        var vid= device.deviceDescriptor.idVendor;
        var pid= device.deviceDescriptor.idProduct;
        console.log("idVendor (decimal): "+vid);
        console.log("idProduct (decimal): "+pid);

        //console.log('usb_attached_wait_ar: ');
        //console.log("%o",usb_attached_wait_ar);


        sql_db.run_server_side_app(get_var(srvr_globl_vars,'get_atchd_usb_data_cmd')+ vid+' '+pid,
                function(drv_info_strg,pass_thru_args){ 
                     var drv_info = JSON.parse(JSON.stringify(JSON.parse(drv_info_strg)));
                     console.log("%o",drv_info);
                     
                     //console.log('usb_attached_wait_ar: ');
                     //console.log("%o",usb_attached_wait_ar);

                     var usb_ar_i = pass_thru_args.usb_waiter_ar_idx;

                     if (Array.isArray(usb_attached_wait_ar) && usb_attached_wait_ar.length >= usb_ar_i){
                        console.log('sending notification back to user about a usb drive that was recently attached');
                        usb_attached_wait_ar[usb_ar_i]._res.end(
                           JSON.stringify(JSON.parse(JSON.stringify({'DriveLetter': drv_info.DriveLetter, 'VolumeName': drv_info.VolumeName, 'Caption': drv_info.Caption}))));
                           usb_attached_wait_ar.splice(usb_ar_i,1);
                    }




        }, data)

    } catch (error) {
        console.log("blew up on usb_attached(device) \n  "+error);
    }

};

//console.log(usb.getDeviceList());

function usb_detached() {
    console.log("saw a usb drive was disconnected from computer");
};



////***********************************************************SERVER USB METHODS****************************** */
////*********************************************************************************************************** */
////******************************SERVER USB METHODS*********************************************************** */
////*********************************************************************************************************** */
////*********************************************************************************************************** */
////****************************************************************SERVER USB METHODS************************* */

var scan_dwld_ez_nav_dir =  __dirname + "<network_location>";
var json_dir =  scan_dwld_ez_nav_dir + "<network_location>";
var site_pic_dir =  scan_dwld_ez_nav_dir + "<network_location>";


app.get(["/ez_nav","/ez_nav/:file"],function (req, res){
    console.log("ez_nav request seen");
    try {
        system_user_check(req, res, function (req, res, auth_code, has_sytm_idd_usr, usr_id, snt_dta){
            if (has_sytm_idd_usr == 1){
                console.log('user '+usr_id+' is requesting sites for ez-nav');
                if(req.params.file!=undefined){
                    //console.log("req.params.file: "+req.params.file);
                    //console.log("%o",req.params.file);
                    //res.sendFile(__dirname + "\\DEV_Web_Server_Public_Files\\scan_dwld_ez_nav\\pics\\site_pics\\"+req.params.file);
                    res.sendFile(site_pic_dir +req.params.file);
                }else{
                    try {
                        var data = snt_dta.data;
                        console.log("data:");
                        console.log("%o",data);
                        switch (data.task) {
                            case 'jsites':
                                console.log('jsites was selected');
                                res.end(btoa(btoa(btoa(
                                    fs.readFileSync(json_dir+"sites.json")))));
                                    //fs.readFileSync(__dirname + "\\DEV_Web_Server_Public_Files\\scan_dwld_ez_nav\\json\\sites.json")))));
                                break;

                            case 'jblds':
                                console.log('jblds was selected');
                                ez_nav_site_blds(req, res, data);
                                break;

                            case 'jlvls':
                                console.log('jlvls was selected');
                                sql_db.GET_BLD_LEVELS(data.task_data.site,data.task_data.bld,function(rtn){
                                    console.log("rtn: ");
                                    console.log(rtn);
                                    res.end(btoa(btoa(btoa(JSON.stringify(rtn)))));
                                })
                                break;

                            case  'jquad_grid':
                                console.log('jquad_grid was selected');
                                pop_json_quad_last_scan_date_indctrs(data.task_data.bld+data.task_data.lvl,function(rntd_data){
                                    var json_quad_data = JSON.parse(fs.readFileSync(json_dir+data.task_data.bld+data.task_data.lvl+"_quads.json" ));
                                    //console.log(json_quad_data);
                                    for (let i = 0; i < json_quad_data.quads.length; i++) {
                                        for (let ix = 0; ix < rntd_data.length; ix++) {
                                                if (json_quad_data.quads[i].quad.toString().toUpperCase() == rntd_data[ix].QUAD.toString().toUpperCase()){
                                                //console.log(json_quad_data.quads[i].quad.toString().toUpperCase() +" == "+rntd_data[ix].QUAD.toString().toUpperCase());
                                                //console.log("upload date: "+rntd_data[ix].UPLOAD_DATE.toString());
                                                json_quad_data.quads[i].UPLOAD_DATE = rntd_data[ix].UPLOAD_DATE
                                                rntd_data.splice(ix,1);
                                                break;
                                            }
                                        }
                                    }
                                    //console.log(json_quad_data);
                                    res.end(btoa(btoa(btoa( JSON.stringify(json_quad_data) ))));
                                })
                                break;

                            default:
                                //res.end(btoa(btoa(btoa( "scan_dwld_ez_nav.html") )));
                                res.end( "scan_dwld_ez_nav.html");
                                break;
                        }
                    } catch (error) {
                        if (snt_dta == undefined){
                            //res.end(btoa(btoa(btoa( "scan_dwld_ez_nav.html") )));
                            res.end( "scan_dwld_ez_nav.html");
                        } else console.log(error);
                    }
                }
                
            } else {
                res.end("User doesn't have the correct permissions");
            }
        }) 




    } catch (error) {
        res.end('<iframe style="display:none" onload="top.parent.chld_2_prnt_chk_usr();" ></iframe>');
    }

 

 });


function pop_json_quad_last_scan_date_indctrs(bld__lvl_strg,cb){
//figure out when and how functionality will work while executing aql server function 'SELECT QUAD,UPLOAD_DATE FROM GET_QUAD_SCAN_DATES('C11')'
    if (fs.existsSync(json_dir+bld__lvl_strg+".json")){
        if(cb)cb(JSON.parse(fs.readFileSync(json_dir+bld__lvl_strg+".json")));
    }
    else {
        sql_db.GET_QUAD_LAST_SCAN_DATES(bld__lvl_strg, function(db_rtn){
            try {
                fs.writeFileSync(json_dir+bld__lvl_strg+".json",JSON.stringify(db_rtn))
                //console.log("completed pop_json_quad_last_scan_date_indctrs")
                if(cb)cb(db_rtn);
            } catch (error) {
                console.log(error);
            }
        })
    }
}

})

 var server = app.listen(8050, function () {
    try {
        var host = server.address().address
        var port = server.address().port
        //console.log(`Dev Server Worker ${process.pid} started and listening at http://%s:%s`, host, port);
        console.log("Dev Server Worker %s started and listening at http://%s:%s", process.pid, host, port);
        //console.log("Dev Server listening at http://%s:%s", host, port)   
    } catch (error) {
        console.log(error);
    }

 })
}
