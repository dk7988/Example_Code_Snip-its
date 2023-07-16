const ewelink = require('ewelink-api');    
var db = require('./db');
//const notifr = require('./emailer.js');
const { time } = require('console');

//const tell_nick = new notifr();
//tell_nick.test_notif();

class bot_sitr{
    //ewelink_plugs = new Object();
plug_waiting=[];
plugs_with_water_cooled_miners=["special_plug_name_1","special_plug_name_2"];
plug_ids_wtr_miners=[];
plug_ids=['plug_id_1','plug_id_2','plug_id_3','plug_id_4'];
thirdConnection;
ewelink_con;
_email;
_pswrd;

constructor(email, pswrd){
    this._email=email;
    this._pswrd=pswrd;
}

async watch_plugs(){
    try{
	    /* first request: get access token and api key */
		this.ewelink_con = new ewelink({
			email: this._email,
			password: this._pswrd
		});
  
		const credentials = await this.ewelink_con.getCredentials();
  
		const accessToken = credentials.at;
		const apiKey = credentials.user.apikey;
		const region = credentials.region;
  
		this.thirdConnection = new ewelink({
		  at: accessToken,
		  region: region
		});



		this.get_plug_data();

		setInterval(async function(me){
			var plg_info = await me.get_plug_data();
			for (let i = 0; i < plg_info.length; i++) {
				if (!me.plug_waiting.includes(plg_info[i].plug_id))
				me.procs_plug_data(plg_info[i]);
			}
			console.log("plugs being closely monitored:")
			for (let i = 0; i < me.plug_waiting.length; i++) {
				console.log(me.plug_waiting[i]);
			}
			console.log("\n");
		}, 15000,this);

	} catch (error) {
		console.log("this error was caught: \n" + error);
		const strt_up_int = setInterval(function(me){
			console.log("trying to connect to ewelink service again")
			clearInterval(strt_up_int)
			me.watch_plugs()
		}, 10000,this);
	}
	//try {
	//	clearInterval(strt_up_in);	
	//} catch (error) {}

};

get_plug_data = async function() {
	var rtn_ar =[];
	var tot_pwr = 0;
	for (let i = 0; i < this.plug_ids.length; i++) {
		console.log("getting plug data for plug_id: "+this.plug_ids[i]);
		var plug_data = await this.get_plug_specific_data(this.plug_ids[i]);
		await db.post_plug_data(plug_data.plug_id,plug_data.online.toString(),plug_data.power_consumption,null);
		rtn_ar.push(plug_data);
		tot_pwr= tot_pwr+parseFloat(plug_data.power_consumption);
		if (this.plugs_with_water_cooled_miners.includes(plug_data.plug_name)) this.plug_ids_wtr_miners.push(plug_data.plug_id);
	}
	rtn_ar.push({});
	rtn_ar.push({plug_id:'Total Power Draw', power_consumption: parseFloat(tot_pwr.toFixed(3))});
	console.table(rtn_ar);
	this.print_datetime();
	return rtn_ar
}



async get_plug_specific_data(dvc_id) {
	var stay_in_loop = true;
	while (stay_in_loop) {
		try {
			var device = await this.thirdConnection.getDevice(dvc_id);
			var plg_has_pwr = false;
			if (device.params.sledOnline=="on") plg_has_pwr = true;
			var rtn_ar = {plug_id:device.deviceid,
						  power_consumption: device.params.power,
						  plug_name: device.name,
						  online: device.online,
						  status:device.params.switch,
						  plug_has_power: plg_has_pwr};
			stay_in_loop = false;
			return rtn_ar
	} catch (error) {
		stay_in_loop = true
	}
}
}



procs_plug_data(plug_info){
	console.log("in procs_plug_data and was passed name: "+plug_info.plug_name);
	try {
		switch (plug_info.plug_name) {
// 			case "WaterpumpPlug":
// //				if (!plug_info.online||!plug_info.plug_has_power||plug_info.status=="off"||plug_info.power_consumption=="0.00"){
// 				if(!this.power_consumption_good(plug_info)){
// //					tell_nick._send_notif("WATER PUMP IS OFF FOR SOME REASON.. I'M TURNING OFF ALL THE DEPENDING COMPUTERS", "WATER PUMP OFF");
// 					for (let i = 0; i < this.plug_ids_wtr_miners.length; i++) {
// 						this.plug_waiting.push(plug_info.plug_id);
// 						for (let ix = 0; i < this.plug_ids_wtr_miners.length; ix++) {
// 							console.log("water pump data is saying it is off so i'm turning off plug_id:"+this.plug_ids_wtr_miners[ix]);
// 	                        //this.toggle_off_plug(plug_ids_wtr_miners[i]);
// 							if (ix>=plug_ids.length) ix= this.plug_ids_wtr_miners.length+1;
// 						}
// 						if (i>=plug_ids.length) i= this.plug_ids_wtr_miners.length+1;
// 					}
// 				}

// 				break;
			case "LoudmouthPlug":
				if(!this.power_consumption_good(plug_info)){
//					tell_nick._send_notif("i see Loudmouth is off.. if you forget to turn it back on i'll turn it back on in 3hrs from now","Loudmouth is off");
					this.set_timer_and_toggle_plug(plug_info.plug_id,10800000); // setting timer to tick in 3hrs
				}
				break;

				case "EPlug":
					if (!this.power_consumption_good(plug_info)){
						var miner = plug_info.plug_name;
	//					tell_nick._send_notif(miner+" is on the shit list",miner+" is being odd");
						this.set_timer_and_toggle_plug(plug_info.plug_id,60000*3); // setting timer to tick in 1 min
							//this.set_timer_and_toggle_plug(plug_info.plug_id,12000); // setting timer to tick in 12 sec.s
							//set_timer_and_toggle_plug(plug_info.plug_id,300000); // setting timer to tick in 5 min
					}
				break;

			default:
				if (!this.power_consumption_good(plug_info)){
					var miner = plug_info.plug_name;
//					tell_nick._send_notif(miner+" is on the shit list",miner+" is being odd");
	            	this.set_timer_and_toggle_plug(plug_info.plug_id,60000*6); // setting timer to tick in 1*4 min.s
						//this.set_timer_and_toggle_plug(plug_info.plug_id,12000); // setting timer to tick in 12 sec.s
						//set_timer_and_toggle_plug(plug_info.plug_id,300000); // setting timer to tick in 5 min
				}

				break;
		}
	} catch (error) {
		console.log("while executing procs_plug_data the following error was caught: \n"+error);
	}


}



power_consumption_good(plug_info){
	switch (plug_info.plug_name) {
		// case "WaterpumpPlug":
		// 	if (!plug_info.online) return false;
		// 	else if (!plug_info.plug_has_power) return false;
		// 	else if (plug_info.status=="off") return false;
		// 	else if (plug_info.power_consumption=="0.00") return false;
		// 	else return true;
		// 	break;

		case "LoudmouthPlug":
			//if (800.00>parseFloat(plug_info.power_consumption)) return false;
//			if (250.00>parseFloat(plug_info.power_consumption)) return false
//			else if (plug_info.power_consumption=="0.00") return false;
//			else if (plug_info.status=="off") return true;
//			else 
return true;
			break;

			case "Waterpump_n_fans":
				//if (800.00>parseFloat(plug_info.power_consumption)) return false;
	//			if (250.00>parseFloat(plug_info.power_consumption)) return false
	//			else if (plug_info.power_consumption=="0.00") return false;
	//			else if (plug_info.status=="off") return true;
	//			else 
	return true;
				break;


			


		case "ACPlug1":
			//if (plug_info.online&&700.00>parseFloat(plug_info.power_consumption))return false;
			//if (25.00>parseFloat(plug_info.power_consumption))return false;
			//else 
			return true;
			break;
		
		case "ACPlug2":
			//if (plug_info.online&&700.00>parseFloat(plug_info.power_consumption))return false;
			//if (25.00>parseFloat(plug_info.power_consumption))return false;
			//else 
			return true;
			break;


		// case "Spare_Plug1":
		// 	//if (plug_info.online&&700.00>parseFloat(plug_info.power_consumption))return false;
		// 	//if (25.00>parseFloat(plug_info.power_consumption))return false;
		// 	//else 
		// 	return true;
		// 	break;	 
		


	 case "EPlug":
		if (!plug_info.online) return true;
		else if (!plug_info.plug_has_power) return true;
		else if (650.0>parseFloat(plug_info.power_consumption))return false;
	 	else return true;
 	break;

	 case "TPlug":
		if (!plug_info.online) return true;
		else if (!plug_info.plug_has_power) return true;
		else if (625.0>parseFloat(plug_info.power_consumption))return false;
		 else return true;
		//return true
	 	break;
		 
	 case "LPlug":
		//if (1250.0>parseFloat(plug_info.power_consumption))return false;
	   if (!plug_info.online) return true;
		else if (!plug_info.plug_has_power) return true;
		else if (450.0>parseFloat(plug_info.power_consumption))return false;
		else return true;
	  return true
	break;

	case "APlug":
		if (!plug_info.online) return true;
		else if (!plug_info.plug_has_power) return true;
		else if (200.0>parseFloat(plug_info.power_consumption))return false;
		else return true;
		//	return true
		 break;

				 


	 case "TPlug2":
	// // //	if (610.0>parseFloat(plug_info.power_consumption))return false;
	// // //	else return true;
	   return true
	 break;
   
	case "EPlug2":
	// // //	if (610.0>parseFloat(plug_info.power_consumption))return false;
	// // //	else return true;
	  return true
	 break;
	   
	 case "APlug2":
		// 	//if (plug_info.online&&700.00>parseFloat(plug_info.power_consumption))return false;
		// 	//if (25.00>parseFloat(plug_info.power_consumption))return false;
		// 	//else 
		 return true;
	 break;
	
	
				
	 case "APlug3":
	// 	//if (plug_info.online&&700.00>parseFloat(plug_info.power_consumption))return false;
	// 	//if (25.00>parseFloat(plug_info.power_consumption))return false;
	// 	//else 
		 return true;
	 break;


 	case "LPlug2":
 		// if (400.0>parseFloat(plug_info.power_consumption))return false;
 		// else return true;
	 	return true
	break;

	case "LPlug3":
	// if (400.0>parseFloat(plug_info.power_consumption))return false;
	// else return true;
		return true
	break;

	case "LPlug4":
	// if (400.0>parseFloat(plug_info.power_consumption))return false;
	  // else return true;
		return true
	break;
			
		default:
		//if(plug_info.plug_name == "LPlug"||plug_info.plug_name == "TPlug"||plug_info.plug_name == "APlug"||plug_info.plug_name == "EPlug"){
				if (plug_info.status=="off") return true;
				else if (!plug_info.online) return true;
				else if (!plug_info.plug_has_power) return true;
				else if (615.0>parseFloat(plug_info.power_consumption))return false;
				else return true;
			//} else return true;
			break;
	}
}



set_timer_and_toggle_plug(plug_id,timer_dur){
	console.log("watching plug_id: "+plug_id)
	this.plug_waiting.push(plug_id)
	var myint = setInterval(async function(dvc_id,me){
		console.log("timer ticked");
		var plug_data = await me.get_plug_specific_data(dvc_id);
		var miner = plug_data.plug_name;
		
		// console.log("plug_data: ");
		// console.log(plug_data);

		if (!me.power_consumption_good(plug_data)){
//			tell_nick._send_notif("I'm seeing weird power consumption numbers with "+miner+" so i'm turning it off for a couple minutes then i'll try to turn it back on.","turning off "+miner);
			await me.toggle_off_plug(plug_data.plug_id);
			var myint_2 = setInterval(async function(dvc_id,me){
				var miner = plug_data.plug_name;
//				tell_nick._send_notif("Turning "+miner+" back on","turning "+miner+" on");
				console.log("timer_2 ticked");
				await me.toggle_on_plug(dvc_id);
				clearInterval(myint_2);
				clearInterval(myint);
			} , timer_dur*1.5, plug_data.plug_id,me);
		}else{
//			tell_nick._send_notif(miner+" has figured her shit out", miner+" is off the shit list");
			me.plug_waiting=me.remove_from_ar(dvc_id,me.plug_waiting);
			clearInterval(myint);
		}
//	clearInterval(myint);
	} , timer_dur*1.5, plug_id,this);
}



remove_from_ar(val,ar){
	var rtn_ar=[];
	try {
		for (let i = 0; i < ar.length; i++) {
			if (ar[i]!=val){
				rtn_ar.push(ar[i]);
			} 
			ar=[];
			if (rtn_ar!=undefined) ar=rtn_ar;
			//console.log(ar);
		}
		return rtn_ar	
	} catch (error) {
		console.log(error);
		return []
	}
	
}



async toggle_off_plug(dvc_id){
	if (!this.plug_waiting.includes(dvc_id)) this.plug_waiting.push(dvc_id);
	var device = await this.get_plug_specific_data(dvc_id);
	console.log("turning off plug: "+device.plug_name+"/"+device.plug_id)
	if ((device.status=='on'||parseFloat(device.power_consumption)>0.0)&&device.plug_has_power)
		await this.ewelink_con.toggleDevice(dvc_id);

		
}



async toggle_on_plug(dvc_id){
	var device = await this.get_plug_specific_data(dvc_id);
	console.log("turning on plug: "+device.plug_name+"/"+device.plug_id)
	if (this.plug_waiting.includes(dvc_id)) this.plug_waiting=this.remove_from_ar(dvc_id,this.plug_waiting);
	if (device.status=='off'&&device.plug_has_power)
		await this.ewelink_con.toggleDevice(dvc_id);


}



async toggle_plug(dvc_id){
	await this.ewelink_con.toggleDevice(dvc_id);
}



print_datetime(){
	let date_time = new Date();

// get current date
// adjust 0 before single digit date
let date = ("0" + date_time.getDate()).slice(-2);

// get current month
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

// get current year
let year = date_time.getFullYear();

// get current hours
let hours = date_time.getHours();

// get current minutes
let minutes = date_time.getMinutes();

// get current seconds
let seconds = date_time.getSeconds();

// prints date in YYYY-MM-DD format
//console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log( month + "/" + date + "/" + year + "  " + hours + ":" + minutes + ":" + seconds);
}




};



module.exports = bot_sitr;