var chld_name='';
var pg_cntr=0;
var actvt_brswr='';
var copy_frm_loc = '';
var paste_to_loc = '';
var actvt_vew ='';
//localStorage.scan_data={};
window.sessionStorage.scan_data=JSON.stringify({});
window.sessionStorage.dnlda={};


function fe_load_sub_page(page_2_load,show,opacity) {
   return load_sub_page(page_2_load,"explr_mangr_body",show,opacity)
}


function load_sub_page(page_2_load,prnt_html_obj_2_add_2,show,opacity) {
  var html_obj = document.createElement("object");
  html_obj.setAttribute("id","pg_nme_"+pg_cntr);
  html_obj.setAttribute("type","text/html");
  html_obj.setAttribute("data",page_2_load);
  html_obj.setAttribute("width","100%");
  html_obj.setAttribute("height","775");
  //html_obj.setAttribute("onclick","sheet_name_changed()");
  html_obj.setAttribute("onclick","child_call_to_parent('"+pg_cntr+"')");
  html_obj.setAttribute("child_page_num",pg_cntr);
  html_obj.setAttribute("name","pg_nme_"+pg_cntr);

  document.getElementById(prnt_html_obj_2_add_2).appendChild(html_obj);
  if (opacity!=""){
    document.getElementById("pg_nme_"+pg_cntr).style.opacity = opacity;
  }
  if (!show){
    document.getElementById("pg_nme_"+pg_cntr).style.display="none"
  }
  var sub_pg_id = "pg_nme_"+pg_cntr;
  pg_cntr=pg_cntr+1;

  return sub_pg_id;
}


function frm_loc_slctd(){
    copy_frm_loc = document.getElementById(actvt_brswr).contentDocument.getElementById("path").childNodes[3].innerHTML
    //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
    var drv_ltr  = document.getElementById(actvt_brswr).contentWindow.location.pathname.split('/')[1];  
    copy_frm_loc = drv_ltr+copy_frm_loc;
    //localStorage.scan_data.copy_frm = copy_frm_loc;
    //window.sessionStorage.scan_data.copy_frm = copy_frm_loc;
    var a = JSON.parse(window.sessionStorage.scan_data)
    a.copy_frm = copy_frm_loc;
    window.sessionStorage.scan_data = JSON.stringify(a);
    edit_scan_sidebar("copy_frm_lbl","Copying from:","copy_frm_loc_lbl",copy_frm_loc);
    //console.log("frm_loc_slctd: "+ copy_frm_loc);
    //document.getElementById("btn_slct_frm_loc").style.display="none";
    //document.getElementById("btn_slct_to_loc").style.display="block";
    //console.log(window.sessionStorage.scan_data);
}

function to_loc_slctd(){
    paste_to_loc = document.getElementById(actvt_brswr).contentDocument.getElementById("path").childNodes[3].innerHTML
    //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
    var drv_ltr  = document.getElementById(actvt_brswr).contentWindow.location.pathname.split('/')[1];  
    paste_to_loc = drv_ltr+paste_to_loc;
    //localStorage.scan_data.paste_to = paste_to_loc;
    var a = JSON.parse(window.sessionStorage.scan_data)
    a.paste_to = paste_to_loc;
    window.sessionStorage.scan_data = JSON.stringify(a);
    //window.sessionStorage.scan_data.paste_to = paste_to_loc;
    edit_scan_sidebar("paste_to_lbl","Pasting to:","paste_to_loc_lbl",paste_to_loc);
    //console.log("to_loc_slctd: "+ paste_to_loc);
}

























function fix_scan_fldr(){
    var scan_fldr = document.getElementById(actvt_brswr).contentDocument.getElementById("path").childNodes[3].innerHTML
    //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
    var drv_ltr  = document.getElementById(actvt_brswr).contentWindow.location.pathname.split('/')[1];
    //scan_fldr = drv_ltr+scan_fldr;
    var a = JSON.parse(window.sessionStorage.scan_data)
    a.fix_scan_fldr = scan_fldr;
    window.sessionStorage.scan_data = JSON.stringify(a);

    //localStorage.scan_data.fix_scan_fldr = scan_fldr;
    //window.sessionStorage.scan_data.fix_scan_fldr = scan_fldr
    edit_scan_sidebar("fx_scan_fldr_lbl","Renaming Scan Folder:","fx_scan_fldr_loc_lbl",scan_fldr);
    window.alert("starting to fix scan folder: " + scan_fldr);
    //console.log("to_loc_slctd: "+ paste_to_loc);

    window.top.get_scn_fixr_ui(drv_ltr,scan_data,
    //window.top.post_to_db_2("/"+scan_data.copy_frm.split("\\")[0]+"/"+scan_data.task.replace("~",""),
    //fix_arg_strg(JSON.stringify(scan_data)),
        function(){
            clean_up_sidebar();
        });



    //clean_up_sidebar();
}

function cmp_chngd(new_val){
    rst_fltrs();
    document.getElementById('reqst_btn').style.display='none';
    update_slctn_lbl('slctd_cmp',new_val);
    ld_tbl();
}

function bld_chngd(new_val,rfsh_tbl){
    //rst_fltrs();
    document.getElementById('reqst_btn').style.display='none';
    update_slctn_lbl('slctd_bld',new_val);
    if (rfsh_tbl==undefined) ld_tbl();
}

function lvl_chngd(new_val,rfsh_tbl){
    document.getElementById('reqst_btn').style.display='block';
    update_slctn_lbl('slctd_lev',new_val);
    if (rfsh_tbl==undefined) ld_tbl();
}

function quad_chngd(new_val,rfsh_tbl){
    document.getElementById('reqst_btn').style.display='block';
    update_slctn_lbl('slctd_qud',new_val);
    if (rfsh_tbl==undefined) ld_tbl();
}

function ft_chngd(new_val,rfsh_tbl){
    document.getElementById('reqst_btn').style.display='block';
    update_slctn_lbl('slctd_ft',new_val);
    if (rfsh_tbl==undefined) ld_tbl();
}

function rst_fltrs(){
    lvl_chngd('');
    quad_chngd('');
    ft_chngd('');
    ld_tbl();
}



function update_slctn_lbl(p_id,val){
    if(val!=undefined||val!=null||val!=''){
        document.getElementById(p_id).innerHTML=val;
        document.getElementById(p_id).style.display='block';
    }else if(document.getElementById(p_id).style.display=='block') 
                            document.getElementById(p_id).style.display='none';
}

