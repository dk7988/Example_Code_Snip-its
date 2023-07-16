module rotr #(parameter int sz, idx) (input logic [sz-1:0] in_val, output logic [sz-1:0] result);
	assign result = {in_val[idx-1:0], in_val[sz-1:idx]};
endmodule

module rotr_32 #(parameter dis=7) (input logic [31:0] in_val, output logic [31:0] result);
	assign result = {in_val[dis-1:0], in_val[31:dis]};
endmodule

module sig_0 (input logic [31:0] in_val, output logic [31:0] result);
	logic[31:0] a,b,c;
	rotr_32 #(7) r1 (in_val, a);
	rotr_32 #(18) r2 (in_val, b);
	assign c = in_val >> 3;
	assign result = (a^b)^c;
endmodule

module sig_1 (input logic [31:0] in_val, output logic [31:0] result);
	logic[31:0] a,b,c;
	rotr_32 #(17) r1 (in_val, a);
	rotr_32 #(19) r2 (in_val, b);
	assign c = in_val >> 10;
	assign result = (a^b)^c;
endmodule


module Sig0 (input logic [31:0] in_val, output logic [31:0] result);
	logic[31:0] a,b,c;
	rotr_32 #(2) r1 (in_val, a);
	rotr_32 #(13) r2 (in_val, b);
	rotr_32 #(22) r3 (in_val, c);
	assign result = (a^b)^c;
endmodule

module Sig1 (input logic [31:0] in_val, output logic [31:0] result);
	logic[31:0] a,b,c;
	rotr_32 #(6) r1 (in_val, a);
	rotr_32 #(11) r2 (in_val, b);
	rotr_32 #(25) r3 (in_val, c);
	assign result = (a^b)^c;
endmodule


module maj (input logic [31:0] x, y, z, output logic [31:0] result);
	assign result = (x & y)|(z & (x | y));
endmodule


module ch (input logic [31:0] x, y, z, output logic [31:0] result);
	assign result = z^(x & (y ^ z));
endmodule

module counter #(parameter size = 6) (input clk, rst, en, output logic [size-1:0] result);
	always_ff @ (posedge clk or posedge rst) begin
			if(rst)
				result <= 0;
			else
				if(en)
					result <= result + 1;
		end
endmodule

module counter_alt #(parameter size = 6) (input clk, rst, en, output logic [size-1:0] result);
	always_ff @ (posedge clk or posedge rst) begin
			if(rst)
				result <= '{size{1'b1}};
			else
				if(en)
					result <= result + 1;
		end
endmodule

// Used to generate a 50% duty cycle 1000Hz Clock from the FPGA's 50Mhz clock 
module fdivby25K (input clk, reset, output logic clkout);
	localparam [23:0] maxcount = 24'h0030D4; // 12.5 thoussand in hex
	logic pulse;
	logic [23:0] count;
	
	// Perimiterized Counter Module instansiation
	pmcntr #(24) pmcntr1 (clk, reset, maxcount, count, pulse);
	
	always_ff @ (posedge reset or posedge pulse) begin
	if(reset) begin
		clkout = 1'b0;
	end
	else
		// toggles clkout every 12.5M clock cycles, 50% duty cycle
		clkout = ~clkout;
	end
	
endmodule

// Perimiterized Counter Module from old lab
module pmcntr #(parameter siz=5) (input clk, reset,
	input [siz-1:0] count_max, output logic [siz-1:0] count,
	output logic clkout);
	
	always_ff @ (posedge clk or posedge reset)
		if (reset) begin
			count <= {siz{1'b0}};
			clkout <= 1'b0;
			end
		else if (count<count_max)
			count <= count + {{(siz-1){1'b0}},1'b1};
		else begin
			count <= {siz{1'b0}};
			clkout <= ~clkout;
		end
endmodule