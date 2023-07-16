module ECM_UART_Wrpr__TB();

	logic[639:0] blk_hdr=640'b0;

	logic system_clk, hold_state_pin, rstn=1'b0, rx_pin, _frcd_loop_exit = 1'b0, tx_pin = 1'b0, frcd_loop_exit=1'b0, exited=1'b0, _exited=1'b0;
	logic [31:0] header0 [19:0];

	logic [7:0] count = 0;
	logic [7:0] buff [0:3];
	
	logic [7:0] cmd = 8'b00000000;
	
	
	function [9:0] pac(input [7:0] a);
		begin
			pac = {1'b1,a,1'b0};
		end
	endfunction
	

	ECM_UART_Wrpr inst0(system_clk, rstn, hold_state_pin, rx_pin, tx_pin, frcd_loop_exit,exited);
	
	always @(posedge frcd_loop_exit)begin
		_frcd_loop_exit <= 1'b1;
	end
	
	always @(posedge exited)begin
		_exited <= 1'b1;
	end

	initial begin
		rstn=1'b0; hold_state_pin=0; _frcd_loop_exit = 1'b0; frcd_loop_exit=1'b0; tx_pin = 1'b0;
		//blk_hdr = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F0119C0610833; // -5000 
		//blk_hdr = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011990690833; // -3000 
		//blk_hdr = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F0119786D0833; // -2000 
		//blk_hdr = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011960710833; // -1000  
		blk_hdr = 640'h0200000017975B97C18ED1F7E255ADF297599B55330EDAB87803C81701000000000000008A97295A2747B4F1A0B3948DF3990344C0E19FA6B2B92B3A19C8E6BADC141787358B0553535F011946750833; // 41750833 <<---- nonce as been adjusted so nonce = nonce_blk_fnd - 8 (meaning 7 nonce+1 then blk_fnd)
        //																																										 48750833
		header0='{blk_hdr[639:608], blk_hdr[607:576], blk_hdr[575:544], blk_hdr[543:512],
				  blk_hdr[511:480], blk_hdr[479:448], blk_hdr[447:416], blk_hdr[415:384],
				  blk_hdr[383:352], blk_hdr[351:320], blk_hdr[319:288], blk_hdr[287:256],
				  blk_hdr[255:224], blk_hdr[223:192], blk_hdr[191:160], blk_hdr[159:128],
				  blk_hdr[127:96], blk_hdr[95:64], blk_hdr[63:32], blk_hdr[31:0]};
				  

		rx_pin = 1; system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;
		system_clk = 1; #1;
		system_clk = 0; #1;

		count = 0;
		
		// Send Command Byte
		for(int k=0; k<10; k=k+1) begin
			rx_pin <= pac(cmd)[k];
			for(int j=0; j<87; j=j+1) begin
				system_clk = 1; #1;
				system_clk = 0; #1;
			end
		end


		//  Send Data (80 bytes)
		if(cmd < 8'h8) begin
			for(int i=19; i>-1; i=i-1) begin
				buff[0] <= header0[i][31:24];
				buff[1] <= header0[i][23:16];
				buff[2] <= header0[i][15:8];
				buff[3] <= header0[i][7:0];
				for(int j=0; j<4; j = j+1) begin
					for(int k=0; k<10; k=k+1) begin
						rx_pin <= pac(buff[j])[k];
						for(int m=0; m<87; m=m+1) begin
							system_clk = 1; #1;
							system_clk = 0; #1;
						end
					end
				end
			end
		end	

	$display("_exited: %h",_exited);
		while (_exited==1'b0 && _frcd_loop_exit == 1'b0)begin
			system_clk <= 1; #1;
			system_clk <= 0; #1;
		end
		
		for(int j=0; j<25000; j=j+1) begin
			system_clk = 1; #1;
			system_clk = 0; #1;
		end

		
		if (_exited==1'b1)begin
			$display("");
			$display("");
			$display("Mining code exited on it's own");
		end
		if (_frcd_loop_exit==1'b1)begin
			$display("");
			$display("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			$display("");
			$display("Mining code was FORCED TO EXIT");
			$display("");
			$display("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		end
		
		$display("");
		$display("---->>>>>--------***********---------<<<<<---");
		$display("Jumped out of hold while loop and about to exit initial block");
		$display("---->>>>>--------***********---------<<<<<---");
		$display("");
	end
endmodule