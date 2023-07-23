var id_dialog="proj_dash_dialog_body";
var evnt_html="Dev_Proj_dash_Timeline_Events.html";
var event_data;
var baseURL = "";
try {
    baseURL = server;
} catch (error) {}
var frms = ['evnt_info','new_proj_milestn_dialog_frm','add_proj_milestn_2_proj_dialog_frm'];
var form_data = new Object()
var obj_2 = new Object()
var obj_3 = new Object()
const month_Names = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];


function load_mlstn_data(cb){
    try {
        //var prnt_wndw = this.window;
        //var prnt_wndw_2 = parent.window;
        parent.window.GET_MILESTONE_DATA(function(frm_data){
            form_data = frm_data;
            add_opts_2_pulldown(frm_data.MILESTONES,'proj_milestn_opts_dialog');
            add_opts_2_pulldown(frm_data.MILESTONE_STATUSES,'proj_milestn_stat_opts_dialog');
            if (cb != ''||cb != null){
                cb();
            }
        })
    } catch (error) {console.log(error);}

}

function load_event_dialog_pg(){//(data){
    hide_all_forms(function(){
    //bk_proj_data=data;
    load_mlstn_data('');
    //try {
    //    //var prnt_wndw = this.window;
    //    //var prnt_wndw_2 = parent.window;
    //    parent.window.GET_MILESTONE_DATA(function(frm_data){
    //        form_data = frm_data;
    //        add_opts_2_pulldown(frm_data.MILESTONES,'proj_milestn_opts_dialog');
    //        add_opts_2_pulldown(frm_data.MILESTONE_STATUSES,'proj_milestn_stat_opts_dialog');
    //    })
    //} catch (error) {console.log(error);}

    try {
        event_data = new bk_proj_data();
        event_data = window.parent.data_str.copy();
        document.getElementById("evnt_nme").innerHTML=event_data.get(0).toString().split("-")[0].replace(" ","");
        document.getElementById("d_date").innerHTML=event_data.get(0).toString().split("-")[1].replace(" ","");
        document.getElementById("e_stat").innerHTML=event_data.get(1).toString().replace(" ","");
        window.parent.data_str=undefined;
    } catch (error) {console.log(error);}
    
    turn_on_frm("evnt_info");
})
}

function milestn_cmpltd(){
    //alert("trying to update milestone status in the db");
    if (isObjPropEmpty(obj_3)){
        obj_3.project_data = event_data;
        //post_data_2 = {
        //    evnt_data
       //}
        if (isObjPropEmpty(obj_3.UPLOADING)){
            obj_3.UPLOADING="MILESTONE_COMPLETED"

    }
}
console.log(JSON.stringify(obj_3));
wait_screen(obj_3);
}

function turn_on_frm(frm_nme){
    hide_all_forms();
    crnt_frm = frm_nme;
    document.getElementById(frm_nme).style.display = 'block';
}

function hide_all_forms(cb){
    for(var i=0; i<frms.length; i++){
        document.getElementById(frms[i]).style.display = 'none';
    }
    if (!isObjPropEmpty(cb)) {
        cb();
    }
}

function isObjPropEmpty(data){
    if(typeof(data) === 'object'){
        if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
            return true;
        }else if(!data){
            return true;
        }
        return false;
    }else if(typeof(data) === 'string'){
        if(!data.trim()){
            return true;
        }
        return false;
    }else if(typeof(data) === 'undefined'){
        return true;
    }else{
        return false;
    }
}

function add_opts_2_pulldown(ar,NameOfPullDwon2Pop){
    var select = document.getElementsByName(NameOfPullDwon2Pop)[0];
    //select = select[0];
    //var select_2 = document.getElementsByName(NameOfPullDwon2Pop);
    if (select.length > 1){
      Clear_Pull_Down(NameOfPullDwon2Pop);
    }
    try {
        for(var i=0; i<ar.length; i++)
        {
            var option_1 = document.createElement("option");
            //option_1.id = NameOfPullDwon2Pop+'_'+i;
            option_1.value = ar[i];
            option_1.text = ar[i];
            select.add(option_1);
        }
    } catch (err) {
        console.log(err);
    }
}

