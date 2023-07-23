use[ICS_REV13_SHEET_NAMING] 

IF OBJECT_ID('CALCULATE_SHEET_NAME') IS NOT NULL
    DROP function CALCULATE_SHEET_NAME
GO
CREATE function CALCULATE_SHEET_NAME(@_SHT_INFO SHEET_INFO_TBL readonly)
returns @_Rtn_Calutd_Sht_Nme table(ID int IDENTITY(0,1),CALCULATED_SHEET_NAME varchar(516),TITLE_1 VARCHAR(255),TITLE_2 VARCHAR(255),TITLE_3 VARCHAR(255),TITLE_4 VARCHAR(255))
begin
declare @_SHT_INFO_2 SHEET_INFO_TBL
DECLARE @t table (CALCULATED_SHEET_NAME varchar(516))
declare @_SHT_NME varchar(255)
insert into @_SHT_INFO_2(SITE,BUILDING,DISCPLINE,SUB_DISCPLINE,SHEET_TYPE,LEVEL,LEVEL_TYPE,SUB_SHEET_TYPE,SECTOR,SECTOR_SCALE,SUB_SECTOR_1,SUB_SECTOR_2,SUB_SECTOR_3,UPN_GROUP,UPN_SUB_GROUP, DIAGRAM_TYPE, NUMBER_OF_SHEETS)
select SITE,BUILDING,DISCPLINE,SUB_DISCPLINE,SHEET_TYPE,LEVEL,LEVEL_TYPE,SUB_SHEET_TYPE,SECTOR,SECTOR_SCALE,SUB_SECTOR_1,SUB_SECTOR_2,SUB_SECTOR_3,UPN_GROUP,UPN_SUB_GROUP,DIAGRAM_TYPE,NUMBER_OF_SHEETS from @_SHT_INFO
while ((select count(*) from @_SHT_INFO_2)>0) begin
declare @_ID int = (select top(1) ID from @_SHT_INFO_2)
declare
@_T1 varchar(255) ='NA',@_T2 varchar(255) ='NA',@_T3 varchar(255) ='NA',@_T4 varchar(255) ='NA',@_FLE_NME varchar(255),
@_SITE varchar(30) = (select SITE from @_SHT_INFO_2 where ID = @_ID),
@_BUILDING varchar(35) = (select BUILDING from @_SHT_INFO_2 where ID = @_ID),
@_DISCPLINE varchar(50) = (select DISCPLINE from @_SHT_INFO_2 where ID = @_ID),
@_SUB_DISCPLINE varchar(255) = (select SUB_DISCPLINE from @_SHT_INFO_2 where ID = @_ID),
@_SHEET_TYPE varchar(255) = (select SHEET_TYPE from @_SHT_INFO_2 where ID = @_ID),
@_LEVEL varchar(255) = (select LEVEL from @_SHT_INFO_2 where ID = @_ID),
@_LEVEL_TYPE varchar(255) = (select LEVEL_TYPE from @_SHT_INFO_2 where ID = @_ID),
@_SUB_SHEET_TYPE varchar(255) = (select SUB_SHEET_TYPE from @_SHT_INFO_2 where ID = @_ID),
@_SECTOR varchar(10) = (select SECTOR from @_SHT_INFO_2 where ID = @_ID),
@_SECTOR_SCALE varchar(15) = (select SECTOR_SCALE from @_SHT_INFO_2 where ID = @_ID),
@_SUB_SECTOR_1 varchar(10) = (select SUB_SECTOR_1 from @_SHT_INFO_2 where ID = @_ID),
@_SUB_SECTOR_2 varchar(10) = (select SUB_SECTOR_2 from @_SHT_INFO_2 where ID = @_ID),
@_SUB_SECTOR_3 varchar(10) = (select SUB_SECTOR_3 from @_SHT_INFO_2 where ID = @_ID),
@_UPN_GROUP varchar(255) = (select UPN_GROUP from @_SHT_INFO_2 where ID = @_ID),
@_UPN_SUB_GROUP varchar(255) = (select UPN_SUB_GROUP from @_SHT_INFO_2 where ID = @_ID),
@_DIAGRAM_TYPE varchar(255) = (select DIAGRAM_TYPE from @_SHT_INFO_2 where ID = @_ID),
@_NUMBER_OF_SHEETS INT = (select NUMBER_OF_SHEETS from @_SHT_INFO_2 where ID = @_ID),
@_Supplier_Code varchar(3) = 'ID_',
@_Model_Type_Code varchar(2) = 'DM'

