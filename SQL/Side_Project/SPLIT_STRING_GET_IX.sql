USE DomSun
IF OBJECT_ID('SPLIT_STRING_GET_IX') IS NOT NULL
    DROP FUNCTION SPLIT_STRING_GET_IX
GO 
CREATE FUNCTION SPLIT_STRING_GET_IX (@_strg varchar(max),@_del VARCHAR(2),@_i int)
    RETURNS varchar(max)
BEGIN
DECLARE @_t TABLE (R_ID INT IDENTITY(0,1), VAL VARCHAR(MAX))
INSERT INTO @_T SELECT VALUE FROM string_split(@_strg,@_del)
RETURN (SELECT VAL FROM @_t WHERE R_ID = @_i)
END