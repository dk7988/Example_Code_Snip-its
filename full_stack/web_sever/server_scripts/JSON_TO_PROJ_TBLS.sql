USE[ID_Projects]
IF OBJECT_ID('JSON_TO_PROJ_TBLS') IS NOT NULL
    DROP type JSON_TO_PROJ_TBLS
GO
CREATE type JSON_TO_PROJ_TBLS as table (
_ID_PROJ_NUM varchar(128),
_CUST_DB_IDX_NUM varchar(100),
_CUST_PO_NUM varchar(100),
CUST_PROJ_NUM varchar(128),
CUST_DSGN_NUM varchar(100),
----------------------------------------------
_PROJ_DB_IDX_NUM varchar(100), 
_PROJ_NAME varchar(100), 
_PROJ_FILE_LOC varchar(256), 
_PROJ_TYPE varchar(100), 
_PROJ_STAGE varchar(100),
_ID_DESIGN_LD varchar(100),
_PROJ_BLD_IDX varchar(100),
_PROJ_CNTRCT_LVL_ID varchar(100),
PROJ_30_REVIEW varchar(10),
PROJ_60_REVIEW varchar(10),
PROJ_90_REVIEW varchar(10),
PROJ_IFC_REVIEW varchar(10),
CLNT_CONTCT_PRSN varchar(100),
PROJ_DEMO_CHAR VARCHAR(7),
PROJ_DEMO_STRG VARCHAR(15)
)
