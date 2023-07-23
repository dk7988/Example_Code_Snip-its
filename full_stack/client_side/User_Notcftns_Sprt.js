var orgznd_nots=[];
var usr_projs=[];
var _req_id='';
var _drv_ltr='';
var _idx='';
var _proj='';



function get_frm_ar(strg_2_lk_4, ar, ar_fld_2_srch, slice_ar) {
    var rtn_ar=[];
    var re = new RegExp(strg_2_lk_4, 'g');
    for (let i = ar.length-1; i >= 0; i--) {
        if(ar[i][ar_fld_2_srch].match(re)){
            rtn_ar.push(ar[i]);
            if (slice_ar) ar.splice(i,1);
        }  
    }
    return JSON.parse(JSON.stringify(rtn_ar));
}

function manage_usr_nots(){
    for (let i = 0; i < usr_notes.length; i++) {
        try {
            var j_obj = new Object
            j_obj.nav_txt=""
            j_obj.ar=[];
            if(!(usr_notes[i][0].NOFCTN_STRG.match(/:/g))){
                j_obj.nav_txt=usr_notes[i][0].NOFCTN_STRG;
                for (let ix = usr_notes[i].length-1; ix >= 0; ix--) {
                    var sc_req = new Object
                    sc_req.name=usr_notes[i][ix].USR_NAME;
                    sc_req.nots = get_frm_ar(sc_req.name,usr_notes[i],'USR_NAME',true);
                    j_obj.ar.push(JSON.parse(JSON.stringify(sc_req)));
                    ix=usr_notes[i].length;
                }
            }else{
                j_obj.nav_txt=usr_notes[i][0].USR_NAME;
                for (let ix = usr_notes[i].length-1; ix >= 0; ix--) {
                    var proj_actvs = new Object
                    proj_actvs.name=usr_notes[i][ix].NOFCTN_STRG.split(':')[0].trimLeft().trimRight();

                    if((usr_notes[i][ix].NOFCTN_STRG.match(/MILESTONE:/g)))
                        proj_actvs.name=usr_notes[i][ix].NOFCTN_STRG.split('MILESTONE')[0].trimLeft().trimRight();
                
                    if(!usr_projs.includes(proj_actvs.name)) usr_projs.push(proj_actvs.name);

                    proj_actvs.nots = get_frm_ar(proj_actvs.name,usr_notes[i],'NOFCTN_STRG',true);
                    j_obj.ar.push(JSON.parse(JSON.stringify(proj_actvs)));

                    for (let index = 0; index < j_obj.ar.length; index++) {
                        var obj = j_obj.ar[index];
                        for (let idx = 0; idx < obj.nots.length; idx++) {
                            if(obj.nots[idx].NOFCTN_STRG.match(/:/g))
                                obj.nots[idx].NOFCTN_STRG = obj.nots[idx].NOFCTN_STRG.split(":")[1].trimLeft().trimRight();
                        }
                    }
                    ix=usr_notes[i].length;
                }
            }
         orgznd_nots.push(j_obj);
        } catch (error) {
        console.log(error);
        }
    }
    bld_pg();
}

function bld_pg() {
    //console.log(orgznd_nots);
    //console.log(JSON.stringify(orgznd_nots));
    //var obj = JSON.parse(JSON.stringify(get_frm_ar('SCAN REQUEST', orgznd_nots, 'nav_txt')[0]));
    var obj;
    try {
        obj = get_frm_ar('SCAN REQUEST', orgznd_nots, 'nav_txt')[0];
        if(obj!=undefined){
            obj.nav_txt='SCAN REQUESTs';
            add_2_side_nav(obj,"sidenav",'name');        
        } else obj = new Object;
    } catch (error) {
        console.log(error);
    }
    try {
        obj.ar=usr_projs;
        obj.nav_txt='Active Projects';
        add_2_side_nav(obj,"sidenav");
    } catch (error) {
        console.log(error);
    }
}