function Clear_Pull_Down(name){
    var select = document.getElementsByName(name)[0];
    select.options.length=0;
    var option_1 = document.createElement("option");
    option_1.text = "-- SELECT --";
    select.add(option_1);
}

function turn_on_main_form(){
    turn_on_frm('evnt_info');
}

function add_proj_milestn_2_proj_dialog_frm_data(){
    if (chk_usr_inpt(['proj_milestn_opts_dialog','proj_milestn_stat_opts_dialog','proj_milestn_dialog_due_date'])){
        rtn_val = true;
        color_valid_field(['proj_milestn_opts_dialog','proj_milestn_stat_opts_dialog','proj_milestn_dialog_due_date']);

        var post_data = new Object()
        var post_data_2 = new Object()
        post_data_2 = {
            'milestn_nme':get_selctd_opt('proj_milestn_opts_dialog'),
            'milestn_stat': get_selctd_opt('proj_milestn_stat_opts_dialog'),
            'milestn_due_date': document.getElementsByName('proj_milestn_dialog_due_date')[0].value
        }

        //update_main_form_with_sub_form_data(document.getElementsByName('proj_milestn_dialog_due_date')[0].value,
        //                                 [],['proj_mlestn_due_date']);

        if (isObjPropEmpty(obj_2.project_data)){
            post_data = {
                    'milestns_2_add_2_proj': [post_data_2]
                }
                obj_2.project_data = post_data;
        } else {
            if (isObjPropEmpty(obj_2.project_data.milestns_2_add_2_proj)){
                obj_2.project_data.milestns_2_add_2_proj = [post_data_2];
            } else {
            var mlestn_ar = obj_2.project_data.milestns_2_add_2_proj
            mlestn_ar.push(post_data_2);
            obj_2.project_data.milestns_2_add_2_proj = mlestn_ar;
            }
        }

        if (isObjPropEmpty(obj_2.UPLOADING)){
            obj_2.project_data.proj_data = event_data.proj_data;
            obj_2.project_data.evnt_data = event_data.evnt_data;
            obj_2.UPLOADING="ADD_MILESTONE"
        }

        turn_on_main_form();
        console.log(JSON.stringify(obj_2));
        clear_form();
        wait_screen(obj_2);

    } else{
        color_invalid_field(['proj_milestn_opts_dialog','proj_milestn_stat_opts_dialog','proj_milestn_dialog_due_date']);
    }


}

function save_changes(){
    //alert("running to db with all modified changes");
    if (isObjPropEmpty(obj_3)){
        obj_3.project_data = event_data;

        if (isObjPropEmpty(obj_3.UPLOADING)){
            obj_3.UPLOADING="UPDATE_MILESTONE"

    }
}
console.log(JSON.stringify(obj_3));
wait_screen(obj_3);
}


function event_due_date_changed(id){
    event_data.evnt_data[0]=event_data.evnt_data[0].split("-")[0].toString().trimEnd().trimStart()+"~"+document.getElementById(id).value;
    //var new_due_date = document.getElementById(id).value;
    //var old_due_date = event_data.get(0).toString().split("-")[1].replace(" ","")
    //alert("the due date changed from "+old_due_date.toString()+" to "+new_due_date.toString());
}

function date_clicked(){
    if (!document.getElementById('evnt_date')){
        document.getElementById("save_btn").style.display="block";
 
        var inpt = document.createElement("input"); 
        inpt.setAttribute('type','date');
        inpt.setAttribute('class','large');
        inpt.setAttribute('data-format','mm-dd-yyyy');
        inpt.setAttribute('placeholder','mm-dd-yyyy');
        inpt.setAttribute('id','evnt_date');
        inpt.setAttribute('onchange','event_due_date_changed("evnt_date")');

        document.getElementById('d_date').innerHTML="";
        document.getElementById('d_date').appendChild(inpt);

    }
}

