USE master

IF OBJECT_ID('Db_SHA256') IS NOT NULL
    DROP function Db_SHA256
GO
CREATE function Db_SHA256 ( @__V VARBINARY(4),@__PHB VARBINARY(32),@__RH VARBINARY(32),@__T VARCHAR(20),@__B VARBINARY(4),@__N VARBINARY(4))
RETURNS @_TBL TABLE (HASH_OUT BINARY(32))
BEGIN
DECLARE
	@_V VARBINARY(4)=(select top(1) little_END from littleEndian_4(@__V)),
	@_PHB VARBINARY(32)=(select top(1) little_END from littleEndian_32(@__PHB)),
	@_RH VARBINARY(32)=(select top(1) little_END from littleEndian_32(@__RH)),
	@_T VARBINARY(4)=(select top(1) little_END from littleEndian_32((SELECT CONVERT(VARBINARY(8), 
													(SELECT DATEDIFF(s, '1970-01-01 00:00:00', DATEADD(hh,7,CONVERT(DATETIME,@__T)) ))  ---<<----------- NOTE: REQUIRES GMT TIME STAMP ACCOUNTING FOR az TIME DIFFERANCE
	 )))),
	@_B VARBINARY(4)=(select top(1) little_END from littleEndian_4(@__B)),
	@_N VARBINARY(4)=(select top(1) little_END from littleEndian_4(@__N))

INSERT INTO @_TBL select  cast(reverse(HASHBYTES('SHA2_256', HASHBYTES('SHA2_256',CONVERT(VARBINARY(1024),CONCAT(@_V,@_PHB,@_RH,@_T,@_B,@_N)) ))) AS BINARY(32)) 

RETURN
END
GO;

--btc BLOCK 500,000
--Block 500000
--SELECT top(1) HASH_OUT FROM Db_SHA256( 
--										0x20000000,
--										0x0000000000000000007962066dcd6675830883516bcf40047d42740a85eb2919,
--										0x31951c69428a95a46b517ffb0de12fec1bd0b2392aec07b64573e03ded31621f,
--										'2017-12-18 18:35:25', --<<--- GMT time stamp
--										0x18009645,
--										0x5cfc9955)


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


IF OBJECT_ID('Db_SHA256_2') IS NOT NULL
    DROP function Db_SHA256_2
GO
CREATE function Db_SHA256_2 ( @__V VARBINARY(4),@__PHB VARBINARY(32),@__RH VARBINARY(32),@__T VARCHAR(20),@__B bigint,@__N bigint)
RETURNS @_TBL TABLE (HASH_OUT BINARY(32))
BEGIN
DECLARE
	@_V VARBINARY(4)=(select top(1) little_END from littleEndian_4(@__V)),
	@_PHB VARBINARY(32)=(select top(1) little_END from littleEndian_32(@__PHB)),
	@_RH VARBINARY(32)=(select top(1) little_END from littleEndian_32(@__RH)),
	@_T VARBINARY(4)=(select top(1) little_END from littleEndian_32((SELECT CONVERT(VARBINARY(8), 
													(SELECT DATEDIFF(s, '1970-01-01 00:00:00', DATEADD(hh,7,CONVERT(DATETIME,@__T)) ))  ---<<----------- NOTE: REQUIRES GMT TIME STAMP ACCOUNTING FOR az TIME DIFFERANCE
	 )))),
	@_B VARBINARY(4)=(select top(1) little_END from littleEndian_32((SELECT CONVERT(VARBINARY(8),@__B)))),
	@_N VARBINARY(4)=(select top(1) little_END from littleEndian_32((SELECT CONVERT(VARBINARY(8),@__N))))

INSERT INTO @_TBL select  cast(reverse(HASHBYTES('SHA2_256', HASHBYTES('SHA2_256',CONVERT(VARBINARY(1024),CONCAT(@_V,@_PHB,@_RH,@_T,@_B,@_N)) ))) AS BINARY(32)) 

RETURN
END
GO;

--btc BLOCK 700,000
--SELECT top(1) HASH_OUT FROM Db_SHA256_2( 0x3fffe004,0x0000000000000000000aa3ce000eb559f4143be419108134e0ce71042fc636eb, 0x1f8d213c864bfe9fb0098cecc3165cce407de88413741b0300d56ea0f4ec9c65,1631290472,386877668,2881644503)

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

IF OBJECT_ID('littleEndian_4') IS NOT NULL
    DROP function littleEndian_4
GO
CREATE function littleEndian_4 ( @_little VARBINARY(4))
RETURNS @_TBL TABLE (little_END BINARY(4))
BEGIN
INSERT INTO @_TBL select  cast(reverse(@_little) as binary(4))

RETURN
END
GO;

--select top(1) little_END from littleEndian_4(0x3fffe004)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



IF OBJECT_ID('littleEndian_32') IS NOT NULL
    DROP function littleEndian_32
GO
CREATE function littleEndian_32 ( @_little VARBINARY(32))
RETURNS @_TBL TABLE (little_END BINARY(32))
BEGIN
INSERT INTO @_TBL select  cast(reverse(@_little) as binary(32))

RETURN
END
GO;

--select top(1) little_END from littleEndian_32(0x0000000000000000000aa3ce000eb559f4143be419108134e0ce71042fc636eb)


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------