function get_scan_dwld_info(){
    //var scan_fldr = document.getElementById(actvt_brswr).contentDocument.getElementById("path").childNodes[3].innerHTML
    if(localStorage.dwld_tbl_data==undefined||localStorage.dwld_tbl_data==null
        ||localStorage.dwld_tbl_data==''||!localStorage.dwld_tbl_data.match(/[,]/g)) {
    //if(!localStorage.dwld_tbl_data.match(/[,]/g)){
    var drv_ltr = '';
    try {
        //drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];  
        drv_ltr = document.getElementById(actvt_brswr).contentWindow.location.pathname.split('/')[1];  
          
    } catch (error) {
        var drv_ltr = 'E';
    } 
    //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
    localStorage.dnlda={};
    localStorage.dnlda=JSON.stringify(dnld={ft:"INI"});
    window.top.get_scn_dnld_tbl(drv_ltr,JSON.stringify(JSON.parse(localStorage.dnlda)),function(rtn_tbl){
        localStorage.dwld_tbl_data = rtn_tbl;
        do_this(rtn_tbl);
        get_scan_dwld_info();
    });
    localStorage.removeItem("dnlda");
    window.sessionStorage.dnlda={};
}else {
    if (window.sessionStorage.fts==undefined||
        window.sessionStorage.bds==undefined||
        window.sessionStorage.lvs==undefined||
        window.sessionStorage.quds==undefined||
        window.sessionStorage.cmps==undefined) do_this(localStorage.dwld_tbl_data);

    ld_pldwns();
    document.getElementById('wt_msg').style.display='none';
    document.getElementById('the_div').style.display='block';}
}


function do_this(rtn_tbl){
    var tbl_data;
    try {
        tbl_data = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(rtn_tbl)))));
    } catch (error) {
        tbl_data = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(rtn_tbl))));
    }
    
    var a=[];
    var b=[];
    var c=[];
    var d=[];
    var e=[];
    for (let i = 0; i < tbl_data.length; i++) {
        if (!a.includes(tbl_data[i].FILE_TYPE))a.push(tbl_data[i].FILE_TYPE);
        if (!b.includes(tbl_data[i].BUILDING))b.push(tbl_data[i].BUILDING);
        if (!c.includes(tbl_data[i].LEVEL))c.push(tbl_data[i].LEVEL);
        if (!d.includes(tbl_data[i].QUAD))d.push(tbl_data[i].QUAD);
        if (!e.includes(tbl_data[i].CAMPUS))e.push(tbl_data[i].CAMPUS);
    }
    window.sessionStorage.fts=a;
    window.sessionStorage.bds=b;
    window.sessionStorage.lvs=c;
    window.sessionStorage.quds=d;
    window.sessionStorage.cmps=e;

}




















function revome_kids(prnt_id){
    var prnt = document.getElementById(prnt_id);
    if (prnt.children.length != 0){
        for (i=prnt.children.length; i>=0 ; i--){
            try{
                prnt.removeChild(prnt.children[i]);
            }catch{
                try{
                    prnt.removeChild(prnt.children[i-1]);
                }catch{}
            }
        }
    }
  }





var tmr_id;

function get_scan_dwld_sts_info(cb){
    window.top.GET_UPLD_DWNLD_INFO(function(upld_dwnld_trsn_stats){
        var trns_stats = JSON.parse(JSON.stringify(JSON.parse(upld_dwnld_trsn_stats)));
        if(trns_stats!=undefined&&trns_stats!=null&&trns_stats!=''&&trns_stats!='done'){
            built_upld_dwnld_pg(trns_stats);
            tmr_id = setInterval(refresh_upld_dwnld_pg, 5000);
            //if (cb) cb();
        } else {
            // the DB didn't return any upload/ download data
            revome_kids("dwnld_sts_body"); 
            var h2 =document.createElement("h2");
            h2.innerHTML="All uploads and downloads have been completed"
            document.getElementById("dwnld_sts_body").appendChild(h2);
        }
        if (cb) cb();
    });
}


function refresh_upld_dwnld_pg(){
    try {
        window.top.GET_UPLD_DWNLD_INFO(function(upld_dwnld_trsn_stats){
            var trns_stats = JSON.parse(JSON.stringify(JSON.parse(upld_dwnld_trsn_stats)));
            if(trns_stats!=undefined&&trns_stats!=null&&trns_stats!=''&&trns_stats!='done')built_upld_dwnld_pg(trns_stats);
            else {
                clearInterval(tmr_id);
                revome_kids("dwnld_sts_body"); 
                var h2 =document.createElement("h2");
                h2.innerHTML="All uploads and downloads have been completed"
                document.getElementById("dwnld_sts_body").appendChild(h2);
            }
        });    
    } catch (error) {
        console.log(error);
        clearInterval(tmr_id);
    }    
}


function built_upld_dwnld_pg(trns_stats){
    try {
        revome_kids("dwnld_sts_body");    
    } catch (error) {}
    for (let i = 0; i < trns_stats.length; i++) {
        document.getElementById("dwnld_sts_body").appendChild(make_progrs_bar(trns_stats[i]));
    }
}

function make_progrs_bar(trans_data){
// trans_data =
//            {
//              "RQST_ID": 16,
//              "EVNT_STAT": "PENDING",
//              "CMPLT_PRCNTG": 19.755
//            }
    
    try {
        if (trans_data.CMPLT_PRCNTG == undefined || trans_data.CMPLT_PRCNTG==null || trans_data.CMPLT_PRCNTG=='') trans_data.CMPLT_PRCNTG='0%';
        var cntnr = document.createElement('div');    
        cntnr.classList.add("w3-container");
        cntnr.classList.add("progrs_row");

        var lbl_1 = document.createElement('p');
        try {
            lbl_1.innerHTML = 'Task: '+trans_data.TASK.toString()+
                        '<br>Last file copy/pasted: '+trans_data.WRKG_ON_TRNSFG.toString()+
                        '<br>Request id: '+trans_data.RQST_ID.toString()+
                        '<br> Current Status: '+trans_data.EVNT_STAT.toString();    
        } catch (error) {
            lbl_1.innerHTML = 'Task: '+trans_data.TASK.toString()+
                        '<br>Request id: '+trans_data.RQST_ID.toString()+
                        '<br> Current Status: '+trans_data.EVNT_STAT.toString();
        }
    
        var prog_div = document.createElement('div');
        prog_div.classList.add("progress");
        prog_div.classList.add("w3-light-grey");
    
        var p_bar = document.createElement('div');
        p_bar.id = 'p_bar_'+trans_data.RQST_ID.toString();
        p_bar.classList.add("progress-bar");
        p_bar.classList.add("progress-bar-striped");
        p_bar.classList.add("active");
        p_bar.classList.add("w3-container");
        p_bar.classList.add("w3-green");
        p_bar.role="progressbar";
        p_bar.ariaValueNow=Math.round(trans_data.CMPLT_PRCNTG).toString();
        p_bar.ariaValueMin="0";
        p_bar.ariaValueMax="100";
        p_bar.style.height='24px';
        p_bar.style.width=Math.round(trans_data.CMPLT_PRCNTG).toString()+'%';

        prog_div.appendChild(p_bar);

        var lbl_2 = document.createElement('p');
        lbl_2.innerHTML=trans_data.CMPLT_PRCNTG.toString()+"% Completed";

        cntnr.appendChild(lbl_1);
        cntnr.appendChild(prog_div);
        cntnr.appendChild(lbl_2);

        return cntnr;
    } catch (error) {
        
    }
}