function add_2_side_nav(obj, nav_id, ar_fld_2_srch){
    var prnt_grp=document.createElement("div");
    prnt_grp.id="sidenav";
    prnt_grp.classList.add("sidenav");
    if(document.getElementById(nav_id)) prnt_grp=document.getElementById(nav_id);
    
    var sec_hdr = document.createElement("h2")
    sec_hdr.innerHTML=obj.nav_txt;
    prnt_grp.appendChild(sec_hdr);
    for (let i = 0; i < obj.ar.length; i++) {
        var req_div=document.createElement("div");
        var a=document.createElement("a");
        if (ar_fld_2_srch!=undefined && ar_fld_2_srch!=null && ar_fld_2_srch!=""){
            a.innerHTML=obj.ar[i][ar_fld_2_srch];
            if (obj.nav_txt.toUpperCase().match(/PROJECT/g))
                req_div.setAttribute("onmouseover","redraw_main(-1,'"+obj.ar[i][ar_fld_2_srch]+"')");
            else
                req_div.setAttribute("onmouseover","redraw_main("+i+",'"+obj.ar[i][ar_fld_2_srch]+"')");
        } else {
            a.innerHTML=obj.ar[i];
            if (obj.nav_txt.toUpperCase().match(/PROJECT/g))
                req_div.setAttribute("onmouseover","redraw_main(-1,'"+obj.ar[i]+"')");
            else
                req_div.setAttribute("onmouseover","redraw_main("+i+",'"+obj.ar[i]+"')");
        }
           
        req_div.appendChild(a);
        prnt_grp.appendChild(req_div);
    }
    if(!(document.getElementById(nav_id))) document.body.appendChild(prnt_grp);
}

function redraw_main(idx,proj_name){
    var main_bdy=document.createElement("div");
    main_bdy.id="main_body";
    main_bdy.classList.add("main");
    if(document.getElementById("main_body")) document.body.removeChild(document.getElementById("main_body"));


    if(proj_name!=undefined && proj_name!=null && proj_name!=""){

        switch (true) {
            case idx > -1:
                //filter table data with "proj_name" data
                var prnt_obj = JSON.parse(JSON.stringify(orgznd_nots[idx]));
                //var tbl_tit = prnt_obj.nav_txt;
                var obj = get_frm_ar(proj_name, prnt_obj.ar, 'name')[0];
                //var tbl_row_dt = obj.nots;
                var t = make_tbl(prnt_obj.nav_txt,['Request Number','Date of Request'],obj.nots,['DB_IDX_NUM','DATE_OF_UPDATE'])
                for (let r = 1; r < t.rows.length; r++) {
                    t.rows[r].id="r_"+t.rows[r].cells[0].innerHTML;
                    t.rows[r].setAttribute("onclick","scn_reqst_clkd("+t.rows[r].cells[0].innerHTML+","+idx+",'"+proj_name+"')");
                }
                main_bdy.appendChild(t);
                break;
            case idx == -1:
                // run thru all 'orgznd_nots' objects looking for "proj_name" make a new table per object found
                for (let i = 0; i < orgznd_nots.length; i++) {
                    var prnt_obj = JSON.parse(JSON.stringify(orgznd_nots[i]));
                    var obj = get_frm_ar(proj_name, prnt_obj.ar, 'name')[0];
                    if(obj!=undefined && obj!=null && obj!=""){
                        switch (true) {
                            case prnt_obj.nav_txt.match(/UPCOMING/g) != null:
                                main_bdy.appendChild(make_tbl(prnt_obj.nav_txt,['Upcoming Milestone','Date of Upcoming Milestone'],obj.nots,['NOFCTN_STRG','DATE_OF_UPDATE']));
                                break;

                            case prnt_obj.nav_txt.match(/CHANGES/g) != null:
                                main_bdy.appendChild(make_tbl(prnt_obj.nav_txt,['Project Activity','Date of Activity Update'],obj.nots,['NOFCTN_STRG','DATE_OF_UPDATE']));
                                break;

                            default:
                                break;
                        }
                        
                    }
                }

                break;
            default:
                //do NOT filter table data

                break;
        }
        if(idx > -1){
           
        }
    }else{

    }
    document.body.appendChild(main_bdy);
}