declare
@_ICS_SITE_CODE varchar(7) = (select top(1) BUILDING_SHEET_CODE from Get_ICS_Site_Code(@_SITE)),
@_ICS_BUILDING_CODE varchar(7) = (select top(1) BUILDING_SHEET_CODE from Get_ICS_Building_Code(@_SITE,@_BUILDING)),
@_ICS_DISCPLINE_CODE varchar(7) = (select top(1) DISCIPLINE_CODE from Get_ICS_Discpline_Code(@_DISCPLINE)),
@_ICS_SUB_DISCPLINE_CODE varchar(7) = (select top(1) DISCIPLINE_CODE from Get_ICS_Sub_Discpline_Code(@_SUB_DISCPLINE)),
@_ICS_SHEET_TYPE_CODE varchar(7) = (select top(1) SHEET_CODE from Get_ICS_Sheet_Type_Code(@_SHEET_TYPE)),
@_ICS_LEVEL_CODE varchar(7) = (select top(1) LEVEL_CODE from Get_ICS_Level_Code(@_LEVEL)),
@_ICS_LEVEL_TYPE_CODE varchar(7) = (select top(1) LEVEL_TYPE_CODE from Get_ICS_Level_Type_Code(@_LEVEL_TYPE)),
@_ICS_LEVEL_VIEW varchar(7) = 'A',
@_ICS_SUB_SHEET_TYPE_CODE varchar(25) = (select top(1) replace(SHEET_CODE_RANGE,'-','~') from Get_ICS_Sub_Sheet_Type_Code(@_DISCPLINE,@_SUB_SHEET_TYPE)),
@_ICS_SECTOR_CODE varchar(7) = (select * from Get_ICS_Sector_Code(@_SECTOR,@_SECTOR_SCALE,@_SUB_SECTOR_1,@_SUB_SECTOR_2,@_SUB_SECTOR_3)),
@_ICS_UPN_GROUP_CODE varchar(7) = (select top(1) UPN from Get_UPN_Code(@_UPN_GROUP,@_UPN_SUB_GROUP)),
@_DIAGRAM_TYPE_CODE varchar(7) = (select top(1) DIAGRAM_TYPE_CODE from Get_ICS_Diagram_Type_Code(@_DIAGRAM_TYPE)),
@_ICS_NUMBER_OF_SHEETS INT = (select NUMBER_OF_SHEETS from @_SHT_INFO_2 where ID = @_ID)

if @_ICS_SHEET_TYPE_CODE = 1 begin
--    Navisworks Saved Viewpoint
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
values('Have NOT written a path for this SHEET TYPE yet - Navisworks Saved Viewpoint -',@_T1,@_T2,@_T3,@_T4)
end
else if @_ICS_SHEET_TYPE_CODE = 2 begin
--    Revit File/Navisworks export
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
values('Have NOT written a path for this SHEET TYPE yet - Revit File/Navisworks export -',@_T1,@_T2,@_T3,@_T4)
end


else if @_ICS_SHEET_TYPE_CODE = 3 begin
--    Xref File
set @_SHT_NME = 'X-'+@_ICS_SITE_CODE+'-'+@_ICS_BUILDING_CODE+'-'+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW+'-'+@_ICS_UPN_GROUP_CODE+'-'+@_ICS_SUB_DISCPLINE_CODE+'-'+
                @_ICS_SECTOR_CODE+'-'+@_Supplier_Code+'-'+@_Model_Type_Code
				
