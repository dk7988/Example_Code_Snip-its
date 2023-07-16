const puppeteer = require('puppeteer');
const { start } = require('repl');
const config = require('./config_amz.json');

var err_cntr = 0;
const login_url = "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
const usr_sgn_strg = "signin";
const lgn_btn = 'input.a-button-input'
const usr_lgn_txtbx_id = '#ap_email';
const psw_lgn_txtbx_id = '#ap_password';

const add_2_crt_btn_id = '#add-to-cart-button';
const proc_2_crt_btn_id = '#hlb-ptc-btn-native';

const buy_now_btn_id = '#buy-now-button';
//							
const pymt_btn_cls = 'span.os-primary-action-button-text.buy-button-line-height';



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function report(log) {
	currentTime = new Date();
	console.log(currentTime.toString().split('G')[0] + ': ' + log)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



async function run_login(page) {
	const amz_nav_logo_id = 'nav-logo-sprites'
	var logged_in = false;
    while (!logged_in) {
		await page.waitForTimeout(2000)
		await report("going to amazon login page")
		await page.goto(login_url, {waitUntil: 'load' })
		if (page.url().includes(usr_sgn_strg)) {
			await page.waitForSelector(usr_lgn_txtbx_id)
			await page.type(usr_lgn_txtbx_id, config.email)
			await page.waitForTimeout(1500)
			await page.waitForSelector(lgn_btn , {waitUntil: 'load'})
			await page.click(lgn_btn , {timeout: 500})
			await page.waitForTimeout(1500)
			logged_in =await enter_psw(page);
			if (logged_in || logged_in == undefined) break;
			await report("logged_in : "+logged_in);
			await page.waitForTimeout(5000)
		}else if (page.url().includes("areyouahuman")) {
			await page.waitForTimeout(1000)
		}
	}
	if (logged_in) {
		await report("Logged in");
		return true;
	} else return false;
	

}


async function enter_psw(page){
	const amz_nav_logo_id = 'nav-logo-sprites'
	const logo_cl ='a.nav-logo-link.nav-progressive-attribute'
	try {
		await page.waitForSelector(psw_lgn_txtbx_id , {waitUntil: 'load'})
		await page.type(psw_lgn_txtbx_id, config.password)
		await page.waitForTimeout(1000)
		await page.click(lgn_btn)
		await page.waitForTimeout(750)
		try {
			await page.waitForSelector(amz_nav_logo_id, {timeout: 750})
			//report("here 1")
			return true;
		} 
		catch (err) {
			if (page.url().includes("approval")){
				var cntr = 0
				//report("here 2")
				while (page.url().includes("approval")){
					try {
						cntr = cntr+1;
						//report("here 3")
						if (!page.url().includes("approval")){
							//report("here 4")
							return true;
						}
						report("here 5")
						if (cntr >= 10){
							report("Manual authorization required by Amazon.")
							return undefined;
						}
						await page.waitForSelector(amz_nav_logo_id);
					} catch (error) {
						//report("here 6")
						await page.waitForTimeout(2500);
					}
				}
			}
		}
		try {
			//await page.waitForSelector(amz_nav_logo_id);
			if (page.url().includes("nav_ya_signin")){
				//report("here 7")
				return true;
			}
			else if (page.url().includes("nav-ya-signin")){
				//report("here 8")
				return true;
			}else if (page.url().includes("nav_logo")){
				//report("here 9")
				await page.waitForSelector(amz_nav_logo_id);
				//report("here 9.1")
				return true;
			}else return false;
		} catch (error) {
			try {
				await page.waitForSelector(logo_cl, {timeout: 1500})	
			} catch (error) {
				await report("i think i can't find the -AMAZON LOGO-... but who knows what my problem is.. have fun.. ERROR "+error.toString());	
			}
		}
	} catch (err) {
		await report("no idea whats going on... have fun.. ERROR "+error.toString());
	}
}

async function chk_prod(page,prod_url,price_limit) {
	while (true) {
		var fnd_by_btn,fnd_ad2crt_btn,fnd_optns_btn=false;
		await page.goto(prod_url, { waitUntil: 'load', timeout: 9999990})
		try {
			await page.waitForSelector(buy_now_btn_id , {timeout: 5000})
			fnd_by_btn = true
			return await pick_buying_path(page,price_limit,fnd_by_btn,fnd_ad2crt_btn,fnd_optns_btn)
		} catch (error) {}

		try {
			await page.waitForSelector(add_2_crt_btn_id  , {timeout: 5000})
			fnd_ad2crt_btn = true
			return await pick_buying_path(page,price_limit,fnd_by_btn,fnd_ad2crt_btn,fnd_optns_btn)
		} catch (error) {}


		try {
			await page.waitForSelector('#buybox-see-all-buying-choices' , {timeout: 5000})
			fnd_optns_btn = true
			return await pick_buying_path(page,price_limit,fnd_by_btn,fnd_ad2crt_btn,fnd_optns_btn)
		} catch (error) {}

		await page.waitForTimeout(config.refresh_time)
	}
    await report("Item found")
}

async function pick_buying_path(page,price_limit,fnd_by_btn,fnd_ad2crt_btn,fnd_optns_btn){
	if (fnd_by_btn&&!fnd_ad2crt_btn&&!fnd_optns_btn){
		await report("found -buy now- button");
		if (await chk_price(page,price_limit)) return await buy_now(page);
	}
	else if (fnd_ad2crt_btn&&!fnd_by_btn&&!fnd_optns_btn){
		await report("found -add to cart- button");
		if (await chk_price(page,price_limit)) return await add_2_crt(page);
	}
	else if (fnd_optns_btn&&!fnd_by_btn&&!fnd_ad2crt_btn){
		await report("found -buying options- button");
		if (await get_from_dom_elem(page,'#buybox-see-all-buying-choices') != undefined){
			var rtn = await chk_price(page,price_limit);
			if(rtn[0]){
				return await buying_opts(page,rtn[1]);
			}
		}
	}
}

function find_id_in_elm(prnt,id){
	for (let i = 0; i < prnt.length; i++) {
		var kid = lst.childern[i];
		if (kid.id==id) return kid;
	}
}

async function chk_price(page,price_limit){
	//'price_inside_buybox'
	await report("checking price");
	var byblkval =undefined;
	var prcblkval =undefined;

try {
	await page.waitForSelector('#price_inside_buybox' , {timeout: 9999990})
	//await report("checking price assuming -price_inside_buybox-");
	await report("buying price_limit: $"+price_limit);
	byblkval = await clean_decimal_string(await get_from_dom_elem(page,'#price_inside_buybox'));
	await report("sale price: $"+ byblkval);
} catch (error) {
	await report("-price_inside_buybox-ERROR:\n"+error);
	try {
		await page.waitForSelector('#priceblock_ourprice' , {timeout: 9999990})
		//await report("checking price assuming -priceblock_ourprice-");
		await report("buying price_limit: $"+price_limit);
		prcblkval = await clean_decimal_string(await get_from_dom_elem(page,'#priceblock_ourprice'));
		await report("sale price: $"+prcblkval);
	} catch (error) {await report("-priceblock_ourprice-ERROR:\n"+error);}
}




	if (byblkval != undefined && byblkval != null && price_limit >= parseFloat(byblkval)) return true;

	else if(prcblkval != undefined && prcblkval != null && price_limit >= parseFloat(prcblkval)) return true;

	else if( await page.$('#buybox-see-all-buying-choices') != null){
		// opens offscreen slider
		//page.$(document).getElementByid('buybox-see-all-buying-choices').childern[0].click
		await page.click('#buybox-see-all-buying-choices > span' , {timeout: 9999990})
		// go thur all kids in 'aod-offer-list'
		var lst = page.$(document).getElementByid('aod-offer-list')
		for (let i = 0; i < lst.childern.length; i++) {
			var kid = lst.childern[i];
			if (kid.id=="aod-offer"){
				try {
					var elm = find_id_in_elm(kid,'aod-offer-price');
					if (price_limit >= parseFloat(elm.childern[0].childern[0].childern[0].childern[0].childern[0].childern[0].innerHTML)){
						var elm2=elm.childern[0].childern[0].childern[1].childern[0].childern[0].childern[1]
						var elm3=elm2.childern[elm2.childern.length-1].childern[0];
						return [true, elm3]
					}					
				} catch (error) {
					await report(" :( tried looking up the price and find the -add to cart- for the off screen style of buying opptions but something did go as planned ");
				}

			}
			
		}
		return [false, undefined];
	}
	

//	else if(page.$(document).getElementByid('') != undefined && page.$(document).getElementByid('') != null &&
//	price_limit >= parseFloat(page.$(document).getElementByid('').innerHTML)) return true;
//
//	else if(page.$(document).getElementByid('') != undefined && page.$(document).getElementByid('') != null &&
//	price_limit >= parseFloat(page.$(document).getElementByid('').innerHTML)) return true;

}

async function get_from_dom_elem(page, dom_id) {
	await page.waitForSelector(dom_id, {timeout: 1000})
	let element = await page.$(dom_id);
	try {
		return await page.evaluate(el => el.textContent.toString().replace(/\n/g,''), element);	
	} catch (error) {
		return await page.evaluate(el => el.value.toString().replace(/\n/g,''), element);	
	}
	
}

async function clean_decimal_string(dec_strg) {
	//await report("dec_strg: "+dec_strg);
	var dec_strg_ar = dec_strg.split("");
	var rtn_val ='';
	for (let i = dec_strg_ar.length; i >=0; i--) {
		//await report("dec_strg_ar['"+i.toString()+"'] = "+dec_strg_ar[i]);
		if (!filterInt(dec_strg_ar[i])){
			//await report("filterInt(dec_strg_ar['"+i.toString()+"']) = "+filterInt(dec_strg_ar[i]).toString());
			if (dec_strg_ar[i]!="."){
				//await report("removing '"+dec_strg_ar[i]+"' from "+dec_strg);
				dec_strg_ar.splice(i,1)
			}
		}	
	}
	for (let i = 0; i < dec_strg_ar.length; i++) {
		rtn_val = rtn_val+dec_strg_ar[i];
	}
	//await report("rtn_val: "+rtn_val);
	return rtn_val;
}

function filterInt(value) {
	try {
		if (value.toString()=='0'||value ==0) return true
		else if (/^[-+]?(\d+|Infinity)$/.test(value))
		  return true
		else return false	
	} catch (error) {}
		return false
}

async function buy_now(page) {
	//run_login(page);
	await report("starting -buy now- process");
	await page.click(buy_now_btn_id);
	await report("at product page, found -buy now- button!! i'm clicking to complete order!! **Continued to checkout**");
	await page.waitForTimeout(1000)
	return await chk_out(page);
}

async function add_2_crt(page) {
	//run_login(page);
	await report("starting -add to cart- process");
	const ship_2_adrs_btn_id = '#shipToThisAddressButton-announce';
	await page.click(add_2_crt_btn_id);

	await report("at product page, found -add to cart- button!! i'm clicking to complete order!!");
	try {
		await page.waitForSelector(proc_2_crt_btn_id, {timeout: 9999990})
		await page.click(proc_2_crt_btn_id);
		await page.waitForSelector(ship_2_adrs_btn_id, {timeout: 9999990})
		if (await vrfy_shp_adrs(page)){
			await page.click(ship_2_adrs_btn_id);
			await page.waitForSelector(pymt_btn_cls, {timeout: 9999990})
			return await chk_out(page);
		}
	}catch (err) {}
	return false;
}

async function buying_opts(page,btn_2_clk){
	run_login(page);
	page.click(btn_2_clk);
}

async function chk_out(page){
	const plce_ordr_btn_id = '#submitOrderButtonId';
	const plce_ordr_btn2_id = '#bottomSubmitOrderButtonId';
	const buy_btn_cls = 'span.place-order-button-text.buy-button-line-height'
	await report("at payment verification")
	await page.waitForTimeout(2500)
	try {
		if (await vrfy_paymt_cc(page)){
			try {
				await page.waitForTimeout(1500)
				await page.click(pymt_btn_cls)
				//await page.waitForSelector(buy_btn_cls, {timeout: 7500})
				await page.waitForSelector(plce_ordr_btn_id, {timeout: 9999990})
				await page.waitForTimeout(1000)
				await report("at order review")
				if(config.auto_submit){
					try {
						await page.click(plce_ordr_btn_id);
						//await report("clicked "+plce_ordr_btn_id);
						await report("------placed order------ WHOOP WHOPP!!!");
						return true;
					} catch (error) {
						try {
							await page.waitForSelector(plce_ordr_btn2_id, {timeout: 9999990})
							await page.click(plce_ordr_btn2_id);
							//await report("clicked "+plce_ordr_btn2_id);
							await report("------placed order------ WHOOP WHOPP!!!");	
							return true;			
						} catch (error) {
							try {
								await page.click(buy_btn_cls);	
							} catch (error) {
								await report("not sure what happened.. was looking for the -place your order- button or the button was clicked and the following error was returned");								
								await report(error);								
							}
						}
					}
				}else{
					await report("*******everything is ready for the order to be placed.. all that is left is to click the submit button*******");
					await page.waitForTimeout(999999);
				} 
			}catch (err) {
				await report("at payment page, can not find -USE THIS PAYMENT METHOD- button :(");
				await report("ERROR: "+err);
				await page.waitForTimeout(999999);
			}
		}
	} catch (error) {
		await report("i ran into the following error on this page \n ERROR: "+error);
		await page.waitForTimeout(999999);
	}
	return false;
}

async function vrfy_shp_adrs(page){
	const adrs_lst_id ='#address-list';
	const ship_2_optns_name = 'submissionURL';
	var re_1 = new RegExp(config.shpg_adrs_nmbr, 'g');
	var re_2 = new RegExp(config.shpg_zip, 'g');
	try {
		await page.waitForSelector(adrs_lst_id, {timeout: 2750})
		//var lst_elms = document.getElementByname (ship_2_optns_name);
		var lst_elms = page.$(document).getElementByname(ship_2_optns_name);
		for (let i = 0; i < lst_elms.length; i++) {
			if (lst_elms[i].childern[0].innerHTML.match(re_1) &&
				lst_elms[i].childern[0].innerHTML.match(re_2)) 
				if (lst_elms[i].checked) return true;
				else {
					lst_elms[i].checked = true;
					return false
				};
		}
	await report("CAN NOT VERIFY SHIPPING ADDRESS :'( you should manually go on to your amazon account and add or figure out what is going on with your shipping to address");
	return false
	}catch (err) {
		await report("Ran into a error wihile verifying the shipping address: \n"+err);
		await page.waitForTimeout(99999999);
	}

}

async function vrfy_paymt_cc(page){
	const pmt_cc_cls_nme = 'span.pmts-cc-number';
	//await report("in -vrfy_paymt_cc-");
	try{
		await page.waitForSelector(pmt_cc_cls_nme, {timeout: 9999990})
		await page.waitForTimeout(2350)
		await page.$$eval(pmt_cc_cls_nme, function(elements,config) {
			const element = elements.find(element => element.innerText === "ending in "+config.cc_lst_4);
			element.click();
		},config);
		return true
	} catch (error) {
		await report("i ran into the following error on this page \n ERROR: "+error);
		await page.waitForTimeout(999999);
	}
}

async function restart_bot(browser) {
	await browser.close()
	return run();
}


async function run() {
	const browser = await puppeteer.launch({
		headless: config.no_ui_window,
		product: 'chrome',
		defaultViewport: { width: 1500, height: 1200 }
	});
	const page = await browser.newPage();
	await page.setCacheEnabled(false);

	await report("Started");
	if (await run_login(page)){
		await report("running item checks");
		var keep_trying = true;
		var dolrs_spnt = 0;
		const startTime = new Date();
		var nowTime = new Date();
		var timeDiffMinutes = Math.round((nowTime - startTime) / 1000) / 60;
		while (keep_trying) {
			try {
				if (config.use_timer && timeDiffMinutes >= parseFloat(config.timer_mins)) {
					await report("OUT OF TIME")
					restart_bot(browser)
					//await browser.close()
					//return run();
				}
				try {
					//await report("here 10")
					for (let i = 0; i < config.amazon_items.length; i++) {
						var confg_item = config.amazon_items[i];
						if(await chk_prod(page,confg_item.url,confg_item.price_limit)){
						//if(chk_prod(page,confg_item.url,confg_item.price_limit)){
							dolrs_spnt = dolrs_spnt + confg_item.price_limit;
							confg_item.number_bought = (parseInt(confg_item.number_bought, 10) + 1).toString();
							if (parseInt(confg_item.number_bought) == parseInt(confg_item.number_wanted)){
								config.amazon_items.splice(i,1);
								report("got all "+confg_item.number_wanted+" that where requested. removing this from list of things to get.")
							}

							if (config.amazon_items.length == 0) {
								keep_trying = false;
								report("all requested item were bought... stopping buying service")
							}

							if (dolrs_spnt >= parseInt(config.spending_limit)) {
								keep_trying = false;
								report("i think i spent all the money... stopping buying service")
							}
						}
					}
				
				} catch(err) {
					err_cntr = err_cntr + 1;
					await report("While loop error\n ERROR: "+err);
					if (err_cntr >= 10 && 15 >= err_cntr) return restart_bot(browser);
					else if (err_cntr > 16){
						keep_trying = false;
						await report("stopping botting service");
					}
				}
	
				nowTime = new Date();
				timeDiffMinutes = Math.round((nowTime - startTime) / 1000) / 60;

			} catch(err) {
				err_cntr = err_cntr + 1
				await report("Strang new error: \n"+err);
				if (err_cntr >= 15 && 25 >= err_cntr) return restart_bot(browser);
				else if (err_cntr > 25){
					keep_trying = false;
					await report("stopping botting service");
				}
			}
		}
		await report("buying service stopped")
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

run();

