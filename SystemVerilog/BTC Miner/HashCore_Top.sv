`timescale 100ns/1ps

module HashCore_top__TB();

	logic[639:0] blk_hdr=640'b0;

	logic system_clk=0, hold_state_pin, rstn=1'b0, rx_pin, _frcd_loop_exit = 1'b0, tx_pin = 1'b0, 
		  frcd_loop_exit=1'b0, exited=1'b0, _exited=1'b0,non_chngd=1'b0,ecm_clk_sig_out,
		  uart_clk_sig_out,show_blk_hdr=1'b0,blkd_hdr_updtd,fpga_clk_sig_out, vrsn_updtd;
	logic [6:0] seg_out [5:0];
	logic [31:0] header0 [19:0];

	logic [7:0] count = 0;
	logic [7:0] buff [0:3];
	
	logic [7:0] cmd = 8'b00000000;
	
	
	function [9:0] pac(input [7:0] a);
		begin
			pac = {1'b1,a,1'b0};
		end
	endfunction
	

	HashCore_Top inst0(system_clk, rstn, hold_state_pin, show_blk_hdr, rx_pin, 1'b0,1'b0,1'b0,1'b0,1'b0, seg_out, tx_pin, frcd_loop_exit, exited, non_chngd, ecm_clk_sig_out, uart_clk_sig_out, fpga_clk_sig_out, blkd_hdr_updtd, vrsn_updtd);
	
	
	always @(posedge frcd_loop_exit)begin
		_frcd_loop_exit <= 1'b1;
	end
	
	always @(posedge exited)begin
		_exited <= 1'b1;
	end

  
	initial begin
		rstn=1'b1; hold_state_pin=1'b0; _frcd_loop_exit = 1'b0; frcd_loop_exit=1'b0; tx_pin = 1'b0;
		
	$display("Mining Started");
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1;
		show_blk_hdr=1'b1;#1;
		system_clk = 0; #1;
		system_clk = 1;
		show_blk_hdr=1'b0;#1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		
		
		while (_exited==1'b0 && _frcd_loop_exit == 1'b0)begin
			system_clk <= 1; #1;
			system_clk <= 0; #1;
		end

		
		if (_exited==1'b1)begin
//			$display("");
//			$display("");
			$display("Mining code exited on it's own");
		end
		if (_frcd_loop_exit==1'b1)begin
			$display("");
			$display("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			$display("");
			$display("Mining code was FORCED TO EXIT");
			$display("");
			$display("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			$display("");
		end
		
//		$display("");
		$display("");
		$timeformat(-12,5," ns");
		$display("      Execuation time about %0t",$realtime);
		$display("");
//		$display("");
		
//		$display("");
		$display("---->>>>>--------***********---------<<<<<---");
		$display("Jumped out of hold while loop and about to exit initial block");
		$display("---->>>>>--------***********---------<<<<<---");
//		$display("");
	end
endmodule




























module HashCore_Top (input logic sys_clk, rstn_mnr_pin, hold_state_pin , show_blk_hdr, rx_pin, sw_asicboost_msg, sw_ecm_msg, sw_core_msg, sw_hasheng_msg, sw_crnt_non,
output logic [6:0] seg_out [5:0], output logic tx_pin, frcd_loop_exit, exited_correctly, non_chngd, ecm_clk_sig_out, uart_clk_sig_out, fpga_clk_sig_out, blkd_hdr_updtd, vrsn_updtd);


//---------------*Top_TB_supporting code----------------------------------------
//---------------*Top_TB_supporting code----------------------------------------
//---------------*Top_TB_supporting code----------------------------------------

//	logic [31:0] header0 [0:15];
//	logic [31:0] data1 [0:15];

	
	logic [31:0] iv[0:7] = '{32'h6a09e667, 32'hbb67ae85, 32'h3c6ef372, 32'ha54ff53a, 32'h510e527f, 32'h9b05688c, 32'h1f83d9ab, 32'h5be0cd19};
	
	logic [31:0] kt [0:63] = '{32'h428A2F98,32'h71374491,32'hB5C0FBCF,32'hE9B5DBA5,32'h3956C25B,32'h59F111F1,32'h923F82A4,32'hAB1C5ED5,32'hD807AA98,
	32'h12835B01,32'h243185BE,32'h550C7DC3,32'h72BE5D74,32'h80DEB1FE,32'h9BDC06A7,32'hC19BF174,32'hE49B69C1,32'hEFBE4786,32'h0FC19DC6,32'h240CA1CC,
	32'h2DE92C6F,32'h4A7484AA,32'h5CB0A9DC,32'h76F988DA,32'h983E5152,32'hA831C66D,32'hB00327C8,32'hBF597FC7,32'hC6E00BF3,32'hD5A79147,32'h06CA6351,
	32'h14292967,32'h27B70A85,32'h2E1B2138,32'h4D2C6DFC,32'h53380D13,32'h650A7354,32'h766A0ABB,32'h81C2C92E,32'h92722C85,32'hA2BFE8A1,32'hA81A664B,
	32'hC24B8B70,32'hC76C51A3,32'hD192E819,32'hD6990624,32'hF40E3585,32'h106AA070,32'h19A4C116,32'h1E376C08,32'h2748774C,32'h34B0BCB5,32'h391C0CB3,
	32'h4ED8AA4A,32'h5B9CCA4F,32'h682E6FF3,32'h748F82EE,32'h78A5636F,32'h84C87814,32'h8CC70208,32'h90BEFFFA,32'hA4506CEB,32'hBEF9A3F7,32'hC67178F2};





	logic c=1'b0,
			e=1'b0,
			rs=1'b0,
		  _clk,
		  r=1'bx,
		  _frcd_loop_exit = 1'b0, 
		  _exit = 1'b0,
		  test_cond_1 = 1'b0,
		  _non_chngd = 1'b0,
		  clk_strt_postn=1'b0,
		  clk_strt_postn_ini=1'b1,
		  sysclk;
		  
	logic [639:0] blk_hdr_1=640'b0;
//	logic [31:0] blk_hdr_data [19:0];
	logic [23:0] msg = 24'h000000, _msg = 24'hAAAAAA, core_msg = 24'hCCCCCC, ecm_msg = 24'h000000, hasheng_msg = 24'hBBBBBB;
	logic [31:0] crnt_non;


	assign sysclk = clk_fun(sys_clk);
	assign non_chngd = _non_chngd;
	assign frcd_loop_exit = _frcd_loop_exit;
	assign exited_correctly = _exit;
	
	assign fpga_clk_sig_out = sysclk;
	assign _clk = e && sysclk && ~hold_state_pin;
	
//	assign fpga_clk_sig_out = c;
//	assign _clk = e && c && ~hold_state_pin;
	
	assign ecm_clk_sig_out = _clk;	
//	assign uart_clk_sig_out = 1'b0;//uart_clk;
	
	
	
//	Clock_Tick_10Mhz fd10m(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//  	Clock_Tick_55HZ	fd55(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//	Clock_Tick_25HZ	fd25(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//	Clock_Tick_16_6HZ fd17(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//	Clock_Tick_10HZ fd10(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//	Clock_Tick_5HZ fd5(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//	Clock_Tick_2HZ fd2(sysclk, (sysclk && ~rstn_mnr_pin), c);// <<---- added this
//
//
//	Clock_Tick_10HZ fd10(sys_clk, (sys_clk && r), system_clk);// <<---- added this
//	Clock_Tick_5HZ fd5(sys_clk, (sys_clk && rstn_mnr_pin), clk);// <<---- added this
//	Clock_Tick_2HZ fd2(sys_clk, (sys_clk && r), system_clk);// <<---- added this
//	
//	inc_reg_val inc_nonce(inc_non_flg_clk, _crnt_nonce,nxt_nonce,non_inc_flg);
	
	hexOutput inst0(_msg,seg_out);

	
	
	always_ff @(sw_asicboost_msg, sw_ecm_msg, sw_core_msg, sw_hasheng_msg, show_blk_hdr, sw_crnt_non)begin
		if(show_blk_hdr) _msg = blk_hdr_1;
		if(sw_asicboost_msg)_msg = msg;
		if(sw_ecm_msg)_msg = ecm_msg;
		if(sw_core_msg)_msg = core_msg;
		if(sw_hasheng_msg)_msg = hasheng_msg;
		if(sw_crnt_non)_msg = {crnt_non[7:0],crnt_non[15:8],crnt_non[23:16],crnt_non[31:24]};
		if(!sw_asicboost_msg&&!sw_ecm_msg&&!sw_core_msg&&!sw_hasheng_msg&&!show_blk_hdr)_msg= 24'h000000;
		
	end
	
	always_ff @(sys_clk)begin
		if(clk_strt_postn_ini === 1'bx || clk_strt_postn_ini === 1'bz || clk_strt_postn_ini == 1'b1)begin
			clk_strt_postn_ini <= 1'b0;
			clk_strt_postn <= sys_clk;
		end
	end
	
	
	function bit clk_fun(logic s_clk);
		//logic corctd_clk_tick;
		
		if(clk_strt_postn_ini == 1'b0)begin
			if(clk_strt_postn == 1'b1) clk_fun = s_clk;
			if(clk_strt_postn == 1'b0) clk_fun = ~s_clk;
			
		end else 
			if(clk_strt_postn_ini === 1'bx || clk_strt_postn_ini === 1'bz || clk_strt_postn_ini == 1'b1)
				clk_fun = 1'b1;
				
		//return corctd_clk_tick;
	endfunction : clk_fun



	
	always_ff @(posedge sysclk or posedge r)begin
		if(r==1'b1)begin
		  if(~hold_state_pin)begin
			e=1'b1;
//			cntr_en <=1'b1;
			rs=1'b1;
			r = 1'b0;

			//blk_hdr_1 = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F0119A8EE0633; // -100000
			//blk_hdr_1 = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011928270833; // -20000
		
			//blk_hdr_1 = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F0119D85D0833; // -6000
			blk_hdr_1 = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011960710833; // -1000 
			//blk_hdr_1 = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011945750833; // -8

			
//			blk_hdr_data = '{blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],
//				  blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
//				  blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],
//				  blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128],
//				  blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0]};
//						
//			header0 = '{blk_hdr_data[19],blk_hdr_data[18],blk_hdr_data[17],blk_hdr_data[16],blk_hdr_data[15],blk_hdr_data[14],
//						blk_hdr_data[13],blk_hdr_data[12],blk_hdr_data[11],blk_hdr_data[10],blk_hdr_data[9],blk_hdr_data[8],
//						blk_hdr_data[7],blk_hdr_data[6],blk_hdr_data[5],blk_hdr_data[4]};
//			
//			data1 = '{ blk_hdr_data[3],blk_hdr_data[2],blk_hdr_data[1],blk_hdr_data[0],
//						32'h80000000, 32'h00000000, 32'h00000000, 32'h00000000,
//						32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
//						32'h00000000, 32'h00000000, 32'h00000000, 32'h00000280 };
					
//			ecm_msg = 24'hA00300;
		  end
		end else begin
		  if(~hold_state_pin)begin
//			ecm_msg = 24'hA00200;
			if(r == 1'b1)r = 1'b0;
			if(r === 1'bx || r === 1'bz)r<=1'b1;
			if(rs == 1'b1)rs <= 1'b0;
		  end
		end
	end
	
	
	
	

	
//---------------*Top_TB_supporting code----------------------------------------
//---------------*Top_TB_supporting code----------------------------------------
//---------------*Top_TB_supporting code----------------------------------------	

// coming out of *Top_TB_supporting code and should be used in the below code block :
//		_clk   ------>    system_clk
//		rs   ------>    ecm_rst
//		blk_hdr   ------>    blk_hdr
//		
// going in to *Top_TB_supporting code and should be :
//      vrn_ovr_flw_flg   <------    vrn_ovr_flw_flg
//		blk_fnd   <------    blk_fnd_flg_out
//		vrsn_out   <------    vrsn_out
//		tme_out   <------    tme_out
//		trkd_non   <------    non_out
//		ecm_msg   <------    _msg_out
//		core_msg   <------    _core_msg
//		hasheng_msg   <------    _hasheng_msg
//
//  
//		_non_chngd
//		_frcd_loop_exit
//		_exit
//		blkd_hdr_updtd
//		



///-------------connects between upper and lower code blocks

logic [31:0] vrsn_out, tme_out, non_out;
logic vrn_ovr_flw_flg, blk_fnd_flg_out;

logic system_clk, ecm_rst;
logic [639:0] blk_hdr;

assign system_clk = _clk;
assign ecm_rst = rs;
assign blk_hdr = blk_hdr_1;
///-------------connects between upper and lower code blocks





///----------------EVERYTHING BELOW HERE IS ECM--------VVVV

	logic rst=1'b1,
		  ini_rst=1'b1,
		  _ecm_rst,
		  rst_cntr=1'b1,
		  core_rst=1'b0,
		  trgr = 1'b0,
		  clk,
		  clk_en=1'b0,
		  cntr_en=1'b0,
		  sec_tick=1'b0,
		  tme_flg=1'b0,
		  _validOut_0=1'b0,
		  _validOut_1=1'b0,
		  _validOut_2=1'b0,
		  validOut_0,
		  validOut_1,
		  validOut_2,
		  vrn_cir_complt_flg=1'b0,
		  inc_vrn_flg=1'b0,
		  inc_vrn_flg_=1'b0,
		  core_en=1'b0,
		  vrsn_en_clk=1'b0,
		  vrsn_en=1'b0,
		  ms_0_en = 1'b0,
		  ms_1_en = 1'b0,
		  ms_2_en = 1'b0,
		  iniztn_cmpltd_clk,
		  vrsn_updt_clk,
		  calc_ms_clk,
		  core_en_clk,		  
		  chk_core_otpts,
		  vrsn_inc_clk,
		  new_data_in;
	
	logic [2:0] blk_fnd = 2'b00;
	logic [5:0] r_cntr = 6'b000000;

	logic [31:0] cr_tme = 32'h00000000,
				 crnt_nonce = 32'h00000000,
				 vrsn2 = 32'h00000000,
				 vrsn1 = 32'h00000000,
				 vrsn0 = 32'h00000000,
				 vrsn = 32'h00000000,// = data0[0],
				 shdw_vrsn = 32'h00000000,// = data0[0],
				 tme = 32'h00000000,// = data1[1],
				 mt0_ = 32'h00000000,
				 mt1_ = 32'h00000000,
				 mt2_ = 32'h00000000,
				 _vrsn_out = 32'h00000000,
				 kt_ = 32'h00000000;
				 
	logic [31:0] data0 [0:15] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								   32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	logic [31:0] data1 [0:15] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								   32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	
	logic [31:0] blk_hdr_data [0:19] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
										 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
										 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	
	logic [31:0] ms_0 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	logic [31:0] ms_1 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	logic [31:0] ms_2 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	
	logic [31:0] _ms_0 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	logic [31:0] _ms_1 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	logic [31:0] _ms_2 [0:7] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
	
	logic [31:0] data_1 [0:15] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								   32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000}; //data0;
	logic [31:0] data_2 [0:15] = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								   32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000}; //data0;
	logic [31:0] vrns_ar[2:0];
	typedef logic [31:0] get_vrns_rtn_date[2:0];
		  
		  
	assign clk = clk_en && system_clk;
	assign iniztn_cmpltd_clk = system_clk && ini_rst;
	assign _ecm_rst = ecm_rst&& rst;
	assign new_data_in = (({blk_hdr_data[0],blk_hdr_data[1],blk_hdr_data[2],blk_hdr_data[3],blk_hdr_data[4],blk_hdr_data[5],
						   blk_hdr_data[6],blk_hdr_data[7],blk_hdr_data[8],blk_hdr_data[9],blk_hdr_data[10],blk_hdr_data[11],
						   blk_hdr_data[12],blk_hdr_data[13],blk_hdr_data[14],blk_hdr_data[15],blk_hdr_data[16],blk_hdr_data[17],
						   blk_hdr_data[18],blk_hdr_data[19]}===blk_hdr)?1'b0:1'b1);
//	assign vrsn_updt_clk = clk && ((vrn_cir_complt_flg === 1'bx || vrn_cir_complt_flg === 1'bz)?1'b0:vrn_cir_complt_flg);

	assign validOut_0 = _validOut_0 && ms_0_en;
	assign validOut_1 = _validOut_1 && ms_1_en;
	assign validOut_2 = _validOut_2 && ms_2_en;
	assign core_en_clk = clk && (validOut_0 || validOut_1 || validOut_2);
	assign chk_core_otpts = clk && ( ((blk_fnd != 2'b00)?1'b1:1'b0) || inc_vrn_flg);
	assign vrsn_inc_clk = clk && inc_vrn_flg_;
	
	assign non_out = crnt_nonce;
	assign tme_out = cr_tme;
	assign vrsn_out = _vrsn_out;
	assign crnt_non = crnt_nonce;
	assign uart_clk_sig_out = clk;
//	assign _msg_out = msg_out;
//	assign _core_msg = core_msg;
//	assign _hasheng_msg = hasheng_msg;

	
	
//----------utility functions ---- start
//	get_vrns vrns_inst0(clk, vrsn_en, vrsn, vrn_cir_complt_flg, vrsn0, vrsn1, vrsn2);
	clock_unit clk_unt(clk,rst,sec_tick);
	counter counter_inst0 (clk, rst_cntr, cntr_en, r_cntr);
	
//----------utility functions ---- end	

	
//----------pre-processing functions ---- start
	SHA256 #(4'b0001) sha_inst0 (clk, rst, ms_0_en , r_cntr, iv, kt_, mt0_, ms_0, _validOut_0);
	SHA256 #(4'b0010) sha_inst1 (clk, rst, ms_1_en , r_cntr, iv, kt_, mt1_, ms_1, _validOut_1);
	SHA256 #(4'b0011) sha_inst2 (clk, rst, ms_2_en , r_cntr, iv, kt_, mt2_, ms_2, _validOut_2);
//----------pre-processing functions ---- end	
	
//	Core core_inst0(clk, rst, core_en, sec_tick, iv, kt, data1, _ms_0, _ms_1, _ms_2, cr_tme, crnt_nonce, blk_fnd, inc_vrn_flg);
	Core core_inst0(clk, rst, core_en, sec_tick, iv, kt, data1, _ms_0, _ms_1, _ms_2, cr_tme, crnt_nonce, blk_fnd, inc_vrn_flg, core_msg, hasheng_msg, _non_chngd );
	
	
	
	
	always_ff @(core_en_clk) begin
		if(trgr === 1'bx || trgr === 1'bz)trgr<=1'b0;
 		if ({validOut_0,validOut_1,validOut_2} == 3'b111 && r_cntr == 63)begin
			trgr <= 1'b1;
		end else trgr <= 1'b0;
//		ecm_msg = 24'hB00001;
	end
	
	
	

	
	always_comb begin
		if(iniztn_cmpltd_clk || _ecm_rst)begin
//			ecm_msg = 24'hB00002;
			kt_ = 32'h00000000;
			mt0_ = 32'h00000000;
			mt1_ = 32'h00000000;
			mt2_ = 32'h00000000;
		end else begin
//			ecm_msg = 24'hB00003;
			kt_ <= kt[r_cntr];
			if (ms_0_en == 1'b1) mt0_<=data0[r_cntr%16]; else mt0_ = 32'h00000000;
			if (ms_1_en == 1'b1) mt1_<=data_1[r_cntr%16]; else mt1_ = 32'h00000000;
			if (ms_2_en == 1'b1) mt2_<=data_2[r_cntr%16]; else mt2_ = 32'h00000000;
		end
		
	end
	
	
	
	
	
//	always_ff @(posedge clk or posedge iniztn_cmpltd_clk or posedge _ecm_rst)begin
//		if(iniztn_cmpltd_clk || _ecm_rst)begin
////			msg_out = 24'h0000B2;
//			mt0_ = 32'h00000000;
//			mt1_ = 32'h00000000;
//			mt2_ = 32'h00000000;
//		end else if (clk == 1'b1) begin
////			msg_out = 24'h0000B3;
//			if (ms_0_en == 1'b1)begin
//				mt0_<=data0[r_cntr%16];
//			end
//			if (ms_1_en == 1'b1)begin
//				mt1_<=data_1[r_cntr%16];	
//			end
//			if (ms_2_en == 1'b1)begin		
//				mt2_<=data_2[r_cntr%16];
//			end
//		end
//	end
	
	
	
	
	
	
	
	
	
		
	always_ff @(posedge clk or posedge iniztn_cmpltd_clk or posedge _ecm_rst)begin
//		if(rst === 1'bx || rst === 1'bz)rst<=1'b1;
//		if(_ecm_rst==1'b1)msg_out = 24'hB00001;
//		if(core_en_clk)msg_out = 24'h0000B1;
//		if ({validOut_0,validOut_1,validOut_2} == 3'b111 && r_cntr == 63)msg_out = 24'h0000B8;
//		if(trgr == 1'b1) msg_out = 24'h0000B7;
	
	
	
	
	
	
	
	
	
//		msg_out = 24'h0000B5;
//		case(1'b1)
//		if(_ecm_rst==1'b1)msg_out = 24'hB00001;
		if(iniztn_cmpltd_clk || _ecm_rst)begin
			ecm_msg = 24'hB00004;
			rst<=1'b0;
			rst_cntr = 1'b1;
			core_rst<=1'b0;
			vrsn_en = 1'b1;
			
			
			
			cntr_en = 1'b0;
			_vrsn_out = 32'h00000000;
			tme_flg = 1'b0;
			inc_vrn_flg_ = 1'b0;
			core_en = 1'b0;
			vrsn_en_clk = 1'b0;
//			ms_0_en = 1'b0;
//			ms_1_en = 1'b0;
//			ms_2_en = 1'b0;
			vrn_ovr_flw_flg <= 1'b0;
			blk_fnd_flg_out <= 1'b0;
			tme = data1[1];
			_ms_0 = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
			_ms_1 = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
			_ms_2 = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};		
			data_1 [0:15] = data0;
			data_2 [0:15] = data0;
			clk_en <= 1'b1;
			if (ini_rst)
				blk_hdr_data = '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
										 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
										 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};

			
////-------core----------handeling new_data_in event				
		if(new_data_in==1'b1) begin
//			ecm_msg = 24'hB00005;
			
			blk_hdr_data='{blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
						blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128],
						blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0]};
						
						
			data0 = '{ blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],
					blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
					blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],
					blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128]};
					
			data1= '{ blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0],
					32'h80000000, 32'h00000000, 32'h00000000, 32'h00000000,
					32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
					32'h00000000, 32'h00000000, 32'h00000000, 32'h00000280 };
					
			blkd_hdr_updtd <= 1'b1;
			core_rst<=1'b1;

			shdw_vrsn = blk_hdr[639:608];
			vrn_ovr_flw_flg<=1'b0;
			
			blk_fnd_flg_out <= 1'b0;
			
			ecm_msg = 24'hB0000F;
//			rst_cntr = 1'b0;	

			ini_rst<=1'b0; 			
			
			//vrsn = blk_hdr[639:608];
			vrns_ar = fun_get_vrns( blk_hdr[639:608]);
			//data0[0]=vrsn0;
			//data_1[0]=vrns_ar[1];
			//data_2[0]=vrns_ar[2];

			if(vrns_ar[0] != 32'h00000000)begin
				data0[0]<=vrns_ar[0];
				ms_0_en = 1'b1;
				shdw_vrsn=vrns_ar[0];
			end
			if(vrns_ar[1] != 32'h00000000)begin
				data_1[0]<=vrns_ar[1];
				ms_1_en = 1'b1;
				shdw_vrsn=vrns_ar[1];
			end
			if(vrns_ar[2] != 32'h00000000)begin
				data_2[0]<=vrns_ar[2];
				ms_2_en = 1'b1;
				shdw_vrsn=vrns_ar[2];
			end
			if({ms_0_en,ms_1_en,ms_2_en} == 3'b000)begin
				vrn_ovr_flw_flg<=1'b1;
				ecm_msg = 24'hB00010;
			end else begin cntr_en <= 1'b1; vrsn_updtd=1'b1; end
//			vrn_cir_complt_flg<=1'b0;
//			vrsn_en=1'b0;
		end
			
			
			
			
			//msg_out = blk_hdr_data[19];
//			if(_ecm_rst==1'b1)msg_out = 24'hB00005;//<<-------- this is true at this point
			//else 
//				if(iniztn_cmpltd_clk==1'b1)ecm_msg = 24'hB00006;
//		end



		
			ecm_msg = 24'hB00006;
		end else if(clk == 1'b1) begin
		
		
		
		
		
		
		
		
	msg={r_cntr,  { msg[15],msg[14],msg[13],msg[12] ,msg[11],msg[10],msg[9], msg[8],msg[7],msg[6],msg[5],msg[4], msg[3],msg[2],msg[1],msg[0]}+1'b1};
		
		
		
		
		
//******************--------------------------******************************----------------------------
	if({crnt_nonce[7:0],crnt_nonce[15:8],crnt_nonce[23:16],crnt_nonce[31:24]} >= 32'h3308754B)begin
		_frcd_loop_exit=1'b1;
		_exit <= 1'b0;
		ecm_msg = 24'h0000F6;
		clk_en<=1'b0;// <<---- added this
//		$display("here A6");
	end
//******************--------------------------******************************----------------------------
	
	
		if(trgr == 1'b1) begin
//			trgr = 1'b0;
			_ms_0 = ms_0;
			_ms_1 = ms_1;
			_ms_2 = ms_2;
			core_en = 1'b1;
			ms_0_en = 1'b0;
			ms_1_en = 1'b0;
			ms_2_en = 1'b0;
			cntr_en = 1'b0;
			ecm_msg = 24'hB00007;
		end
		
		if (rst_cntr == 1'b1) begin
			rst_cntr = 1'b0;
		end
//		if (cntr_en == 1'b0) begin
//			cntr_en <= 1'b1;
//		end
//	
//		if(new_data_in==1'b1) begin
//			ecm_msg = 24'hB00005;
//			
//			blk_hdr_data='{blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
//						blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128],
//						blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0]};
//						
//						
//			data0 = '{ blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],
//					blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
//					blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],
//					blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128]};
//					
//			data1= '{ blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0],
//					32'h80000000, 32'h00000000, 32'h00000000, 32'h00000000,
//					32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
//					32'h00000000, 32'h00000000, 32'h00000000, 32'h00000280 };
//					
//			blkd_hdr_updtd <= 1'b1;
//			rst=1'b1;
//			core_rst<=1'b1;
//			
//			//vrsn = blk_hdr[639:608];
//			vrns_ar = get_vrns( blk_hdr[639:608]);
//			//data0[0]=vrsn0;
//			data_1[0]=vrns_ar[1];
//			data_2[0]=vrns_ar[2];
//			shdw_vrsn = blk_hdr[639:608];
//			vrn_ovr_flw_flg<=1'b0;
//			blk_fnd_flg_out <= 1'b0;
//			//msg_out = blk_hdr_data[19];
////			if(_ecm_rst==1'b1)msg_out = 24'hB00005;//<<-------- this is true at this point
//			//else 
////				if(iniztn_cmpltd_clk==1'b1)ecm_msg = 24'hB00006;
//		end
		
		//not good... version feild has overflown with nonce values
		if(vrn_ovr_flw_flg==1'b1) begin
			// sound all bells and figure out what to do...
			ecm_msg = 24'hB00008;
			vrsn = 32'h00000000;
			shdw_vrsn = 32'h00000000;
			rst=1'b0;
			clk_en<=1'b0;
			vrsn_en=1'b0;
			cntr_en=1'b0;
			ms_0_en=1'b0;
			ms_1_en=1'b0;
			ms_2_en=1'b0;
			core_en=1'b0;
			inc_vrn_flg_ = 1'b0;
		end
		
		//version_nonce_feild + 1
		if(vrsn_inc_clk==1'b1) begin
			ecm_msg = 24'hB00009;
			vrsn = shdw_vrsn;
			rst = 1'b1;
			inc_vrn_flg_ = 1'b0;
			vrsn_en=1'b1;
		end
	
		if(chk_core_otpts==1'b1) begin
			ecm_msg = 24'hB0000A;
			if (blk_fnd != 2'b00)begin //block was found
				//tme_out <= cr_tme;
				//non_out <= crnt_nonce;
				ecm_msg = 24'hBF0F10;
				if(blk_fnd == 2'b01) _vrsn_out <= vrsn0;
				if(blk_fnd == 2'b10) _vrsn_out <= vrsn1;
				if(blk_fnd == 2'b11) _vrsn_out <= vrsn2;
				blk_fnd_flg_out <= 1'b1;
				_exit <= 1'b1;
				_frcd_loop_exit<=1'b0;
			end else begin
				ecm_msg = 24'hB0000E;//<<-------- doesn't makes sence to be showing but is #1 ------------------ conclusion is what not exec.ed it b11 showed as mixed signals from other places
				inc_vrn_flg_ = 1'b1;
				blk_fnd_flg_out <= 1'b0;
			end 
		end
	
		
			
//		if(vrsn_updt_clk==1'b1)begin
//			ecm_msg = 24'hB0000F;
//			rst_cntr <= 1'b0;
//			if(vrsn0 != 32'h00000000)begin
//				data0[0]=vrsn0;
//				ms_0_en = 1'b1;
//				shdw_vrsn=vrsn0;
//			end
//			if(vrsn1 != 32'h00000000)begin
//				data_1[0]=vrsn1;
//				ms_1_en = 1'b1;
//				shdw_vrsn=vrsn1;
//			end
//			if(vrsn2 != 32'h00000000)begin
//				data_2[0]=vrsn2;
//				ms_2_en = 1'b1;
//				shdw_vrsn=vrsn2;
//			end
//			if({ms_0_en,ms_1_en,ms_2_en} == 3'b000)begin
//				vrn_ovr_flw_flg<=1'b1;
//				ecm_msg = 24'hB00010;
//			end else begin cntr_en <= 1'b1; vrsn_updtd=1'b1; end
////			vrn_cir_complt_flg<=1'b0;
//			vrsn_en=1'b0;
//		end
		
		
//		default: msg_out = 24'hBF0000;
	end
	end
	
	






  function get_vrns_rtn_date fun_get_vrns( logic[31:0] crnt_vrsn);//, output logic cir_cmpltn_flg, output logic[31:0] vrsn_0, vrsn_1, vrsn_2);
	get_vrns_rtn_date temp_payload;
	
	logic[31:0] _crnt_vrsn,_vrsn_0, _vrsn_1, _vrsn_2;
	
	_crnt_vrsn = {crnt_vrsn[7:0],crnt_vrsn[15:8],crnt_vrsn[23:16],crnt_vrsn[31:24]};
	
		if(crnt_vrsn[27:13] <= 16'h7fff && crnt_vrsn[27:12] != 16'hffff ) begin  //if (vrsn + 1'b1 has NOT rolled outside of bits 13-28) begin
			_vrsn_0 = _crnt_vrsn;
		end else begin
			_vrsn_0 = 32'h00000000;
		end		
		if(crnt_vrsn[27:13] + 1'b1 <= 16'h7fff) begin
			_vrsn_1 = {_crnt_vrsn[31:28], _crnt_vrsn[27:13] + 1'b1, _crnt_vrsn[12:0]};
		end else begin
			_vrsn_1 = 32'h00000000;
		end
		if(crnt_vrsn[27:13] + 2'b10 <= 16'h7fff) begin
			_vrsn_2 = {_crnt_vrsn[31:28], _crnt_vrsn[27:13] + 2'b10, _crnt_vrsn[12:0]};
		end else begin
			_vrsn_2 = 32'h00000000;
		end
	
	temp_payload[0] = {_vrsn_0[7:0],_vrsn_0[15:8],_vrsn_0[23:16],_vrsn_0[31:24]};
	temp_payload[1] = {_vrsn_1[7:0],_vrsn_1[15:8],_vrsn_1[23:16],_vrsn_1[31:24]};
	temp_payload[2] = {_vrsn_2[7:0],_vrsn_2[15:8],_vrsn_2[23:16],_vrsn_2[31:24]};
	
	 return temp_payload;
endfunction : fun_get_vrns









function logic[31:0] endian_swap_32b(input logic[31:0] val_in);
		endian_swap_32b = {val_in[7:0],val_in[15:8],val_in[23:16],val_in[31:24]};
endfunction





























	
	
	
endmodule






















module get_vrns(input logic clk, en, input logic[31:0] crnt_vrsn, output logic cir_cmpltn_flg, output logic[31:0] vrsn_0, vrsn_1, vrsn_2);
	logic cir_clk_0, int_clk;
	logic[31:0] _crnt_vrsn = 32'bXXXXXXXX,
				_vrsn_0= 32'h00000000,
				_vrsn_1= 32'h00000000,
				_vrsn_2= 32'h00000000;
	
	assign int_clk = ((_crnt_vrsn == _vrsn_0)?1'b0:1'b1);
	assign cir_clk_0 = ~clk && en && (int_clk || cir_cmpltn_flg==1'b1);
	
	
	endian_swap_32b ins_0(crnt_vrsn,_crnt_vrsn);
	endian_swap_32b ins_1(_vrsn_0,vrsn_0);
	endian_swap_32b ins_2(_vrsn_1,vrsn_1);
	endian_swap_32b ins_3(_vrsn_2,vrsn_2);
	
	

//	always_ff @(posedge cir_clk_0) begin
	always_ff @(clk) begin
		if (clk == 1'b0 && cir_cmpltn_flg==1'b1)cir_cmpltn_flg=1'b0;
		else if (cir_clk_0) begin
//			_crnt_vrsn = crnt_vrsn;
			cir_cmpltn_flg=1'b0;
			if(crnt_vrsn[27:13] <= 16'h7fff && crnt_vrsn[27:12] != 16'hffff ) begin
				_vrsn_0 <= _crnt_vrsn;
			end else begin
				_vrsn_0 <= 32'h00000000;
			end		
			if(crnt_vrsn[27:13] + 1'b1 <= 16'h7fff) begin
				_vrsn_1 <= {_crnt_vrsn[31:28], _crnt_vrsn[27:13] + 1'b1, _crnt_vrsn[12:0]};
			end else begin
				_vrsn_1 <= 32'h00000000;
			end
			if(crnt_vrsn[27:13] + 2'b10 <= 16'h7fff) begin
				_vrsn_2 <= {_crnt_vrsn[31:28], _crnt_vrsn[27:13] + 2'b10, _crnt_vrsn[12:0]};
			end else begin
				_vrsn_2 <= 32'h00000000;
			end
			cir_cmpltn_flg<=1'b1;
		end 
	end
endmodule





module endian_swap_32b(input logic[31:0] val_in, output logic[31:0] val_out);
//|   31 30 29 28 - 27 26 25 24 - 23 22 21 20 - 19 18 17 16 - 15 14 13 12 - 11 10 9 8 - 7 6 5 4 - 3 2 1 0   |
//-------------------------------------------------|---------------------------------------------------------
//                                                 |
//                                                 V
// ----------------------------------------------------------------------------------------------------------
// | 7 6 5 4 - 3 2 1 0 -- 15 14 13 12 - 11 10 9 8 -- 23 22 21 20 - 19 18 17 16 -- 31 30 29 28 - 27 26 25 24 |
	always_comb begin
		val_out <= {val_in[7:0],val_in[15:8],val_in[23:16],val_in[31:24]};
	end
endmodule