insert into @t(CALCULATED_SHEET_NAME) SELECT RtnVal from CALCULATE_MULTI_SHEET_NAMES(@_SHT_NME,@_ICS_NUMBER_OF_SHEETS,@_ICS_SHEET_TYPE_CODE)

while ((select count(*) from @t)>0) begin
set @_FLE_NME = (select top(1)CALCULATED_SHEET_NAME from @t)
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
VALUES(@_FLE_NME,@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)

delete @t where CALCULATED_SHEET_NAME = @_FLE_NME
--values(@_SHT_NME)
--values('Have NOT written a path for this SHEET TYPE yet - Xref File -')
end
end

else if @_ICS_SHEET_TYPE_CODE = 4 begin
--    Plan Sheets
set @_SHT_NME = @_ICS_BUILDING_CODE+'-'+@_ICS_SUB_DISCPLINE_CODE+'-'+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW+'-'+@_ICS_SECTOR_CODE
set @_T1 = @_ICS_BUILDING_CODE+' - '+@_DISCPLINE -- = FS1 - ARCHITECTURAL
set @_T2 = upper(@_LEVEL)+' - '+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW -- = Fourth Level - 40A
set @_T3 = 'SECTOR '+@_ICS_SECTOR_CODE -- = SECTOR A04B0
set @_T4 = UPPER(@_SUB_DISCPLINE)+ ' PLAN' -- = Architectural Walls/Doors

insert into @t(CALCULATED_SHEET_NAME) SELECT RtnVal from CALCULATE_MULTI_SHEET_NAMES(@_SHT_NME,@_ICS_NUMBER_OF_SHEETS,@_ICS_SHEET_TYPE_CODE)

while ((select count(*) from @t)>0) begin
set @_FLE_NME = (select top(1)CALCULATED_SHEET_NAME from @t)
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
VALUES(@_FLE_NME,@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)

delete @t where CALCULATED_SHEET_NAME = @_FLE_NME
--values(@_SHT_NME)
--values('Have NOT written a path for this SHEET TYPE yet - Plan Sheets -')
end
end


else if @_ICS_SHEET_TYPE_CODE = 5 begin
--    Partial Plan Sheets
set @_SHT_NME = @_ICS_BUILDING_CODE+'-'+@_ICS_SUB_DISCPLINE_CODE+'-'+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW+'-'+@_ICS_SECTOR_CODE +'-'+@_ICS_SUB_SHEET_TYPE_CODE
set @_T1 = @_ICS_BUILDING_CODE+' - '+@_DISCPLINE -- = FS1 - ARCHITECTURAL
set @_T2 = upper(@_LEVEL)+' - '+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW +', '+'SECTOR '+@_ICS_SECTOR_CODE -- = Fourth Level - 40A, SECTOR A04B0
set @_T3 = '** ENTER COLUMN CALL OUTS HERE **'
set @_T4 = 'PARTIAL '+UPPER(@_SUB_DISCPLINE)+' PLAN' -- = PARTIAL Architectural Walls/Doors PLAN

insert into @t(CALCULATED_SHEET_NAME) SELECT RtnVal from CALCULATE_MULTI_SHEET_NAMES(@_SHT_NME,@_ICS_NUMBER_OF_SHEETS,@_ICS_SHEET_TYPE_CODE)

while ((select count(*) from @t)>0) begin
set @_FLE_NME = (select top(1)CALCULATED_SHEET_NAME from @t)
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
VALUES(@_FLE_NME,@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)

delete @t where CALCULATED_SHEET_NAME = @_FLE_NME
--values(@_SHT_NME)
--values('Have NOT written a path for this SHEET TYPE yet - Partial Plan Sheets -')
end
end

