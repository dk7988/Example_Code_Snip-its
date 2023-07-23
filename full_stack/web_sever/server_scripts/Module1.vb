Imports System.IO
Imports System.Management
Imports Minions.Sql_Minion.Mike
Imports Minions.File_Minion.Steve

Module Module1

    Private Gru As New Minions.Gru
    Private Scan_files_chk_in_loc As String = "<server_name>\<folder>\Check_in\"

    Sub Main()
        Dim args() As String = System.Environment.GetCommandLineArgs()
        Dim args_strg As String = ""
        For i As Integer = 0 To (args.Count - 1)
            If args_strg = "" Then
                args_strg = args(i)
            Else
                args_strg = args_strg + " " + args(i)
            End If
        Next
        Gru.Mike.GoToDB(Reason2Go2DB.LOG_WEB_SRVR_EXEC_CMD, args_strg)

        Dim cmd = args(1)
        Dim wkr_trd As System.Threading.Thread = Nothing
        'MsgBox("args(0): " + args(0).ToString + vbNewLine +
        '    "args(1): " + args(1).ToString + vbNewLine +
        '    "args(2): " + args(2).ToString + vbNewLine +
        '    "args(3): " + args(3).ToString + vbNewLine +
        '    "args(3): " + args(4).ToString)


        Select Case cmd
            Case "web_srvr_get_attchd_usb_data"
                wkr_trd = New Threading.Thread(Sub()
                                                   get_attchd_usb_data(args)
                                               End Sub)

            Case "web_srvr_eject_usb"
                wkr_trd = New Threading.Thread(Sub()
                                                   eject_usb(args)
                                               End Sub)

            Case "web_srvr_checkin_scans"
                wkr_trd = New Threading.Thread(Sub()
                                                   checkin_scans(args)
                                               End Sub)

            Case "web_srvr_checkout_scans"
                wkr_trd = New Threading.Thread(Sub()
                                                   checkout_scans(args)
                                               End Sub)

            Case "web_srvr_fix_scan_fldr"
                wkr_trd = New Threading.Thread(Sub()
                                                   fix_scan_proj_flde(args)
                                               End Sub)

            Case "web_srvr_fill_scan_dwnld_reqst"
                wkr_trd = New Threading.Thread(Sub()
                                                   fill_scan_dwnld_reqst(args)
                                               End Sub)

            Case "scans_auto_task"
                wkr_trd = New Threading.Thread(Sub()
                                                   brk_out_procsd_chk_in()
                                                   run_db_update_procs()
                                               End Sub)
            Case "scans_auto_task_with_stats"
                wkr_trd = New Threading.Thread(Sub()
                                                   brk_out_procsd_chk_in(True)
                                                   run_db_update_procs()
                                               End Sub)

            Case "reproce_scans_data_with_stats"
                wkr_trd = New Threading.Thread(Sub()
                                                   brk_out_procsd_chk_in(True, args(2))
                                                   run_db_update_procs()
                                               End Sub)


            Case "web_srvr_drv_fre_spc_vrfy"
                wkr_trd = New Threading.Thread(Sub()
                                                   If (args.Count - 1) > 3 Then
                                                       Dim i As Integer = -1
                                                       If Integer.TryParse(args(4), i) Then
                                                           _drv_fre_spc_vrfy(args)
                                                       ElseIf i = 0 Then
                                                           drv_fre_spc_vrfy(args)
                                                       End If
                                                   End If
                                               End Sub)

            Case Else

        End Select
        If Not wkr_trd Is Nothing Then
            wkr_trd.Start()
        End If

    End Sub

    Private Sub run_db_update_procs()
        Dim dg_wrker As New Threading.Thread(Sub()
                                                 Gru.Mike.GoToDB(Reason2Go2DB.AUTO_TASK_EXE_DB_UPDT_PROC, "")
                                             End Sub)
        dg_wrker.Start()
    End Sub


    Private Sub eject_usb(cnsl_args As String())
        Gru.Steve.eject_usb_drive(cnsl_args(2))

    End Sub

    ''   'expected call: location of this script file\Web_Server_Console_CMDs.exe web_srvr_checkin_scans 5 100101 H\Nick\Registrations
    Private Sub checkin_scans(cnsl_args As String())
        Dim usr_id As Integer = cnsl_args(2)
        'usr_id = 5
        Dim id_proj_num As String = cnsl_args(3)
        'id_proj_num = 100101
        Dim copy_frm As String = fix_url(cnsl_args(4))
        'copy_frm = H:\Scans\
        'Dim paste_to As String = fix_url(cnsl_args(5))
        ''MsgBox("processing check in request for project number: " + id_proj_num + vbNewLine +
        ''       "   copying content from: " + copy_frm + vbNewLine +
        ''       "   pasteing content to: " + paste_to + vbNewLine)
        'copy_paste_scan_files(usr_id, id_proj_num, copy_frm, paste_to, True)
        copy_paste_scan_files(usr_id, id_proj_num, copy_frm, Scan_files_chk_in_loc, True, True)
    End Sub

    Private Sub checkout_scans(cnsl_args As String())
        Dim usr_id As Integer = cnsl_args(2)
        'usr_id = 5
        Dim id_proj_num As String = cnsl_args(3)
        'id_proj_num = 100101
        Dim copy_frm As String = fix_url(cnsl_args(4))
        'copy_frm = H:\Scans\
        Dim paste_to As String = fix_url(cnsl_args(5))
        'MsgBox("processing check out request for project number: " + id_proj_num + vbNewLine +
        '       "   copying content from: " + copy_frm + vbNewLine +
        '       "   pasteing content to: " + paste_to + vbNewLine)
        copy_paste_scan_files(usr_id, id_proj_num, copy_frm, paste_to, False, False)
    End Sub


























    Private Function make_x_wide(n As Integer, strg As String)
        Dim rtn As String = ""
        If strg.Length < n Then
            For i As Integer = 0 To (n - 1 - strg.Length)
                If rtn = "" Then
                    rtn = "0" + strg
                Else
                    rtn = "0" + rtn
                End If
            Next
            Return rtn
        Else
            Return strg
        End If

    End Function



    Private Sub get_attchd_usb_data(cnsl_args As String())
        'cnsl_args(2) = 8457
        'cnsl_args(3) = 1813

        Dim vndr_id As String = make_x_wide(4, Hex(cnsl_args(2)))
        'vndr_id = 2109
        Dim prodct_id As String = make_x_wide(4, Hex(cnsl_args(3)))
        'prodct_id = 715

        Dim props As KeyValuePair(Of String, String)() = Nothing
        Dim usb As New usb_data(vndr_id, prodct_id)
        With usb
            .Find_USB_Info()

            'Console.WriteLine("Disk: " + i("Name").ToString())
            Try

                props = Add2Ar(New KeyValuePair(Of String, String)("PNP_DeviceID", .get_usb_info(usb_data.usb_info_type.USBController)("PNPDeviceID").ToString.TrimEnd.TrimStart), props)

                props = Add2Ar(New KeyValuePair(Of String, String)("Caption", .get_usb_info(usb_data.usb_info_type.DiskDrive)("Caption").ToString.TrimEnd.TrimStart), props)
                props = Add2Ar(New KeyValuePair(Of String, String)("SerialNumber", .get_usb_info(usb_data.usb_info_type.DiskDrive)("SerialNumber").ToString.TrimEnd.TrimStart), props)

                props = Add2Ar(New KeyValuePair(Of String, String)("DriveLetter", .get_usb_info(usb_data.usb_info_type.LogicalDisk)("Name").ToString.TrimEnd.TrimStart + "\"), props)
                props = Add2Ar(New KeyValuePair(Of String, String)("FreeSpace", UInt64.Parse(.get_usb_info(usb_data.usb_info_type.LogicalDisk)("FreeSpace")).ToString), props)
                props = Add2Ar(New KeyValuePair(Of String, String)("VolumeName", .get_usb_info(usb_data.usb_info_type.LogicalDisk)("VolumeName").ToString.TrimEnd.TrimStart), props)
                props = Add2Ar(New KeyValuePair(Of String, String)("VolumeSerialNumber", .get_usb_info(usb_data.usb_info_type.LogicalDisk)("VolumeSerialNumber").ToString.TrimEnd.TrimStart), props)

            Catch ex As Exception
            End Try
        End With


        Dim consle_msg As String = Nothing
        For i As Integer = 0 To (props.Count - 1)
            If consle_msg Is Nothing Then
                'consle_msg = "{" + props(i).Key + ":""" + props(i).Value + """}"
                consle_msg = " """ + props(i).Key + """:""" + props(i).Value.Replace("\", "\\") + """ "
                'consle_msg = " """ + props(i).Key + """:""" + props(i).Value + """ "
            Else
                'consle_msg = consle_msg + "," + "{" + props(i).Key + ":""" + props(i).Value + """}"
                consle_msg = consle_msg + ", """ + props(i).Key + """:""" + props(i).Value.Replace("\", "\\") + """ "
                'consle_msg = consle_msg + ", """ + props(i).Key + """:""" + props(i).Value + """ "
            End If
        Next

        Console.WriteLine("{" + consle_msg + "}")

    End Sub


    Private Function Add2Ar(_Value As KeyValuePair(Of String, String), Ar As KeyValuePair(Of String, String)()) As KeyValuePair(Of String, String)()
        Try
            Dim Ar2() = Ar
            Dim idx As Integer = Ar.Count * 1
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

    Private Function Add2Ar(_Value As DataTable, Ar() As DataTable) As DataTable()
        Try
            Dim Ar2() = Ar
            Dim idx As Integer = Ar.Count * 1
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

    Private Function Remove_from_Ar(ix As Integer, Ar() As DataTable) As DataTable()

        Try
            Dim Ar2() = Ar
            Dim idx As Integer = (Ar.Count * 1) - 2
            ReDim Ar(idx)
            For i As Integer = 0 To (Ar2.Count - 1)
                If ix > i Then
                    Ar(i) = Ar2(i)
                ElseIf i > ix Then
                    Ar(i - 1) = Ar2(i)
                End If

            Next
        Catch ex As Exception
            Throw ex
        End Try
        Return Ar
    End Function





    Private Function Add2Ar(_Value As Object, Ar() As Object) As Object()
        Try
            Dim Ar2() = Ar
            Dim idx As Integer = Ar.Count * 1
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
























    Private Class usb_data
        Private _vndr_id As String
        Private _prodct_id As String
        Private _drv_info As KeyValuePair(Of String, ManagementObject)() = Nothing

        Public Sub New(vndr_id As String, prodct_id As String)
            _vndr_id = vndr_id
            _prodct_id = prodct_id
        End Sub

        Public Enum usb_info_type
            USBController = 2
            DiskDrive = 3
            DiskPartition = 4
            LogicalDisk = 5
        End Enum

        Public Function get_usb_info(info_type As usb_info_type)
            Select Case info_type
                Case = usb_info_type.USBController
                    Dim rtn = test_found_usb_data("*PnPEntity.DeviceID=*", 0)
                    If rtn IsNot Nothing Then
                        Return rtn
                    Else
                        Return test_found_usb_data("*USBHub.DeviceID=*", 0)
                    End If
                    'Return _drv_info(0).Value
                Case = usb_info_type.DiskDrive
                    Return test_found_usb_data("*DiskDrive.DeviceID=*", 1)
                    'Return _drv_info(1).Value
                Case = usb_info_type.DiskPartition
                    Return test_found_usb_data("*DiskPartition.DeviceID=*", 2)
                    'Return _drv_info(2).Value
                Case = usb_info_type.LogicalDisk
                    Return test_found_usb_data("*LogicalDisk.DeviceID=*", 3)
                    'Return _drv_info(3).Value
                Case Else
                    Return Nothing
            End Select
        End Function

        Private Function test_found_usb_data(test_strg As String, idx_num_data_SHOULD_b_at As Integer)
            If Not _drv_info(idx_num_data_SHOULD_b_at).Value.ToString Like test_strg Then
                For i As Integer = idx_num_data_SHOULD_b_at + 1 To (_drv_info.Length - 1)
                    If _drv_info(i).Value.ToString Like test_strg Then
                        Return _drv_info(i).Value
                    End If
                Next
            Else
                Return _drv_info(idx_num_data_SHOULD_b_at).Value
            End If
            Return Nothing

        End Function





        Private Function Add2Ar(_Value As KeyValuePair(Of String, ManagementObject), Ar() As KeyValuePair(Of String, ManagementObject)) As KeyValuePair(Of String, ManagementObject)()
            Try
                Dim Ar2() = Ar
                Dim idx As Integer = Ar.Count * 1
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



        Public Sub Find_USB_Info()

            'Public Function Find_USB_Info(vndr_id As String, prodct_id As String) As KeyValuePair(Of String, ManagementObject)()
            Dim Secondentity As New List(Of String)
            Dim USBobjects As New List(Of String)
            Dim props As KeyValuePair(Of String, String)() = Nothing
            Dim drv As ManagementObject = Nothing
            'Dim drv_info As KeyValuePair(Of String, ManagementObject)() = Nothing

            For Each entity As ManagementObject In New ManagementObjectSearcher("select * from Win32_USBHub").Get()
                For Each controller As ManagementObject In entity.GetRelated("Win32_USBController")
                    For Each obj As ManagementObject In New ManagementObjectSearcher("ASSOCIATORS OF {Win32_USBController.DeviceID='" + controller("PNPDeviceID").ToString() + "'}").Get()
                        If obj.ToString().Contains("DeviceID") Then
                            USBobjects.Add(obj("DeviceID").ToString())
                            If obj("DeviceID").ToString() Like "*VID_" + _vndr_id + "&PID_" + _prodct_id + "*" Or
                                obj("DeviceID").ToString() Like "*VID&" + _vndr_id + "_PID&" + _prodct_id + "*" Then
                                'MsgBox("found device!! whoop whoop!")
                                Threading.Thread.Sleep(3000)
                                _drv_info = Add2Ar(New KeyValuePair(Of String, ManagementObject)("Win32_USBController", obj), _drv_info)
                                drv = obj
                                'props = Add2Ar(New KeyValuePair(Of String, String)("Name", obj("Name").ToString.TrimEnd.TrimStart), props)
                                'props = Add2Ar(New KeyValuePair(Of String, String)("DeviceID", obj("DeviceID").ToString.TrimEnd.TrimStart), props)
                                'props = Add2Ar(New KeyValuePair(Of String, String)("PNP_DeviceID", obj("PNPDeviceID").ToString.TrimEnd.TrimStart), props)
                                'props = Add2Ar(New KeyValuePair(Of String, String)("Caption", obj("caption").ToString.TrimEnd.TrimStart), props)
                                'props = Add2Ar(New KeyValuePair(Of String, String)("Description", obj("Description").ToString.TrimEnd.TrimStart), props)
                                'props = Add2Ar(New KeyValuePair(Of String, String)("Service", obj("Service").ToString.TrimEnd.TrimStart), props)
                                'If obj("HardwareID").length > 1 Then
                                '    For i As Integer = 0 To (obj("HardwareID").length - 1)
                                '        props = Add2Ar(New KeyValuePair(Of String, String)("HardwareID_" + i.ToString, obj("HardwareID")(i).ToString.TrimEnd.TrimStart), props)
                                '    Next
                                'Else
                                '    props = Add2Ar(New KeyValuePair(Of String, String)("HardwareID", obj("HardwareID").ToString.TrimEnd.TrimStart), props)
                                'End If
                                GoTo here
                            End If
                        End If
                    Next
                Next
            Next

here:
            Try
                Dim cntr As Integer = 0
                Try
try_again:
                    For Each i As KeyValuePair(Of String, ManagementObject) In GetDriveLetter(_vndr_id, _prodct_id, drv)
                        _drv_info = Add2Ar(i, _drv_info)
                    Next
                Catch exx As Exception
                    If 10 > cntr Then
                        cntr = cntr + 1
                        Threading.Thread.Sleep(3000)
                        GoTo try_again
                    Else
                        Throw exx
                    End If
                End Try

            Catch ex As Exception
                Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul("This exception is most likly caused becuase function -GetDriveLetter- didnt work correctly which caused it to not return anything ", ex, "Web_Server_Console_CMDs.usb_data.Find_USB_Info"))
                Gru.Log_Project_Exceptions()
                Console.WriteLine("EXCEPTION:" + vbNewLine + "The following error(s) were encountered while trying to -get_attchd_usb_data-\n look in the DB (ID-052119\\ID_Projects) for more info")
                Console.WriteLine(ex.ToString)
            End Try


            'Return drv_info
        End Sub



        Private Function GetDriveLetter(vndr_id As String, prodct_id As String, drv_info As ManagementObject) As KeyValuePair(Of String, ManagementObject)()
            Dim rtn As KeyValuePair(Of String, ManagementObject)() = Nothing
            Dim serial_num As String = get_serialnumber_frm_pnpID(drv_info("PNPDeviceID").ToString).TrimEnd.TrimStart.ToUpper
            For Each drive As ManagementObject In New ManagementObjectSearcher("select * from Win32_DiskDrive").Get()
                Dim chk As Boolean = False
                Select Case True
                    Case drive("PNPDeviceID").ToString = drv_info("PNPDeviceID").ToString
                        chk = True
                    Case drv_info("PNPDeviceID").ToString Like "*VID_" + vndr_id + "&PID_" + prodct_id + "*" + drive("SerialNumber").ToString
                        chk = True
                    Case drive("PNPDeviceID").ToString Like "*\*" + prodct_id + vndr_id.Substring(0, 2) + "*\*"
                        chk = True
                    Case drive("PNPDeviceID").ToString Like "*\*" + vndr_id + "*\*"
                        chk = True
                    Case drive("PNPDeviceID").ToString Like "*\*" + prodct_id + "*\*"
                        chk = True
                    Case serial_num Like "*" + drive("SerialNumber").ToString.TrimEnd.TrimStart.ToUpper
                        chk = True
                    Case serial_num = drive("SerialNumber").ToString.TrimEnd.TrimStart.ToUpper
                        chk = True

                End Select

                'If drive("PNPDeviceID").ToString = drv_info("PNPDeviceID").ToString Or drv_info("PNPDeviceID").ToString Like "*VID_" + vndr_id + "&PID_" + prodct_id + "*" + drive("SerialNumber").ToString Or
                '        drive("PNPDeviceID").ToString Like "*\*" + prodct_id + vndr_id.Substring(0, 2) + "*\*" Or drive("PNPDeviceID").ToString Like "*\*" + vndr_id + "*\*" Or drive("PNPDeviceID").ToString Like "*\*" + prodct_id + "*\*" Or
                '        serial_num Like "*" + drive("SerialNumber").ToString.TrimEnd.TrimStart.ToUpper Or serial_num = drive("SerialNumber").ToString.TrimEnd.TrimStart.ToUpper Then
                If chk Then
                    rtn = Add2Ar(New KeyValuePair(Of String, ManagementObject)("Win32_DiskDrive", drive), rtn)
                    For Each o As ManagementObject In drive.GetRelated("Win32_DiskPartition")
                        'rtn = Add2Ar(New KeyValuePair(Of String, ManagementObject)("Win32_DiskPartition", o), rtn)
                        For Each i As ManagementObject In o.GetRelated("Win32_LogicalDisk")
                            rtn = Add2Ar(New KeyValuePair(Of String, ManagementObject)("Win32_DiskPartition", o), rtn)
                            rtn = Add2Ar(New KeyValuePair(Of String, ManagementObject)("Win32_LogicalDisk", i), rtn)
                            'Console.WriteLine("Disk: " + i("Name").ToString())
                        Next
                    Next
                End If
            Next
            Return rtn
        End Function


        Private Function get_serialnumber_frm_pnpID(pnp_devc_id As String) As String
            Return pnp_devc_id.Split("\")(pnp_devc_id.Split("\").Count - 1).ToString
        End Function

    End Class



















































    Private Function check_drv_spce(sc_req_id As Integer, drv_lst As String()) As Boolean
        Return _check_drv_spce(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString), drv_lst)(1)
    End Function

    Private Function check_drv_spce(dwnld_smry As DataTable, drv_lst As String()) As Boolean
        Return _check_drv_spce(dwnld_smry, drv_lst)(1)
    End Function

    Private Function _check_drv_spce(dwnld_smry As DataTable, drv_lst As String()) As Object()
        Dim rtn As Object() = Nothing
        For i As Integer = 0 To (drv_lst.Count - 1)

            If Not drv_lst(i).EndsWith("\") Then
                If drv_lst(i) Like "[A-Z]:*" Then
                    drv_lst(i) = drv_lst(i) + "\"
                Else
                    drv_lst(i) = drv_lst(i) + ":\"
                End If
            End If
        Next
        rtn = Add2Ar(get_reqird_space_for_dwnld(dwnld_smry), rtn)
        If Gru.Steve.get_drv_fre_spc(drv_lst) > rtn(0) Then
            rtn = Add2Ar(True, rtn)
        Else
            rtn = Add2Ar(False, rtn)
        End If

        Return rtn

        'Dim free_drv_spce As Long = Gru.Steve.get_drv_fre_spc(drv_lst)
        'Dim roln_sum As Long = 0
        'For r As Integer = 0 To (dwnld_smry.Rows.Count - 1)
        '    With dwnld_smry.Rows(r)
        '        roln_sum = roln_sum + CType(New IO.FileInfo(.Item(0)), IO.FileInfo).Length
        '    End With
        'Next
        'If free_drv_spce > roln_sum Then
        '    Return True
        'Else
        '    Return False
        'End If


    End Function

    Private Function get_reqird_space_for_dwnld(dwnld_smry As DataTable) As Long
        Dim roln_sum As Long = 0
        For r As Integer = 0 To (dwnld_smry.Rows.Count - 1)
            With dwnld_smry.Rows(r)
                roln_sum = roln_sum + CType(New IO.FileInfo(.Item(0)), IO.FileInfo).Length
            End With
        Next
        Return roln_sum
    End Function












    'expected call: location of this script file\Web_Server_Console_CMDs.exe web_srvr_drv_fre_spc_vrfy 15 5 <list_of_drives> (drive_1,drive_2,drive_3,etc....)
    Private Sub drv_fre_spc_vrfy(cnsl_args As String())
        Dim sc_req_id As Integer = cnsl_args(2)
        'sc_req_id = 15
        Dim usr_id As Integer = cnsl_args(3)
        'usr_id = 5

        If (cnsl_args.Count - 1) > 3 Then
            'MsgBox("running drv_fre_spc_vrfy")
            If check_drv_spce(sc_req_id, cnsl_args(4).Split(",")) Then
                'MsgBox("SELECTED_DRIVE(S)_HAS_ENOUGH_FREE_SPACE_ON_IT_2_FILL_DWNLD_REQST")
                'Console.WriteLine("SELECTED_DRIVE(S)_HAS_ENOUGH_FREE_SPACE_ON_IT_2_FILL_DWNLD_REQST")
            Else
                Dim rtn_msg_strg As String = "EXCEPTION:"
                'MsgBox("NOT_ENOUGH_AVAILABLE_FREE_SPACE_ON_SELECTED_DRIVE(S)")
                'Console.WriteLine("EXCEPTION: NOT_ENOUGH_AVAILABLE_FREE_SPACE_ON_SELECTED_DRIVE(S)_OR_SELECTED_DRIVE(S)_ARE_MISSING_FROM_SYSTEM")
                If 0 > Gru.Steve.get_drv_fre_spc(cnsl_args(4).Split(",")) Then
                    rtn_msg_strg = rtn_msg_strg + "SELECTED DRIVE OR DRIVES SEEM TO BE MISSING FROM SYSTEM OR ARE IN SOME STATE THAT THE SYSTEM CAN NOT FIND THE DRIVE(S) OR USE THEM"
                Else
                    rtn_msg_strg = rtn_msg_strg + "NOT ENOUGH AVAILABLE FREE SPACE ON SELECTED DRIVE(S)"
                End If
                Console.WriteLine(rtn_msg_strg)
            End If

        Else
            Console.WriteLine("EXCEPTION: MISSING DRIVE PARAMETER")
        End If




    End Sub




    ''---------------left working here on 2/12/21 still need to finish
    'expected call: location of this script file\Web_Server_Console_CMDs.exe web_srvr_drv_fre_spc_vrfy 15 5 <list_of_drives> (drive_1,drive_2,drive_3,etc....)
    Private Sub _drv_fre_spc_vrfy(cnsl_args As String())
        Dim sc_req_id As Integer = cnsl_args(2)
        'sc_req_id = 15
        Dim usr_id As Integer = cnsl_args(3)
        'usr_id = 5
        Dim fill_dwnld_rqst As Boolean = False

        If (cnsl_args.Count - 1) > 3 Then
            Dim i As Integer = 0
            If Integer.TryParse(cnsl_args(4), i) Then
                fill_dwnld_rqst = IIf(cnsl_args(4) = 0, False, True)
            End If
        End If

        'MsgBox("running drv_fre_spc_vrfy")

        Dim drv_lst() As String = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_GET_DRVS, sc_req_id.ToString), DataTable).Rows(0).Item(0).ToString.Split(",") '' go to DB and get <list_of_drives> (drive_1,drive_2,drive_3,etc....) assoicated with "sc_req_id"
        Dim dwnld_smry As DataTable = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString)

        If check_drv_spce(sc_req_id, drv_lst) Then

            Dim cpy_pst_fle_per_drv_ltr() As DataTable = add_drv_ltr_2_path(dwnld_smry, drv_lst)


            MsgBox("YAY!! the selected drive has enough free space on it to completely download all the files!")
            'Console.WriteLine("YAY!! the selected drive has enough free space on it to completely download all the files!")
            If fill_dwnld_rqst Then
                fill_scan_dwnld_reqst(sc_req_id, usr_id, dwnld_smry, cpy_pst_fle_per_drv_ltr)
            Else
                Console.WriteLine("SELECTED_DRIVE(S)_HAS_ENOUGH_FREE_SPACE_ON_IT_2_FILL_DWNLD_REQST")
            End If

        Else
            'MsgBox("LAME, the selected drive DOES NOT have enough free space on it for the download")
            'fill_scan_dwnld_reqst(sc_req_id, usr_id, Nothing)
            Console.WriteLine("NOT_ENOUGH_AVAILABLE_FREE_SPACE_ON_SELECTED_DRIVE(S)")
        End If


        Dim a As Integer = 1 + 1
        Dim b As Integer = 1 + 1
        Dim c As Integer = 1 + 1
        Dim d As Integer = 1 + 1
        Dim e As Integer = 1 + 1





    End Sub

    Private Function add_drv_ltr_2_path(ByRef docClctn As DataTable, drv_lst() As String) As DataTable()

        ''temp dev work around --- 2/19/2021
        If (drv_lst.Count - 1) = 0 Then
            For r As Integer = 0 To (docClctn.Rows.Count - 1)
                With docClctn.Rows(r)
                    .Item(1) = drv_lst(0).ToString + .Item(1).ToString
                End With
            Next
            Return Nothing
        Else
            ''----------------------------------------ADD CODE HERE TO FIGURE OUT HOW TO BRAKE UP DOWNLOAD REQUEST ONTO MULTIPLE DRIVES AND WHICH DRIVE GETS WHAT DATA-----------------------------------START----------------------------------------------
            Try

                Dim dwnld_split_rslts() As split_dwnld_2_multi_drvs = Nothing
                Dim dwnld_grps() As DataTable = get_dwnld_grps(docClctn)
                '1.) LOOKING AT docClctn.Rows(0).Item(0).ToString ("COPY_LOC") OF ROW 1
                '       IF THIS ISDBNULL --> THEN WE KNOW THE "ROOT PASTE TO LOC" IS AT docClctn.Rows(0).Item(1).ToString ("PASTE_LOC")
                '       ELSE (drv_lst.Count - 1) /= 0   <------- THIS CONDITION IS ALREADY FILTERED OUT BEFOR REACHING THIS POINT (DON'T NEED TO WORRY ABOUT)
                '
                '
                For d As Integer = 0 To (drv_lst.Length - 1)
                    Dim free_drv_spce As Long = Gru.Steve.get_drv_fre_spc({drv_lst(d)})
                    free_drv_spce = free_drv_spce - (free_drv_spce * 0.08)
                    Dim roln_sum As Long = 0

                    'For Each g As DataTable In dwnld_grps
                    Dim g As Integer = dwnld_grps.Length - 1
                    'For g As Integer = 0 To (dwnld_grps.Length - 1)
                    While (g >= 0)
                        Dim drv_chk_rslts() As Object = _check_drv_spce(dwnld_grps(g), {drv_lst(d)})
                        Dim reqird_space_for_dwnld As Long = drv_chk_rslts(0)
                        Dim does_drv_have_enght_space_4_dwnld As Boolean = drv_chk_rslts(1)
                        If does_drv_have_enght_space_4_dwnld AndAlso (free_drv_spce > (roln_sum + reqird_space_for_dwnld)) Then

                            ' 1.) somehow log that this drive -drv_lst(d)- has enought free space for this section of the download request
                            dwnld_split_rslts = Add2Ar(New split_dwnld_2_multi_drvs(drv_lst(d), dwnld_grps(g)), dwnld_split_rslts)
                            roln_sum = roln_sum + reqird_space_for_dwnld

                            ' 2.) remove g-th item from dwnld_grps()
                            dwnld_grps = Remove_from_Ar(g, dwnld_grps)

                        End If
                        If roln_sum > free_drv_spce - (free_drv_spce * 0.08) Then
                            GoTo jmp_2_nxt_drv
                        End If
                        g = g - 1
                    End While
                    'Next
