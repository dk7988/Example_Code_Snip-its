Imports Minions

Public Class ShtDtls
    Private _Sht_DB_ID As String = ""
    Private _Disp As String = ""
    Private Shared _ShtName As String = ""
    Private _TBTit1 As String = ""
    Private _TBTit2 As String = ""
    Private _TBTit3 As String = ""
    Private _TBTit4 As String = ""
    Protected Shared _WrkId As String = ""
    Private _IfcDte As String = ""
    Private _ShtFlr As String = ""
    Private _TitBlkNme As String = ""
    Private _TitBlkLyOt As String = ""
    Private _Client_proj_num As String = ""
    Private _ShtHasVp As Boolean = False
    Private _IsNothing As Boolean = True
    'Private _ShtMkr As DsgnShtMkr = Nothing
    Private _TblIdx As Integer = -1
    Private _PsXrefs() As String
    Private _MsXrefs() As String
    Private _PsXrefLoc As String
    Private _MsXrefLoc As String
    Private _LSP_Loc As String = ""
    Private _vars() As class_vars
    Private _sht_dt As DataTable
    Private _Sht_Type As String
    Private _proj_name As String
    Private _milestone As String
    Private _cust_dsgn_num As String
    Public proj_has_dsgn_num As Boolean = False
    Protected Shared _CvrShtDtlsLoaded As Boolean = False
    Private _CvrShtDtls As CvrShtDtls

    Friend Enum VarType
        Para = 1
        Bool = 2
        Ar = 3
        Obj = 4
        Tbl = 5
    End Enum

    Protected Friend Structure class_vars
        Friend var_name As String
        Friend var_type As VarType
        Friend var_value As Object

        Friend Sub New(_var_name As String, _var_type As VarType, _var_value As Object)
            var_name = _var_name
            var_type = _var_type
            var_value = _var_value
        End Sub

        Public Function VarDump()
            Try

                Select Case var_type
                    Case = VarType.Para
                        Return var_name + " = " + IIf(Not var_value = "", var_value.ToString, " This var is empty") + vbNewLine

                    Case = VarType.Bool
                        Return var_name + " = " + var_value.ToString + vbNewLine

                    Case = VarType.Ar
                        Dim Ar_Strg As String = ""
                        Ar_Strg = Ar_Strg + "   " + var_name + ": "
                        Try
                            For ix As Integer = 0 To (var_value.Count - 1)
                                Ar_Strg = Ar_Strg + "       " + var_name + "(" + ix.ToString + ") = " + var_value(ix).ToString + vbNewLine
                            Next
                            Return Ar_Strg
                        Catch ex As ArgumentNullException
                            Return var_name + " = empty" + vbNewLine
                        Catch ex As Exception
                            Return ex.ToString + vbNewLine
                        End Try

                    Case = VarType.Obj
                        Return var_name + ": " + var_value.VarDump() + vbNewLine

                    Case = VarType.Tbl
                        Dim dt As DataTable = var_value
                        Dim dt_Strg As String = Get_dt_col_hrds(dt) + vbNewLine
                        For r As Integer = 0 To (dt.Rows.Count - 1)
                            For c As Integer = 0 To (dt.Columns.Count - 1)
                                dt_Strg = dt_Strg + dt.Rows(r).Item(c).ToString
                            Next
                            dt_Strg = dt_Strg + vbNewLine
                        Next

                        Return dt_Strg
                End Select
            Catch ex As Exception
            End Try

            Return Nothing
        End Function

        Private Function _Get_dt_col_hrds(dt As DataTable) As String()
            Dim names(dt.Columns.Count) As String
            Dim i As Integer = 0
            For Each column As DataColumn In dt.Columns
                names(i) = column.ColumnName
                i += 1
            Next
            Return names
        End Function

        Private Function Get_dt_col_hrds(dt As DataTable) As String
            Dim rtn_val As String = "  "

            For i As Integer = 0 To (dt.Columns.Count - 1)
                If rtn_val.TrimEnd.TrimStart = "" Then
                    rtn_val = CType(dt.Columns(i), DataColumn).ColumnName + "  |  "
                Else
                    rtn_val = rtn_val + CType(dt.Columns(i), DataColumn).ColumnName + "  |  "
                End If
            Next

            Return rtn_val
        End Function


    End Structure

    Property ShtFlr As String
        Get
            Return _ShtFlr
        End Get
        Set(value As String)
            IsNothing = False
            _ShtFlr = value
        End Set
    End Property

    Property Disp As String
        Get
            Return _Disp
        End Get
        Set(value As String)
            IsNothing = False
            _Disp = value
        End Set
    End Property

    Property ShtName As String
        Get
            Return _ShtName
        End Get
        Set(value As String)
            IsNothing = False
            _ShtName = value
        End Set
    End Property

    Property TBTit1 As String
        Get
            Return _TBTit1
        End Get
        Set(value As String)
            IsNothing = False
            _TBTit1 = value
        End Set
    End Property

    Property TBTit2 As String
        Get
            Return _TBTit2
        End Get
        Set(value As String)
            IsNothing = False
            _TBTit2 = value
        End Set
    End Property

    Property TBTit3 As String
        Get
            Return _TBTit3
        End Get
        Set(value As String)
            IsNothing = False
            _TBTit3 = value
        End Set
    End Property

    Property TBTit4 As String
        Get
            Return _TBTit4
        End Get
        Set(value As String)
            IsNothing = False
            _TBTit4 = value
        End Set
    End Property

    Property WrkId As String
        Get
            Return _WrkId
        End Get
        Set(value As String)
            IsNothing = False
            _WrkId = value
        End Set
    End Property

    Property Client_proj_num As String
        Get
            Return _Client_proj_num
        End Get
        Set(value As String)
            IsNothing = False
            _Client_proj_num = value
        End Set
    End Property

    Property IfcDte As String
        Get
            Return _IfcDte
        End Get
        Set(value As String)
            IsNothing = False
            _IfcDte = value
        End Set
    End Property

    Property TitBlkNme As String
        Get
            Return _TitBlkNme
        End Get
        Set(value As String)
            IsNothing = False
            _TitBlkNme = value
        End Set
    End Property

    Property TitBlkLyOt As String
        Get
            Return _TitBlkLyOt
        End Get
        Set(value As String)
            IsNothing = False
            _TitBlkLyOt = value
        End Set
    End Property

    Property ShtHasVp As Boolean
        Get
            Return _ShtHasVp
        End Get
        Set(value As Boolean)
            IsNothing = False
            _ShtHasVp = value
        End Set
    End Property

    Property IsNothing As Boolean
        Get
            Return _IsNothing
        End Get
        Set(value As Boolean)
            _IsNothing = value
        End Set
    End Property

    Property PsXrefs As String()
        Get
            Return _PsXrefs
        End Get
        Set(value As String())
            If (value.Count - 1 >= 0) Then
                For i As Integer = 0 To (value.Count - 1)
                    _PsXrefs = Add2Ar(value(i), _PsXrefs)
                Next
            Else
                _PsXrefs = Add2Ar(value(0), _PsXrefs)
            End If
        End Set
    End Property

    Property MsXrefs As String()
        Get
            Return _MsXrefs
        End Get
        Set(value As String())
            If (value.Count - 1 >= 0) Then
                For i As Integer = 0 To (value.Count - 1)
                    _MsXrefs = Add2Ar(value(i), _MsXrefs)
                Next
            Else
                _MsXrefs = Add2Ar(value(0), _MsXrefs)
            End If
        End Set
    End Property

    Property PsXrefLoc As String
        Get
            Return _PsXrefLoc
        End Get
        Set(value As String)
            IsNothing = False
            _PsXrefLoc = value
        End Set
    End Property

    Property MsXrefLoc As String
        Get
            Return _MsXrefLoc
        End Get
        Set(value As String)
            IsNothing = False
            _MsXrefLoc = value
        End Set
    End Property

    ReadOnly Property sht_dt As DataTable
        Get
            Return _sht_dt
        End Get
    End Property

    Property Sht_type As String
        Get
            Return _sht_type
        End Get
        Set(value As String)
            _sht_type = value
        End Set
    End Property

    Property proj_name As String
        Get
            Return _proj_name
        End Get
        Set(value As String)
            _proj_name = value
        End Set
    End Property

    Property milestone As String
        Get
            Return _milestone
        End Get
        Set(value As String)
            _milestone = value
        End Set
    End Property

    Property cust_dsgn_num As String
        Get
            Return _cust_dsgn_num
        End Get
        Set(value As String)
            _cust_dsgn_num = value
        End Set
    End Property

    Property LSP_Loc As String
        Get
            Return _LSP_Loc
        End Get
        Set(value As String)
            _LSP_Loc = value
        End Set
    End Property

    Property CoverShtDtls As CvrShtDtls
        Get
            Return _CvrShtDtls
        End Get
        Set(value As CvrShtDtls)
            _CvrShtDtls = value
        End Set
    End Property

    Private Function Add2Ar(_Value As Object, Ar() As String)
        Try
            Dim Ar2() = Ar
            Dim idx As Integer = Ar.Count + 1 - 1
            ReDim Ar(idx)
            For i As Integer = 0 To (Ar2.Count - 1)
                Ar(i) = Ar2(i)
            Next
            Ar(idx) = _Value
        Catch NullVal As ArgumentNullException
            ReDim Ar(0)
            Ar(0) = _Value
        Catch ex As Exception
            Throw ex
        End Try
        Return Ar
    End Function


    Public Sub New(sht_name As String, tit_1 As String, tit_2 As String, tit_3 As String, tit_4 As String, id_proj_num As String,
                                                                Clnt_proj_num As String, dis As String, ifc_dt As String)
        ShtName = sht_name
        TBTit1 = tit_1
        TBTit2 = tit_2
        TBTit3 = tit_3
        TBTit4 = tit_4
        WrkId = id_proj_num
        Disp = dis
        IfcDte = ifc_dt
        Client_proj_num = Clnt_proj_num
    End Sub

    Public Sub New(id_proj_num As String, acad_sht_cmd_dt As DataTable)
        _sht_dt = acad_sht_cmd_dt
        With acad_sht_cmd_dt.Rows(0)
            Sht_type = Minions.File_Minion.Steve.GetFileName(.Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.COPY_FROM)).Split(".")(0).ToString.ToUpper.TrimEnd.TrimStart
            If Sht_type Like "*_*" Then
                Sht_type = Sht_type.Split("_")(1)
            End If
            WrkId = id_proj_num
            ShtName = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.SHT_NAME)
            Disp = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.DISIP)
            TBTit1 = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.TIT_1)
            TBTit2 = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.TIT_2)
            TBTit3 = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.TIT_3)
            TBTit4 = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.TIT_4)
            TitBlkNme = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.ACAD_TIT_BLK_NME)
            TitBlkLyOt = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.ACAD_LAYOUT_TAB)
            ShtFlr = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.SHT_FLR)
            PsXrefLoc = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.PS_XREF_LOC)
            MsXrefLoc = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.MS_XREF_LOC)
            PsXrefs = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.PS_XREFs).ToString.Split(",")
            MsXrefs = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.MS_XREFs).ToString.Split(",")
            IfcDte = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.IFC_DATE)
            Client_proj_num = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.CLNT_PROJ_NUM)
            If Client_proj_num Like "*~*" Then
                cust_dsgn_num = Client_proj_num.Split("~")(1)
                Client_proj_num = Client_proj_num.Split("~")(0)
                proj_has_dsgn_num = True
            Else
                cust_dsgn_num = "UNKNOWN"
            End If
            ShtHasVp = Nothing
            proj_name = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.PROJ_NAME)
            milestone = .Item(Sql_Minion.Mike.acad_sht_cmd_tbl_cols.MILESTONE)
        End With
        _CvrShtDtls = New CvrShtDtls()

        _vars = {New class_vars("_Sht_DB_ID", VarType.Para, _Sht_DB_ID),
                 New class_vars("_Sht_Type", VarType.Para, _Sht_Type),
                 New class_vars("_WrkId", VarType.Para, _WrkId),
                 New class_vars("_ShtName", VarType.Para, _ShtName),
                 New class_vars("_Disp", VarType.Para, _Disp),
                 New class_vars("_TBTit1", VarType.Para, _TBTit1),
                 New class_vars("_TBTit2", VarType.Para, _TBTit2),
                 New class_vars("_TBTit3", VarType.Para, _TBTit3),
                 New class_vars("_TBTit4", VarType.Para, _TBTit4),
                 New class_vars("_TitBlkNme", VarType.Para, _TitBlkNme),
                 New class_vars("_TitBlkLyOt", VarType.Para, _TitBlkLyOt),
                 New class_vars("_ShtFlr", VarType.Para, _ShtFlr),
                 New class_vars("_PsXrefLoc", VarType.Para, _PsXrefLoc),
                 New class_vars("_MsXrefLoc", VarType.Para, _MsXrefLoc),
                 New class_vars("_PsXrefs", VarType.Ar, _PsXrefs),
                 New class_vars("_MsXrefs", VarType.Ar, _MsXrefs),
                 New class_vars("_IfcDte", VarType.Para, _IfcDte),
                 New class_vars("_Client_proj_num", VarType.Para, _Client_proj_num),
                 New class_vars("_cust_dsgn_num", VarType.Para, _cust_dsgn_num),
                 New class_vars("proj_has_dsgn_num", VarType.Bool, proj_has_dsgn_num),
                 New class_vars("_ShtHasVp", VarType.Bool, _ShtHasVp),
                 New class_vars("_IsNothing", VarType.Bool, _IsNothing),
                 New class_vars("_proj_name", VarType.Para, _proj_name),
                 New class_vars("_milestone", VarType.Para, _milestone),
                 New class_vars("_CvrShtDtls", VarType.Obj, _CvrShtDtls)}

    End Sub

    Public Function get_sht_prop(i As Sql_Minion.Mike.acad_sht_cmd_tbl_cols) As String
        Return _sht_dt.Rows(0).Item(i).ToString
    End Function

    Public Sub load_cover_sheet_details(minions_mangr As Gru)
        If Not WrkId = "" Then
            _CvrShtDtls.load_cover_sheet_details(minions_mangr)
        End If
    End Sub

    Public Function GetTitleBlockFields() As String()
        Return {TBTit1, TBTit2, TBTit3, TBTit4}
    End Function


    Public Class CvrShtDtls
            Private _vars() As class_vars
            Private _ProjShtLst_dt As DataTable
            Private _CvrCnstrnDtls_dt As DataTable
            Private _ProjShtLst_dt_row_idx As Integer = 0

        Public Enum Cover_Sht_Constr_Dtls
            Cvr_Sht_Constrct_Dtl__Start_Pt = 0
            Cvr_Sht_Constrct_Dtl__End_Pt = 1
            Cvr_Sht_Constrct_Dtl__Height = 2
            Cvr_Sht_Constrct_Dtl__Width = 3
            Cvr_Sht_Constrct_Dtl__X_Dist_Betwn_Lists = 4
            Cvr_Sht_Constrct_Dtl__Num_Of_Lists_Per_Sheet = 5
            Cvr_Sht_Constrct_Dtl__Block_Location_On_System = 6
            Cvr_Sht_Constrct_Dtl__Discipline_Header_Group_Block = 7
            Cvr_Sht_Constrct_Dtl__Table_Header_Block = 8
            Cvr_Sht_Constrct_Dtl__Table_Row_Block = 9
            Cvr_Sht_Constrct_Dtl__Table_Header_Row_Height = 10
            Cvr_Sht_Constrct_Dtl__Table_Header_Row_Width = 11
            Cvr_Sht_Constrct_Dtl__Table_Row_Height = 12
            Cvr_Sht_Constrct_Dtl__Table_Row_Width = 13
            Cvr_Sht_Constrct_Dtl__Table_Displn_Row_Height = 14
            Cvr_Sht_Constrct_Dtl__Table_Displn_Row_Width = 15
        End Enum

        Public Enum Sheet_List_Dtls
            Sheet_List__ID = 0
            Sheet_List__DB_SHEET_INDEX_NUMBER = 1
            Sheet_List__SHEET_NAME = 2
            Sheet_List__TITLE_1 = 3
            Sheet_List__TITLE_2 = 4
            Sheet_List__TITLE_3 = 5
            Sheet_List__TITLE_4 = 6
            Sheet_List__SHT_REV_NUM = 7
            Sheet_List__SHT_REV_DATE = 8
        End Enum



        Property DT_Proj_Sht_Lst As DataTable
                Get
                    Return _ProjShtLst_dt
                End Get
                Set(value As DataTable)

                End Set
            End Property

        Property DT_Cvr_Sht_Construction As DataTable
            Get
                Return _CvrCnstrnDtls_dt
            End Get
            Set(value As DataTable)

            End Set
        End Property


        ReadOnly Property Cnstrctn_Dtl__Start_Pt As _Point3D
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Start_Pt)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__End_Pt As _Point3D
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__End_Pt)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Height As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Height)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Width As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Width)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__X_Dist_Betwn_Lists As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__X_Dist_Betwn_Lists)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Num_Of_Lists_Per_Sheet As Integer
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Num_Of_Lists_Per_Sheet)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Block_Location_On_System As String
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Block_Location_On_System)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Discipline_Header_Group_Block As String
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Discipline_Header_Group_Block)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Header_Block As String
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Header_Block)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Row_Block As String
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Row_Block)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Header_Row_Height As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Header_Row_Height)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Header_Row_Width As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Header_Row_Width)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Row_Height As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Row_Height)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Row_Width As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Row_Width)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Displn_Row_Height As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Displn_Row_Height)(1)
            End Get
        End Property

        ReadOnly Property Cnstrctn_Dtl__Table_Displn_Row_Width As Double
            Get
                Return Get_Construction_Detail(Cover_Sht_Constr_Dtls.Cvr_Sht_Constrct_Dtl__Table_Displn_Row_Width)(1)
            End Get
        End Property


        ReadOnly Property Sht_List__ID As Integer
            Get
                Dim rtn_val As String = Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__ID)(1).ToString
                Return IIf(Not rtn_val.TrimEnd.TrimStart.ToUpper = "NULL" OrElse Not rtn_val = Nothing OrElse Not rtn_val = "", CInt(rtn_val), 0)
            End Get
        End Property

        ReadOnly Property Sht_List__DB_SHEET_INDEX_NUMBER As Integer
            Get
                Dim rtn_val As String = Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__DB_SHEET_INDEX_NUMBER)(1).ToString
                If Not (rtn_val.TrimEnd.TrimStart.ToUpper = "NULL" OrElse rtn_val = Nothing OrElse rtn_val = "") Then
                    Return CInt(rtn_val)
                Else
                    Return 0
                End If
                'Return IIf(Not rtn_val.TrimEnd.TrimStart.ToUpper = "NULL" OrElse Not rtn_val = Nothing OrElse Not rtn_val = "", CInt(rtn_val), 0)
            End Get
        End Property

        ReadOnly Property Sht_List__SHEET_NAME As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__SHEET_NAME)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__TITLE_1 As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__TITLE_1)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__TITLE_2 As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__TITLE_2)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__TITLE_3 As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__TITLE_3)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__TITLE_4 As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__TITLE_4)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__SHT_REV_NUM As String
            Get
                Return Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__SHT_REV_NUM)(1)
            End Get
        End Property

        ReadOnly Property Sht_List__SHT_REV_DATE As String
            Get
                Dim rtn_val As String = Get_Sheet_List_Detail(Sheet_List_Dtls.Sheet_List__SHT_REV_DATE)(1).ToString
                If Not (rtn_val.TrimEnd.TrimStart.ToUpper = "NULL" OrElse rtn_val = Nothing OrElse rtn_val = "") Then
                    Return rtn_val
                Else
                    Return "01/01/1900"
                End If
                'Return IIf(Not rtn_val.TrimEnd.TrimStart.ToUpper = "NULL" OrElse Not rtn_val = Nothing OrElse Not rtn_val = "", CInt(rtn_val), 0)
            End Get
        End Property


        ReadOnly Property Get_Number_Of_Sheets_in_List As Integer
                Get
                    If _CvrShtDtlsLoaded Then
                        Return _ProjShtLst_dt.Rows.Count - 1
                    Else
                        Return 0
                    End If
                End Get
            End Property

        Public Sub ProjShtLst_Load_Next_Row()
            _ProjShtLst_dt_row_idx = _ProjShtLst_dt_row_idx + 1
        End Sub

        Public Sub New()
            End Sub

        Public Sub New(id_proj_num As Integer)
            _WrkId = id_proj_num.ToString()
        End Sub


        Public Sub load_covr_sht_blk_detls(ByVal gru As Gru, covr_sht_chk As Boolean)
            If Not _WrkId = "" Then
                Dim acad As New acad_db(False)
                _CvrCnstrnDtls_dt = gru.Mike.GoToDB(Sql_Minion.Mike.Reason2Go2DB.Make_Proj_Sheets_GET_DETAILED_COVER_SHT_INFO, _WrkId)
                _CvrShtDtlsLoaded = True

                Dim Table_Header_Block_heigth As Double = acad.Get_height_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Table_Header_Block)
                Dim Table_Header_Block_width As Double = acad.Get_width_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Table_Header_Block)

                Dim Table_Row_Block_heigth As Double = acad.Get_height_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Table_Row_Block)
                Dim Table_Row_Block_width As Double = acad.Get_width_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Table_Row_Block)

                Dim Discipline_Header_Group_Block_heigth As Double = acad.Get_height_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Discipline_Header_Group_Block)
                Dim Discipline_Header_Group_Block_width As Double = acad.Get_width_of_Insd_blk(Cnstrctn_Dtl__Block_Location_On_System + Cnstrctn_Dtl__Discipline_Header_Group_Block)

                '' POST Table_Header_Block_heigth,Table_Header_Block_width,  Table_Row_Block_heigth,Table_Row_Block_width,  Discipline_Header_Group_Block_heigth,Discipline_Header_Group_Block_width

                Dim db_arg_strg As String = _WrkId + "," + IIf(covr_sht_chk, "1", "0") + "," + Table_Header_Block_heigth.ToString() + "," + Table_Header_Block_width.ToString() + "," +
                    Table_Row_Block_heigth.ToString() + "," + Table_Row_Block_width.ToString() + "," + Discipline_Header_Group_Block_heigth.ToString() + "," +
                    Discipline_Header_Group_Block_width.ToString()

                gru.Mike.GoToDB(Sql_Minion.Mike.Reason2Go2DB.Make_Proj_Sheets_POST_COVER_SHT_DETAILS, db_arg_strg)

                ''gru.Mike.GoToDB(Sql_Minion.Mike.Reason2Go2DB.Make_Proj_Sheets_GET_DETAILED_COVER_SHT_INFO, _WrkId)

            End If
        End Sub


        Public Sub load_cover_sheet_details(ByVal gru As Gru)
            If Not _WrkId = "" Then
                load_covr_sht_blk_detls(gru, False)
                _ProjShtLst_dt = gru.Mike.GoToDB(Sql_Minion.Mike.Reason2Go2DB.Make_Proj_Sheets_GET_SHEET_LIST_FOR_COVER_CONSTRUCTIONAL, _WrkId + "~" + _ShtName)

            End If
            '_CvrShtDtlsLoaded = True

            _vars = {New class_vars("Sheet_List__Start_Pt", VarType.Obj, Cnstrctn_Dtl__Start_Pt),
               New class_vars("Sheet_List__End_Pt", VarType.Obj, Cnstrctn_Dtl__End_Pt),
               New class_vars("Sheet_List__Height", VarType.Para, Cnstrctn_Dtl__Height),
               New class_vars("Sheet_List__Width", VarType.Para, Cnstrctn_Dtl__Width),
               New class_vars("Sheet_List__X_Dist_Betwn_Lists", VarType.Para, Cnstrctn_Dtl__X_Dist_Betwn_Lists),
               New class_vars("Sheet_List__Num_Of_Lists_Per_Sheet", VarType.Para, Cnstrctn_Dtl__Num_Of_Lists_Per_Sheet),
               New class_vars("Sheet_List__Block_Location_On_System", VarType.Para, Cnstrctn_Dtl__Block_Location_On_System),
               New class_vars("Sheet_List__Discipline_Header_Group_Block", VarType.Para, Cnstrctn_Dtl__Discipline_Header_Group_Block),
               New class_vars("Sheet_List__Table_Header_Block", VarType.Para, Cnstrctn_Dtl__Table_Header_Block),
               New class_vars("Sheet_List__Table_Row_Block", VarType.Para, Cnstrctn_Dtl__Table_Row_Block),
               New class_vars("_CvrCnstrnDtls_dt", VarType.Tbl, _CvrCnstrnDtls_dt)}



        End Sub

        Private Function Get_Construction_Detail(dtl_2_get As Cover_Sht_Constr_Dtls) As Object()
            Return _Get_Detail(DT_Cvr_Sht_Construction, dtl_2_get * 1, 1)
        End Function

        'Private Function Get_Sheet_List_Detail(dtl_2_get As Cover_Sht_Constr_Dtls) As Object()
        Private Function Get_Sheet_List_Detail(dtl_2_get As Integer) As Object()
            Return _Get_Detail(DT_Proj_Sht_Lst, _ProjShtLst_dt_row_idx, dtl_2_get * 1)
        End Function


        Private Function _Get_Detail(dt As DataTable, r As Integer, c As Integer) As Object()

            Dim rtn_val As Object = "Cover Sheet Details need to be loaded"
            Dim rtnd_val As New Object

            Dim Cnvtd_strg_Pt2d As New _Point2D
            Dim Cnvtd_strg_Pt3d As New _Point3D
            Dim Cnvtd_strg_Dbl As Double = 0
            Dim Cnvtd_strg_Int As Integer = 0
            Try

                If _CvrShtDtlsLoaded Then
                    rtnd_val = dt(r).Item(c)
                    Select Case True
                'Case rtn_val.ToString Like "*[0-9].[0-9]*,*[0-9].[0-9]*,*[0-9].[0-9]*" AndAlso _Point3D.TryParse(rtn_val.ToString)
                '    rtn_val = {"_Point3D", New _Point3D(CDbl(rtn_val.ToString.Split(",")(0)), CDbl(rtn_val.ToString.Split(",")(1)), CDbl(rtn_val.ToString.Split(",")(2)))}
                'Case rtn_val.ToString Like "*[0-9].[0-9]*,*[0-9].[0-9]*" AndAlso _Point2D.TryParse(rtn_val.ToString)
                '    rtn_val = {"_Point2D", New _Point2D(CDbl(rtn_val.ToString.Split(",")(0)), CDbl(rtn_val.ToString.Split(",")(1)))}

                        Case Cnvtd_strg_Pt3d._TryParse(rtnd_val.ToString)
                            rtn_val = {"_Point3D", Cnvtd_strg_Pt3d}
                        Case Cnvtd_strg_Pt2d._TryParse(rtnd_val.ToString)
                            rtn_val = {"_Point2D", Cnvtd_strg_Pt2d}
                        Case Double.TryParse(rtnd_val.ToString, Cnvtd_strg_Dbl)
                            rtn_val = {"Double", Cnvtd_strg_Dbl}
                        Case Integer.TryParse(rtnd_val.ToString, Cnvtd_strg_Int)
                            rtn_val = {"Integer", Cnvtd_strg_Int}
                        Case Else
                            rtn_val = {"String", rtnd_val.ToString}
                    End Select
                End If

            Catch ex As Exception
                rtn_val = Nothing
            End Try

            Return rtn_val
        End Function





        Public Function VarDump()
                Dim Para_Strg As String = "Parameters:" + vbNewLine
                Dim Bool_Strg As String = "Booleans:" + vbNewLine
                Dim Ar_Strg As String = "Arrays:" + vbNewLine
                Dim Obj_Strg As String = "Objects: " + vbNewLine
                Dim Tbl_Strg As String = "Tables: " + vbNewLine
                Try

                    For i As Integer = 0 To (_vars.Count - 1)

                        Select Case _vars(i).var_type
                            Case = VarType.Para
                                Para_Strg = Para_Strg + _vars(i).VarDump() + vbNewLine

                            Case = VarType.Bool
                                Bool_Strg = Bool_Strg + _vars(i).VarDump() + vbNewLine

                            Case = VarType.Ar
                                Ar_Strg = Ar_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                            Case = VarType.Obj
                                Obj_Strg = Obj_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                            Case = VarType.Tbl
                                Tbl_Strg = Tbl_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                        End Select

                    Next
                Catch ex As Exception
                End Try
                Return Para_Strg + vbNewLine + Bool_Strg + vbNewLine + Ar_Strg + vbNewLine + Obj_Strg + vbNewLine + Tbl_Strg
            End Function

        End Class
























        Public Function VarDump()
        Dim Para_Strg As String = "Parameters:" + vbNewLine
        Dim Bool_Strg As String = "Booleans:" + vbNewLine
        Dim Ar_Strg As String = "Arrays:" + vbNewLine
        Dim Obj_Strg As String = "Objects: " + vbNewLine
        Dim Tbl_Strg As String = "Tables: " + vbNewLine
        Try

            For i As Integer = 0 To (_vars.Count - 1)

                Select Case _vars(i).var_type
                        Case = VarType.Para
                        Para_Strg = Para_Strg + _vars(i).VarDump() + vbNewLine

                    Case = VarType.Bool
                        Bool_Strg = Bool_Strg + _vars(i).VarDump() + vbNewLine

                    Case = VarType.Ar
                        Ar_Strg = Ar_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                    Case = VarType.Obj
                        Obj_Strg = Obj_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                    Case = VarType.Tbl
                        Tbl_Strg = Tbl_Strg + vbNewLine + _vars(i).VarDump() + vbNewLine

                End Select

            Next
        Catch ex As Exception
        End Try
        Return Para_Strg + vbNewLine + Bool_Strg + vbNewLine + Ar_Strg + vbNewLine + Obj_Strg + vbNewLine + Tbl_Strg
    End Function

    Public Function VarDump_2()
        Dim Para_Strg As String = "Parameters:" + vbNewLine
        Dim Bool_Strg As String = "Booleans:" + vbNewLine
        Dim Ar_Strg As String = "Arrays:" + vbNewLine
        Dim Obj_Strg As String = "Objects: " + vbNewLine
        Try

            For i As Integer = 0 To (_vars.Count - 1)
                With _vars(i)
                    Select Case .var_type
                        Case = VarType.Para
                            Para_Strg = Para_Strg + .var_name + " = " + IIf(Not .var_value = "", .var_value.ToString, " This var is empty") + vbNewLine

                        Case = VarType.Bool
                            Bool_Strg = Bool_Strg + .var_name + " = " + .var_value.ToString + vbNewLine

                        Case = VarType.Ar
                            Ar_Strg = Ar_Strg + "   " + .var_name + ": "
                            Try
                                For ix As Integer = 0 To (.var_value.Count - 1)
                                    Ar_Strg = Ar_Strg + "       " + .var_name + "(" + i.ToString + ") = " + .var_value(i).ToString + vbNewLine
                                Next
                            Catch ex As ArgumentNullException
                                Ar_Strg = Ar_Strg + .var_name + " = empty" + vbNewLine
                            Catch ex As Exception
                                Ar_Strg = Ar_Strg + ex.ToString + vbNewLine
                            End Try

                        Case = VarType.Obj
                            Obj_Strg = Obj_Strg + .var_name + ": " + .var_value.VarDump() + vbNewLine
                    End Select
                End With
            Next
        Catch ex As Exception
        End Try
        Return Para_Strg + vbNewLine + Bool_Strg + vbNewLine + Ar_Strg + vbNewLine + Obj_Strg
    End Function

    Public Function VarDump_3()
        Dim Strg As String = ""
        Try
            Strg = Strg + "Parameters:" + vbNewLine
            Strg = Strg + "    Disp = " + IIf(Not _Disp = "", Disp.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    IfcDte = " + IIf(Not _IfcDte = "", IfcDte.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    ShtName = " + IIf(Not _ShtName = "", ShtName.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TBTit1 = " + IIf(Not _TBTit1 = "", TBTit1.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TBTit2 = " + IIf(Not _TBTit2 = "", TBTit2.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TBTit3 = " + IIf(Not _TBTit3 = "", TBTit3.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TBTit4 = " + IIf(Not _TBTit4 = "", TBTit4.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TitBlkNme = " + IIf(Not _TitBlkNme = "", TitBlkNme.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    TitBlkLyOt = " + IIf(Not _TitBlkLyOt = "", TitBlkLyOt.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "    WrkId = " + IIf(Not _WrkId = "", WrkId.ToString, " This var is empty") + vbNewLine
            Strg = Strg + "Booleans:" + vbNewLine
            Strg = Strg + "    IsNothing = " + IsNothing.ToString + vbNewLine
            Strg = Strg + "    ShtHasVp = " + ShtHasVp.ToString + vbNewLine
            Strg = Strg + "Arrays:" + vbNewLine
            Try
                For i As Integer = 0 To (MsXrefs.Count - 1)
                    Strg = Strg + "  MsXrefs(" + i.ToString + ") = " + MsXrefs(i).ToString + vbNewLine
                Next
            Catch ex As ArgumentNullException
                Strg = Strg + "MsXrefs = empty" + vbNewLine
            Catch ex As Exception
                Strg = Strg + ex.ToString + vbNewLine
            End Try


            Try
                For i As Integer = 0 To (PsXrefs.Count - 1)
                    Strg = Strg + "  PsXrefs(" + i.ToString + ") = " + PsXrefs(i).ToString + vbNewLine
                Next
            Catch ex As ArgumentNullException
                Strg = Strg + "PsXrefs = empty" + vbNewLine
            Catch ex As Exception
                Strg = Strg + ex.ToString + vbNewLine
            End Try










        Catch ex As Exception
            MsgBox(ex.ToString)
            'MgBx(ex.ToString)
        End Try
        Return Strg
    End Function



End Class