function cleartimer(){
    try {clearInterval(tmr_id);revome_kids("dwnld_sts_body");} catch (error) {console.log(error);}
}










function ld_tbl(){
    var uf=[];
    var t= 0;
    var fltr_dt=[document.getElementById('slctd_cmp').innerHTML,document.getElementById('slctd_bld').innerHTML,
                 document.getElementById('slctd_lev').innerHTML,document.getElementById('slctd_qud').innerHTML,
                 document.getElementById('slctd_ft').innerHTML];
    var tbl_data = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(localStorage.dwld_tbl_data)))));
    for (let i = 0; i < fltr_dt.length; i++) {
        if(fltr_dt[i]!=undefined&&fltr_dt[i]!=null&&fltr_dt[i]!=''){uf.push(true); t++;}
        else uf.push(false);
    }
    try {
        document.getElementById("req_tbl").removeChild(document.getElementById("req_tbl").children[0]);
    } catch (error) {}
    var tbl_bdy = document.createElement("tbody");
    tbl_bdy.setAttribute('id','req_tbl_bdy');
    document.getElementById('req_tbl').appendChild(tbl_bdy);
    document.getElementById('req_tbl_bdy').appendChild(hdr_row(['ADD TO CART','CAMPUS','BUILDING','LEVEL','QUADRANT','FILE TYPE']));
    if(t>0){
        for (let i = 0; i < tbl_data.length; i++) {
            var r =[tbl_data[i].CAMPUS.toUpperCase(),tbl_data[i].BUILDING.toUpperCase(),tbl_data[i].LEVEL.toUpperCase(),tbl_data[i].QUAD.toUpperCase(),
                                                                                tbl_data[i].FILE_TYPE.toUpperCase()]
            var chk_ar=[];
            for (let f = 0; f < uf.length; f++) {
                if(uf[f] && fltr_dt[f].toUpperCase() == r[f].toUpperCase())chk_ar.push(true);
            }
            if(chk_ar.length==t)
                add_2_tbl('req_tbl_bdy',['',tbl_data[i].CAMPUS,tbl_data[i].BUILDING,tbl_data[i].LEVEL,tbl_data[i].QUAD,tbl_data[i].FILE_TYPE],i);
            }
    }else{
        for (let i = 0; i < tbl_data.length; i++) {
            add_2_tbl('req_tbl_bdy',['',tbl_data[i].CAMPUS,tbl_data[i].BUILDING,tbl_data[i].LEVEL,tbl_data[i].QUAD,tbl_data[i].FILE_TYPE],i);
        }
    }
    //document.getElementById('reqst_btn').style.display='block';
}

function ld_pldwns(){
    add_pldwn_opt("cmp_dpdn",window.sessionStorage.cmps.split(","),'cmp_chngd');
    add_pldwn_opt("bld_dpdn",window.sessionStorage.bds.split(","),'bld_chngd');
    add_pldwn_opt("lvl_dpdn",window.sessionStorage.lvs.split(","),'lvl_chngd');
    add_pldwn_opt("quad_dpdn",window.sessionStorage.quds.split(","),'quad_chngd');
    add_pldwn_opt("ft_dpdn",window.sessionStorage.fts.split(","),'ft_chngd');
}


function add_pldwn_opt(prnt_id, ar, onclick){
    revome_all_children_from_parent(prnt_id);
    var prnt = document.getElementById(prnt_id);
    for (let i = 0; i < ar.length; i++) {
        var kd = document.createElement('label');
        kd.innerHTML=ar[i];
        kd.setAttribute("onclick",onclick+"('"+ar[i]+"')");
        prnt.appendChild(kd);
    }
}

function show_sub_row(id){
    if(document.getElementById(id).classList.contains("tst_tbl_h")){
        document.getElementById(id).classList.remove("tst_tbl_h");
        document.getElementById(id).classList.add("tst_tbl_s");
    } else{
        document.getElementById(id).classList.remove("tst_tbl_s");
        document.getElementById(id).classList.add("tst_tbl_h");
    }
    //elm_on_off(id);
    //id.style.display="block";
    //document.getElementById(id).style.display="block";
}

function chk_box(chkbx_id){
    document.getElementById(chkbx_id).click();
}

function add_2_tbl(prnt_id,col_ar,ri){

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    var r = document.createElement('tr');
    r.classList.add("req_tbl");
    for (let i = 0; i < col_ar.length; i++) {
        var cell = document.createElement('td');
        cell.classList.add("req_tbl");
        cell.setAttribute("onclick",'chk_box("chk_bx_'+ri+'")'); 
        if(i==0){ 
            var chk_box = document.createElement("input");
            chk_box.setAttribute("type","checkbox");
            chk_box.setAttribute("id",'chk_bx_'+ri); 
            chk_box.setAttribute("onchange",'show_sub_row("sr_'+ri+'")');
            cell.appendChild(chk_box);
        } else {
            cell.innerHTML=col_ar[i];
        }
        r.appendChild(cell);
    }
    document.getElementById(prnt_id).appendChild(r);
    var sr = document.createElement('tr');
    sr.classList.add("tst_tbl_h");
    sr.setAttribute("id",'sr_'+ri);
    var srcell = document.createElement('td');
    srcell.setAttribute("colspan", "6")
    srcell.classList.add("tst_tbl");


    var lbl_1= document.createElement("label");
    lbl_1.innerHTML="Select the earliest date you would like to use for filtering:"
   

    var d1 = document.createElement("INPUT");
    d1.setAttribute("type", "date");
    d1.classList.add("w3-right");
    d1.setAttribute("value", new Date().toDateInputValue());
    lbl_1.appendChild(d1);
    srcell.appendChild(lbl_1);

    var lbl_2= document.createElement("label");
    lbl_2.innerHTML="Select the oldest date you would like to use for filtering: "
    

    var d2 = document.createElement("INPUT");
    d2.setAttribute("type", "date");
    d2.classList.add("w3-right");
    lbl_2.appendChild(d2);
    srcell.appendChild(lbl_2);

    sr.appendChild(srcell);
    document.getElementById(prnt_id).appendChild(sr);


    
}


