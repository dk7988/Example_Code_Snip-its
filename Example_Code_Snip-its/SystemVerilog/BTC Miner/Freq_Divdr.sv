module freq_dvid_1_5(input logic clk, reset, output logic Qout );
logic D0=1'b1, Q0, Q1;
	always_ff @(clk, reset) begin
	if(reset==1'b0)
		Q0 <= 1'b0;
	else
		Q0 <= D0;
	end

	assign D0 = ~Q0;

	always_ff @(negedge clk or negedge reset) begin
	if(reset==1'b0)
		Q1 <= 1'b0;
	else
		Q1 <= Q0;
	end

	assign Qout = Q1 | Q0;
endmodule


module freq_dvid_2(input logic clk, reset, output logic Qout );
logic D=1'b1, Q;
	always_ff @(clk, reset) begin
		if(reset==1'b0)
			Q <= 1'b0;
		else
		Q <= D;
	end

assign D = ~Q;
assign Qout = Q;

endmodule


module freq_dvid_3(input logic clk, reset, output logic Qout );
logic D0=1'b1, Q0, Q1, Q2;
always_ff @(clk, reset) begin
  if(reset==1'b0)
    Q0 <= 1'b0;
   else
    Q0 <= D0;
end

always_ff @(clk, reset) begin
  if(reset==1'b0)
    Q1 <= 1'b0;
   else
    Q1 <= Q0;
end

always_ff @(negedge clk or negedge reset) begin
  if(reset==1'b0)
    Q2 <= 1'b0;
   else
    Q2 <=  Q1;
end

assign D0 = ~(Q0 & Q1);
assign Qout = Q1 | Q2;

endmodule






module freq_dvid_4(input logic clk, reset, output logic Qout );
logic D0=1'b1, Q0, Q1;

always_ff @(posedge clk or negedge reset) begin
  if(reset)
    Q0 <= 1'b0;
   else
    Q0 <= D0;
end
assign D0 = ~Q0;

always_ff @(posedge Q0 or negedge reset) begin
  if(reset)
    Q1 <= 1'b0;
   else
    Q1 <= D1;
end

assign D1 = ~Q1;
assign Qout = Q1;

endmodule







module Clock_Tick_2HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b1;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd20000000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule




module Clock_Tick_10Mhz(input logic clk_in, r, output logic clk_out);
logic[2:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 3'd0;
		clk_out = 1'b1;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 3'd5) begin
			clk_out = ~clk_out;
			cnt = 3'd0;
		end
	end
end
endmodule


module Clock_Tick_55HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b1;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd900000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule


module Clock_Tick_25HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b1;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd2000000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule



module Clock_Tick_16_6HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b1;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd3000000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule




module Clock_Tick_10HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b0;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd5000000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule


module Clock_Tick_5HZ(input logic clk_in, r, output logic clk_out);
logic[25:0] cnt;
always_ff @(posedge clk_in or posedge r) begin
	if(r==1)begin
		cnt = 26'd0;
		clk_out = 1'b0;
		end
	else begin
		cnt = cnt + 1'b1 ;
		if(cnt == 26'd10000000) begin
			clk_out = ~clk_out;
			cnt = 26'd0;
		end
	end
end
endmodule



//50,000,000 / 20,000,000 = 2.5hz
//50,000,000 / 5 = 10Mhz
//50,000,000 / 900,000  = 55.55hz
//50,000,000 / 2,000,000 = 25hz
//50,000,000 / 3,000,000 = 16.6hz
//50,000,000 / 5,000,000 = 10hz
//50,000,000 / 10,000,000 = 5hz