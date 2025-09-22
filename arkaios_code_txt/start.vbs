
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
htmlPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), "index.html")
If fso.FileExists(htmlPath) Then
    shell.Run Chr(34) & htmlPath & Chr(34), 0, False
Else
    MsgBox "No se encontró el archivo ATM_ENGINE.html", vbCritical, "Error"
End If
