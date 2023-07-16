module KtWt #(parameter core=4'b0,sha=2'b0)(input logic clk, rst, en, input logic[5:0] r_cntr, input logic[31:0] kt, wt, output logic[31:0] ktwt);
	logic dyn_hrd_code_cmpltd_flg, ktwt_19_inc_flg;
	logic [31:0] _ktwt [2:0];
	logic[31:0] nxt_ktwt_19 ,_crnt_ktwt_19;
	
	assign ktwt = kt + wt;
	
	always @(posedge rst)begin
		dyn_hrd_code_cmpltd_flg = 1'b0;
		ktwt_19_inc_flg=1'b0;
		_ktwt='{32'b00000000,32'b00000000,32'b00000000};
		nxt_ktwt_19=32'b00000000;
		//_crnt_ktwt_19=32'b00000000;
	end
	
	
endmodule

module KtWt_1 #(parameter core=4'b0,sha=2'b0)(input logic clk, rst, en, input logic[5:0] r_cntr, input logic[31:0] kt, wt, output logic[31:0] ktwt);

//    this file includes sha_1 and sha_2 for 6.5, 6.6, and 6.10 

	logic dyn_hrd_code_cmpltd_flg, ktwt_19_inc_flg;
	logic [31:0] _ktwt [2:0];
	logic[31:0] nxt_ktwt_19 ,_crnt_ktwt_19;
	
	inc_reg_val ins_0(_crnt_ktwt_19,nxt_ktwt_19,ktwt_19_inc_flg);
	
	
	always @(posedge ktwt_19_inc_flg)begin
		ktwt_19_inc_flg<=1'b0;
		ktwt=nxt_ktwt_19;
		_ktwt[2] = nxt_ktwt_19;
	end

	always @(posedge rst)begin
		dyn_hrd_code_cmpltd_flg = 1'b0;
		ktwt_19_inc_flg=1'b0;
		_ktwt='{32'b00000000,32'b00000000,32'b00000000};
		nxt_ktwt_19=32'b00000000;
		//_crnt_ktwt_19=32'b00000000;
	end

	always @(wt or kt) begin
		if (en == 1'b1)begin
		case(sha)
			2'b00: ktwt <= kt + wt;
			
		////////////////OPTIMIZATION 6.5 and 6.6 SHA 256_1 combined/////////////

			2'b01: begin
				case (1'b1)
					((r_cntr == 4)?1'b1:1'b0): 						ktwt = 32'hb956c25b;
					((r_cntr >= 5 && r_cntr <= 14)?1'b1:1'b0): 		ktwt = kt;
					((r_cntr == 15)?1'b1:1'b0): 					ktwt = 32'hc19bf3f4;

			// BEGIN OPTIMIZATION No. 10 -- to assign values at nonce zero and counts 16-19
					((r_cntr == 16 || r_cntr == 17 || r_cntr == 19)?1'b1:1'b0): begin
						case(1'b1)
							((dyn_hrd_code_cmpltd_flg != 1'b1)?1'b1:1'b0): begin
								case(1'b1)
									((r_cntr == 16 && dyn_hrd_code_cmpltd_flg != 1'b1)?1'b1:1'b0): begin
											ktwt = wt + 32'he49b69c1;
											_ktwt[0] = wt + 32'he49b69c1;
									end

									((r_cntr == 17 && dyn_hrd_code_cmpltd_flg != 1'b1)?1'b1:1'b0): begin
											ktwt = wt + 32'hefbe4786;
											_ktwt[1] = wt + 32'hefbe4786;
									end

									((r_cntr == 19 && dyn_hrd_code_cmpltd_flg != 1'b1)?1'b1:1'b0): begin
											ktwt = wt + 32'h240ca1cc;
											_ktwt[2] = wt + 32'h240ca1cc;
											dyn_hrd_code_cmpltd_flg = 1'b1;
									end
									default: ktwt = kt + wt;
								endcase
							end
						
							((dyn_hrd_code_cmpltd_flg == 1'b1)?1'b1:1'b0): begin
								case(1'b1)
									((r_cntr == 16 && dyn_hrd_code_cmpltd_flg == 1'b1)?1'b1:1'b0):	ktwt = _ktwt[0];
									((r_cntr == 17 && dyn_hrd_code_cmpltd_flg == 1'b1)?1'b1:1'b0):	ktwt = _ktwt[1];
									((r_cntr == 19 && dyn_hrd_code_cmpltd_flg == 1'b1)?1'b1:1'b0):  begin
											ktwt_19_inc_flg<=1'b0;
											_crnt_ktwt_19<=_ktwt[2];
									end
									default: ktwt = kt + wt;
								endcase
							end
							default: ktwt = kt + wt;
						endcase
				// OPT. 10
						
					end
					default: ktwt = kt + wt;
				endcase
			end
			/////////////////////////////////////////////////////////////////////////
		
			////////////////OPTIMIZATION 6.5 and 6.6 SHA256_2 combined/////////////

			2'b10: begin
					case(1'b1)
						((r_cntr == 8)?1'b1:1'b0):						ktwt = 32'h5807aa98;
						((r_cntr >= 9 && r_cntr <= 14)?1'b1:1'b0):		ktwt = kt;
						((r_cntr == 15)?1'b1:1'b0):						ktwt = 32'hc19bf274;
						default:										ktwt = kt + wt;
					endcase
				end
			/////////////////////////////////////////////////////////////////////////
			
			default: ktwt = kt + wt;
		endcase
		end
	end
			

endmodule