function event_status_changed(id){
    event_data.evnt_data[1]=get_selctd_opt(id);
    //var new_status = get_selctd_opt(id);
    //var old_status = event_data.get(1).toString().replace(" ","");
    //alert("the status changed from "+old_status+" to "+new_status);
}

function status_clicked(){

    if (!document.getElementById('evnt_stat_opts_div')){
        document.getElementById("save_btn").style.display="block";
    
    var _span = document.createElement("span"); 
    _span.setAttribute('title','Select the current status of this milestone');
    _span.setAttribute('class','element-select');
    _span.setAttribute('name','evnt_stat_opts_div');
    _span.setAttribute('id','evnt_stat_opts_div');
    
    var _select = document.createElement("select"); 
    _select.setAttribute('name','evnt_stat_opts_slct');
    _select.setAttribute('id','evnt_stat_opts_slct');
    _select.setAttribute('onchange','event_status_changed("evnt_stat_opts_slct")');

    var _option = document.createElement("option"); 
    _option.innerHTML="-- SELECT --";

    _select.appendChild(_option);
    _span.appendChild(_select);

    document.getElementById('e_stat').innerHTML="";
    document.getElementById('e_stat').appendChild(_span);

    add_opts_2_pulldown(form_data.MILESTONE_STATUSES,'evnt_stat_opts_slct');
        

    }


  








}


function wait_screen(obj){
    turn_on_main_form();
    document.getElementById('mlestn_dialog_btns').style.display = 'none';
    document.getElementById('evnt_info_cntnr').style.display = 'none';
    document.getElementById('save_btn').style.display = 'none';
    document.getElementById("evnt_nme").innerHTML="Please wait while the dashboard is being updated";
    parent.window.POST_PROJECT_DATA(obj,function(srvr_resp){
        try {
            if (srvr_resp.match(/_/g).match(/./g)){
                // 1.) close dialog box
                // 2.) send pg_2_ld to parent
            } else {
                parent.window.refresh_timeline(srvr_resp);

                //document.getElementById("evnt_nme").innerHTML="The server responded with: \n\""+srvr_resp+"\"";
            }    
        } catch (error) {
            var strg_ar = srvr_resp.replace('[','').replace(']','').split(',');
            parent.window.refresh_timeline(strg_ar);
            console.log("srvr_resp =\n");
            console.log(srvr_resp);
            console.log("strg_ar =\n");
            console.log(strg_ar);
            //document.getElementById("evnt_nme").innerHTML="The server responded with: \n\""+srvr_resp+"\"";
        }
        

    })

}





function new_proj_milestn_dialog_frm_data(){
    var rtn_val = false;
    if (chk_usr_inpt(['new_milestn_nme_dialog'])){
        rtn_val = true;
        color_valid_field(['new_milestn_nme_dialog']);

        var post_data = new Object()
        var sub_from_data_val = document.getElementsByName('new_milestn_nme_dialog')[0].value.toString().toUpperCase();

        if (isObjPropEmpty(obj_2.project_data)){
            post_data = {
                //'A_new_milestn': [{
                'A_new_milestn_nme':[{
                    'new_milestn_nme':sub_from_data_val
                    }]
                }
                //------NEW OBJECT ARRAY ADDED 3/20/2020 IN THE WHILE MODIFING DB CODE, VERIFY "post_data" IF FORMATTED LIKE vvv
                //"A_new_milestn":[{
                //    "new_milestn_nme":"TEST MILESTONE 1"
                //    }]

                obj_2.project_data = post_data;
        } else {
            if (isObjPropEmpty(obj_2.project_data.A_new_milestn_nme)){
                obj_2.project_data.A_new_milestn_nme = [{'new_milestn_nme':sub_from_data_val}];
            } else{
            var mlestn_ar = obj_2.project_data.A_new_milestn_nme
            mlestn_ar.push({'new_milestn_nme':sub_from_data_val});
            obj_2.project_data.A_new_milestn_nme = mlestn_ar;
            }
        }
        
        update_main_form_with_sub_form_data(sub_from_data_val, form_data.MILESTONES,['proj_milestn_opts_dialog']);

    } else{
        color_invalid_field(['new_milestn_nme_dialog']);
    }
    return rtn_val;
}