function make_tbl(tbl_tit,col_hdrs,row_ar,obj_flds_2_use_ar){
    var t = document.createElement("table");
    var tt = document.createElement("title");
    tt.innerHTML = tbl_tit;
    t.appendChild(tt);
    var thr = document.createElement("tr");
    for (let c = 0; c < col_hdrs.length; c++) {
        var th = document.createElement("th");
        th.innerHTML = col_hdrs[c];
        thr.appendChild(th);
    }
    t.appendChild(thr);
    for (let r = 0; r < row_ar.length; r++) {
        //var rdv = document.createElement("div");
        var tr = document.createElement("tr");
        for (let f = 0; f < obj_flds_2_use_ar.length; f++) {
            var td = document.createElement("td");
            if(obj_flds_2_use_ar[f].match(/DATE/g)){
                if(Date.parse(row_ar[r][obj_flds_2_use_ar[f]])!='NaN'){
                    const testDate = new Date(row_ar[r][obj_flds_2_use_ar[f]]); 
                    //console.log(testDate.toDateString());
                    td.innerHTML = testDate.toDateString()
                } else td.innerHTML = row_ar[r][obj_flds_2_use_ar[f]];
            } else td.innerHTML = row_ar[r][obj_flds_2_use_ar[f]];
            tr.appendChild(td);
        }
        //rdv.appendChild(tr);
        t.appendChild(tr);
    }
    return t;
}




function scn_reqst_clkd(req_id,idx,proj){
    _req_id=req_id;
    _idx=idx;
    _proj=proj;
    console.log(req_id);
    fill_scan_req(req_id,function(rtn){
        try {
            if (rtn!=undefined&&rtn!=null&&rtn!="") {
                rtn = JSON.parse(JSON.stringify(JSON.parse(rtn)));
                //if (rtn==undefined||rtn==null||rtn=="") console.log("copy/pasting scan request");
                //else console.log("server responded with the following \n"+rtn);
                //updt_scan_req
      
                    var rnt_strg = rtn.task
                    switch (rnt_strg) {
                        case "drvs_comm_probs":
                            alert(rtn.msg_strg);

                            usr_pick_drv(req_id, "");
                            break;
                    
                        case "no_drvs_atchd":
                            alert(rtn.msg_strg);
                            break;
                       
                        default:
                            add_drv_opts_2_tbl(rtn,req_id);
                            break;
                    }
            }else{
    //need to finish as of 12/21/2020---------------VVVV

                // scan request is being processed.. remove "req_id" from "orgznd_nots[idx]" and redraw table
                //1.) loop thru orgznd_nots[idx] r(=0 to orgznd_nots[idx].count-1)
                //   a.) if orgznd_nots[idx].DB_IDX_NUM == req_id then orgznd_nots[idx].slice(r,1)
                //2.) redraw(idx,proj);
                redraw_main(idx,proj);

           }
        } catch (error) {
            if(rtn.toString().toLocaleUpperCase().match(/STARTED/g)) nav_2_dwnlds_pg();
            else window.alert(error);
        }
        




    });
    window.alert("HELLO! give me a minute, i'm checking to make sure the selected drive has enought free space on it to complete the download")

}