function hdr_row(hdr_ar){
    //var tbl_bdy = document.createElement("tbody");
    var hr = document.createElement("tr");
    hr.classList.add("req_tbl");

    for (let i = 0; i < hdr_ar.length; i++) {
        var col = document.createElement("th");
        col.classList.add("req_tbl");
        col.setAttribute("scope","col");
        col.innerHTML=hdr_ar[i];
        col.style.width="25%"
        hr.appendChild(col);
    }
    //tbl_bdy.appendChild(hr);
    //return tbl_bdy;
    return hr;
}






function srch_rcps(){
    var drv_ltr = '';
    try {
        drv_ltr = window.sessionStorage.req_adrs.split('/')[window.sessionStorage.req_adrs.split('/').length-2]
    } catch (error) {
        var bt_ar = get_num_of_diplyd_drv_btns()
        if (bt_ar.length==1){
            window.sessionStorage.jmp_bk_2="srch_rcps()";
            document.getElementById(bt_ar[0]).click();
        } else window.alert("Please select which drive you would like to copy the requested files to");
    }
    if (drv_ltr != '' && drv_ltr != undefined && drv_ltr != null){
        var rcp_lst=document.getElementById('srch_fd').value;
        document.getElementById('srch_fd').value='';
        if(rcp_lst.match(','))rcp_lst=rcp_lst.split(',');
        else{rcp_lst=rcp_lst+',';rcp_lst=rcp_lst.split(',');}
        for (let i = 0; i < rcp_lst.length; i++) {
            rcp_lst[i]=rcp_lst[i].toString().replace(' ','');
        }
        //go to db and run 'FIND_PROCSD_RCP'
        //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
        //var drv_ltr = window.sessionStorage.req_adrs.split('/')[window.sessionStorage.req_adrs.split('/').length-2]
        var obj = JSON.stringify(dnld={ft:"RCP", task:"QUAD_LKUP", srch_dt:rcp_lst});
        try{
            window.top.get_scn_dnld_tbl(drv_ltr,JSON.stringify(JSON.parse(obj)),
            function(rtn_tbl){
                var tbl_data = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(rtn_tbl)))));
                try {
                    document.getElementById("rcp_tbl").removeChild(document.getElementById("rcp_tbl").children[0]);
                } catch (error) {}
                var tbl_bdy = document.createElement("tbody");
                tbl_bdy.setAttribute('id','rcp_tbl_bdy');
                document.getElementById('rcp_tbl').appendChild(tbl_bdy);
                document.getElementById('rcp_tbl_bdy').appendChild(hdr_row(['ADD TO CART','SEARCH DATA','UPLOAD DATE','BUILDING','LEVEL','QUADRANT']));
                //                                                              SRCH_DATA,SCAN_UPLOAD_DATE,BUILDING,LEVEL,QUAD
                //document.getElementById('rcp_tbl_bdy').appendChild(hdr_row(['ADD TO CART','BUILDING','LEVEL','QUADRANT']));
                for (let r = 0; r < tbl_data.length; r++) {
                    add_2_tbl('rcp_tbl_bdy',['',tbl_data[r].SRCH_DATA,tbl_data[r].SCAN_UPLOAD_DATE,tbl_data[r].BUILDING,tbl_data[r].LEVEL,tbl_data[r].QUAD],r)
                    //add_2_tbl('rcp_tbl_bdy',[tbl_data[r].BUILDING,tbl_data[r].LEVEL,tbl_data[r].QUAD],r)
                }
            });
        } catch (error) {
            chk_4_new_drives();
            window.alert("OoPpsSs!! Our bad, something happened with the selected drive.. wanna try doing that again?");
        }
        document.getElementById('reqst_btn').style.display='block';
        elm_on_off('srch_dpdn');
    }
    
}






function fd_rcp_fr_slctn(){
    var drv_ltr = '';
    try {
        drv_ltr = window.sessionStorage.req_adrs.split('/')[window.sessionStorage.req_adrs.split('/').length-2]
    } catch (error) {
        var bt_ar = get_num_of_diplyd_drv_btns()
        if (bt_ar.length==1){
            window.sessionStorage.jmp_bk_2="fd_rcp_fr_slctn()";
            document.getElementById(bt_ar[0]).click();
        } else window.alert("Please select which drive you would like to copy the requested files to");
    }
    if (drv_ltr != '' && drv_ltr != undefined && drv_ltr != null){
        //1.) exec get_chkd_frm_tbl('rqu_tbl_div')
        var slctn = get_chkd_frm_tbl('req_tbl_bdy');
        //2.) send JSON/ array to db and exec query ('unknown name')
        //console.log("sending the following to server");
        //console.log(JSON.stringify(slctn));

        //var drv_ltr = document.getElementById(actvt_brswr).contentWindow.base_adrs.split('/')[1];
        //var drv_ltr = window.sessionStorage.req_adrs.split('/')[window.sessionStorage.req_adrs.split('/').length-2]
        var obj = JSON.stringify(dnld={ft:"RCP", task:"FIND", srch_dt:slctn});
        try {
            window.top.get_scn_dnld_tbl(drv_ltr,JSON.stringify(JSON.parse(obj)),
            function(rtn_tbl){
                var tbl_data = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(rtn_tbl)))));
                remv_rcp_tbl();
                var tbl_bdy = document.createElement("tbody");
                tbl_bdy.setAttribute('id','rcp_tbl_bdy');
                document.getElementById('rcp_tbl').appendChild(tbl_bdy);
                document.getElementById('rcp_tbl_bdy').appendChild(hdr_row(['ADD TO CART','SEARCH DATA','RCP FILE NAME','UPLOAD DATE']));
                //                                                              SRCH_DATA, RCP_FILE_NAME, UPLOAD_DATE
                //document.getElementById('rcp_tbl_bdy').appendChild(hdr_row(['ADD TO CART','BUILDING','LEVEL','QUADRANT']));
                for (let r = 0; r < tbl_data.length; r++) {
                    add_2_tbl('rcp_tbl_bdy',['',tbl_data[r].SRCH_DATA,tbl_data[r].RCP_FILE_NAME,tbl_data[r].UPLOAD_DATE],r)
                    //add_2_tbl('rcp_tbl_bdy',[tbl_data[r].BUILDING,tbl_data[r].LEVEL,tbl_data[r].QUAD],r)
                }
            });
        } catch (error) {
            chk_4_new_drives();
            window.alert("OoPpsSs!! Our bad, something happened with the selected drive.. wanna try doing that again?");
        }
        document.getElementById('reqst_btn').style.display='block';
    }
}