function chk_usr_inpt(reqird_inpts){
    var rtn_val = true;
    for(var i=0; i<reqird_inpts.length; i++){
        var strg = document.getElementsByName(reqird_inpts[i])[0].value.toString().replace(' ','');
        if (strg == ""){
            rtn_val = false;
        } else if (strg == "--SELECT --"){
            rtn_val = false;
        }
    }
    return rtn_val
}

function color_valid_field(reqird_inpts){
    for(var i=0; i<reqird_inpts.length; i++){
        if (document.getElementsByName(reqird_inpts[i])[0].tagName == 'INPUT'){
            document.getElementsByName(reqird_inpts[i])[0].style.backgroundColor = 'rgb(' + [255,255,255].join(',') + ')'; //rgb(255, 255, 255);//#fff
        } else if (document.getElementsByName(reqird_inpts[i])[0].tagName == 'SELECT') {
            var btn_elm_2_updt = get_form_pull_down_element(reqird_inpts[i]).nextElementSibling;
            btn_elm_2_updt.childNodes[1].style.backgroundColor = 'rgb(' + [255,255,255].join(',') + ')';//'rgb(255,255,255)';//rgb(255, 255, 255);//#fff
        }
    }
}

function color_invalid_field(reqird_inpts){
    for(var i=0; i<reqird_inpts.length; i++){
        if (chk_usr_inpt([reqird_inpts[i]])){
            color_valid_field([reqird_inpts[i]]);
        } else {
            if (document.getElementsByName(reqird_inpts[i])[0].tagName == 'INPUT'){
                document.getElementsByName(reqird_inpts[i])[0].style.backgroundColor = "pink";
                //document.getElementsByName(reqird_inpts[i])[0].focus();
            } else if (document.getElementsByName(reqird_inpts[i])[0].tagName == 'SELECT') {
                var btn_elm_2_updt = get_form_pull_down_element(reqird_inpts[i]).nextElementSibling;
                btn_elm_2_updt.childNodes[1].style.backgroundColor = "pink";
                //btn_elm_2_updt.childNodes[1].focus();
            }
        }
    }
}

function check_usr_slctn(nme_of_elm_that_chgd,cb){
    var usr_slctn = get_selctd_opt(nme_of_elm_that_chgd).toString().toUpperCase();
    if (usr_slctn.match(/ADD NEW/g)){
        hide_all_forms();
        usr_slctn = usr_slctn.replace('ADD NEW ','');
        switch(usr_slctn){
            case (usr_slctn.match(/^MILESTONE/) || {}).input:
                crnt_frm = 'new_proj_milestn_dialog_frm';
                document.getElementById('new_proj_milestn_dialog_frm').style.display = 'block';
                break;
//            case (usr_slctn.match(/^MLESTN/) || {}).input:
//                crnt_frm = 'add_proj_milestn_2_proj_frm';
//                document.getElementById('add_proj_milestn_2_proj_frm').style.display = 'block';
//                break;
        }
    }
    if (!isObjPropEmpty(cb)) {
        cb(nme_of_elm_that_chgd);
    }
}

function get_selctd_opt(name) {
    var des_sel = document.getElementsByName(name)[0];
    return des_sel.options[des_sel.selectedIndex].text;
}