function add_drv_opts_2_tbl(rtn,req_id){
                //********* THIS PATH IS EXECUATED WHEN THE SELECTED DRIVE(S) FAIL FREE SPACE CHECK *********

                var ul2 = document.createElement("ul");
                ul2.classList.add("dropdown-menu");

                //1.) show user avablive 'COPY_TO' drives
                //2.) onclick/drive selected exec "drv_slctd(drv_ltr)"
      
                for (let i = 0; i < rtn.length; i++) {
                    var r = document.createElement("li");
                    r.setAttribute("onclick","drv_slctd('"+rtn[i][0].split(":")[0]+"')");
      
                    var c1 = document.createElement("a");
                    c1.innerHTML=rtn[i][1] +" ("+rtn[i][0].split(":")[0]+")";
                    c1.style.cursor="pointer";
                    r.appendChild(c1);
                    ul2.appendChild(r);
                    //document.getElementById("_"+req_id).appendChild(r);
                }
      
                //document.getElementById("_"+req_id).appendChild()
                var sp = document.createElement("span");
                sp.classList.add("caret");
                sp.style.cursor="pointer";
                sp.style.color="blue";
            
                var a = document.createElement("a");
                a.innerHTML="Select a Drive";
                a.classList.add("dropdown-toggle");
                a.style.cursor="pointer";
                a.style.color="blue";
                a.setAttribute("data-toggle","dropdown");
                a.appendChild(sp);

                var li = document.createElement("li");
                li.classList.add("dropdown");
                li.appendChild(a);
                li.appendChild(ul2);

                var ul = document.createElement("ul");
                ul.classList.add("nav");
                ul.classList.add("nav-tabs");
                ul.appendChild(li);

                var p_div = document.createElement("div");
                p_div.classList.add("container");
                p_div.id="d_"+req_id
            
                if ((document.getElementById("d_"+req_id)))
                    document.getElementById("r_"+req_id).removeChild(document.getElementById("d_"+req_id));
                else p_div.appendChild(ul);

                document.getElementById("r_"+req_id).removeAttribute('onclick');
                document.getElementById("r_"+req_id).appendChild(p_div);
                //var c = document.getElementById("r_"+req_id);
                //c.parentNode.appendChild(p_div);
}

function drv_slctd(drv_ltr){
    _drv_ltr=drv_ltr;
    //updt_scan_req(JSON.stringify([_req_id,drv_ltr]),function(rtnd){
        updt_scan_req([_req_id,drv_ltr],function(rtnd){
        if (rtnd==undefined||rtnd==null||rtnd==""){
            document.getElementById("r_"+_req_id).removeChild(document.getElementById("d_"+_req_id));
            document.getElementById("r_"+_req_id).setAttribute("onclick","scn_reqst_clkd("+_req_id+","+_idx+",'"+_proj+"')")
            //scn_reqst_clkd(_req_id,_idx,_proj);
            //redraw_main(_idx,_proj);
            _req_id=undefined;
            _drv_ltr=undefined;
            _idx=undefined;
            _proj=undefined;
            
        }else{
            //not sure how or why this would happen... ummm... maybe cause the drive doesn't have enough free space on it... duhhh...
            //---------     bring in pop-up msgbox with "Dwnlod_Rqst_Drv_Spc_Err.html" in it ---------   
            //alert("****** HERE 1 ******");
            //alert(rtnd);
            //console.log(rtnd+":");
            //console.log("%o",rtnd);
            if(rtnd.toString().toLocaleUpperCase().match(/STARTED/g)) nav_2_dwnlds_pg();
            else usr_pick_drv(_req_id, _drv_ltr);
        }

    })

}



var old_pop_uo_txt='';

function usr_pick_drv(dwld_rqst_id, drv_ltr){
    //alert("****** HERE 2 ******");
    window.top.sessionStorage.drv_ltr = drv_ltr;
    window.top.sessionStorage.dwld_rqst_id = dwld_rqst_id;
    old_pop_uo_txt=window.top.document.getElementById("dialog1_label").innerHTML;
    window.top.document.getElementById("dialog1_label").innerHTML='Please select next action';
    window.top.elm_on_off(this.window.name);
    window.top.dialog_load_sub_page("Dwnlod_Rqst_Drv_Spc_Err.html",750,true,0.94);
}


async function nav_2_dwnlds_pg(){
    //window.alert("trying to navigate to downloads dashboard page");
    try {
        window.top.move2Pg('nav_to_scans');
        window.top.sessionStorage.file_explr_btn_clk = "scan_fill_sts_btn"
        window.top.mang_sub_pg_ld('/FILE_EXPLR',true,0.90)
        window.top.closeCurrentDialog();
    } catch (error) {
        console.log(error);
    }

    

}