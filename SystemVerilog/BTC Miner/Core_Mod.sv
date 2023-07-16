 module Core (
input 
	logic clk, rst, en, sec_tick,
input 
	logic [31:0] iv_ [0:7], 
input 
	logic [31:0] kt [0:63], 
input logic [31:0] data1 [0:15], 
input logic [31:0] ms_0 [0:7], input logic [31:0] ms_1 [0:7], input logic [31:0] ms_2 [0:7],

output
	logic [31:0] cr_tme, crnt_nonce, 
output
	logic [2:0] blk_fnd,
output
	logic inc_vrn_flg
);


	logic _clk,
		new_data_in,
		new_ms_in,
		non_inc_flg = 1'b0,
		tme_inc_flg = 1'b0,
		_rst = 1'b0,
		he_rst = 1'b0,
		rst_cntr = 1'b0,
		clk_en=1'b0,
		en1=0, 
		inc_non_flg = 1'b0,
		cmpltn_flg_0 = 1'b0,
		cmpltn_flg_1 = 1'b0,
		cmpltn_flg_2 = 1'b0,
		inc_non_flg_0 = 1'b0,
		inc_non_flg_1 = 1'b0,
		inc_non_flg_2 = 1'b0,
		blk_fnd_0 = 1'b0,
		blk_fnd_1 = 1'b0,
		blk_fnd_2 = 1'b0,
		sec_tick_clk,
		inc_non_flg_clk,
		cmpltn_flg_clk;
		  
	logic [31:0] _ms_0 [0:7];
	logic [31:0] _ms_1 [0:7];
	logic [31:0] _ms_2 [0:7];
	
		  
	logic [2:0] _blk_fnd = 2'b0;
	logic [5:0] r_cntr = 6'b0;
	logic [31:0] kt_, wt, mt=32'b0;
	logic [31:0] _cr_tme = data1[1];
	logic [31:0] _crnt_nonce =32'b0;
	logic [31:0] crnt_time, _crnt_time;
	logic [31:0] nxt_nonce=32'b0, nxt_time=32'b0;
	logic [31:0] blk_hdr_data [0:15];
	logic [31:0] _data1 [0:15];
	logic [31:0] trkd_non=32'b0;
		  
	assign new_data_in = en && ((blk_hdr_data==data1)?1'b0:1'b1);
	assign new_ms_in = en && (((_ms_0==ms_0)?1'b0:1'b1) | ((_ms_1==ms_1)?1'b0:1'b1) | ((_ms_2==ms_2)?1'b0:1'b1));
	assign _clk = en && clk && clk_en;
	assign sec_tick_clk = _clk && sec_tick && tme_inc_flg;
	assign inc_non_flg_clk = _clk && inc_non_flg && non_inc_flg;
	assign cmpltn_flg_clk = _clk && (cmpltn_flg_0 | cmpltn_flg_1 | cmpltn_flg_2);
	assign blk_fnd =_blk_fnd;
	
	inc_reg_val inc_time(_crnt_time,nxt_time,tme_inc_flg);
	
	inc_reg_val inc_nonce(_crnt_nonce,nxt_nonce,non_inc_flg);
	counter counter_inst1 (_clk, rst_cntr, en, r_cntr);

	SCHr #(4'b1111,2'b01) scheduler_inst1 (_clk, _rst, en1, r_cntr, mt, wt);
	HashEngine #(4'b0001) he_inst0 (_clk, he_rst, en1, sec_tick, r_cntr, iv_, kt_, wt, _ms_0, blk_fnd_0, cmpltn_flg_0, inc_non_flg_0);
	HashEngine #(4'b0010) he_inst1 (_clk, he_rst, en1, sec_tick, r_cntr, iv_, kt_, wt, _ms_1, blk_fnd_1, cmpltn_flg_1, inc_non_flg_1);
	HashEngine #(4'b0011) he_inst2 (_clk, he_rst, en1, sec_tick, r_cntr, iv_, kt_, wt, _ms_2, blk_fnd_2, cmpltn_flg_2, inc_non_flg_2);
	
	
	
	always @(posedge rst)begin
		rst_cntr = 1'b1;
		_rst = 1'b1;
		he_rst = 1'b1;
		clk_en=1'b1;
		inc_non_flg=1'b0;
		cmpltn_flg_0=1'b0;
		cmpltn_flg_1=1'b0;
		cmpltn_flg_2=1'b0;
		inc_non_flg_0=1'b0;
		inc_non_flg_1=1'b0;
		inc_non_flg_2=1'b0;
		r_cntr = 6'b0;
		blk_hdr_data= '{32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
						32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000};
		wt=32'b00000000;
		_crnt_nonce=_data1[3];
		_blk_fnd = 2'b0;
	end
	
	always @(*) begin
		if (rst_cntr == 1'b1) begin
			rst_cntr <= 1'b0;
		end
		if (_rst == 1'b1) begin
			_rst <= 1'b0;
		end
		if (he_rst == 1'b1) begin
			he_rst <= 1'b0;
		end
	end
	
	always_comb begin
		mt <= _data1[r_cntr%16];
		kt_ <= kt[r_cntr];
	end	
		
	always @(posedge new_ms_in) begin
		rst_cntr <= 1'b1;
		_ms_0 = ms_0;
		_ms_1 = ms_1;
		_ms_2 = ms_2;
		en1 <= 1'b1;
		$display("Optimization 1 - Saving commonly shared mid-state data");
	$display("ms_0  = %h" , {_ms_0[0],_ms_0[1],_ms_0[2],_ms_0[3],_ms_0[4],_ms_0[5],_ms_0[6],_ms_0[7]});
	$display("ms_1  = %h" , {_ms_1[0],_ms_1[1],_ms_1[2],_ms_1[3],_ms_1[4],_ms_1[5],_ms_1[6],_ms_1[7]});
	$display("ms_2  = %h" , {_ms_2[0],_ms_2[1],_ms_2[2],_ms_2[3],_ms_2[4],_ms_2[5],_ms_2[6],_ms_2[7]});
	$display("");
		_rst<=1'b1;
		_rst=1'b0;
		he_rst<=1'b1;
		he_rst=1'b0;
	end
	

	always @(posedge new_data_in) begin
		blk_hdr_data= data1;
		_data1 = data1;
		_crnt_time=_data1[1];
		_crnt_nonce=_data1[3];
		crnt_time=_data1[1];
	end
	

	always @(posedge sec_tick_clk)begin
		_crnt_time = nxt_time;
		crnt_time = nxt_time;
		_data1[1] = nxt_time;
		tme_inc_flg<=1'b0;
	end
		
		//version_nonce_feild + 1
	always @(posedge inc_non_flg_clk) begin
		if (inc_non_flg == 1'b1 && non_inc_flg == 1'b1) begin
			if (nxt_nonce == 32'h00000000) begin
				// nonce over flow: throw version+1 flag
				inc_vrn_flg<=1'b1;
				clk_en<=1'b0;
			end else begin
			$display("");
				$display("iterating nonce:  _crnt_nonce = %h ---> nxt_nonce = %h ",_crnt_nonce,nxt_nonce);
				$display("");
				_data1[3] <= nxt_nonce;
				_crnt_nonce = nxt_nonce;
				crnt_nonce <= _crnt_nonce;
			end
			inc_non_flg <= 1'b0;
			non_inc_flg <= 1'b0;
		end
	end
	
	always @(posedge cmpltn_flg_clk ) begin
		if (cmpltn_flg_0 == 1'b1 | cmpltn_flg_1 == 1'b1 | cmpltn_flg_2 == 1'b1) begin
			if({blk_fnd_0,blk_fnd_1,blk_fnd_2} != 3'b000) begin
			$display("");
	$display("cmpltn_flg_clk: %b  |  blk_fnd_on_core: %b" , cmpltn_flg_clk,{blk_fnd_2,blk_fnd_1,blk_fnd_0});
				cr_tme<=crnt_time;
				clk_en<=1'b0;
				crnt_nonce <= trkd_non;
				case({blk_fnd_2,blk_fnd_1,blk_fnd_0})
					3'b001 : begin
							_blk_fnd <= 2'b01;
							cmpltn_flg_0<=1'b0;
	$display("                                                --->>---- CORE 1 FOUND A BLOCK! YAY!! ---<<----");
						end
					3'b010 : begin
							_blk_fnd <= 2'b10;
							cmpltn_flg_1<=1'b0;
	$display("                                                --->>---- CORE 2 FOUND A BLOCK! YAY!! ---<<----");
						end 
					3'b100 : begin
							_blk_fnd <= 2'b11;
							cmpltn_flg_2<=1'b0;
	$display("                                                --->>---- CORE 3 FOUND A BLOCK! YAY!! ---<<----");
						end 
					default : begin //else 
							_blk_fnd <= 2'b00;
						end
				endcase
			end else begin
				cmpltn_flg_0<=1'bx;
				cmpltn_flg_1<=1'bx;
				cmpltn_flg_2<=1'bx;
			end
			
		end
		
	end
	
	always @(*) begin
		if (inc_non_flg_0 == 1'b1 && inc_non_flg_1 == 1'b1 && inc_non_flg_2 == 1'b1 && ({blk_fnd_2,blk_fnd_1,blk_fnd_0} == 3'b000))begin
			trkd_non = _crnt_nonce;
			inc_non_flg<=1'b1;
		end
		inc_non_flg_0<=1'bx;
		inc_non_flg_1<=1'bx;
		inc_non_flg_2<=1'bx;
	end

	
 endmodule
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 



module inc_reg_val(input logic[31:0] val_in, output logic [31:0] val_out, output logic cmplt_flg);
logic [31:0] reg_1;
endian_swap_32b inst0(reg_1, val_out);

always @(val_in) begin
	cmplt_flg <= 1'b0;
	reg_1<={val_in[7:0],val_in[15:8],val_in[23:16],val_in[31:24]}+1'b1;
end

always @(val_out) begin
	cmplt_flg <= 1'b1;
end


endmodule