function update_main_form_with_sub_form_data(sub_from_data_val, ar, prnt_opts_name){
    var chk = false;
    if (!isObjPropEmpty(ar)){
        var b = ar[ar.length -1];
        ar[ar.length - 1] = sub_from_data_val;
        ar.push(b);
        chk = true;
    }

    for(var i=0; i<prnt_opts_name.length; i++){
        if (chk){
            add_opts_2_pulldown(ar,prnt_opts_name[i]);
        }
        try {
            pre_populate_field(prnt_opts_name[i],sub_from_data_val);
            color_valid_field([prnt_opts_name[i]]);
        } catch (error) {
            try {
                var prnt = document.getElementsByName(prnt_opts_name); 
                prnt.value = sub_from_data_val;//<<---- this is not working as of 3/20/2020
            } catch (error) {
                console.log(error);
            }
        }

    }
    turn_on_main_form();

}

function pre_populate_field(id,val){
    var a = []
    //a = document.getElementsByName(id)[0];
    var idx_num = find_opt(id,val);
    if (idx_num != -1 ){
        var prnt = document.getElementsByName(id)[0];

        try {
            prnt.value = val;
        } catch (error) {
            prnt.value = val.toString().toUpperCase();
        }
        prnt.options[idx_num].selected = true;
        prnt.options[idx_num].className = "selected";
        prnt.selectedIndex = idx_num;
        update_btn_slectn(id);
    }

}

function update_btn_slectn(id){
    var val = document.getElementsByName(id)[0].value;
    var idx_num = find_opt(id,val);
    var btn_elm_2_updt = get_form_pull_down_element(id).nextElementSibling;
    var elm_fld_2_updt = btn_elm_2_updt.childNodes[1].childNodes[0];
    deselect_all_btn_options(btn_elm_2_updt);
    btn_elm_2_updt.childNodes[2].children[idx_num].className = "selected";
    elm_fld_2_updt.textContent = val;
}

function deselect_all_btn_options(pull_down_btn_prnt){
   var prnt = pull_down_btn_prnt.childNodes[2];
   for(var i=0; i<prnt.children.length; i++){
       prnt.children[i].className = '';
    }
}

function find_opt(id,val_2_lk_4){
    var select = document.getElementsByName(id)[0];
    var cntr = -1;
    try {
        for(var i=0; i<select.options.length; i++){
            if (select.options[i].text.toString().toUpperCase().trim() == val_2_lk_4.toString().toUpperCase().trim()){
                cntr = i;
            }
        }
    } catch (err) {
        console.log(err);
    }
    return cntr;
}

function get_form_pull_down_element(id){
    ////var elms = document.querySelectorAll("[id="+id+"]");
    var elms = document.querySelectorAll("[name="+id+"]")[0];
    //return elms[elms.length - 1];
    return document.querySelectorAll("[name="+id+"]")[0];
}

function clear_form(){
    //['new_proj_milestn_dialog_frm','add_proj_milestn_2_proj_dialog_frm']
    add_opts_2_pulldown(form_data.MILESTONES,'proj_milestn_opts_dialog');
    add_opts_2_pulldown(form_data.MILESTONE_STATUSES,'proj_milestn_stat_opts_dialog');
    document.getElementsByName("new_milestn_nme_dialog")[0].value='';
    document.getElementsByName("proj_milestn_dialog_due_date")[0].value='';
}

class bk_proj_data {
    proj_data=[];
    evnt_data=[];
    constructor(){};
    length_proj_data(){return this.proj_data.length;}
    length(){return this.evnt_data.length;}
    add_proj_data(obj){this.proj_data.push(obj);}
    add(obj){this.evnt_data.push(obj);}
    get_proj_data(i){ return this.proj_data[i];}
    get(i){return this.evnt_data[i];}
    toString(){return this.proj_data.toString()+','+this.evnt_data.toString();}
    remove(i){this.evnt_data.splice(i,1);}
    remove_all(){ this.evnt_data.splice(0,this.evnt_data.length);}
    copy(){var bk_cpy= new bk_proj_data();
        for (let i = 0; i < this.length_proj_data(); i++) {
            bk_cpy.add_proj_data(this.get_proj_data(i));
        }
        for (let i = 0; i < this.length(); i++) {
            bk_cpy.add(this.get(i));
        }       
        return bk_cpy;}
 };
