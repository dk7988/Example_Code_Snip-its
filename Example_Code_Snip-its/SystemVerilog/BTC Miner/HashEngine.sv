 module HashEngine #(parameter core=4'b0) (
input 
	logic clk, rst, en, sec_tick,
input 
	logic [5:0] r_cntr, 
input 
	logic [31:0] iv_ [0:7], 
input 
	logic [31:0] kt, wt,
input logic [31:0] ms_ [0:7],

output
	logic blk_fnd,
		cmpltn_flg,
		inc_non
);


	logic [31:0] _clk, wt_,mt,kt_,target32,sha2_stp_erly_flg,_ktwt_0,_ktwt_1,clk_en=1'b1;
	logic [31:0] wreg_0 [0:7];
	logic [31:0] wreg_1 [0:7];
	logic [31:0] wreg_2 [0:7];
	logic [31:0] wreg_3;
	logic [31:0] ms [0:7];
	logic [31:0] H1 [0:15] = '{ 32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								32'h00000000, 32'h00000000, 32'h00000000, 32'h00000000,
								32'h80000000, 32'h00000000, 32'h00000000, 32'h00000000,
								32'h00000000, 32'h00000000, 32'h00000000, 32'h00000100 };
			
	logic sha_2_clk, validOut_0=0, validOut_1=0, en1=0, en2=0,_rst=0;
	
	assign _clk = clk_en && clk;
	assign sha_2_clk = _clk && en2; //en1;  // commented out 3.28.23
	
	KtWt #(core,2'b01) ktwt_inst_0(_clk, rst, ((en1==1'b1)?1'b0:en), r_cntr, kt, wt, _ktwt_0);
	CMPr #(core,2'b01) compressor_inst1 (_clk, rst, ((en1==1'b1)?1'b0:en) , r_cntr, ms_, _ktwt_0, wreg_0, validOut_0);
	
	//----sha256_2 start
	SCHr #(core,2'b10) scheduler_inst2 (_clk, _rst, en2, r_cntr, mt, wt_);
	KtWt #(core,2'b10) ktwt_inst_2(_clk, _rst, en2, r_cntr, kt, wt_, _ktwt_1);
	CMPr #(core,2'b10) compressor_inst2 (_clk, _rst, en2, r_cntr, iv_,  _ktwt_1, wreg_1, validOut_1);
	//----sha256_2 start
	
	always @(posedge clk)begin
		if (validOut_0==1 && r_cntr==63) begin
			_rst=1'b1;
			_rst<=1'b0;
			inc_non<=1'b1;
			en2=1'b1;
			
			H1[0]=wreg_0[0];
			H1[1]=wreg_0[1];
			H1[2]=wreg_0[2];
			H1[3]=wreg_0[3];
			H1[4]=wreg_0[4];
			H1[5]=wreg_0[5];
			H1[6]=wreg_0[6];
			H1[7]=wreg_0[7];


		end
		if (en && r_cntr == 2 ) target32<=wt;
		if (en2 && r_cntr == 60 ) begin
			if (wreg_1[4]+iv_[7] != 32'h00000000) begin
				cmpltn_flg<=1'b1;
				blk_fnd<=1'b0;
				en2<=1'b0;
				$display("CORE: %d  |  Optimization 2 - Compressed Output was terminated early - on round 60 for sha2  wreg_E + iv_H != 00000000 " , core);
				$display("CORE: %d  |  wreg_E + iv_H = %h " , core, (wreg_1[4]+iv_[7]));
				sha2_stp_erly_flg<=1'b1;
			end
		end
		if (en2 && r_cntr == 61 ) begin
			wreg_3 <= wreg_1[4]+iv_[6];
			if ({wreg_3[7:0],wreg_3[15:8],wreg_3[23:16],wreg_3[31:24]} <= target32) begin
				cmpltn_flg<=1'b1;
				blk_fnd<=1'b0;
				en2<=1'b0;
				$display("CORE: %d  |  Optimization 2 - Compressed Output was terminated early - on round 61 for sha2  !(wreg_E + iv_G <= %h ) " , core,target32);
				$display("CORE: %d  |  wreg_E + iv_G = %h " , core, (wreg_1[4]+iv_[6]));
				$display("CORE: %d  |  target32 = %h " , core, target32);
				sha2_stp_erly_flg<=1'b1;
			end
		end
		
		if (validOut_1==1 && r_cntr==63) begin
			cmpltn_flg<=1'b1;
			blk_fnd<=1'b1;
			wreg_2 <= wreg_1;
			sha2_stp_erly_flg=1'b0;
			validOut_1 <=0;
			$display("CORE: %d  |  Compressed Output  = %h" , core, {wreg_1[0],wreg_1[1],wreg_1[2],wreg_1[3],wreg_1[4],wreg_1[5],wreg_1[6],wreg_1[7]});
			clk_en=1'b0;
		end
		
		if (sha2_stp_erly_flg==1'b1 && r_cntr==63)begin
			_rst=1'b1;
			_rst<=1'b0;
			sha2_stp_erly_flg<=1'b0;
			en2<=1'b1;
		end
		
	end
	
	
	always @(posedge en) ms <= ms_;
	
	always @(posedge rst) begin
		validOut_0=0;
		validOut_1=0;
		clk_en=1'b1;
		en1=0;
		en2=0;
		_rst=0;
		cmpltn_flg<=1'b0;
		blk_fnd<=1'b0;
		sha2_stp_erly_flg=1'b0;
	end
	
	always @(posedge sha_2_clk) begin
		mt<= H1[(r_cntr+1)%16];
	end
	
	always @(*) begin
		if (cmpltn_flg == 1'b1) begin
			cmpltn_flg <= 1'b0;
		end
		if (blk_fnd == 1'b1) begin
			blk_fnd <= 1'b0;
		end
		if (inc_non == 1'b1) begin
			inc_non <= 1'b0;
		end
	end

 endmodule
 
 
module calc_target(input logic [31:0] in_bits, output logic [255:0] val_out);
	
	always_comb 
		val_out <= in_bits[23:0] * (2**(8*(in_bits[31:24] - 3)));
	
	
endmodule