function remv_rcp_tbl(){
    try {
        document.getElementById("rcp_tbl").removeChild(document.getElementById("rcp_tbl").children[0]);
    } catch (error) {}
}

function get_chkd_frm_tbl(tbl_id){
    var tbl = document.getElementById(tbl_id);
    var rd=[];
      //1.) loop thru tbl and collect all checked/'add to cart'
      //2.) convert row data into array element/ JSON
      //3.) return table results/ complied array/ JSON  
      
    try {
        for (let r = 1; r < tbl.children.length; r++) {
            //var a = tbl.children[r];
            if(tbl.children[r].children[0].children[0].checked){
                rd.push([tbl.children[r].children[1].innerHTML,
                         tbl.children[r].children[2].innerHTML,
                         tbl.children[r].children[3].innerHTML,
                         tbl.children[r].children[4].innerHTML,
                         tbl.children[r].children[5].innerHTML.replace('.',''),
                         tbl.children[r].nextSibling.children[0].children[0].children[0].value,
                         tbl.children[r].nextSibling.children[0].children[1].children[0].value]);
            }
        }
    } catch (error) {
        try {
            for (let r = 1; r < tbl.children.length; r++) {
                if(tbl.children[r].children[0].children[0].checked){
                    rd.push([tbl.children[r].children[1].innerHTML,
                             tbl.children[r].children[2].innerHTML,
                             //tbl.children[r].children[3].innerHTML,
                             tbl.children[r].nextSibling.children[0].children[0].children[0].value,
                             tbl.children[r].nextSibling.children[0].children[1].children[0].value]);
                }
            }            
        } catch (error) {}

    }
    
    return rd;
}


function chk_pre_nav(){
    if(window.top.sessionStorage.file_explr_btn_clk!=undefined&&
        window.top.sessionStorage.file_explr_btn_clk!=null&&
        window.top.sessionStorage.file_explr_btn_clk!="")
            window.top.document.getElementById(window.top.sessionStorage.file_explr_btn_clk).click();
}



function reqst_slctn(){
    var req_dir = window.sessionStorage.req_adrs;
    //if (req_dir != undefined || req_dir != '' || req_dir != null){
    var drv_ltr = '';
    try {
        drv_ltr = window.sessionStorage.req_adrs.split('/')[window.sessionStorage.req_adrs.split('/').length-2]
    } catch (error) {
        var bt_ar = get_num_of_diplyd_drv_btns()
        if (bt_ar.length==1){
            window.sessionStorage.jmp_bk_2="fd_rcp_fr_slctn()";
            document.getElementById(bt_ar[0]).click();
        } else window.alert("Please select which drive you would like to copy the requested files to");
    }

    if (req_dir != undefined && req_dir != '' && req_dir != null){
        //1.) exec get_chkd_frm_tbl('rqu_tbl_div')
        var t_1 = get_chkd_frm_tbl('req_tbl_bdy');
        //2.) exec get_chkd_frm_tbl('req_tbl_bdy')
        var t_2 = get_chkd_frm_tbl('rcp_tbl_bdy');
        //3.) send JSON/ array to db and exec query ('unknown name')
        for (let r = 0; r < t_2.length; r++) {
            t_1.push(t_2[r]);
        }
        try{
            elm_on_off('reqst_btn');
            console.log("sending the following request to "+window.sessionStorage.req_adrs);
            console.log(t_1);
            console.log(JSON.stringify(t_1));
            submt_reqst(drv_ltr,JSON.stringify(t_1))

        } catch (error) {
            elm_on_off('reqst_btn');
            chk_4_new_drives();
            window.alert("OoPpsSs!! Our bad, something happened with the selected drive.. wanna try doing that again?");
            console.log(error);
        }
    } else {
        var bt_ar = get_num_of_diplyd_drv_btns()
        if (bt_ar.length==1){
            window.sessionStorage.jmp_bk_2="reqst_slctn()";
            document.getElementById(bt_ar[0]).click();
        } else window.alert("Please select which drive you would like to copy the requested files to");
    }
    


    
}




function submt_reqst(drv_ltr,rqst_strg){
  // example: rqst_strg = [
  //                          ["SITE","BULIDING","LEVEL","CLO/ROW","FILE_TYPE","DATE_1","DATE_2"],
  //                          ["SITE","BULIDING","LEVEL","CLO/ROW","FILE_TYPE","DATE_1","DATE_2"],
  //                          ["SITE","BULIDING","LEVEL","CLO/ROW","FILE_TYPE","DATE_1","DATE_2"]
  //                      ]
  
            window.top.req_copy(drv_ltr,JSON.stringify(JSON.parse(rqst_strg)),
            function(res){

                if (res==undefined||res==null||res==""){
                    try {
                        window.sessionStorage.removeItem("req_adrs");
                        refsh_btn_txt();
                        if (actvt_vew == "dwnld_scans_ui_tbl"){
                            bld_chngd('');
                            remv_rcp_tbl();
                        }
                        window.alert("Your request as been submitted and is being processed.. or should be (fingers crossed) :/ haha");
                    } catch (error) {
                        elm_on_off('reqst_btn');
                        chk_4_new_drives();
                        window.alert("OoPpsSs!! Our bad, something happened with the selected drive.. wanna try doing that again?");
                        console.log(error);
                    }
                }else{
// some error happened on the server side with the requested download
// assume most of the time this is caused because the selected drive doesn't have enough free space on it for the download
//---------     bring in pop-up msgbox with "Dwnlod_Rqst_Drv_Spc_Err.html" in it    ---------   
                    alert(res);
                    
                }
                

            });
}