else if @_ICS_SHEET_TYPE_CODE = 6 begin
--    P&ID/PFD/PDS/AFD Sheets
set @_SHT_NME = @_ICS_BUILDING_CODE+'-'+@_ICS_UPN_GROUP_CODE+'-'+@_ICS_SUB_DISCPLINE_CODE+'-'+@_DIAGRAM_TYPE_CODE
set @_T1 = @_ICS_BUILDING_CODE+' - '+@_DISCPLINE -- = FS1 - MECHANIAL
set @_T2 = @_UPN_GROUP +' - '+ @_UPN_SUB_GROUP -- = HVAC - OVERALL SYSTEM (GAH)
set @_T3 = UPPER(@_SUB_DISCPLINE) +' - '+ UPPER(@_DIAGRAM_TYPE) -- = HVAC Systems - SECONDARY SYSTEM
set @_T4 = 'SYSTEM P&ID'

insert into @t(CALCULATED_SHEET_NAME) SELECT RtnVal from CALCULATE_MULTI_SHEET_NAMES(@_SHT_NME,@_ICS_NUMBER_OF_SHEETS,@_ICS_SHEET_TYPE_CODE)

while ((select count(*) from @t)>0) begin
set @_FLE_NME = (select top(1)CALCULATED_SHEET_NAME from @t)
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
VALUES(@_FLE_NME,@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)

delete @t where CALCULATED_SHEET_NAME = @_FLE_NME
--values(@_SHT_NME)
--values('Have NOT written a path for this SHEET TYPE yet - P&ID/PFD/PDS/AFD Sheets -')
end
end


else if @_ICS_SHEET_TYPE_CODE = 7 begin
--    Non-Plan Sheets
set @_SHT_NME = @_ICS_BUILDING_CODE+'-'+@_ICS_SUB_DISCPLINE_CODE+'-'+@_ICS_SUB_SHEET_TYPE_CODE
set @_T1 = @_ICS_BUILDING_CODE+' - '+@_DISCPLINE -- = FS1 - ELECTRICAL
set @_T2 = 'LEVEL(S) '+@_ICS_LEVEL_CODE+@_ICS_LEVEL_TYPE_CODE+@_ICS_LEVEL_VIEW -- = LEVEL(S) 40A
set @_T3 = upper(@_SUB_SHEET_TYPE) -- = Power Monitoring
set @_T4 = '** ENTER MORE DESCRIPTIVE SHEET TYPE **'

insert into @t(CALCULATED_SHEET_NAME) SELECT RtnVal from CALCULATE_MULTI_SHEET_NAMES(@_SHT_NME,@_ICS_NUMBER_OF_SHEETS,@_ICS_SHEET_TYPE_CODE)

while ((select count(*) from @t)>0) begin
set @_FLE_NME = (select top(1)CALCULATED_SHEET_NAME from @t)
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
VALUES(@_FLE_NME,@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)

delete @t where CALCULATED_SHEET_NAME = @_FLE_NME
--values(@_SHT_NME)
--values('Have NOT written a path for this SHEET TYPE yet - Non-Plan Sheets -')
end
end

else if @_ICS_SHEET_TYPE_CODE = 8 begin
--    Navisworks NWD
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
values('Have NOT written a path for this SHEET TYPE yet - Navisworks NWD -',@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)
end
else if @_ICS_SHEET_TYPE_CODE = 9 begin
--    place holder for new sheet types
insert into @_Rtn_Calutd_Sht_Nme (CALCULATED_SHEET_NAME,TITLE_1,TITLE_2,TITLE_3,TITLE_4)
values('Have NOT written a path for this SHEET TYPE yet - place holder for new sheet types -',@_T1,@_T2,(select dbo.SmartTrim_Sheet_Type_Description(@_T3)),@_T4)
end

delete @_SHT_INFO_2 where ID = @_ID 
end

return

end