jmp_2_nxt_drv:
                Next

                Dim temp_tbl As New DataTable()
                Dim temp_tbl_2 As New DataTable()
                Dim rtn_tbl_ar() As DataTable = Nothing
                With docClctn
                    For c As Integer = 0 To (.Columns.Count - 1)
                        temp_tbl.Columns.Add(.Columns(c).ColumnName)
                        temp_tbl_2.Columns.Add(.Columns(c).ColumnName)
                    Next

                    temp_tbl.ImportRow(.Rows(0))
                    temp_tbl.Rows(0).Item(1) = drv_lst(0).ToString + temp_tbl.Rows(0).Item(1).ToString

                    For t As Integer = 0 To (dwnld_split_rslts.Length - 1)
                        If Not is_dt_in_ar(dwnld_split_rslts(t).drv_ltr.ToString, rtn_tbl_ar) Then
                            rtn_tbl_ar = add_dt_2_ar(dwnld_split_rslts(t).drv_ltr.ToString, temp_tbl_2, rtn_tbl_ar)
                            rtn_tbl_ar(rtn_tbl_ar.Length - 1).ImportRow(.Rows(0))
                            rtn_tbl_ar(rtn_tbl_ar.Length - 1).Rows(0).Item(1) = dwnld_split_rslts(t).drv_ltr.ToString + rtn_tbl_ar(rtn_tbl_ar.Length - 1).Rows(0).Item(1).ToString
                        End If
                        Dim ar_idx As Integer = get_dt_idx_from_ar(dwnld_split_rslts(t).drv_ltr.ToString, rtn_tbl_ar)

                        For r As Integer = 0 To (dwnld_split_rslts(t).dwnld_grp_tbl.Rows.Count - 1)
                            temp_tbl.ImportRow(dwnld_split_rslts(t).dwnld_grp_tbl.Rows(r))
                            rtn_tbl_ar(ar_idx).ImportRow(dwnld_split_rslts(t).dwnld_grp_tbl.Rows(r))
                        Next
                    Next
                End With

                docClctn = temp_tbl
                Return rtn_tbl_ar

            Catch ex As Exception
                'MsgBox(ex)
                Return Nothing
            End Try
            ''----------------------------------------ADD CODE HERE TO FIGURE OUT HOW TO BRAKE UP DOWNLOAD REQUEST ONTO MULTIPLE DRIVES AND WHICH DRIVE GETS WHAT DATA-----------------------------------END----------------------------------------------



        End If
        ''temp dev work around --- 2/19/2021

    End Function

    Public Class split_dwnld_2_multi_drvs
        Public drv_ltr As String
        Public dwnld_grp_tbl As DataTable

        Public Sub New(_drv_ltr As String, _dwnld_grp As DataTable)
            drv_ltr = _drv_ltr
            dwnld_grp_tbl = _dwnld_grp
            For r As Integer = 0 To (dwnld_grp_tbl.Rows.Count - 1)
                With dwnld_grp_tbl.Rows(r)
                    .Item(1) = drv_ltr.ToString + .Item(1).ToString
                End With
            Next
        End Sub

    End Class

    Private Function Add2Ar(_Value As split_dwnld_2_multi_drvs, Ar() As split_dwnld_2_multi_drvs) As split_dwnld_2_multi_drvs()
        Try
            Dim Ar2() = Ar
            Dim idx As Integer = Ar.Count * 1
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

















    Private Function get_dwnld_grps(docClctn As DataTable) As DataTable()
        Dim rtn() As DataTable = Nothing
        Dim temp_tbl As New DataTable()

        With docClctn
            Try
                For c As Integer = 0 To (.Columns.Count - 1)
                    temp_tbl.Columns.Add(.Columns(c).ColumnName)
                Next

                Dim root_paste_2_path As String = .Rows(0).Item(1).ToString
                If Not root_paste_2_path.EndsWith("\") Then
                    Throw New Exception("DATA IN ROW ZERO, COLUMN ONE IS NOT AS ASSUMED.. CHECK DB OUTPUT AND TRY AGAIN. " + vbNewLine + "HERE IS WHAT WAS FOUND " + .Rows(0).Item(1).ToString)
                End If

                rtn = add_dt_2_ar(generalize_fldr_name(.Rows(1).Item(1).ToString.Replace(root_paste_2_path, "").Split("\")(0)), temp_tbl, rtn)
                For i As Integer = 1 To (.Rows.Count - 1)
                    Dim fldr_name As String = generalize_fldr_name(.Rows(i).Item(1).ToString.Replace(root_paste_2_path, "").Split("\")(0).ToUpper)
                    If is_dt_in_ar(fldr_name, rtn) Then
                        rtn(get_dt_idx_from_ar(fldr_name, rtn)).ImportRow(.Rows(i))
                    Else
                        rtn = add_dt_2_ar(fldr_name, temp_tbl, rtn)
                        rtn(get_dt_idx_from_ar(fldr_name, rtn)).ImportRow(.Rows(i))
                    End If
                Next
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try
        End With

        Return rtn
    End Function

    Private Function generalize_fldr_name(fldr_name As String) As String
        If fldr_name Like "*.[A-Z][A-Z][A-Z]" Then
            fldr_name = Mid(fldr_name, 1, fldr_name.Length - 4)
        ElseIf fldr_name Like "*.[A-Z][A-Z][A-Z][A-Z]" Then
            fldr_name = Mid(fldr_name, 1, fldr_name.Length - 5)
        ElseIf fldr_name Like "* SUPPORT" Then
            Dim fldr_strg() As String = fldr_name.Split(" ")
            For wrd As Integer = 0 To (fldr_strg.Length - 1)
                If Not fldr_strg(wrd).ToUpper = "SUPPORT" Then
                    fldr_name = fldr_strg(wrd).ToUpper + " "
                End If
            Next
            fldr_name = fldr_name.TrimEnd.TrimStart
        End If
        Return fldr_name
    End Function

    Private Function is_dt_in_ar(tbl_name As String, tbls_ar As DataTable()) As Boolean
        Try
            For t As Integer = 0 To (tbls_ar.Length - 1)
                If tbls_ar(t).TableName.ToUpper = tbl_name.ToUpper Then
                    Return True
                End If
            Next
        Catch null As NullReferenceException
            Return False
        Catch ex As Exception
            Throw ex
        End Try
        Return False
    End Function

    Private Function get_dt_idx_from_ar(tbl_name As String, tbls_ar As DataTable()) As Integer
        For t As Integer = 0 To (tbls_ar.Length - 1)
            If tbls_ar(t).TableName.ToUpper = tbl_name.ToUpper Then
                Return t
            End If
        Next
        Return -1
    End Function

    Private Function add_dt_2_ar(tbl_name As String, temp_tbl As DataTable, tbls_ar As DataTable()) As DataTable()
        Dim tbl As DataTable = temp_tbl.Copy
        tbl.TableName = tbl_name
        Return Add2Ar(tbl, tbls_ar)
    End Function




























    'expected call: location of this script file\Web_Server_Console_CMDs.exe fill_scan_dwnld_reqst 15 5




    Private Sub fill_scan_dwnld_reqst(cnsl_args As String())
        fill_scan_dwnld_reqst(cnsl_args(2), cnsl_args(3), Nothing, Nothing)
    End Sub




    'expected call: location of this script file\Web_Server_Console_CMDs.exe fill_scan_dwnld_reqst 15 5
    Private Sub fill_scan_dwnld_reqst(sc_req_id As Integer, usr_id As Integer, docClctn As DataTable, copy_paste_files_per_drv_ltr() As DataTable)
        'Dim sc_req_id As Integer = cnsl_args(2)
        'sc_req_id = 15
        'Dim usr_id As Integer = cnsl_args(3)
        'usr_id = 5

        Dim bkgrd_wkr As Threading.Thread = Nothing
        Dim num_of_trys As Integer = 0

        Try
            'GoTo here
            'MsgBox("sc_req_id: " + sc_req_id.ToString + vbNewLine + "usr_id: " + usr_id.ToString)
            'Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_PROCS_STARTED, sc_req_id.ToString)

            Dim drv_lst() As String = Nothing

            If docClctn Is Nothing Then
                'Dim docClctn As DataTable = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString)
                drv_lst = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_GET_DRVS, sc_req_id.ToString), DataTable).Rows(0).Item(0).ToString.Split(",")
                docClctn = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString)
                copy_paste_files_per_drv_ltr = add_drv_ltr_2_path(docClctn, drv_lst)
                If copy_paste_files_per_drv_ltr Is Nothing Then
                    copy_paste_files_per_drv_ltr = add_dt_2_ar(docClctn.TableName, docClctn, copy_paste_files_per_drv_ltr)
                End If
            ElseIf copy_paste_files_per_drv_ltr Is Nothing Then
                drv_lst = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_GET_DRVS, sc_req_id.ToString), DataTable).Rows(0).Item(0).ToString.Split(",")
                copy_paste_files_per_drv_ltr = add_drv_ltr_2_path(docClctn, drv_lst)
            End If

            Dim wrd_wrkr As Minions.Office_minion.Spot.Word = Gru.Spot.new_wrd_wrkr(Minions.Office_minion.Spot.Word.SysWrdDoc.Scan_Rqst_dwnl_smry_form)


            'Dim bkgrd_wkr As New Threading.Thread(Sub()
            '                                          'Dim dwnld_smry As DataTable = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_DWNLD_SMRY, sc_req_id.ToString)
            '                                          wrd_wrkr.fill_out_form(CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_DWNLD_SMRY, sc_req_id.ToString), DataTable))
            '                                      End Sub)

            If Gru.Do_Minions_Have_ExitCode_Exceptions() Then
                Gru.Log_Project_Exceptions()
                Console.WriteLine("EXCEPTION 1:" + vbNewLine + "The following error(s) were encountered while trying to process a SCAN REQUEST [req_id: " + sc_req_id.ToString + "]")
                Console.WriteLine(Gru.Get_Exception_string())

            Else

                bkgrd_wkr = New Threading.Thread(Sub()
                                                     'Dim dwnld_smry As DataTable = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_DWNLD_SMRY, sc_req_id.ToString)

                                                     If Not docClctn Is Nothing Then
                                                         If IsDBNull(docClctn.Rows(0).Item(0)) Then
                                                             wrd_wrkr.Save_as_path = docClctn.Rows(0).Item(1).ToString
                                                         Else
                                                             Dim save_path_ar() As String = docClctn.Rows(0).Item(1).ToString.Split("\")
                                                             Select Case save_path_ar.Count - 1
                                                                 Case = 1
                                                                     wrd_wrkr.Save_as_path = save_path_ar(0) + "\" + save_path_ar(1) + "\"
                                                                 Case = 2
                                                                     wrd_wrkr.Save_as_path = save_path_ar(0) + "\" + save_path_ar(1) + "\" + save_path_ar(2) + "\"
                                                                 Case Else
                                                                     wrd_wrkr.Save_as_path = save_path_ar(0) + "\" + save_path_ar(1) + "\" + save_path_ar(2) + "\" + save_path_ar(3) + "\"
                                                             End Select
                                                         End If
                                                     End If

                                                     wrd_wrkr.fill_out_form(CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_DWNLD_SMRY, sc_req_id.ToString), DataTable))
                                                     wrd_wrkr.ClsWrdApp_and_Wrkr()
                                                 End Sub)
                bkgrd_wkr.Start()


                ''here:
                'If docClctn Is Nothing Then
                '    'Dim docClctn As DataTable = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString)
                '    docClctn = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_CopyPaste_LOCS, sc_req_id.ToString)
                'End If
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_STARTED, usr_id.ToString + "~" + sc_req_id.ToString)
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_LOG_TOTL_NUM_OF_FILES_IN_RQST, sc_req_id.ToString + "~" + (docClctn.Rows.Count - 1).ToString)

                Parallel.ForEach(copy_paste_files_per_drv_ltr, Sub(t As DataTable)
                                                                   'For Each  t As DataTable In copy_paste_files_per_drv_ltr
                                                                   'For r As Integer = 1 To (docClctn.Rows.Count - 1)
                                                                   '   With docClctn.Rows(r)
                                                                   For r As Integer = 1 To (t.Rows.Count - 1)
                                                                       With t.Rows(r)
                                                                           Dim copy_fle As String = .Item(0)
                                                                           'copy_frm = E:\ID_ROOT\LASER_SCANNING\CH_SITE_SCANS\100101\CH1\101\CH1\CH1_L1_10.20.20\100_200\PROJECT\RECAP_10.20.20 SUPPORT\CH1_L1_J10_ID_10.20.20_L_200.DIFF
                                                                           Dim paste_to As String = .Item(1)
                                                                           'paste_to = H:\IND_DSGN\NICHOLASX.LEAVITT@INTEL.COM\15_11.20.2020\RECAP_10.20.20 SUPPORT\CH1_L1_J10_ID_10.20.20_L_200.DIFF

                                                                           Dim excptn_strg As String = "~PASTE_TO~ drive can NOT be found. Logging error and exiting script"

                                                                           Try
try_agn:
                                                                               If IO.File.Exists(copy_fle) Then
                                                                                   If IO.Directory.Exists(Gru.Steve._GetDrive(paste_to)) Then
                                                                                       Gru.Steve.CopyAndRnmeFile(copy_fle, paste_to)
                                                                                       num_of_trys = 0
                                                                                       Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_LOG_NUM_OF_FILES_COPYED, sc_req_id.ToString + "~" + (r + 1).ToString)
                                                                                   ElseIf Not IO.Directory.Exists(Gru.Steve._GetDrive(paste_to)) Then
                                                                                       Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_PASTE_DRV_NOT_FOUND, usr_id + "~" + sc_req_id + "~" + Gru.Steve._GetDrive(paste_to))
                                                                                       Throw New Exception(excptn_strg)
                                                                                   End If
                                                                               ElseIf Not IO.File.Exists(copy_fle) Then
                                                                                   Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_COPY_FILE_NOT_FOUND, sc_req_id + "~" + copy_fle)
                                                                               End If
                                                                           Catch ex As Exception
                                                                               If ex.Message = excptn_strg Then
                                                                                   Throw ex
                                                                               Else
                                                                                   If num_of_trys > 60 Then
                                                                                       Throw ex
                                                                                   Else
                                                                                       num_of_trys = num_of_trys + 1
                                                                                       Threading.Thread.Sleep(5000)
                                                                                       GoTo try_agn
                                                                                   End If
                                                                               End If
                                                                           End Try



                                                                       End With
                                                                   Next
                                                               End Sub)

                'Next


                ''-------------to do
                '1.) use docClctn.Rows(0).Item(0) - docClctn.Rows(0).Item(1) = path2Rqst_root_fldr "H:\IND_DSGN\NICHOLASX.LEAVITT@INTEL.COM\15_11.20.2020\"
                '2.) fill out form and save as it to  'path2Rqst_root_fldr' location
                '          wrd_wrkr

                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_DWNLD_CMPLTD, usr_id.ToString + "~" + sc_req_id.ToString)



            End If
        Catch ex As Exception

            '1.) get the project number assicoated with sc_req_id
            Dim proj_id As Integer = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_REQ_GET_PROJ_NUM, sc_req_id.ToString), DataTable).Rows(0).Item(0)
            '2.) log error in DB
            If num_of_trys > 60 Then
                Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul("I suspect this computer or server was having OS problems which might have kicked the drives out while writing data/copy-pasteing to them... but here is the stack exception report" + vbNewLine + vbNewLine +
                                                                            "Working on scan request id: " + sc_req_id.ToString + vbNewLine + "admin id: " + usr_id.ToString + vbNewLine +
                                                                            "id_proj_num: " + proj_id.ToString, ex, True, "Web_Server_Console_CMDs.exe fill_scan_reqst" + vbNewLine + "num_of_trys: " + num_of_trys.ToString))
            Else
                Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul("Working on scan request id: " + sc_req_id.ToString + vbNewLine + "admin id: " + usr_id.ToString + vbNewLine +
                                                                     "id_proj_num: " + proj_id.ToString, ex, True, "Web_Server_Console_CMDs.exe fill_scan_reqst" + vbNewLine + "num_of_trys: " + num_of_trys.ToString))
            End If

            '3.) Console.WriteLine("The following error was encountered while trying to process a SCAN REQUEST [req_id: " + sc_req_id.ToString + "]")
            '    Console.WriteLine(ex.ToString)
            Console.WriteLine("EXCEPTION 2:" + vbNewLine + "The following error(s) were encountered while trying to process a SCAN REQUEST [req_id: " + sc_req_id.ToString + "]" + vbNewLine + "num_of_trys: " + num_of_trys.ToString)
            Console.WriteLine(ex.ToString)

        End Try

        If bkgrd_wkr.IsAlive Then
            bkgrd_wkr.Join()
        End If

        Gru.Clean_up_minions()
        If Gru.Do_Minions_Have_Exceptions() Then
            Gru.Log_Project_Exceptions()
        End If

    End Sub


























    Private Sub copy_paste_scan_files(usr_id As Integer, id_proj_num As String, copy_frm As String, paste_to As String, is_chk_in As Boolean, updt_progs_bar As Boolean)
        'usr_id = 5
        'id_proj_num = 100101
        'copy_frm = H:\Scans\
        'paste_to = E:\ID_ROOT\Laser_Scanning\CH_Site_Scans\CH8\CH8_OFA_SCANS\
        Dim req_id As String = ""
        Dim req_has_procsd_files As Boolean = False
        Dim scan_tbl_id As String = ""
        Dim ful_fle_path As String = ""

        If is_chk_in Then
            req_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_CHECK_IN_USB_START, id_proj_num + "~" + usr_id.ToString), DataTable).Rows(0).Item(0)
        Else
            req_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_CHECK_OUT_USB_START, id_proj_num + "~" + usr_id.ToString), DataTable).Rows(0).Item(0)
        End If
        ''System.Threading.Thread.CurrentThread.Sleep(10000)

        'Dim envt_id As String = ""

        Dim fldr_cntnt As KeyValuePair(Of String, String)() = Gru.Steve.GetSubFolder_Cntnt(copy_frm).ToArray
        Dim tot_num_files As Integer = 0
        Dim file_cntr As Integer = 0
        For i As Integer = 0 To (fldr_cntnt.Count - 1)
            Dim sub_fldr_data As scan_info = New scan_info(fldr_cntnt(i))
            tot_num_files = tot_num_files + sub_fldr_data.get_sub_folder_content.Count
        Next

        Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPDT_CHK_IN_OUT_PROGS_DATA, req_id.ToString + "~0~" + tot_num_files.ToString)
        Dim use_crnt_path As Boolean = True

        'Array.ForEach(Gru.Steve.GetSubFolder_Cntnt(copy_frm).ToArray,
        Array.ForEach(fldr_cntnt, Sub(key_pair As KeyValuePair(Of String, String))



                                      Dim scan_info_obj As scan_info = New scan_info(key_pair)
                                      With scan_info_obj
                                          Try


                                              'If key_pair.Key = "FILE" AndAlso (req_has_procsd_files = False) AndAlso (key_pair.Value.ToUpper Like "*.RCP" Or key_pair.Value.ToUpper Like "*.RCS") Then
                                              '    req_has_procsd_files = True
                                              '    'envt_id = ( exec Reason2Go2DB.SCAN_UPLOADING_RECAP_FILES)
                                              'ElseIf (req_has_procsd_files = False) AndAlso .sub_fldrs_hv_procsd_scan_files Then
                                              '    req_has_procsd_files = True
                                              '    'envt_id = ( exec Reason2Go2DB.SCAN_UPLOADING_RECAP_FILES)
                                              'End If
                                              Dim a_num As Integer = 0
                                              Dim scn_fldr_num As String = "" '.scn_nbr.ToCharArray(0, 1) + "00"
                                              Dim paste_loc As String = "" 'paste_to + id_proj_num + "\" + .dte + "\" + req_id + "\" + scn_fldr_num + "\"
                                              If is_chk_in Then
                                                  Select Case .get_type
                                                      Case Is = scan_info.info_type.FILE
                                                          If Integer.TryParse(.scn_nbr.ToCharArray(0, 1), a_num) Then
                                                              scn_fldr_num = a_num.ToString + "00"
                                                              paste_loc = paste_to + id_proj_num + "\" + .dte + "\" + req_id + "\" + scn_fldr_num + "\"
                                                          Else
                                                              paste_loc = paste_to + id_proj_num + "\" + .dte + "\" + req_id + "\"
                                                          End If
                                                      Case Is = scan_info.info_type.DIRECTORY
                                                          If .get_current_folder_strg().ToUpper Like "*.[A-Z][A-Z]*" Then
                                                              use_crnt_path = False
lvl_up:
                                                              paste_loc = paste_to + id_proj_num + "\" + .get_parent_folder_strg() + "\" + req_id + "\"
                                                          Else
                                                              If use_crnt_path Then
                                                                  paste_loc = paste_to + id_proj_num + "\" + .get_current_folder_strg() + "\" + req_id + "\"
                                                              Else
                                                                  GoTo lvl_up
                                                              End If
                                                          End If

                                                  End Select


                                              Else
                                                  paste_loc = paste_to
                                              End If

                                              If key_pair.Key = "FILE" Then
                                                  If (req_has_procsd_files = False) AndAlso (key_pair.Value.ToUpper Like "*.RCP" Or key_pair.Value.ToUpper Like "*.RCS") Then
                                                      req_has_procsd_files = True
                                                  End If
                                                  ful_fle_path = paste_loc + Gru.Steve._GetFileName(key_pair.Value)
                                                  file_cntr = copy_paste_scan_file(key_pair.Value, ful_fle_path, file_cntr, req_id, updt_progs_bar)

                                                  'Gru.Steve.CopyPaste_FLS_ScanFile(key_pair.Value, ful_fle_path)

                                                  If is_chk_in Then
                                                      scan_tbl_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_ADD_SCAN_FILE_2_DB, req_id + "~" + ful_fle_path), DataTable).Rows(0).Item(0)
                                                  End If
                                              ElseIf key_pair.Key = "DIRECTORY" Then
                                                  If (req_has_procsd_files = False) AndAlso .sub_fldrs_hv_procsd_scan_files Then
                                                      req_has_procsd_files = True
                                                  End If
                                                  Array.ForEach(.get_sub_folder_content().ToArray,
                                                Sub(sub_fldr_item As String)
                                                    Dim sub_fldr_path As String = ""
                                                    'sub_fldr_item.Replace(key_pair.Value + "\", "")
                                                    'For i As Integer = (key_pair.Value.Split("\").Count - 1) To (sub_fldr_item.Split("\").Count - 1)
                                                    For i As Integer = key_pair.Value.Split("\").Count To (sub_fldr_item.Split("\").Count - 1)
                                                        If sub_fldr_path = "" Then
                                                            sub_fldr_path = sub_fldr_item.Split("\")(i)
                                                        Else
                                                            sub_fldr_path = sub_fldr_path + "\" + sub_fldr_item.Split("\")(i)
                                                        End If
                                                    Next
                                                    If is_chk_in Then
                                                        ful_fle_path = paste_loc + .get_current_folder_strg() + "\" + sub_fldr_path
                                                    Else
                                                        ful_fle_path = paste_loc + .get_current_folder_strg() + "\" + sub_fldr_path
                                                        ful_fle_path = ful_fle_path.Replace(id_proj_num + "\", "")
                                                        ful_fle_path = ful_fle_path.Replace(.dte + "\", "")
                                                        ful_fle_path = ful_fle_path.Replace(req_id + "\", "")
                                                        If Not scn_fldr_num = "" Then
                                                            ful_fle_path = ful_fle_path.Replace(scn_fldr_num + "\", "")
                                                        End If
                                                    End If


                                                    file_cntr = copy_paste_scan_file(sub_fldr_item, ful_fle_path, file_cntr, req_id, updt_progs_bar)
                                                    'Gru.Steve.CopyPaste_FLS_ScanFile(sub_fldr_item, ful_fle_path)

                                                    'Gru.Steve.CopyPaste_FLS_ScanFile(sub_fldr_item, paste_loc + .get_parent_folder_strg() + "\" + sub_fldr_path)
                                                    '' TO DO
                                                    ' 1.) LOG SCAN INFO INTO "SCANS" TABLE assuming raw files are being uploaded/downloaded
                                                    If is_chk_in Then
                                                        scan_tbl_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_ADD_SCAN_FILE_2_DB, req_id + "~" + ful_fle_path), DataTable).Rows(0).Item(0)
                                                    End If
                                                End Sub)
                                              End If


                                          Catch ex As Exception
                                              ''MsgBox(ex)
                                              Dim msg_strg As String = ex.ToString + vbNewLine + vbNewLine + vbNewLine +
                                                                        "usr_id = " + usr_id.ToString() + vbNewLine +
                                                                        "id_proj_num = " + id_proj_num.ToString() + vbNewLine +
                                                                        "copy_frm = " + copy_frm.ToString() + vbNewLine +
                                                                        "paste_to = " + paste_to.ToString() + vbNewLine +
                                                                        "scan_info_obj: " + vbNewLine + .var_dump()
                                              Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul(msg_strg, ex, "Web_Server_Console_CMDs.Module1.copy_paste_scan_files"))
                                              MsgBox("The following has been logged in the DB execptions table but i figured i would show you now also" + vbNewLine + vbNewLine + msg_strg)

                                          End Try
                                      End With

                                  End Sub)

        '' TO DO
        ' 1.) POST TO DB WHICH TYPE OF FILE(S) WERE BEING UPLOADED/DOWNLOADED
        '   a.) if req_has_procsd_files = True then 
        '           1.) The Type OF FILES BEING UPLOADED/DOWNLOADED are PROCESSED  envt_id = ( exec Reason2Go2DB.SCAN_UPLOADING_PROCESSED_FILES)
        '           2.) else they are assumed to be RAW SCAN FILES envt_id = ( exec Reason2Go2DB.SCAN_UPLOADING_RAW_FILES)
        '      
        ' 2.) insert into proj_evnt_to_req values (envt_id, req_id)

        If req_has_procsd_files Then
            '(exec Reason2Go2DB.SCAN_UPLOADING_PROCESSED_FILES)
            'envt_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPLOADING_PROCESSED_FILES, id_proj_num), DataTable).Rows(0).Item(0)
            If is_chk_in Then
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPLOADING_PROCESSED_FILES, id_proj_num + "~" + req_id)
                ''Log in DB req_id has processed files to brake out
                'Dim trd As New System.Threading.Thread(Sub()
                '                                           brk_out_procsd_chk_in()
                '                                       End Sub)
                'trd.Start()
            Else
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_DOWNLOADING_PROCESSED_FILES, id_proj_num + "~" + req_id)
            End If
        Else
            'envt_id = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPLOADING_RAW_FILES, id_proj_num), DataTable).Rows(0).Item(0)
            If is_chk_in Then
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPLOADING_RAW_FILES, id_proj_num + "~" + req_id)
            Else
                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_DOWNLOADING_RAW_FILES, id_proj_num + "~" + req_id)
            End If
        End If

        If is_chk_in Then
            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_CHECK_IN_USB_FINISHED, id_proj_num + "~" + usr_id.ToString + "~" + req_id)
        Else
            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_CHECK_OUT_USB_FINISHED, id_proj_num + "~" + usr_id.ToString + "~" + req_id)
        End If
    End Sub

    Private Function copy_paste_scan_file(sub_fldr_item As String, ful_fle_path As String, file_cntr As Integer, req_id As Integer, updt_progs_bar As Boolean) As Integer
        Gru.Steve.CopyPaste_FLS_ScanFile(sub_fldr_item, ful_fle_path)
        file_cntr = file_cntr + 1
        If updt_progs_bar Then
            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_UPDT_CHK_IN_OUT_PROGS_DATA, req_id.ToString + "~" + file_cntr.ToString + "~0")
        End If
        Return file_cntr
    End Function


    Private Sub brk_out_procsd_chk_in()
        brk_out_procsd_chk_in(False)
    End Sub


    Private Sub brk_out_procsd_chk_in(show_stats As Boolean)
        brk_out_procsd_chk_in(show_stats, Nothing)
        ''brk_out_procsd_chk_in(False, Nothing)
    End Sub

    Private Sub brk_out_procsd_chk_in(show_stats As Boolean, reprcs_data_fldr_pth As String)
        'Dim req_id As String = ""
        'Dim ful_fle_path As String = ""
        'Dim sub_fldr_item As String = ""
        '' TO DO
        ' 1.) go to DB and get all copy/paste loctions
        Try


            Dim prcd_scan_copy_paste_tbl As DataTable
            If reprcs_data_fldr_pth = Nothing Then
                prcd_scan_copy_paste_tbl = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_GET_PROCSD_SCAN_LOCS, "")
            Else
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("~", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("!", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("#", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("$", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("+", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("=", " ")
                reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("^", " ")
                ''reprcs_data_fldr_pth = reprcs_data_fldr_pth.Replace("*", " ")
                If IO.Directory.Exists(reprcs_data_fldr_pth) Then
                    If show_stats Then
                        Console.WriteLine("going to DB to reprocess scan check-in data and getting the list of files to copy/paste into system folders.. please wait")
                    End If
                    prcd_scan_copy_paste_tbl = Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_GET_PROCSD_SCAN_LOCS_RERUN, reprcs_data_fldr_pth)
                Else
                    Throw New Exception("Directory: '" + reprcs_data_fldr_pth + "' NOT found on system")
                End If

            End If
            Dim req_id As String = ""
            Dim strt_time As DateTime = Now
            Dim rate_ar(7) As Double
            Dim tot_num_files As Integer = (prcd_scan_copy_paste_tbl.Rows.Count - 1)
            For i As Integer = 0 To (prcd_scan_copy_paste_tbl.Rows.Count - 1)
                With prcd_scan_copy_paste_tbl.Rows(i)
                    Try


                        If req_id = "" Then
                            req_id = .Item(3).ToString
                            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.AUTO_TASK_SRT_STP, req_id)
                        ElseIf Not req_id = .Item(3).ToString Then
                            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.AUTO_TASK_SRT_STP, req_id)
                            req_id = .Item(3).ToString
                            Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.AUTO_TASK_SRT_STP, req_id)
                        End If









                        ' 2.) copy/paste file
                        'Gru.Steve.CopyPaste_FLS_ScanFile(sub_fldr_item, ful_fle_path)
                        If .Item(1) = "MOVE_2_NEW_CHIO_REQ_NUM" Then
                            '' db as idenified this check in and files in the folder as having problems/has deviated from file naming convention/std and has requested this code to move to folder and content to another req_id_number and to re-sync move with checkin directry and db
                            If show_stats Then
                                Console.WriteLine("DB as requested command 'MOVE_2_NEW_CHIO_REQ_NUM' executing CMD with " + vbNewLine +
                                "folder path: " + .Item(2).ToString + vbNewLine + "req_id_num: " + .Item(3).ToString)
                            End If

















                            '' add code here --- incomplete code branch        as of 10/29/2021
                            '' TO DO
                            ''1.) go to db and 'EXEC' stored_proc. to 'UPDATE' 'SCANS' table to the next 'CHIO_REQ_ID_NUM' and return updated folder string (as datatable)
                            ''2.) move files from old directory --> to returned folder path
                            ''3.) SENT EMAIL TO ADMIN NOTIFIYING THEM ABOUT CHANGE

                            Gru.Spot.new_ol_wrkr()
                            Gru.Spot.get_otlk_wrkr().EmailAdmins("TESTING EMAILING FUNCTION -- DB as requested command 'MOVE_2_NEW_CHIO_REQ_NUM' executing CMD with " + vbNewLine + "folder path: " + .Item(2).ToString + vbNewLine + "req_id_num: " + .Item(3).ToString)
                            'Gru.Spot.get_otlk_wrkr().EmailAdmins("Found problem with checkin req# " + .Item(3).ToString + " folder path " + .Item(2).ToString + " moving this folder to another checkin request number")
























                        Else
                                Gru.Steve.CopyPaste_FLS_ScanFile(.Item(1), .Item(2))


                            '' 3.) add new file location to DB
                            ''Dim scan_tbl_id As String = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_ADD_SCAN_FILE_2_DB, req_id + "~" + ful_fle_path), DataTable).Rows(0).Item(0)
                            Dim scan_tbl_id As String = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_ADD_SCAN_FILE_2_DB, req_id + "~" + .Item(2)), DataTable).Rows(0).Item(0)
                            ''Dim scan_tbl_id As String = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.SCAN_ADD_SCAN_FILE_2_DB, .Item(3).ToString + "~" + .Item(2)), DataTable).Rows(0).Item(0)

                            If i = prcd_scan_copy_paste_tbl.Rows.Count - 1 Then
                                Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.AUTO_TASK_SRT_STP, req_id)
                            End If

                            If show_stats Then
                                Try
                                    Dim files_per_sec As Double = i / (Now - strt_time).TotalSeconds
                                    rate_ar(7) = rate_ar(6)
                                    rate_ar(6) = rate_ar(5)
                                    rate_ar(5) = rate_ar(4)
                                    rate_ar(4) = rate_ar(3)
                                    rate_ar(3) = rate_ar(2)
                                    rate_ar(2) = rate_ar(1)
                                    rate_ar(1) = rate_ar(0)
                                    rate_ar(0) = (Now - strt_time).TotalSeconds

                                    Dim a As Double = i / ((rate_ar(7) + rate_ar(6) + rate_ar(5) + rate_ar(4) + rate_ar(3) + rate_ar(2) + rate_ar(1) + rate_ar(0)) / 8)
                                    files_per_sec = a
                                    ''Dim hrs As Double = (tot_num_files / (files_per_sec * 3600)) - ((strt_time - Now).TotalSeconds / 3600)
                                    Dim hrs As Double = ((tot_num_files / files_per_sec) - (Now - strt_time).TotalSeconds) / 3600

                                    If hrs >= 2 Then
                                        Console.WriteLine("copy/pasted file(" + i.ToString + " of " + tot_num_files.ToString + "): " + .Item(2) + " :: Transfer rate (files/second): " + files_per_sec.ToString + " ::  Number of hours till complete: " + hrs.ToString)
                                    Else
                                        Console.WriteLine("copy/pasted file(" + i.ToString + " of " + tot_num_files.ToString + "): " + .Item(2) + " :: Transfer rate (files/second): " + files_per_sec.ToString + " ::  Number of minutes till complete: " + (hrs * 60).ToString)
                                    End If
                                Catch ex As Exception
                                    Console.WriteLine("copy/pasted file(" + i.ToString + " of " + tot_num_files.ToString + "): " + .Item(2))
                                End Try
                            End If
                        End If
                    Catch ex As Exception
                        Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul("INSIDE <FOR> LOOP: ", ex, "Web_Server_Console_CMDs.Module1.brk_out_procsd_chk_in_2"))
                    End Try
                End With
            Next


        Catch ex As Exception
            Gru.Paul.Add2Excep(New Minions.Exception_Minion.Paul(ex, "Web_Server_Console_CMDs.Module1.brk_out_procsd_chk_in_1"))
        End Try


        If Gru.Do_Minions_Have_Exceptions() Then
            Gru.Log_Project_Exceptions()
        End If

    End Sub








    Private Function fix_url(url_strg As String) As String
        Dim path_strg_1 As String = CType(Gru.Mike.GoToDB(Minions.Sql_Minion.Mike.Reason2Go2DB.Usb_Drv_Get_Full_Path, url_strg.Split("\")(0).ToString.ToUpper), DataTable).Rows(0).Item(0)
        Dim path_strg_2 As String = url_strg.Replace(url_strg.Split("\")(0) + "\", "")
        If path_strg_2.EndsWith("\") Then
            'Return path_strg_1 + ":\" + path_strg_2
            Return path_strg_1 + path_strg_2
        Else
            'Return path_strg_1 + ":\" + path_strg_2 + "\"
            Return path_strg_1 + path_strg_2 + "\"
        End If

    End Function





    Private Sub copy_paste()

    End Sub

    Private Sub fix_scan_proj_flde(cnsl_args As String())

    End Sub





















    Private Class scan_info
        Private _scan_strg As String
        Private _cmplt_scan_strg As String
        Private _type As info_type
        Private _sub_fldr_cntnt As List(Of String)
        Private _quad_scn As Boolean = True
        Private _strg_idx As Boolean = False ''false = 0 and true = 1
        Private _fle_extns_2_lk_4() As String = {"*.rcp", "*.rcs"}
        Private _rcp_found As Boolean = False
        Private _rcs_found As Boolean = False


        Public Function get_current_folder_strg() As String
            Return _scan_strg
        End Function

        Public Function get_parent_folder_strg() As String
            Try
                Return get_nth_lvl_folder_strg(1)
            Catch ex As Exception
                Return _scan_strg
            End Try
        End Function

        Public Function get_cmplt_sub_folder_strg() As String
            Return _cmplt_scan_strg
        End Function

        Public Function get_nth_lvl_folder_strg(n) As String
            Try
                If _cmplt_scan_strg.Split("\").Count - 1 >= n Then
                    Return _cmplt_scan_strg.Split("\")(_cmplt_scan_strg.Split("\").Count - (n + 1))
                Else

                End If

            Catch ex As Exception
                Return _scan_strg
            End Try
        End Function






        Public Enum info_type
            FILE
            DIRECTORY
        End Enum

        Private Enum strg_idx_0
            site = 0
            bld = 1
            bld_code = 2
            lvl = 3
            comp = 4
            dte = 5
            scn_ht = 6
            scn_nbr = 7
        End Enum

        Private Enum strg_idx_1
            site = 0
            bld = 1
            bld_code = 2
            lvl = 3
            quad = 4
            comp = 5
            dte = 6
            scn_ht = 7
            scn_nbr = 8
        End Enum

        Public Function get_type() As info_type
            Return _type
        End Function

        Public Function get_sub_folder_content() As List(Of String)
            Return _sub_fldr_cntnt
        End Function



        Public ReadOnly Property bld As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.bld * 1
                Else
                    i = strg_idx_0.bld * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property

        Public ReadOnly Property lvl As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.lvl * 1
                Else
                    i = strg_idx_0.lvl * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property

        Public ReadOnly Property quad As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    Return get_strg_info(strg_idx_1.quad * 1)
                Else
                    Return Nothing
                End If
            End Get
        End Property

        Public ReadOnly Property comp As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.comp * 1
                Else
                    i = strg_idx_0.comp * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property

        Public ReadOnly Property dte As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.dte * 1
                Else
                    i = strg_idx_0.dte * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property


        Public ReadOnly Property scn_ht As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.scn_ht * 1
                Else
                    i = strg_idx_0.scn_ht * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property

        Public ReadOnly Property scn_nbr As String
            Get
                Dim i As Integer
                If _strg_idx Then
                    i = strg_idx_1.scn_nbr * 1
                Else
                    i = strg_idx_0.scn_nbr * 1
                End If
                Return get_strg_info(i)
            End Get
        End Property

        Public ReadOnly Property has_rcp As Boolean
            Get
                'If _type = info_type.DIRECTORY Then
                Return _rcp_found
                'Else
                '    Return Nothing
                'End If
            End Get
        End Property

        Public ReadOnly Property has_rcs As Boolean
            Get
                Return _rcs_found
            End Get
        End Property

        Public ReadOnly Property sub_fldrs_hv_procsd_scan_files As Boolean
            Get
                Return IIf(_rcp_found AndAlso _rcs_found, True, False)
            End Get
        End Property


        Private Function get_strg_info(i As Integer) As String
            Try
                Return _scan_strg.Split("_")(i)
            Catch ex As Exception
                Return _scan_strg
            End Try
        End Function

        Public Sub New(scan_obj As KeyValuePair(Of String, String))
            _scan_strg = Gru.Steve._GetFileName(scan_obj.Value)
            _cmplt_scan_strg = rmve_drv_ltr(scan_obj.Value)
            strg_idx_2_use()
            Select Case scan_obj.Key
                Case = "FILE"
                    _type = info_type.FILE
                Case = "DIRECTORY"
                    _type = info_type.DIRECTORY
                    _sub_fldr_cntnt = Gru.Steve._GetFiles_Recursive("*", scan_obj.Value)
                    lk_4_procs_file()
            End Select
        End Sub

        Private Sub strg_idx_2_use()
            Dim strg_ar() As String = _scan_strg.Split("_")
            For i As Integer = 0 To (strg_ar.Count - 1)
                If strg_ar(i) Like "*[0-9].[0-9]*.[0-9][0-9]*" Then
                    If i = 4 Then
                        _strg_idx = True
                    End If
                    GoTo jmp_out
                End If
            Next
jmp_out:
        End Sub


        Private Sub lk_4_procs_file()
            For Each sub_fldr_item As String In _sub_fldr_cntnt.ToArray
                If sub_fldr_item.ToUpper Like _fle_extns_2_lk_4(0).ToUpper Then
                    _rcp_found = True
                ElseIf sub_fldr_item.ToUpper Like _fle_extns_2_lk_4(1).ToUpper Then
                    _rcs_found = True
                ElseIf _rcp_found AndAlso _rcs_found Then
                    GoTo jmp_here
                End If
            Next
jmp_here:
        End Sub

        Private Function rmve_drv_ltr(path As String)
            Return path.Split(":")(1)
        End Function

        Public Function var_dump() As String
            Dim rtn_stgr As String = get_cmplt_sub_folder_strg()
            rtn_stgr = rtn_stgr + vbNewLine + "get_current_folder_strg: " + get_current_folder_strg()
            rtn_stgr = rtn_stgr + vbNewLine + "get_parent_folder_strg: " + get_parent_folder_strg()
            rtn_stgr = rtn_stgr + vbNewLine + "get_type: " + get_type()
            rtn_stgr = rtn_stgr + vbNewLine + "has_rcp: " + has_rcp.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "has_rcs: " + has_rcs.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "bld: " + bld.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "lvl: " + lvl.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "quad: " + quad.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "comp: " + comp.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "dte: " + dte.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "scn_ht: " + scn_ht.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "scn_nbr: " + scn_nbr.ToString()
            rtn_stgr = rtn_stgr + vbNewLine + "sub_fldr_cntnt: "
            For i As Integer = 0 To (_sub_fldr_cntnt.Count - 1)
                rtn_stgr = rtn_stgr + vbNewLine + "    " + _sub_fldr_cntnt(i)
            Next

            Return rtn_stgr
        End Function

    End Class


End Module