function get_num_of_diplyd_drv_btns(){
    var btn_div = document.getElementById("drive_btns");
    var btn_ar=[];
    for (let i = 0; i < btn_div.children.length; i++) {
        var a = btn_div.children[i];
        if (btn_div.children[i].style.display == "block" && btn_div.children[i].id != "drv_0_btn") btn_ar.push(btn_div.children[i].id);
    }
    return btn_ar;
}







function clean_up_sidebar(){
    copy_frm_loc = '';
    paste_to_loc = '';
    var scan_side_bar = window.top.document.getElementById("nav_to_scans");
    try {
        scan_side_bar.removeChild(window.top.document.getElementById("copy_frm_lbl"));
        //scan_side_bar.removeChild(window.top.document.getElementById("copy_frm_loc_lbl"));        
    } catch (error) {}
    try {
        scan_side_bar.removeChild(window.top.document.getElementById("paste_to_lbl"));
        //scan_side_bar.removeChild(window.top.document.getElementById("paste_to_loc_lbl"));    
    } catch (error) {}
    try {
        scan_side_bar.removeChild(window.top.document.getElementById("fx_scan_fldr_lbl"));
        //scan_side_bar.removeChild(window.top.document.getElementById("fx_scan_fldr_loc_lbl"));    
    } catch (error) {}

}

function edit_scan_sidebar(lbl_1_id, lbl_1_strg, usr_info_lbl_2_id, copy_paste_loc){
    var scan_side_bar = window.top.document.getElementById("nav_to_scans");   
    try {
        var copy_frm_loc_lbl = window.top.document.getElementById(usr_info_lbl_2_id);
        if (copy_frm_loc_lbl == null){
            make_sidebar_info_lbl(scan_side_bar,lbl_1_id,lbl_1_strg,usr_info_lbl_2_id,copy_paste_loc);
        } else{
            copy_frm_loc_lbl.innerHTML = copy_paste_loc;
        }
    } catch (error) {
        make_sidebar_info_lbl(scan_side_bar,lbl_1_id,lbl_1_strg,usr_info_lbl_2_id,copy_paste_loc);
    }
}

function make_sidebar_info_lbl(prnt_2_add_info_2, lbl_1_id, lbl_1_strg, usr_info_lbl_2_id, usr_info_lbl_2_strg){
    var div = document.createElement("div");
    div.setAttribute("id",lbl_1_id);
    var br = document.createElement("br");
    var lbl_1 = document.createElement("label");
    lbl_1.setAttribute("style","padding-left:5px");
    lbl_1.innerHTML=lbl_1_strg
    var lbl_2 = document.createElement("label");
    lbl_2.setAttribute("id",usr_info_lbl_2_id);
    lbl_2.setAttribute("style","word-wrap:break-word;padding-left:20px;padding-right:15px;");
    lbl_2.innerHTML=usr_info_lbl_2_strg

    div.appendChild(lbl_1);
    div.appendChild(br);
    div.appendChild(lbl_2);
    prnt_2_add_info_2.appendChild(div);

}









function copy_proj_docs(task){
    //to_loc_slctd(); //--<--- changed on 1/8/21 to make check-in easier
    frm_loc_slctd();
    var a = JSON.parse(window.sessionStorage.scan_data)
    a.task = task;
    a.id_proj_num = prompt("Please enter the industrial design project number associated with this "+task.replace("~"," ")+": ","00001");
    window.sessionStorage.scan_data = JSON.stringify(a);
    copy_paste();
}



















function copy__paste(copy_frm, paste_to){
    if (copy_frm_loc != '' && paste_to_loc != ''){
       window.alert("copying/pasteing items from "+copy_frm+" to "+paste_to);
        clean_up_sidebar();
    }
    
}


function copy_paste(){
    var a = JSON.parse(window.sessionStorage.scan_data)
    //a.task = task;
    //window.sessionStorage.scan_data = JSON.stringify(a);

    if (a.copy_frm != undefined && a.copy_frm != ''){
         
        window.top.post_to_db_2("/"+a.copy_frm.split("\\")[0]+"/"+a.task.replace("~",""),
        fix_arg_strg(JSON.stringify(a)), function(){clean_up_sidebar();});
        localStorage.removeItem("scan_data");
        window.sessionStorage.scan_data = JSON.stringify({});

    }
    
}































function eject_drv(drv_id){
    window.alert("sending drive ejection command for drive "+drv_id);
    window.top.EJCT_DRV(drv_id,function(){chk_4_new_drives()});
}

function use_drive(dir_id,btn_id){
    //window.alert("redirecting to drive: "+path);
    window.turn_all_childern_off("explr_mangr_body");
    var pag_adrs = chk_pg(dir_id);
    document.getElementById(dir_id).style.display='block';
    actvt_brswr = dir_id;
    refsh_btn_txt();

    if (crnt_nav_view()=='ez_nav' && btn_id=='drv_0_btn'){
        window.alert("Drive '"+
        document.getElementById(btn_id).children[0].children[2].innerHTML.replace(/<br\s*[\/]?>/gi,' ')+
        "' is not allow to be selected for this kind of action. Please select another drive.");
        window.sessionStorage.removeItem("req_adrs");
    }else{
        document.getElementById(btn_id).children[0].children[2].innerHTML = 
        document.getElementById(btn_id).children[0].children[2].innerHTML+"<br> (selected drive)";
        window.sessionStorage.req_adrs= this.parent.origin+'/'+pag_adrs.replace(this.parent.origin+'/','').split('/')[0]+'/';
    }

    window.sessionStorage.jmp_bk_2=undefined;
    drv_slcnt_cb();
}

function drv_slcnt_cb(){
    if(window.sessionStorage.jmp_bk_2!="undefined" && 
                window.sessionStorage.jmp_bk_2!="null" && 
                window.sessionStorage.jmp_bk_2!=''){
        var cb = window.sessionStorage.jmp_bk_2;
        window.sessionStorage.removeItem("jmp_bk_2_req");
        switch (cb) {
            case "srch_rcps()":
                srch_rcps();
                break;
            case "fd_rcp_fr_slctn()":
                fd_rcp_fr_slctn();
                 break;
            case "reqst_slctn()":
                reqst_slctn();
                break;
            default:
                break;
        }
    }
}



