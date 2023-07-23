Imports Autodesk.AutoCAD
Imports Autodesk.AutoCAD.ApplicationServices.Core
Imports Autodesk.AutoCAD.ApplicationServices
Imports Autodesk.AutoCAD.DatabaseServices
Imports Autodesk.AutoCAD.EditorInput
Imports Autodesk.AutoCAD.Runtime
Imports Autodesk.AutoCAD.Geometry
Imports Autodesk.AutoCAD.ApplicationServices.DocumentCollectionExtension
Imports Autodesk.AutoCAD.ApplicationServices.DocumentExtension
Imports DbSurface = Autodesk.AutoCAD.DatabaseServices.Surface
Imports DbNurbSurface = Autodesk.AutoCAD.DatabaseServices.NurbSurface



Public Class acad_db
    Private _acd_db As Database
    Private _db_was_opened_from_string As Boolean = False
    Private _old_db As Database = Core.Application.DocumentManager.MdiActiveDocument.Database

    Property dwg_full_path As String
        Get
            Return _acd_db.OriginalFileName
        End Get
        Set(value As String)

        End Set
    End Property

    Public Sub New()
        Try
            _acd_db = New Database(False, True)
        Catch ex As Exception
            _acd_db = New Database(True, False)
        End Try

    End Sub

    Public Sub New(use_active_doc As Boolean)
        If use_active_doc Then
            _acd_db = Core.Application.DocumentManager.MdiActiveDocument.Database
        Else
            Try
                _acd_db = New Database(False, True)
            Catch ex As Exception
                _acd_db = New Database(True, False)
            End Try
        End If
    End Sub

    Public Sub New(db As Database)
        _acd_db = db
    End Sub

    Public Sub New(dwg_2_open As String)
        '               !!!!-----********* NOTE *********-----!!!!
        '' MAKE SURE TO USE ARUGMENTS -->> (False, True) <<-- WHEN CALLING "New Database"
        '' IF THESE ARGUMENTS ARE NOT USE OR ARE OMITTED THE NEW DATABASE AND OR SAVED DWG
        '' WILL NEED TO BE RECOVERED BEFORE THE CONTENT CAN BE XREFED OR BEFORE THE DWG CAN
        '' BE USED WITHOUT PROBLEMS IN ACAD

        '' MAKE SURE THE DWG YOUR TRYING TO OPEN IS NOT XREF.ED IN ANY OF THE OTHER "SIDE LOADED" DATABASES OR MAYBE JUST THE ACTIVE DWG/DB
        '' IF IT IS YOU WILL GET EITHER 'eFileInternalErr' OR 'eFilerError' WHEN TRYING TO "Db.ReadDwgFile()" THE FILE AND OR
        '' THE SAME ERRORS WHEN TRYING TO SAVE (IF YOUR USING "Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, False, "")" OR
        '' "Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, True, "")"

        Try
            Dim Db As New Database(False, True) 'Doc.Database
            Db.ReadDwgFile(dwg_2_open, FileOpenMode.OpenForReadAndWriteNoShare, False, "")
            Db.CloseInput(True)
            _acd_db = Db
            _db_was_opened_from_string = True
        Catch ex As Exception
            Dim err_strg As String = "Function 'ReadDwgFile' failed to load a side database for drawing """ + dwg_2_open + """." + vbNewLine +
                                     "Check and make sure the drawing attempting to be side-loaded is NOT being XREF.ed or referenced/linked in any of the other 
                                     side-loaded drawings or the active drawing." + vbNewLine + "If """ + dwg_2_open + """ is referenced in another loaded 
                                     drawing try closing/releasing/disposing the drawing that is referencing it and try side-loading  """ + dwg_2_open + """ again."

            Dim paul As New Minions.Exception_Minion.Paul(err_strg, ex, True, "Acad_Update_Tit_Blk.acad_db.New(dwg_2_open As String)")
            Throw paul

        End Try



        'Dim Db As Database
        'Dim try_1 As Boolean = True
        'Dim try_2 As Boolean = True



        'If try_1 Then
        '    Try
        '        Db = New Database(False, True) 'Doc.Database
        '        'Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, False, "")
        '        'Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, True, "")
        '        'Db.ReadDwgFile(dwg_2_open, FileOpenMode.OpenForReadAndWriteNoShare, True, "")
        '        Db.ReadDwgFile(dwg_2_open, FileOpenMode.OpenForReadAndWriteNoShare, False, "")
        '        Db.CloseInput(True)
        '        _acd_db = Db
        '        _db_was_opened_from_string = True
        '        try_2 = False
        '    Catch ex As SystemException
        '    Catch ex As Exception
        '    End Try

        'End If

        'If try_2 Then
        '    Try
        '        Db = New Database(True, False)
        '        'Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, False, "")
        '        'Db.ReadDwgFile(dwg_2_open, System.IO.FileShare.ReadWrite, True, "")
        '        'Db.ReadDwgFile(dwg_2_open, FileOpenMode.OpenForReadAndWriteNoShare, True, "")
        '        Db.ReadDwgFile(dwg_2_open, FileOpenMode.OpenForReadAndWriteNoShare, False, "")
        '        Db.CloseInput(True)
        '        _acd_db = Db
        '        _db_was_opened_from_string = True
        '        try_1 = False
        '    Catch ex As SystemException
        '    Catch ex As Exception
        '    End Try
        'End If


        HostApplicationServices.WorkingDatabase = _acd_db

    End Sub

    Public Sub copy_paste_2_new_db(path_2_source_dwg As String)
        CopyEntitiesFromSourceDrawing(_acd_db, path_2_source_dwg)
        Dim new_file_name As String = Minions.File_Minion.Steve.FixNewFileName(path_2_source_dwg)
        _acd_db.SaveAs(new_file_name, DwgVersion.Current)
        _acd_db.Dispose()
        IO.File.Copy(path_2_source_dwg, Minions.File_Minion.Steve.FixNewFileName(path_2_source_dwg))
        IO.File.Delete(path_2_source_dwg)
        IO.File.Copy(new_file_name, path_2_source_dwg)

        Dim a As New acad_db(path_2_source_dwg)

        'Dim Db As New Database(False, True)
        'Db.ReadDwgFile(path_2_source_dwg, FileOpenMode.OpenForReadAndWriteNoShare, False, "")
        '_acd_db = Db

    End Sub

    Public Function release_opened_dwg() As Object()
        Try
            If _db_was_opened_from_string Then
                _acd_db.Dispose()
            Else
                Return {False, "Can''t release parent dwg"}
            End If
        Catch ex As Exception
            Return {False, ex.ToString}
        End Try
        HostApplicationServices.WorkingDatabase = _old_db
        Return {True, ""}
    End Function

    Public Sub mod_blk_attrib(blk_OId As ObjectId, att_tag As String, new_att_vals As String, save As Boolean)
        mod_blk_attrib(blk_OId, {att_tag}, {new_att_vals}, Nothing, save)
    End Sub

    Public Sub mod_blk_attrib(blk_OId As ObjectId, att_tag As String, new_att_vals As String, Layout_tab_name As String, save As Boolean)
        mod_blk_attrib(blk_OId, {att_tag}, {new_att_vals}, Layout_tab_name, save)
    End Sub

    Public Sub mod_blk_attrib(blk_OId As ObjectId, att_tag() As String, new_att_vals() As String, save As Boolean)
        mod_blk_attrib(blk_OId, att_tag, new_att_vals, Nothing, save)
    End Sub

    Public Sub mod_blk_attrib(blk_name As String, att_tag As String, new_att_vals As String, save As Boolean)
        mod_blk_attrib(blk_name, {att_tag}, {new_att_vals}, Nothing, save)
    End Sub

    Public Sub mod_blk_attrib(blk_name As String, att_tag As String, new_att_vals As String, Layout_tab_name As String, save As Boolean)
        mod_blk_attrib(blk_name, {att_tag}, {new_att_vals}, Layout_tab_name, save)
    End Sub

    Public Sub mod_blk_attrib(blk_name As String, att_tag() As String, new_att_vals() As String, save As Boolean)
        mod_blk_attrib(blk_name, att_tag, new_att_vals, Nothing, save)
    End Sub


    Private Sub save_changes(save As Boolean) ', isStillWorkingDB As Boolean)
        Try
            If save Then
                'Core.Application.DocumentManager.MdiActiveDocument = _acd_db.Save
                '_acd_db.SaveAs(_acd_db.OriginalFileName, _acd_db.OriginalFileVersion)
                _acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)
                'HostApplicationServices.WorkingDatabase.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)
            End If
        Catch ex As Exception
            Try
                _acd_db.SaveAs(_acd_db.OriginalFileName, DwgVersion.Current)
            Catch exx As Exception
                Try
                    _acd_db.Save()
                Catch exxx As Exception
                    Dim err_strg As String = "Save didn't work! Something unforseen happened." + vbNewLine +
                                                "Going back and look at the side-loaded drawing(s) and make sure the database being processed is NOT being XREF.ed or 
                                                referenced/linked in any of the other side-loaded drawing(s) or the active drawing." + vbNewLine +
                                                "If it is being referenced by/in any of the other loaded drawing(s) try closing, releasing, and disposing the drawing that is referencing 
                                                it and try side-loading, processing, and saving it again."

                    Dim paul As New Minions.Exception_Minion.Paul(err_strg, ex, True, "Acad_Update_Tit_Blk.acad_db.save_changes")
                    Throw paul
                    'Try
                    '    Dim acd_db = _acd_db.AcadDatabase
                    'Catch exxxx As Exception
                    '    Dim err_strg As String = "Save didn't work! Something unforseen happened." + vbNewLine +
                    '                            "Going back and look at the side-loaded drawing(s) and make sure the database being processed is NOT being XREF.ed or 
                    '                            referenced/linked in any of the other side-loaded drawing(s) or the active drawing." + vbNewLine +
                    '                            "If it is being referenced by/in any of the other loaded drawing(s) try closing, releasing, and disposing the drawing that is referencing 
                    '                            it and try side-loading, processing, and saving it again."

                    '    Dim paul As New Minions.Exception_Minion.Paul(err_strg, ex, True, "Acad_Update_Tit_Blk.acad_db.save_changes")
                    '    Throw paul
                    'End Try
                End Try
            End Try
        End Try

        'If Not isStillWorkingDB Then
        '    HostApplicationServices.WorkingDatabase = _old_db
        'End If

    End Sub



    Public Sub mod_blk_attrib(blk_name As String, att_tag() As String, new_att_vals() As String, Layout_tab_name As String, save As Boolean)
        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction
            Dim Blk As BlockReference = GetBlkFrmLayout(blk_name, tr, Layout_tab_name)
            If Blk.AttributeCollection.Count - 1 > -1 Then
                edit_atts(tr, Blk.AttributeCollection, att_tag, new_att_vals)
            Else
                Throw New System.Exception("Can''t Find Attribute In Seal Block")
            End If
here:
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(save)
        'If save Then
        '    _acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)
        'End If
    End Sub

    Public Sub mod_blk_attrib(blk_OId As ObjectId, att_tag() As String, new_att_vals() As String, Layout_tab_name As String, save As Boolean)
        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction
            Try

                Dim Blk As BlockReference = tr.GetObject(blk_OId, OpenMode.ForWrite)
                If Blk.AttributeCollection.Count - 1 > -1 Then
                    edit_atts(tr, Blk.AttributeCollection, att_tag, new_att_vals)
                Else
                    Throw New System.Exception("Can''t Find Attribute(s) In Block")
                End If
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try
here:
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(save)
        'If save Then
        '    _acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)
        'End If
    End Sub

    Private Sub CopyEntitiesFromSourceDrawing(db As Database, sourceFile As String)
        Dim sourceIds As New ObjectIdCollection()

        Using sourceDb As New Database(False, True)

            sourceDb.ReadDwgFile(sourceFile, FileOpenMode.OpenForReadAndAllShare, True, "")
            Using tran As Transaction = sourceDb.TransactionManager.StartTransaction()

                Dim model As BlockTableRecord = tran.GetObject(SymbolUtilityServices.GetBlockModelSpaceId(sourceDb), OpenMode.ForRead)
                For Each id As ObjectId In model
                    sourceIds.Add(id)
                Next
                tran.Commit()

                If sourceIds.Count > 0 Then
                    Dim mapping As New IdMapping()
                    Dim modelId As ObjectId = SymbolUtilityServices.GetBlockModelSpaceId(db)
                    db.WblockCloneObjects(
                        sourceIds, modelId, mapping, DuplicateRecordCloning.Replace, False)
                End If
            End Using
        End Using

    End Sub

    Public Sub mod_text_in_LyOt(strgs_2_rpl() As String, replcemnt_strg() As String, Layout_tab_name As String, save As Boolean)
        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction
            Dim Bt As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
            'Dim Blk As BlockReference = GetBlkFrmLayout(blk_name, tr, Layout_tab_name)
            Dim LyOt_Btr As BlockTableRecord = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
            If Not Layout_tab_name.ToUpper = Nothing AndAlso Not Layout_tab_name.ToUpper = LyOt_Btr.Name.ToUpper Then
                Try
                    'LyOt_Btr = tr.GetObject(BlockTable(LayoutManager.Current.GetLayoutId(Layout_tab_name)), OpenMode.ForWrite)
                    'LyOt_Btr = tr.GetObject(Bt(Layout_tab_name), OpenMode.ForWrite)
                    change_layout(Layout_tab_name)
                Catch ex As Exception
                    LyOt_Btr = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                End Try
            End If
            For i As Integer = 0 To (strgs_2_rpl.Count - 1)
                edit_text(tr, LyOt_Btr, strgs_2_rpl(i), replcemnt_strg(i))
            Next
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(save)
        'If save Then
        '    _acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)
        'End If
    End Sub

    Public Function GetBlkFrmLayout(BlkNme As String, tr As Transaction, Layout_tab_name As String) As BlockReference

        Dim rtn As BlockReference = Nothing
        Dim Bt As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
        If Bt.Has(BlkNme) Then
            'Dim MdlSpc As BlockTableRecord = tr.GetObject(Bt(BlockTableRecord.ModelSpace), OpenMode.ForWrite)
            Dim Crnt_Spce As BlockTableRecord = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
            Try
                If Not Layout_tab_name.ToUpper.TrimEnd.TrimStart = "Nothing" Then
                    If Not Layout_tab_name.ToUpper.TrimEnd.TrimStart = Crnt_Spce.Name.ToUpper Then
                        'change_layout(Layout_tab_name)
                        'Crnt_Spce = tr.GetObject(Db.CurrentSpaceId, OpenMode.ForWrite)
                        Try
                            'Crnt_Spce = tr.GetObject(LayoutManager.Current.GetLayoutId(Layout_tab_name), OpenMode.ForWrite)
                            change_layout(Layout_tab_name)
                            Crnt_Spce = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        Catch exx As Exception
                            Crnt_Spce = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        End Try
                    End If
                End If
            Catch ex As Exception
            Catch ex As ApplicationException
            Catch ex As SystemException
            Catch ex As System.Exception
            End Try


            Dim BlkIds As New ObjectIdCollection
            For Each id As ObjectId In Crnt_Spce
                Dim ent As Entity = tr.GetObject(id, OpenMode.ForWrite)
                If ent.GetType Is GetType(BlockReference) Then
                    Dim BlkRef As BlockReference = tr.GetObject(id, OpenMode.ForWrite)
                    If BlkRef.Name.ToUpper = BlkNme.ToUpper Then
                        rtn = BlkRef
                        GoTo here
                    End If
                End If
            Next
        End If
here:
        Return rtn
    End Function

    Public Function SS_GetBlkFrmLayout(BlkNme As String, tr As Transaction, doc As Document, Layout_tab_name As String)
        Dim Bt As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
        Dim rtn As BlockReference = Nothing

        If Bt.Has(BlkNme) Then
            Dim Crnt_Spce As BlockTableRecord = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
            If Not Layout_tab_name.ToUpper = Nothing AndAlso Not Layout_tab_name.ToUpper = Crnt_Spce.Name.ToUpper Then
                'change_layout(Layout_tab_name)
                'CrntSpc = tr.GetObject(Db.CurrentSpaceId, OpenMode.ForWrite)
                Try
                    'Crnt_Spce = tr.GetObject(LayoutManager.Current.GetLayoutId(Layout_tab_name), OpenMode.ForWrite)
                    Crnt_Spce = tr.GetObject(Bt(Layout_tab_name), OpenMode.ForWrite)
                Catch ex As Exception
                    Crnt_Spce = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                End Try
            End If

            Dim BlkIds As New ObjectIdCollection
            'Dim Bt As BlockTable = tr.GetObject(Db.BlockTableId, OpenMode.ForRead)

            Dim FltrLst() As TypedValue = {New TypedValue(0, "INSERT"), New TypedValue(2, BlkNme)}
            Dim SsFltr As New SelectionFilter(FltrLst)
            Dim SelRslts As PromptSelectionResult = doc.Editor.SelectAll(SsFltr)

            If Not SelRslts.Status = PromptStatus.OK Then
                Throw New ApplicationException("ErrorWithSelectAll")
                GoTo here
            End If

            Dim CrtSpcId As ObjectId = Crnt_Spce.Id
            For Each id As ObjectId In SelRslts.Value.GetObjectIds
                Dim BlkRef As BlockReference = tr.GetObject(id, OpenMode.ForWrite)
                If BlkRef.OwnerId = CrtSpcId Then
                    If BlkRef.Name = BlkNme Then
                        rtn = BlkRef
                        GoTo here
                    End If
                End If
            Next
here:
        End If
        Return rtn
    End Function

    Public Sub change_layout(Layout_tab_name As String)
        LayoutManager.Current.CurrentLayout = Layout_tab_name
    End Sub

    Public Sub change_layout_name(old_layout_tab_name As String, new_layout_tab_name As String)
        'LayoutManager.Current.CurrentLayout = old_layout_tab_name
        LayoutManager.Current.RenameLayout(old_layout_tab_name, new_layout_tab_name)
    End Sub

    Public Sub edit_atts(tr As Transaction, AtCol As AttributeCollection, AtTag() As String, AtStrg() As String)
        For Each arId As ObjectId In AtCol
            Dim Obj2 As DBObject = tr.GetObject(arId, OpenMode.ForWrite, False, True)
            Try
                Dim ar As AttributeReference = CType(Obj2, AttributeReference)
                For i As Integer = 0 To (AtTag.Count - 1)
                    If ar.Tag.ToUpper = AtTag(i).ToUpper Then
                        ar.TextString = AtStrg(i).ToUpper
                        GoTo jump_2_next
                    End If
                Next
            Catch ex As System.Exception
            End Try
jump_2_next:
        Next
    End Sub

    Public Sub edit_text(tr As Transaction, Btr As BlockTableRecord, strg_2_rpl As String, replcemnt_strg As String)

        For Each obj As ObjectId In Btr
            Dim DbObj As DBObject = tr.GetObject(obj, OpenMode.ForWrite)
            Dim ent As Entity = CType(DbObj, Entity) 'tr.GetObject(IdIdx.ObjectId, OpenMode.ForRead)
            If Not ent Is Nothing AndAlso ent.Visible Then
                If ent.GetType() Is GetType(MText) Then
                    Dim TxtE As MText = CType(DbObj, MText)
                    If TxtE.Text Like "*" + strg_2_rpl + "*" Then
                        If TxtE.Contents Like "*:*" Then
                            TxtE.Contents = TxtE.Contents.Split(":")(0) + ": " + replcemnt_strg.ToUpper
                        Else
                            TxtE.Contents = replcemnt_strg.ToUpper
                        End If
                    End If

                ElseIf ent.GetType() Is GetType(DBText) Then
                    Dim TxtE As DBText = CType(DbObj, DBText)
                    If TxtE.TextString Like "*" + strg_2_rpl + "*" Then
                        If TxtE.TextString Like "*:*" Then
                            TxtE.TextString = TxtE.TextString.Split(":")(0) + ": " + replcemnt_strg.ToUpper
                        Else
                            TxtE.TextString = replcemnt_strg.ToUpper
                        End If
                    End If

                    End If
            End If
        Next
    End Sub

    Shared Sub edit_text(Vals2Fnd() As String, NewVals() As String, Doc As Document)

        'CycleThruCvrShtFxSpclChars({"TOOLNAME@*", "*bld-code@*".ToUpper}, {.ProjDesc + " ", .ProjBld})

        Dim OpnDocEd As Editor = Doc.Editor
        Dim Db As Database = Doc.Database


        Dim Tv() As TypedValue = {New TypedValue(CType(DxfCode.Start, Integer), "TEXT,MTEXT")}
        '= {New TypedValue(CType(DxfCode.Start, Integer), "TEXT"), New TypedValue(CType(DxfCode.Start, Integer), "MTEXT")}

        Dim sf As SelectionFilter = New SelectionFilter(Tv)
        Dim Ss As PromptSelectionResult = OpnDocEd.SelectAll(sf)
        If Ss.Status = PromptStatus.OK Then
            Dim SSet As SelectionSet = Ss.Value
            Using t As Transaction = Db.TransactionManager.StartTransaction
                For Idx As Integer = 0 To (Vals2Fnd.Count - 1)
                    For i As Integer = 0 To (SSet.Count - 1)

                        Dim Ent As Entity = t.GetObject(SSet.Item(i).ObjectId, OpenMode.ForWrite)
                        If Ent.GetType Is GetType(DBText) Then
                            Dim Txt As DBText = CType(Ent, DBText)
                            If Txt.TextString.ToUpper Like Vals2Fnd(Idx).ToUpper Then
                                Txt.TextString = NewVals(Idx).TrimStart.TrimEnd + (Mid(Txt.TextString.TrimStart.TrimEnd, Vals2Fnd(Idx).TrimStart.TrimEnd.Count)).TrimStart.TrimEnd
                            End If

                        ElseIf Ent.GetType Is GetType(MText) Then
                            Dim Mtxt As MText = CType(Ent, MText)
                            If Mtxt.Text.ToUpper Like Vals2Fnd(Idx).ToUpper Then
                                Mtxt.Contents = NewVals(Idx).TrimStart.TrimEnd + (Mid(Mtxt.Contents.TrimStart.TrimEnd, Vals2Fnd(Idx).TrimStart.TrimEnd.Count)).TrimStart.TrimEnd
                            End If

                        End If
                    Next
                Next
                t.Commit()
            End Using
        End If




    End Sub

    Public Function add_block_2_dwg(loc_of_blk As String, ins_Blk_Loc_ As Point3d, tr As Transaction) As ObjectId
        '_acd_db
        Dim Rtnd_BlkRef_id As ObjectId = ObjectId.Null
        Dim blkRecId As ObjectId = ObjectId.Null
        Dim acBlkTbl As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForRead)
        Dim blk_name As String = Minions.File_Minion.Steve.GetFileName(loc_of_blk).Split(".")(0)

        If Not acBlkTbl.Has(blk_name) Then
            If IO.File.Exists(loc_of_blk) Then
                Using blk_dwg As New Database(False, True)
                    'bring/read the file in the temp database
                    blk_dwg.ReadDwgFile(loc_of_blk, IO.FileShare.Read, True, Nothing)
                    'insert the tempdb into the current drawing db, id is the new block id
                    blkRecId = _acd_db.Insert(blk_name, blk_dwg, True)
                End Using
            Else
                'Throw exception for missing file 
                Throw New System.Exception(String.Format("File '{0}' was not found", loc_of_blk))
            End If

        Else
            blkRecId = acBlkTbl(blk_name)
        End If


        ' Create and insert the new block reference
        If blkRecId <> ObjectId.Null Then
            Dim acBlkTblRec As BlockTableRecord
            acBlkTblRec = tr.GetObject(blkRecId, OpenMode.ForRead)

            Using acBlkRef As New BlockReference(ins_Blk_Loc_, acBlkTblRec.Id)

                Dim acCurSpaceBlkTblRec As BlockTableRecord
                acCurSpaceBlkTblRec = tr.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)

                acCurSpaceBlkTblRec.AppendEntity(acBlkRef)
                tr.AddNewlyCreatedDBObject(acBlkRef, True)
                Rtnd_BlkRef_id = acBlkRef.Id

                ' Verify block table record has attribute definitions associated with it
                If acBlkTblRec.HasAttributeDefinitions Then
                    ' Add attributes from the block table record
                    For Each objID As ObjectId In acBlkTblRec

                        Dim dbObj As DBObject = tr.GetObject(objID, OpenMode.ForRead)

                        If TypeOf dbObj Is AttributeDefinition Then
                            Dim acAtt As AttributeDefinition = dbObj

                            If Not acAtt.Constant Then
                                Using acAttRef As New AttributeReference

                                    acAttRef.SetAttributeFromBlock(acAtt, acBlkRef.BlockTransform)
                                    acAttRef.Position = acAtt.Position.TransformBy(acBlkRef.BlockTransform)

                                    acAttRef.TextString = acAtt.TextString

                                    acBlkRef.AttributeCollection.AppendAttribute(acAttRef)

                                    tr.AddNewlyCreatedDBObject(acAttRef, True)
                                End Using
                            End If
                        End If
                    Next
                End If
            End Using
        End If

        'Return blkRecId
        Return Rtnd_BlkRef_id
    End Function

    Public Function get_blk_bounds(loc_of_blk As String) As Point3d()
        Dim RtnPtCol As New Point3dCollection
        Dim blkRecId As ObjectId = ObjectId.Null
        Dim NewObjs As ObjectIdCollection = New ObjectIdCollection
        Dim Pts() As Point3d
        Dim SmPt As New Point3d
        Dim LgPt As New Point3d
        Dim CntPt As New Point3d
        Dim CntPt2 As New Point3d
        Dim LL As New Point3d
        Dim UL As New Point3d
        Dim LR As New Point3d
        Dim UR As New Point3d

        Using blk_dwg As New Database(False, True)
            blk_dwg.ReadDwgFile(loc_of_blk, IO.FileShare.Read, True, Nothing)


            Using tr As Transaction = blk_dwg.TransactionManager.StartTransaction
                Dim Bt As BlockTable = tr.GetObject(blk_dwg.BlockTableId, OpenMode.ForRead)
                Dim MdlSpc As BlockTableRecord = tr.GetObject(Bt(BlockTableRecord.ModelSpace), OpenMode.ForRead)

                For Each obj As ObjectId In MdlSpc
                    NewObjs.Add(obj)
                Next


                Pts = FndCntPt(NewObjs, tr)
                SmPt = Pts(0)
                LgPt = Pts(1)
                CntPt = Pts(2)
                CntPt2 = New Point3d(((SmPt.X + LgPt.X) / 2), ((SmPt.Y + LgPt.Y) / 2), ((SmPt.Z + LgPt.Z) / 2))
                LL = Pts(3)
                UL = Pts(4)
                LR = Pts(5)
                UR = Pts(6)
                tr.Commit()
                tr.Dispose()
            End Using



        End Using



        Return {UL, UR, LR, LL}


    End Function

    Private Function FndCntPt(Col As ObjectIdCollection, tr As Transaction)
        'Dim Rtn As New Point3d
        'Dim PtCol As New Point3dCollection
        'Dim PtLst As New List(Of Point3d)
        Dim Xl As Double = 0.0
        Dim Yl As Double = 0.0
        Dim Zl As Double = 0.0
        Dim Xs As Double = 0.0
        Dim Ys As Double = 0.0
        Dim Zs As Double = 0.0
        Dim FrstLp As Boolean = True
        Dim LrgstPt As New Point3d(0, 0, 0)
        Dim SmlstPt As New Point3d(0, 0, 0)

        Dim strg As String = Nothing

        Try
            For Each Obj As ObjectId In Col
                If Not Obj.IsNull Then
                    Dim ent As Entity = tr.GetObject(Obj, OpenMode.ForWrite, False, True)
                    'PtCol = CollectPoints(ent, tr)
                    For Each pt As Point3d In CollectPoints(ent, tr) 'PtCol
                        'PtLst.Add(pt)
                        strg = strg + "X = " + pt.X.ToString + "  Y = " + pt.Y.ToString + "  Z = " + pt.Z.ToString + vbNewLine
                        If FrstLp Then 'Xl = 0.0 AndAlso Yl = 0.0 AndAlso Zl = 0.0 Then
                            FrstLp = False
                            LrgstPt = pt
                            SmlstPt = pt
                            Xl = pt.X
                            Yl = pt.Y
                            Zl = pt.Z
                            Xs = pt.X
                            Ys = pt.Y
                            Zs = pt.Z
                        Else
                            LrgstPt = LargestestPts(LrgstPt, pt)
                            SmlstPt = SmallestPts(SmlstPt, pt)
                            If pt.X > Xl Then
                                Xl = pt.X
                            End If
                            If pt.Y > Yl Then
                                Yl = pt.Y
                            End If
                            If pt.Z > Zl Then
                                Zl = pt.Z
                            End If

                            If pt.X < Xs Then
                                Xs = pt.X
                            End If
                            If pt.Y < Ys Then
                                Ys = pt.Y
                            End If
                            If pt.Z > Zs Then
                                Zs = pt.Z
                            End If

                        End If


                    Next
                End If
            Next

        Catch ex As System.Exception
            MsgBox(ex.ToString)
        End Try


        Dim LL As New Point3d(Xs, Ys, (Zl - Zs) / 2)
        Dim UL As New Point3d(Xs, Yl, (Zl - Zs) / 2)
        Dim LR As New Point3d(Xl, Ys, (Zl - Zs) / 2)
        Dim UR As New Point3d(Xl, Yl, (Zl - Zs) / 2)

        'Using Sw As StreamWriter = New StreamWriter("N:\COMMON\Nick_Leavitt\POR layout\yghtui.txt")
        '    Sw.WriteLine(strg)
        '    Sw.AutoFlush = True
        'End Using

        Return {SmlstPt, LrgstPt, New Point3d((Xl + Xs) / 2, (Yl + Ys) / 2, (Zl - Zs) / 2), LL, UL, LR, UR}



    End Function

    Private Function randomVectorOnPlane(pl As Plane)
        '' Return a random 3D vector on a plane
        Dim r As New Random
        Dim absx As Double = r.NextDouble
        Dim absy As Double = r.NextDouble
        Dim x As Double = r.NextDouble
        Dim y As Double = r.NextDouble
        If x < 0.5 OrElse x.GetType Is GetType(Nullable) Then
            x = r.Next(-absx, absx)
        End If
        If y < 0.5 OrElse y.GetType Is GetType(Nullable) Then
            y = r.Next(-absy, absy)
        End If

        Dim v2 As New Vector2d(x, y)
        Return New Vector3d(pl, v2)

    End Function

    Private Function randomVector3d()
        '' Return a random 3D vector
        Dim r As New Random
        Dim absx As Double = r.NextDouble
        Dim absy As Double = r.NextDouble
        Dim absz As Double = r.NextDouble
        Dim x As Double = r.NextDouble
        Dim y As Double = r.NextDouble
        Dim z As Double = r.NextDouble
        If x < 0.5 OrElse x.GetType Is GetType(Nullable) Then
            x = r.Next(-absx, absx)
        End If
        If y < 0.5 OrElse y.GetType Is GetType(Nullable) Then
            y = r.Next(-absy, absy)
        End If
        If z < 0.5 OrElse z.GetType Is GetType(Nullable) Then
            z = r.Next(-absz, absz)
        End If

        Return New Vector3d(x, y, z)
    End Function

    Private Function SmallestPts(pt1 As Point3d, pt2 As Point3d)
        Dim Scrs() As Integer = ComparePts(pt1, pt2)
        Dim Pt1Cntr As Integer = Scrs(0)
        Dim Pt2Cntr As Integer = Scrs(1)

        If Pt1Cntr > Pt2Cntr Then
            Return pt2
        ElseIf Pt2Cntr > Pt1Cntr Then
            Return pt1
        Else
            Return pt2
        End If

    End Function

    Private Function LargestestPts(pt1 As Point3d, pt2 As Point3d)
        Dim Scrs() As Integer = ComparePts(pt1, pt2)
        Dim Pt1Cntr As Integer = Scrs(0)
        Dim Pt2Cntr As Integer = Scrs(1)

        If Pt1Cntr > Pt2Cntr Then
            Return pt1
        ElseIf Pt2Cntr > Pt1Cntr Then
            Return pt2
        Else
            Return pt2
        End If
    End Function

    Private Function ComparePts(pt1 As Point3d, pt2 As Point3d)
        Dim Pt1Cntr As Integer = 0
        Dim Pt2Cntr As Integer = 0

        If pt1.X > pt2.X Then
            Pt1Cntr = Pt1Cntr + 1
        ElseIf pt2.X > pt1.X Then
            Pt2Cntr = Pt2Cntr + 1
        ElseIf pt1.X = pt2.X Then
            Pt1Cntr = Pt1Cntr + 1
            Pt2Cntr = Pt2Cntr + 1
        End If
        If pt1.Y > pt2.Y Then
            Pt1Cntr = Pt1Cntr + 1
        ElseIf pt2.Y > pt1.Y Then
            Pt2Cntr = Pt2Cntr + 1
        ElseIf pt1.Y = pt2.Y Then
            Pt1Cntr = Pt1Cntr + 1
            Pt2Cntr = Pt2Cntr + 1
        End If
        If pt1.Z > pt2.Z Then
            Pt1Cntr = Pt1Cntr + 1
        ElseIf pt2.Z > pt1.Z Then
            Pt2Cntr = Pt2Cntr + 1
        ElseIf pt1.Z = pt2.Z Then
            Pt1Cntr = Pt1Cntr + 1
            Pt2Cntr = Pt2Cntr + 1
        End If

        Return {Pt1Cntr, Pt2Cntr}
    End Function

    Private Function CalWidthFactor(Blk As BlockReference, Ar As AttributeReference)
        Dim StrgWidth As Double = GetArWidth(Ar) '@Wf = 1 : 2.03208614, 2.03172055 @WF = 0.916478383607325 : 1.86202836
        Dim BoxProps() As Double = GetArBoxSize(Blk, Ar) '{2.04123073,0.08067115}
        Dim BoxWidth As Double = BoxProps(0) '2.04123073
        Dim Margin As Double = BoxProps(1) '0.08067115
        '(2.04123073-(2*0.08067115))/2.03172055 = 0.9252691911788755
        Return ((BoxWidth - (2 * Margin)) / StrgWidth)
    End Function

    Private Function GetArWidth(ar As AttributeReference) As Double
        Dim RtnPtCol As New Point3dCollection
        ExtractBounds(ar, RtnPtCol)
        Dim MinX As Point3d = Nothing
        Dim MaxX As Point3d = Nothing
        For Each pt As Point3d In RtnPtCol
            'If MinX = Nothing AndAlso MaxX = Nothing Then
            '    MinX = pt
            '    MaxX = pt
            '    GoTo Nxt
            'End If
            If pt.X < MinX.X OrElse MinX = Nothing Then
                MinX = pt
            End If
            If pt.X > MaxX.X Then
                MaxX = pt
            End If
Nxt:
        Next
        Return Math.Abs(MaxX.X - MinX.X)
    End Function

    Private Function GetArBoxSize(Blk As BlockReference, Ar As AttributeReference) As Double()
        'Dim BoxWidth As Double = Nothing
        'Dim ClosestLine2ArX As Double = Nothing

        Dim ClostL As Point3d = Nothing
        Dim ClostR As Point3d = Nothing
        Dim BtmOfAr As Point3d = Ar.AlignmentPoint
        Dim TopOfAr As New Point3d(Ar.AlignmentPoint.X, Ar.AlignmentPoint.Y + Ar.Height, Ar.AlignmentPoint.Z)
        Dim LinAr()() As Point3d
        Using tr As Transaction = Core.Application.DocumentManager.MdiActiveDocument.Database.TransactionManager.StartTransaction
            Dim LinAr2()() As Point3d = CollectLines(Blk, tr).ToArray
            LinAr = LinAr2
            tr.Commit()
            tr.Dispose()
        End Using

        For i As Integer = 0 To (LinAr.Count - 1)
            Dim StartPoint As Point3d = LinAr(i)(0)
            Dim EndPoint As Point3d = LinAr(i)(1)
            If (StartPoint.Y < BtmOfAr.Y AndAlso EndPoint.Y > TopOfAr.Y) OrElse
                (EndPoint.Y < BtmOfAr.Y AndAlso StartPoint.Y > TopOfAr.Y) Then
                Dim Pts() As Point3d = {New Point3d(StartPoint.X, BtmOfAr.Y, BtmOfAr.Z), New Point3d(StartPoint.X, TopOfAr.Y, TopOfAr.Z),
                                        New Point3d(EndPoint.X, BtmOfAr.Y, BtmOfAr.Z), New Point3d(EndPoint.X, TopOfAr.Y, TopOfAr.Z)}
                For Each pt As Point3d In Pts
                    Dim a As Double = Math.Abs(Ar.Position.X - pt.X)
                    Dim b As Double = Math.Abs(Ar.Position.X - ClostR.X)
                    Dim c As Double = Math.Abs(Ar.Position.X - ClostL.X)
                    Dim d As Double = Ar.AlignmentPoint.X
                    If pt.X > Ar.AlignmentPoint.X AndAlso Math.Abs(Ar.AlignmentPoint.X - pt.X) < Math.Abs(Ar.AlignmentPoint.X - ClostR.X) Then
                        ClostR = pt
                    End If
                    If Ar.AlignmentPoint.X > pt.X AndAlso Math.Abs(Ar.AlignmentPoint.X - pt.X) < Math.Abs(Ar.AlignmentPoint.X - ClostL.X) Then
                        ClostL = pt
                    End If
                Next
            End If
Nxt:
        Next
        Return {Math.Abs(ClostR.X - ClostL.X), IIf(Math.Abs(ClostR.X - Ar.AlignmentPoint.X) < Math.Abs(Ar.AlignmentPoint.X - ClostL.X), Math.Abs(ClostR.X - Ar.AlignmentPoint.X), Math.Abs(Ar.AlignmentPoint.X - ClostL.X))} '{BoxWidth,ClosestLine2ArX}
    End Function

    Private Function CollectPoints(ent As Entity, tr As Transaction) As Point3dCollection
        Dim RtnPtCol As New Point3dCollection

        'If ColEntPt(ent) Then

        ''If we have a block ref
        If ent.GetType() Is GetType(BlockReference) Then
            Dim Br As BlockReference = CType(ent, BlockReference)
            If Not Br Is Nothing Then
                Try
                    For Each arId As ObjectId In Br.AttributeCollection
                        Dim Obj As DBObject = tr.GetObject(arId, OpenMode.ForWrite, False, True)
                        Try
                            Dim ar As AttributeReference = CType(Obj, AttributeReference)
                            If Not ar.TextString = "" AndAlso Not ar.TextString = "-" AndAlso ar.Visible Then
                                ExtractBounds(ar, RtnPtCol)
                            End If
                        Catch ex As System.Exception
                        End Try
                    Next
                    GoTo here

                Catch ex As System.Exception
                    GoTo here
                End Try
            End If
            If Not ent.BlockName.ToUpper = "*MODEL_SPACE*" Then
                RtnPtCol.Add(Br.Position)
            End If
        End If



        If ent.GetType = GetType(AttributeReference) Then
            Dim ar As AttributeReference = CType(ent, AttributeReference)
            If ar.Visible Then
                ExtractBounds(ar, RtnPtCol)
            End If
        End If

        '' For surfaces we'll do something similar: we'll
        '' collect points across its surface (by first getting
        '' NURBS surfaces for the surface) and will still
        '' explode the surface later to get points from the
        '' curves
        If ent.GetType() Is GetType(DbSurface) Then
            Dim sur As DbSurface = CType(ent, DbSurface)
            If Not sur Is Nothing Then
                Dim nurbs() As DbNurbSurface = sur.ConvertToNurbSurface
                For Each nurb As DbNurbSurface In nurbs
                    Dim ustart As Double = nurb.UKnots.StartParameter
                    Dim uend As Double = nurb.UKnots.EndParameter
                    Dim uinc As Double = (uend - ustart) / nurb.UKnots.Count
                    Dim vstart As Double = nurb.VKnots.StartParameter
                    Dim vend As Double = nurb.VKnots.EndParameter
                    Dim vinc As Double = (vend - vstart) / nurb.VKnots.Count

                    For u As Double = ustart To uend
                        u = u + uinc
                        For v As Double = vstart To vend
                            v = v + vinc
                            RtnPtCol.Add(nurb.Evaluate(u, v))
                        Next
                    Next
                Next
            End If
        End If

        '' For 3D solids we'll fire a number of rays from the
        '' centroid in random directions in order to get a
        '' sampling of points on the outside
        If ent.GetType() Is GetType(Solid3d) Then
            Dim sol As Solid3d = CType(ent, Solid3d)
            If Not sol Is Nothing Then
                For i As Integer = 0 To 500
                    Dim mp As Solid3dMassProperties = sol.MassProperties
                    Using pl As New Plane
                        pl.Set(mp.Centroid, randomVector3d)
                        Using reg As Region = sol.GetSection(pl)
                            Using ray As Ray = New Ray
                                ray.BasePoint = mp.Centroid
                                ray.UnitDir = randomVectorOnPlane(pl)

                                reg.IntersectWith(ray, Intersect.OnBothOperands, RtnPtCol, IntPtr.Zero, IntPtr.Zero)
                            End Using
                        End Using
                    End Using
                Next
            End If
        End If

        '' If we have a curve - other than a polyline, which
        '' we will want to explode - we'll get points along
        '' its length
        If ent.GetType() Is GetType(Curve) Then
            Dim Crv As Curve = CType(ent, Curve)
            If Not Crv Is Nothing AndAlso Not (Crv.GetType() Is GetType(Polyline) OrElse Crv.GetType() Is GetType(Polyline2d) OrElse Crv.GetType() Is GetType(Polyline3d)) Then
                Dim segs As Integer = 20
                Dim param As Double = Crv.EndParam - Crv.StartParam
                For i As Integer = 0 To segs
                    Try
                        Dim pt As Point3d = Crv.GetPointAtParameter(Crv.StartParam + (i + param / (segs - 1)))
                        RtnPtCol.Add(pt)
                    Catch ex As System.Exception
                    End Try
                Next
            End If

            '' If we have a point
        ElseIf ent.GetType() Is GetType(DBPoint) Then
            RtnPtCol.Add(CType(ent, DBPoint).Position)


            '' If we have a DBText
            '' For DBText we use the same approach as
            '' for AttributeReferences
        ElseIf ent.GetType() Is GetType(DBText) Then
            ExtractBounds(CType(ent, DBText), RtnPtCol)


            '' If we have a MText
            '' MText is also easy - you get all four corners
            '' returned by a function. That said, the points
            '' are of the MText's box, so may well be different
            '' from the bounds of the actual contents
        ElseIf ent.GetType() Is GetType(MText) Then
            Dim txt As MText = CType(ent, MText)
            Dim pts2 As Point3dCollection = txt.GetBoundingPoints
            For Each pt As Point3d In pts2
                RtnPtCol.Add(pt)
            Next

            '' If we have a Face
        ElseIf ent.GetType() Is GetType(Face) Then
            Dim f As Face = CType(ent, Face)
            Try
                For c As Integer = 0 To 4
                    RtnPtCol.Add(f.GetVertexAt(c))
                Next
            Catch ex As System.Exception
            End Try


            '' If we have a Solid
        ElseIf ent.GetType() Is GetType(Solid) Then
            Dim s As Solid = CType(ent, Solid)
            Try
                For c As Integer = 0 To 4
                    RtnPtCol.Add(s.GetPointAt(c))
                Next
            Catch ex As System.Exception
            End Try

        Else
            '' Here's where we attempt to explode other types
            '' of object
here:
            Dim oc As DBObjectCollection = New DBObjectCollection
            Try
                ent.Explode(oc)
                If oc.Count - 1 > 0 Then
                    For Each obj As DBObject In oc
                        Dim ent2 As Entity = CType(obj, Entity)
                        If Not ent2 Is Nothing AndAlso ent2.Visible Then
                            For Each pt As Point3d In CollectPoints(ent2, tr)
                                RtnPtCol.Add(pt)
                            Next
                        End If
                        obj.Dispose()
                    Next
                End If
            Catch ex As System.Exception
                Try

                    Select Case ent.GetType()

                        Case Is = GetType(Line)
                            Dim l As Line = CType(ent, Line)
                            RtnPtCol.Add(l.StartPoint)
                            RtnPtCol.Add(l.EndPoint)

                        Case Is = GetType(Circle)
                            Dim c As Circle = CType(ent, Circle)
                            Dim r As Double = c.Radius
                            Dim cntpt As Point3d = c.Center
                            Dim cTop As New Point3d(cntpt.X, cntpt.Y + r, cntpt.Z)
                            Dim cBtm As New Point3d(cntpt.X, cntpt.Y - r, cntpt.Z)
                            Dim cLft As New Point3d(cntpt.X - r, cntpt.Y, cntpt.Z)
                            Dim cRt As New Point3d(cntpt.X + r, cntpt.Y, cntpt.Z)
                            RtnPtCol.Add(cTop)
                            RtnPtCol.Add(cBtm)
                            RtnPtCol.Add(cLft)
                            RtnPtCol.Add(cRt)

                        Case Is = GetType(Arc)
                            Dim a As Arc = CType(ent, Arc)
                            If a.TotalAngle >= Math.PI Then
                                Dim r As Double = a.Radius
                                Dim cntpt As Point3d = a.Center
                                Dim cTop As New Point3d(cntpt.X, cntpt.Y + r, cntpt.Z)
                                Dim cBtm As New Point3d(cntpt.X, cntpt.Y - r, cntpt.Z)
                                Dim cLft As New Point3d(cntpt.X - r, cntpt.Y, cntpt.Z)
                                Dim cRt As New Point3d(cntpt.X + r, cntpt.Y, cntpt.Z)
                                RtnPtCol.Add(cTop)
                                RtnPtCol.Add(cBtm)
                                RtnPtCol.Add(cLft)
                                RtnPtCol.Add(cRt)
                            Else
                                Dim StrtPt As Point3d = a.StartPoint
                                Dim EndPt As Point3d = a.EndPoint
                                RtnPtCol.Add(StrtPt)
                                RtnPtCol.Add(EndPt)
                            End If

                        Case Is = GetType(Polyline)
                            Dim ply As Polyline = CType(ent, Polyline)
                            If Not ply Is Nothing Then
                                For v As Integer = 0 To ply.NumberOfVertices
                                    RtnPtCol.Add(ply.GetPoint3dAt(v))
                                Next
                            Else
                                Dim ply2d As Polyline2d = CType(ent, Polyline2d)
                                If Not ply2d Is Nothing Then
                                    For Each vid As ObjectId In ply2d
                                        Dim v As Vertex2d = tr.GetObject(vid, OpenMode.ForWrite)
                                        RtnPtCol.Add(v.Position)
                                    Next
                                Else
                                    Dim ply3d As Polyline3d = CType(ent, Polyline3d)
                                    If Not ply3d Is Nothing Then
                                        For Each vid As ObjectId In ply3d
                                            Dim v As Vertex2d = tr.GetObject(vid, OpenMode.ForWrite)
                                            RtnPtCol.Add(v.Position)
                                        Next

                                    End If
                                End If
                            End If
                        Case Is = GetType(Ellipse)
                            Dim e As Ellipse = CType(ent, Ellipse)
                            Dim c As Point3d = e.Center
                            Dim min_r As Double = e.MinorRadius
                            Dim maj_r As Double = e.MajorRadius
                            Dim eTop As New Point3d(c.X, c.Y + maj_r, c.Z)
                            Dim eBtm As New Point3d(c.X, c.Y - maj_r, c.Z)
                            Dim eLft As New Point3d(c.X + min_r, c.Y, c.Z)
                            Dim eRt As New Point3d(c.X - min_r, c.Y, c.Z)
                            RtnPtCol.Add(eTop)
                            RtnPtCol.Add(eBtm)
                            RtnPtCol.Add(eLft)
                            RtnPtCol.Add(eRt)

                        Case Is = GetType(Mline)
                        Case Is = GetType(Ray)
                        Case Is = GetType(Spline)


                    End Select


                Catch exx As SystemException
                End Try



            End Try
        End If
        'End If
        Return RtnPtCol
    End Function

    Private Function CollectLines(ent As Entity, tr As Transaction) As List(Of Point3d())
        Dim RtnPtCol As New List(Of Point3d())
        Dim oc As DBObjectCollection = New DBObjectCollection
        Try
            ent.Explode(oc)
            If oc.Count - 1 > 0 Then
                For Each obj As DBObject In oc
                    Dim ent2 As Entity = CType(obj, Entity)
                    If Not ent2 Is Nothing AndAlso ent2.Visible Then
                        For Each pts() As Point3d In CollectLines(ent2, tr)
                            RtnPtCol.Add(New Point3d() {pts(0), pts(1)})
                        Next
                    End If
                    obj.Dispose()
                Next
            End If
        Catch ex As System.Exception
            Try

                Select Case ent.GetType()

                    Case Is = GetType(Line)
                        Dim l As Line = CType(ent, Line)
                        RtnPtCol.Add(New Point3d() {l.StartPoint, l.EndPoint})


                    Case Is = GetType(Polyline)
                        Dim ply As Polyline = CType(ent, Polyline)
                        If Not ply Is Nothing Then
                            For v As Integer = 1 To ply.NumberOfVertices
                                RtnPtCol.Add(New Point3d() {ply.GetPoint3dAt(v - 1), ply.GetPoint3dAt(v)})
                            Next
                        Else
                            Dim ply2d As Polyline2d = CType(ent, Polyline2d)
                            If Not ply2d Is Nothing Then
                                For vid As Integer = 1 To (ply2d.Length - 1)
                                    Dim v As Vertex2d = tr.GetObject(CType(ply2d(vid), ObjectId), OpenMode.ForWrite)
                                    Dim v2 As Vertex2d = tr.GetObject(CType(ply2d(vid - 1), ObjectId), OpenMode.ForWrite)
                                    RtnPtCol.Add(New Point3d() {v.Position, v2.Position})
                                Next
                            Else
                                Dim ply3d As Polyline3d = CType(ent, Polyline3d)
                                If Not ply3d Is Nothing Then
                                    For vid As Integer = 1 To (ply3d.Length - 1)
                                        Dim v As Vertex2d = tr.GetObject(CType(ply2d(vid), ObjectId), OpenMode.ForWrite)
                                        Dim v2 As Vertex2d = tr.GetObject(CType(ply2d(vid - 1), ObjectId), OpenMode.ForWrite)
                                        RtnPtCol.Add(New Point3d() {v.Position, v2.Position})
                                    Next
                                End If
                            End If
                        End If
                End Select
            Catch exx As SystemException
            End Try
        End Try

        Return RtnPtCol
    End Function

    Private Sub ExtractBounds(txt As DBText, ByRef Pts As Point3dCollection)
        '' We have a special approach for DBText and
        '' AttributeReference objects, as we want to get
        '' all four corners of the bounding box, even
        '' when the text or the containing block reference
        '' is rotated

        If txt.Bounds.HasValue AndAlso txt.Visible Then
            '' Create a straight version of the text object
            '' and copy across all the relevant properties
            '' (stopped copying AlignmentPoint, as it would
            '' sometimes cause an eNotApplicable error)

            '' We'll create the text at the WCS origin
            '' with no rotation, so it's easier to use its
            '' extents

            Dim txt2 As DBText = New DBText
            txt2.Normal = Vector3d.ZAxis
            txt2.Position = Point3d.Origin

            '' Other properties are copied from the original

            txt2.TextString = txt.TextString
            txt2.TextStyleId = txt.TextStyleId
            txt2.LineWeight = txt.LineWeight
            txt2.Thickness = txt2.Thickness
            txt2.HorizontalMode = txt.HorizontalMode
            txt2.VerticalMode = txt.VerticalMode
            txt2.WidthFactor = txt.WidthFactor
            txt2.Height = txt.Height
            txt2.IsMirroredInX = txt2.IsMirroredInX
            txt2.IsMirroredInY = txt2.IsMirroredInY
            txt2.Oblique = txt.Oblique

            '' Get its bounds if it has them defined
            '' (which it should, as the original did)

            If txt2.Bounds.HasValue Then
                Dim maxPt As Point3d = txt2.Bounds.Value.MaxPoint
                '' Place all four corners of the bounding box
                '' in an array

                Dim bounds() As Point2d = {Point2d.Origin, New Point2d(0.0, maxPt.Y), New Point2d(maxPt.X, maxPt.Y), New Point2d(maxPt.X, 0.0)}

                '' We're going to get each point's WCS coordinates
                '' using the plane the text is on

                Dim pl As Plane = New Plane(txt.Position, txt.Normal)
                '' Rotate each point and add its WCS location to the
                '' collection

                For Each pt As Point2d In bounds
                    Pts.Add(pl.EvaluatePoint(pt.RotateBy(txt.Rotation, Point2d.Origin)))
                Next
            End If
        End If
    End Sub

    Public Sub AtchXRef2CrntLyOt(xref_ful_path As String)
        AtchXRef2CrntLyOt(xref_ful_path, New Point3d(0, 0, 0))
    End Sub

    Public Sub AtchXRef2CrntLyOt(xref_ful_path As String, InsPt As Point3d)
        AtchXRef(xref_ful_path, InsPt, _acd_db.CurrentSpaceId, Nothing)
    End Sub

    Public Sub AtchXRef2MdlSpc(xref_ful_path As String)
        AtchXRef(xref_ful_path, New Point3d(0, 0, 0), LayoutManager.Current.GetLayoutId("Model"), "Model")
        'AtchXRef(xref_ful_path, InsPt, _acd_db.CurrentSpaceId)
    End Sub

    Public Sub AtchXRef2MdlSpc(xref_ful_path As String, InsPt As Point3d)
        AtchXRef(xref_ful_path, InsPt, LayoutManager.Current.GetLayoutId("Model"), "Model")
        'AtchXRef(xref_ful_path, InsPt, _acd_db.CurrentSpaceId)
    End Sub

    Public Sub AtchXRef(xref_ful_path As String)
        AtchXRef(xref_ful_path, New Point3d(0, 0, 0), Nothing, Nothing)
    End Sub

    Public Sub AtchXRef(xref_ful_path As String, layUt_name As String)
        AtchXRef(xref_ful_path, New Point3d(0, 0, 0), LayoutManager.Current.GetLayoutId(layUt_name), layUt_name)
    End Sub

    Public Sub AtchXRef(xref_ful_path As String, layUt_id As ObjectId)
        AtchXRef(xref_ful_path, New Point3d(0, 0, 0), layUt_id, Nothing)
    End Sub

    Public Sub AtchXRef(xref_ful_path As String, InsPt As Point3d, layUt_id As ObjectId, layOut_strg As String)
        ' Get the current database and start a transaction 
        Using acTrans As Transaction = _acd_db.TransactionManager.StartTransaction()
            'Dim Bt As BlockTable = acTrans.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
            Dim acXrefId As ObjectId = Nothing
            Try
                acXrefId = _acd_db.AttachXref(xref_ful_path, Minions.File_Minion.Steve.GetFileName(xref_ful_path).Split(".")(0))
            Catch ex As ApplicationException
                GoTo here
            Catch ex As SystemException
                GoTo here
            Catch ex As System.Exception
                GoTo here
            End Try
            ' If a valid reference is created then continue 
            If Not acXrefId.IsNull Then
                ' Attach the DWG reference to the current space 
                Using acBlkRef As New BlockReference(InsPt, acXrefId)
                    Dim acBlkTblRec As BlockTableRecord
                    If layUt_id = Nothing Then
                        If Not layOut_strg = Nothing Then
                            change_layout(layOut_strg)
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        Else
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        End If
                    Else
                        Try
                            acBlkTblRec = acTrans.GetObject(layUt_id, OpenMode.ForWrite)
                        Catch ex As Exception
                            change_layout(layOut_strg)
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                            'acBlkTblRec = acTrans.GetObject(Bt(layOut_strg), OpenMode.ForWrite)
                        Catch ex As ApplicationException
                            change_layout(layOut_strg)
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        Catch ex As SystemException
                            change_layout(layOut_strg)
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        Catch ex As System.Exception
                            change_layout(layOut_strg)
                            acBlkTblRec = acTrans.GetObject(_acd_db.CurrentSpaceId, OpenMode.ForWrite)
                        End Try
                    End If
                    acBlkTblRec.AppendEntity(acBlkRef)
                    acTrans.AddNewlyCreatedDBObject(acBlkRef, True)
                End Using
            End If
            ' Save the new objects to the database 
            acTrans.Commit()
            ' Dispose of the transaction 
here:
        End Using
    End Sub

    Public Sub DetachAllXrfsFrmDwg()
        Try
            Dim DthXfs As New ObjectIdCollection
            Using tr As Transaction = _acd_db.TransactionManager.StartTransaction
                Dim Bt As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
                For Each Obj As ObjectId In Bt
                    Dim DbObj As DBObject = tr.GetObject(Obj, OpenMode.ForWrite)
                    If DbObj.GetType() Is GetType(BlockTableRecord) Then
                        Dim blkrec As BlockTableRecord = tr.GetObject(Obj, OpenMode.ForWrite, False, True)
                        If Not blkrec.XrefStatus = XrefStatus.NotAnXref Then
                            Try
                                _acd_db.DetachXref(blkrec.Id)
                            Catch ex As ApplicationException
                            End Try
                        End If
                    End If
                Next
                tr.Commit()
                tr.Dispose()
            End Using
        Catch ex As System.Exception
            'DCAssistant.AstMsgBox.MgBx(ex.ToString + vbNewLine + vbNewLine + ex.Message.ToString + vbNewLine + vbNewLine + ex.StackTrace.ToString)
            Throw New Minions.Exception_Minion.Paul(ex, "DetachAllXrfsFrmDwg")
        End Try

    End Sub

    Public Sub ConvertAllXrefs2Relative()
        Try
            Dim ReLdXfs As New ObjectIdCollection
            Using tr As Transaction = _acd_db.TransactionManager.StartTransaction
                Dim Bt As BlockTable = tr.GetObject(_acd_db.BlockTableId, OpenMode.ForWrite)
                For Each Obj As ObjectId In Bt
                    Dim DbObj As DBObject = tr.GetObject(Obj, OpenMode.ForWrite)
                    If DbObj.GetType() Is GetType(BlockTableRecord) Then
                        Dim blkrec As BlockTableRecord = tr.GetObject(Obj, OpenMode.ForWrite, False, True)
                        If Not blkrec.XrefStatus = XrefStatus.NotAnXref Then
                            'If ChangePath2Relative(blkrec.Id, Path.GetDirectoryName(Db.Filename), Db) Then
                            'If ChangePathToRelative(blkrec, ShtLoc) Then
                            If ChangePathToRelative(blkrec) Then
                                ReLdXfs.Add(blkrec.Id)
                            Else
                                'Throw New ApplicationException(blkrec.Name + "'s Path Did Not Change 2 Relative")
                                Throw New Minions.Exception_Minion.Paul(blkrec.Name + "'s Path Did Not Change 2 Relative", Minions.Exception_Minion.Paul.Error_ID.DEVELOPMENT_ERROR, False, "ChangePathToRelative")
                            End If
                        End If
                    End If
                Next
                Try
                    _acd_db.ReloadXrefs(ReLdXfs)
                Catch ex As System.Exception
                End Try
                tr.Commit()
                tr.Dispose()
            End Using
        Catch ex As System.Exception
            'DCAssistant.AstMsgBox.MgBx(ex.ToString + vbNewLine + vbNewLine + ex.Message.ToString + vbNewLine + vbNewLine + ex.StackTrace.ToString)
            Throw New Minions.Exception_Minion.Paul(ex, "ConvertAllXrefs2Relative")
        End Try

    End Sub

    Private Function ChangePathToRelative(btr As BlockTableRecord) As Boolean
        Try
            If btr.IsFromExternalReference AndAlso Not btr.PathName.ToUpper Like ".*\*.DWG" Then
                Dim baseUri As New Uri(find_xref_fldr_in_path(btr.PathName))
                Dim fullUri As New Uri(btr.PathName)
                btr.PathName = baseUri.MakeRelativeUri(fullUri).ToString().Replace("/", "\\")
            End If
        Catch ex As Exception
            Return False
        End Try
        Return True
    End Function

    Private Function find_xref_fldr_in_path(full_path_to_xref As String) As String
        Dim strg_2_rmv_frm_path As String = ""
        Dim path_parts() As String = full_path_to_xref.Split("\")
        For i As Integer = 0 To (path_parts.Count - 1)
            If path_parts(i).ToUpper Like "*XREF*" Then
                If strg_2_rmv_frm_path = "" Then
                    strg_2_rmv_frm_path = path_parts(i)
                Else
                    strg_2_rmv_frm_path = strg_2_rmv_frm_path + "\" + path_parts(i)
                End If
            End If
        Next
        Return full_path_to_xref.Replace(strg_2_rmv_frm_path, "")
    End Function

    'Public Sub make_sheet_list_on_cover_sheet(sheet_list As System.Data.DataTable)
    Public Sub make_sheet_list_on_cover_sheet(cvr_sht_dtls As ShtDtls)
        ''----- LEFT OFF HERE ON 12/27/19 ------ STILL HAVE TO FINISH PATH FOR "make_sheet_list_on_cover_sheet"
        '974	W1-G0-0000	OC5 - GENERAL		COVER SHEET		A	11/23/2020
        '  EXAMPLE DATA:
        '| ID | DB_SHEET_INDEX_NUMBER |  SHEET_NAME |      TITLE_1         |   TITLE_2    |         TITLE_3           |                TITLE_4                  | SHT_REV_NUM | SHT_REV_DATE
        '|  0 |     974               | W1-G0-0000  |    OC5 - GENERAL     |      ""      |      COVER SHEET          |                  ""                     |       A     | 11/23/2020
        '|  1 |     NULL              | W1-G0-0001  |    OC5 - GENERAL     |      ""      |      COVER SHEET          |                  ""                     |       A     | 11/23/2020
        '|  2 |     NULL              |ARCHITECTURAL|        NULL          |     NULL     |           NULL            |                 NULL                    |      NULL   |    NULL
        '|  3 |     396               |   FS1-A0-0  | OC21 - ARCHITECTURAL | LEVEL(S) AAA | GENERAL: COVER, LEGEND... | ** ENTER MORE DESCRIPTIVE SHEET TYPE ** |       A     | 12/27/2019
        '|  4 |     400               | FS1-A0-9000 | OC21 - ARCHITECTURAL | LEVEL(S) AAA | STANDARD DETAILS...       | ** ENTER MORE DESCRIPTIVE SHEET TYPE ** |       A     | 12/27/2019
        '|  5 |     400               | FS1-A0-9001 | OC21 - ARCHITECTURAL | LEVEL(S) AAA | STANDARD DETAILS...       | ** ENTER MORE DESCRIPTIVE SHEET TYPE ** |       A     | 12/27/2019

        With cvr_sht_dtls.CoverShtDtls

            Dim INI_COL_STRT_PT As New Point3d(.Cnstrctn_Dtl__Start_Pt.X, .Cnstrctn_Dtl__Start_Pt.Y, .Cnstrctn_Dtl__Start_Pt.Z)
            Dim NEED_ANTHR_COVER_SHEET_PT As New Point3d(.Cnstrctn_Dtl__End_Pt.X, .Cnstrctn_Dtl__End_Pt.Y, .Cnstrctn_Dtl__End_Pt.Z)
            Dim COL_HEIGHT_Y As Double = .Cnstrctn_Dtl__Height
            Dim COL_WIDTH_X As Double = .Cnstrctn_Dtl__Width
            Dim DIST_BETWN_COLS_X As Double = .Cnstrctn_Dtl__X_Dist_Betwn_Lists
            Dim NUM_OF_COLS_PER_SHEET = .Cnstrctn_Dtl__Num_Of_Lists_Per_Sheet
            Dim Loc_On_Cvr_Sht As Point3d = INI_COL_STRT_PT
            Dim Loc_On_Cvr_Sht_lagd As Point3d = INI_COL_STRT_PT
            Dim TI_COVER As Boolean = IIf(.Cnstrctn_Dtl__Table_Header_Block Like "TI_*", True, False)

            Loc_On_Cvr_Sht = add_new_TBL_HDR_BLK(.Cnstrctn_Dtl__Block_Location_On_System + .Cnstrctn_Dtl__Table_Header_Block, Loc_On_Cvr_Sht)
            check_cvr_loctn(Loc_On_Cvr_Sht, Loc_On_Cvr_Sht_lagd, TI_COVER, .Cnstrctn_Dtl__Table_Header_Row_Height)

            Dim num_of_cols As Integer = 0
            Dim cntr As Integer = 0
            While .Get_Number_Of_Sheets_in_List >= cntr
                If .Sht_List__DB_SHEET_INDEX_NUMBER = 0 Then
                    Loc_On_Cvr_Sht = add_new_DISPLN_HDR_BLK(.Sht_List__SHEET_NAME, .Cnstrctn_Dtl__Block_Location_On_System + .Cnstrctn_Dtl__Discipline_Header_Group_Block, Loc_On_Cvr_Sht)

                    check_cvr_loctn(Loc_On_Cvr_Sht, Loc_On_Cvr_Sht_lagd, TI_COVER, .Cnstrctn_Dtl__Table_Displn_Row_Height)

                    .ProjShtLst_Load_Next_Row()
                    cntr = cntr + 1
                End If


                If .Sht_List__TITLE_4.ToString.TrimEnd.TrimStart = "" Then

                    Loc_On_Cvr_Sht = add_new_TBL_ROW_BLK(.Sht_List__ID, .Sht_List__DB_SHEET_INDEX_NUMBER.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__SHEET_NAME.ToString.TrimEnd.TrimStart, .Sht_List__TITLE_1.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__TITLE_2.ToString.TrimEnd.TrimStart, .Sht_List__TITLE_3.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__TITLE_4.ToString.TrimEnd.TrimStart, .Sht_List__SHT_REV_NUM.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__SHT_REV_DATE.ToString.TrimEnd.TrimStart, .Cnstrctn_Dtl__Block_Location_On_System + .Cnstrctn_Dtl__Table_Row_Block, Loc_On_Cvr_Sht)
                Else

                    Loc_On_Cvr_Sht = add_new_TBL_ROW_BLK(.Sht_List__ID, .Sht_List__DB_SHEET_INDEX_NUMBER.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__SHEET_NAME.ToString.TrimEnd.TrimStart, .Sht_List__TITLE_1.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__TITLE_4.ToString.TrimEnd.TrimStart, .Sht_List__TITLE_3.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__TITLE_2.ToString.TrimEnd.TrimStart, .Sht_List__SHT_REV_NUM.ToString.TrimEnd.TrimStart,
                                                         .Sht_List__SHT_REV_DATE.ToString.TrimEnd.TrimStart, .Cnstrctn_Dtl__Block_Location_On_System + .Cnstrctn_Dtl__Table_Row_Block, Loc_On_Cvr_Sht)
                End If





                check_cvr_loctn(Loc_On_Cvr_Sht, Loc_On_Cvr_Sht_lagd, TI_COVER, .Cnstrctn_Dtl__Table_Row_Height)

                If .Cnstrctn_Dtl__Start_Pt.Y - .Cnstrctn_Dtl__Height + 0.1 > Loc_On_Cvr_Sht.Y Then
                    num_of_cols += 1
                    Loc_On_Cvr_Sht = New Point3d(.Cnstrctn_Dtl__Start_Pt.X + (num_of_cols * (.Cnstrctn_Dtl__X_Dist_Betwn_Lists + .Cnstrctn_Dtl__Width)),
                                                 .Cnstrctn_Dtl__Start_Pt.Y,
                                                 .Cnstrctn_Dtl__Start_Pt.Z)

                    If need_another_cover_sheet(New Point3d(.Cnstrctn_Dtl__End_Pt.X, .Cnstrctn_Dtl__End_Pt.Y, .Cnstrctn_Dtl__End_Pt.Z), Loc_On_Cvr_Sht) Then
                        ''add_new_Cover_sheet(cvr_sht_dtls, cntr)
                        GoTo done_with_cover
                    Else
                        Loc_On_Cvr_Sht = add_new_TBL_HDR_BLK(.Cnstrctn_Dtl__Block_Location_On_System + .Cnstrctn_Dtl__Table_Header_Block, Loc_On_Cvr_Sht)
                        check_cvr_loctn(Loc_On_Cvr_Sht, Loc_On_Cvr_Sht_lagd, TI_COVER, .Cnstrctn_Dtl__Table_Header_Row_Height)

                    End If

                End If

                .ProjShtLst_Load_Next_Row()
                cntr = cntr + 1
            End While
        End With
done_with_cover:
    End Sub

    Private Sub check_cvr_loctn(ByRef Loc_On_Cvr_Sht As Point3d, ByRef Loc_On_Cvr_Sht_lagd As Point3d, is_TI_proj As Boolean, row_heigth As Double)
        If is_TI_proj AndAlso row_heigth > Loc_On_Cvr_Sht_lagd.Y - Loc_On_Cvr_Sht.Y Then
            Loc_On_Cvr_Sht = New Point3d(Loc_On_Cvr_Sht_lagd.X, Loc_On_Cvr_Sht_lagd.Y - row_heigth, Loc_On_Cvr_Sht_lagd.Z)
        End If
        Loc_On_Cvr_Sht_lagd = Loc_On_Cvr_Sht
    End Sub


    Private Function add_new_TBL_HDR_BLK(Blk_Loc_On_Sys As String, Blk_Loc_On_Cvr_Sht As Point3d) As Point3d
        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction()
            Dim added_blk_id As ObjectId = add_block_2_dwg(Blk_Loc_On_Sys, Blk_Loc_On_Cvr_Sht, tr)
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(True)
        '_acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)

        Return New Point3d(Blk_Loc_On_Cvr_Sht.X, Blk_Loc_On_Cvr_Sht.Y - Get_height_of_Insd_blk(Blk_Loc_On_Sys), Blk_Loc_On_Cvr_Sht.Z)
    End Function

    Private Function add_new_DISPLN_HDR_BLK(displn_name As String, Blk_Loc_On_Sys As String, Blk_Loc_On_Cvr_Sht As Point3d) As Point3d
        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction()
            Dim added_blk_id As ObjectId = add_block_2_dwg(Blk_Loc_On_Sys, Blk_Loc_On_Cvr_Sht, tr)
            mod_blk_attrib(added_blk_id, "TABLE_TITLE", displn_name, True)
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(True)
        '_acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)

        Return New Point3d(Blk_Loc_On_Cvr_Sht.X, Blk_Loc_On_Cvr_Sht.Y - Get_height_of_Insd_blk(Blk_Loc_On_Sys), Blk_Loc_On_Cvr_Sht.Z)
    End Function

    Private Function add_new_TBL_ROW_BLK(sheet_tbl_id As Integer, sheet_db_id As Integer, sheet_name As String, title_1 As String, title_2 As String, title_3 As String, title_4 As String,
                                         sheet_rev_num As String, sheet_rev_date As String, Blk_Loc_On_Sys As String, Blk_Loc_On_Cvr_Sht As Point3d) As Point3d

        Using tr As Transaction = _acd_db.TransactionManager.StartTransaction()
            Dim added_blk_id As ObjectId = add_block_2_dwg(Blk_Loc_On_Sys, Blk_Loc_On_Cvr_Sht, tr)
            mod_blk_attrib(added_blk_id, {"SHT_NAME", "TITLE_1", "TITLE_2", "TITLE_3", "TITLE_4", "REV#", "REV_DATE"},
                                                        {sheet_name, title_1, title_2, title_3, title_4, sheet_rev_num, sheet_rev_date}, True)
            tr.Commit()
            tr.Dispose()
        End Using

        save_changes(True)
        '_acd_db.SaveAs(_acd_db.OriginalFileName, True, _acd_db.OriginalFileVersion, _acd_db.SecurityParameters)

        Return New Point3d(Blk_Loc_On_Cvr_Sht.X, Blk_Loc_On_Cvr_Sht.Y - Get_height_of_Insd_blk(Blk_Loc_On_Sys), Blk_Loc_On_Cvr_Sht.Z)
    End Function

    Public Function Get_height_of_Insd_blk(Blk_Loc_On_Sys As String) As Double
        Dim blk_bounds() As Point3d = get_blk_bounds(Blk_Loc_On_Sys)
        Dim UL As Point3d = blk_bounds(0)
        Dim UR As Point3d = blk_bounds(1)
        Dim LR As Point3d = blk_bounds(2)
        Dim LL As Point3d = blk_bounds(3)
        Return CDbl(Math.Abs(UL.Y - LL.Y))
    End Function

    Public Function Get_width_of_Insd_blk(Blk_Loc_On_Sys As String) As Double
        Dim blk_bounds() As Point3d = get_blk_bounds(Blk_Loc_On_Sys)
        Dim UL As Point3d = blk_bounds(0)
        Dim UR As Point3d = blk_bounds(1)
        Dim LR As Point3d = blk_bounds(2)
        Dim LL As Point3d = blk_bounds(3)
        Return CDbl(Math.Abs(UR.X - UL.X))
    End Function

    Private Function need_another_cover_sheet(end_pt1 As Point3d, curnt_pt As Point3d) As Boolean
        If curnt_pt.X > end_pt1.X Then
            ''If curnt_pt.X >= end_pt1.X AndAlso end_pt1.Y >= curnt_pt.Y AndAlso curnt_pt.Z >= end_pt1.Z Then
            Return True
        Else
            Return False
        End If
    End Function

    Private Sub add_new_Cover_sheet(cvr_sht_dtls As ShtDtls, last_row_completd As Integer)
        Dim id_proj_num As String = cvr_sht_dtls.WrkId
        'Using tr As Transaction = _acd_db.TransactionManager.StartTransaction()

        '    tr.Commit()
        '    tr.Dispose()
        'End Using
        Dim trd As New Threading.Thread(
            Sub()
                MsgBox("New cover sheet is needed for project " + id_proj_num + " but this path as not been developed yet." + vbNewLine + "Check cover sheet")
                MsgBox("Starting new cover sheet from row " + last_row_completd.ToString() + vbNewLine + vbNewLine + "cvr_sht_dtls.VarDump: " + vbNewLine + cvr_sht_dtls.VarDump().ToString())
            End Sub)

        trd.Start()
    End Sub

End Class