function refsh_btn_txt(){
    var bs=window.sessionStorage.btns.split(',');
    for (let i = 0; i < bs.length; i++) {
        try {
            document.getElementById(bs[i]).children[0].children[2].innerHTML = 
                    document.getElementById(bs[i]).children[0].children[2].innerHTML.replace(/<br\s*[\/]?>\s.(\bselected\s\bdrive.)/gi,'');
            //document.getElementById(bs[i]).children[0].children[2].innerHTML = 
            //        document.getElementById(bs[i]).children[0].children[2].innerHTML.replace(/<br\s*[\/]?>\s.(\bselected\s\bas\s\bdrive\s\bto\s\bcopy\s\bto.)/gi,'');
        } catch (error) {}
    }
}


function chk_pg(dir_id){
    var dir_pg = document.getElementById(dir_id);
    if(0 >= dir_pg.childNodes.length){
        var rplcmnt_pg_loc = dir_pg.getAttribute("data");
        var pg_id = dir_pg.getAttribute("id");
        dir_pg.remove();
        var rplcmnt_pg = fe_load_sub_page(rplcmnt_pg_loc,false,1);
        document.getElementById(rplcmnt_pg).id = pg_id;
        return rplcmnt_pg_loc;
    }
}



function revome_all_children_from_parent(prnt_id){
    var prnt = document.getElementById(prnt_id);
    if (!(prnt.children.length == 0)){
        //var chrdln = prnt.children.length;
        for (i=prnt.children.length; !(0 > i) ; i--){
            try{
                prnt.removeChild(prnt.children[i]);
            }catch{
                try{
                    prnt.removeChild(prnt.children[i-1]);
                }catch{}
            }
        }
    }
}


function chk_4_new_drives(){
    try {
        window.sessionStorage.removeItem("req_adrs");
    } catch (error) {}
    if (document.getElementById("drive_btns")){
        window.turn_all_childern_off("drive_btns");
        get_dvs(function(res){
            revome_all_children_from_parent("explr_mangr_body");
            pg_cntr=document.getElementById("explr_mangr_body").children.length;
            res = JSON.parse(JSON.stringify(JSON.parse(res)));
            var b_ar=[];
            var btn_nme = "drv_btn";
            var show_pg = true
            for (let i = res.length-1; i >= 0 ; i--) {
                if(actvt_vew == 'chk_out_scans_ui' && res.length-1 == 0)
                    dir_id = fe_load_sub_page(server + res[i].PATH.toString().substring(1),true,1);
                dir_id = fe_load_sub_page(server + res[i].PATH.toString().substring(1),show_pg,1);
                show_pg = false;
                var btn_id = btn_nme.split('_')[0]+'_'+i.toString()+'_'+btn_nme.split('_')[1];
                b_ar.push(btn_id);
                var btn = document.getElementById(btn_id);
                btn.childNodes[1].childNodes[5].innerHTML = res[i].NAME+'<br>'+res[i].CAPTION;
                btn.setAttribute('onclick','use_drive("'+dir_id+'","'+btn_id+'")');
                btn.style.display='block';
            }

            window.sessionStorage.btns=b_ar;
            if(actvt_vew == 'chk_out_scans_ui')
                document.getElementById("drv_0_btn").style.display="block";
            else document.getElementById("drv_0_btn").style.display="none";
        });
    }
}

function chk_out_scan_proj_fldr(){
    //window.alert("checking out scan project folder");
    //document.getElementById("cpy_frm_btn").style.display="none"
    copy_proj_docs("check~out");
}

function crnt_nav_view(){
    if(document.getElementById('easy_nav_view_btn').style.display=='block') return 'brwsr';
    else return 'ez_nav';
}



function elm_on_off(id){
    try {
        if(document.getElementById(id).style.display=='block') document.getElementById(id).style.display='none';
        else document.getElementById(id).style.display='block';    
    } catch (error) {
        try {
            if(id.style.display=='block') id.style.display='none';
            else id.style.display='block';
        } catch (error) {
            console.log("could not find object")
        }
    }
    
}

function turn_off_all_btns(){
    window.turn_all_childern_off("fleexplr_body");
    window.turn_all_childern_off("copy_paste_btns");
    //window.turn_all_childern_off("drive_btns");
    //document.getElementById("drive_btns").style.display="none";
    window.turn_all_childern_off("svr_fun_btns");
}

function turn_on_easy_nav(){ 
    show_hide_ez_nav_pgs();
    actvt_vew == "dwnld_scans_ui_ez_nav";
    document.getElementById("dwnld_sts_body").style.display="none";
    document.getElementById("explr_mangr_body").style.display="none";
    document.getElementById("easy_nav_view_btn").style.display="none";
    document.getElementById("file_brwsr_btn").style.display="block";
    document.getElementById("the_div").style.display="none";
    document.getElementById("explr_easy_nav_body").style.display="block";
}

function turn_on_tbl_nav(){ 
    show_hide_ez_nav_pgs(true);
    actvt_vew == "dwnld_scans_ui_tbl";
    document.getElementById("dwnld_sts_body").style.display="none";
    document.getElementById("explr_mangr_body").style.display="none";
    document.getElementById("easy_nav_view_btn").style.display="block";
    document.getElementById("file_brwsr_btn").style.display="none";
    document.getElementById("the_div").style.display="block";
    document.getElementById("explr_easy_nav_body").style.display="block";
}

function turn_on_mangr_nav(){
    show_hide_ez_nav_pgs(true)
    document.getElementById("dwnld_sts_body").style.display="none";
    document.getElementById("explr_easy_nav_body").style.display="none";
    document.getElementById("file_brwsr_btn").style.display="none";
    document.getElementById("easy_nav_view_btn").style.display="block";
    document.getElementById("explr_mangr_body").style.display="block";
}

function shrink_tbl_div(){
    document.getElementById("tbl_div").classList.remove("w3-half");
    document.getElementById("tbl_div").classList.add("w3-quarter");
    document.getElementById("easy_nav_view_btn").classList.remove("w3-half");
    document.getElementById("file_brwsr_btn").classList.remove("w3-half");
}

function grow_tbl_div(){
    document.getElementById("tbl_div").classList.remove("w3-quarter");
    document.getElementById("tbl_div").classList.add("w3-half");
    document.getElementById("easy_nav_view_btn").classList.add("w3-half");
    document.getElementById("file_brwsr_btn").classList.add("w3-half");
}


function upld_scans_ui(){
    cleartimer();
    actvt_vew = 'upld_scans_ui';
    turn_on_mangr_nav();
    //window.alert("starting upload process");
    turn_off_all_btns();
    grow_tbl_div();
    //document.getElementById("cpy_frm_btn").children[0].children[2].innerHTML = "Upload Scan Project Below";
    document.getElementById("cpy_frm_btn").setAttribute("onclick","");
    document.getElementById("pst_to_btn").setAttribute("onclick","");
    window.turn_all_childern_on("copy_paste_btns");
    window.turn_all_childern_on("svr_fun_btns");
    document.getElementById("chk_out_scn_fldr_btn").style.display="none";
    document.getElementById("fx_scn_fldr_btn").style.display="none";

 //-------re_val---when bryan is done with this walk-thru remove from-----here------------------------
    //hide_stuff();
//--------------to---here------------------------------------------------------------

    //document.getElementById("drive_btns").style.display="block";
    window.turn_all_childern_on("fleexplr_body");
    document.getElementById("dwnld_sts_body").style.display="none";
    chk_4_new_drives();
    document.getElementById("fleexplr_body").style.display="block";
    
}

function chk_out_scans_ui(){
    cleartimer();
    actvt_vew = 'chk_out_scans_ui';
    turn_on_mangr_nav();
    //window.alert("starting check out process");
    turn_off_all_btns();
    grow_tbl_div();
    //document.getElementById("cpy_frm_btn").children[0].children[2].innerHTML = "Check Out Scan Project Below";
    //document.getElementById("cpy_frm_btn").setAttribute("onclick","chk_out_scan_proj_fldr()");
    document.getElementById("pst_to_btn").setAttribute("onclick","copy_proj_docs()");
    window.turn_all_childern_on("copy_paste_btns");
    //window.turn_all_childern_on("drive_btns");
    document.getElementById("lk_4_drvs_btn").style.display="block";
    document.getElementById("chk_out_scn_fldr_btn").style.display="block";

//-------re_val---when bryan is done with this walk-thru remove from-----here------------------------
    //hide_stuff();
    //document.getElementById("drv_0_btn").style.display="block";
//--------------to---here------------------------------------------------------------

    window.turn_all_childern_on("fleexplr_body");
    document.getElementById("dwnld_sts_body").style.display="none";
    chk_4_new_drives();
    document.getElementById("fleexplr_body").style.display="block";

}

function fix_scan_fldr_ui(){
    cleartimer();
    //window.alert("fixing scan folder and file names");
    actvt_vew = 'fix_scan_fldr_ui';
    turn_on_mangr_nav();
    turn_off_all_btns();
    shrink_tbl_div();
    //window.turn_all_childern_on("drive_btns");
    document.getElementById("lk_4_drvs_btn").style.display="block";
    document.getElementById("fx_scn_fldr_btn").style.display="block";

    window.turn_all_childern_on("fleexplr_body");
    document.getElementById("dwnld_sts_body").style.display="none";
    document.getElementById("fleexplr_body").style.display="block";
}









function dwnld_scans_ui(){
    cleartimer();
    //window.alert("starting download process"); explr_easy_nav_body
    actvt_vew = 'dwnld_scans_ui';
    get_ez_nav_pg();
    document.getElementById("explr_mangr_body").style.display="block";

    get_scan_dwld_info();
    turn_off_all_btns();
    shrink_tbl_div();
    turn_on_easy_nav();
    document.getElementById("lk_4_drvs_btn").style.display="block";
    window.turn_all_childern_on("fleexplr_body");
    document.getElementById("dwnld_sts_body").style.display="none";
    //chk_4_new_drives();
    document.getElementById("fleexplr_body").style.display="block";
    document.getElementById("explr_easy_nav_body").style.display="block";
}




function get_ez_nav_pg(cb){
    ez_nav_get_pg(function(page_2_load){
        var obj_id = load_sub_page(page_2_load,"explr_easy_nav_body",true,1);
        document.getElementById(obj_id).setAttribute("zoom","40%");
        //window.top.mang_sub_pg_ld('/FILE_EXPLR',true,0.90)
        if (cb) cb();
    })
}

function show_hide_ez_nav_pgs(hide){
    var ez_nav_elm = $("#explr_easy_nav_body");
    var tst = $("[data='scan_dwld_ez_nav.html']");
    for (let i = 0; i < tst.length; i++) {
        if (hide) tst[i].style.display="none";
        else
            if (tst[i].style.display=="block") tst[i].style.display="none";
            else tst[i].style.display="block";
    }
}


















function scan_fill_sts_ui(){
    cleartimer();
    //window.turn_all_childern_off("fleexplr_body");
    document.getElementById("fleexplr_body").style.display="none";
    document.getElementById("dwnld_sts_body").style.display="none";
    document.getElementById("explr_mangr_body").style.display="none";
    document.getElementById("explr_easy_nav_body").style.display="none";
    get_scan_dwld_sts_info(function(){
        //chk_4_new_drives();
        document.getElementById("dwnld_sts_body").style.display="block";
    });
}



function scan_actions(){
    actvt_brswr = 'pg_nme_0';
    turn_off_all_btns();
    turn_on_mangr_nav();
    var chld_sub_info = JSON.parse(JSON.stringify(window.top.does_sub_pg_exist('/FILE_EXPLR')));
    if (chld_sub_info.pg_exst){
        chld_name = chld_sub_info.id;
        try {
            window.top.document.getElementById("upld_scans_btn").setAttribute("onclick","document.getElementById('"+chld_name+"').contentDocument.defaultView.upld_scans_ui()");
        } catch (error) {}
        try {
            window.top.document.getElementById("chk_out_scans_btn").setAttribute("onclick","document.getElementById('"+chld_name+"').contentDocument.defaultView.chk_out_scans_ui()");
        } catch (error) {}
        try {
            window.top.document.getElementById("dwnld_scans_btn").setAttribute("onclick","document.getElementById('"+chld_name+"').contentDocument.defaultView.dwnld_scans_ui()");
        } catch (error) {}
        try {
            window.top.document.getElementById("fix_scan_fldr_btn").setAttribute("onclick","document.getElementById('"+chld_name+"').contentDocument.defaultView.fix_scan_fldr_ui()");            
        } catch (error) {}
        try {
            window.top.document.getElementById("scan_fill_sts_btn").setAttribute("onclick","document.getElementById('"+chld_name+"').contentDocument.defaultView.scan_fill_sts_ui()");            
        } catch (error) {}
    } else {
        window.turn_all_childern_on("fleexplr_body");
        window.turn_all_childern_on("copy_paste_btns");
        //window.turn_all_childern_on("drive_btns");
        window.turn_all_childern_on("svr_fun_btns");
    }
}