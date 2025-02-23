import "math"

rule Suspicious_PE_Imports
{
    meta:
        description = "Detects PE files with suspicious API imports used by malware"
        author = "CyberSecurity Researcher"
    strings:
        $virtualalloc = "VirtualAlloc"
        $writeprocessmemory = "WriteProcessMemory"
        $createremotethread = "CreateRemoteThread"
        $loadlibrary = "LoadLibraryA"
        $getprocaddress = "GetProcAddress"
        $ntcreate = "NtCreateThreadEx"
    condition:
        filesize < 10MB and 2 of ($*)
}

rule UPX_Packed_PE
{
    meta:
        description = "Detects PE files packed with UPX (common in malware)"
    strings:
        $upx1 = "UPX!"
        $upx2 = "UPX0"
        $upx3 = "UPX1"
    condition:
        any of them
}

rule Packed_Or_Encrypted
{
    meta:
        description = "Detects executables with high entropy (potentially packed or encrypted)"
    condition:
        math.entropy(0, filesize) > 7.5
}

rule Malware_Loader
{
    meta:
        description = "Detects common malware loaders"
    strings:
        $reflective_loader = "ReflectiveLoader"
        $manual_mapping = "ManualMap"
        $runpe = "RunPE"
    condition:
        any of them
}

rule Anti_Debugging
{
    meta:
        description = "Detects anti-debugging techniques in malware"
    strings:
        $isdebuggerpresent = "IsDebuggerPresent"
        $checkremotedebuggerpresent = "CheckRemoteDebuggerPresent"
        $outputdebugstring = "OutputDebugStringA"
        $sleep = "Sleep"
        $getticks = "GetTickCount"
    condition:
        filesize < 10MB and any of ($*)
}

rule Ransomware_Behavior
{
    meta:
        description = "Detects ransomware based on encryption and ransom keywords"
    strings:
        $encrypt = "encrypt"
        $crypto = "crypto"
        $ransom = "ransom"
        $file_ext = ".locked"
        $crypt_api = "CryptEncrypt"
    condition:
        2 of ($*)
}

rule Keylogger_Behavior
{
    meta:
        description = "Detects potential keylogging behavior"
    strings:
        $api1 = "SetWindowsHookEx"
        $api2 = "GetAsyncKeyState"
        $api3 = "GetForegroundWindow"
        $log1 = "keylog"
    condition:
        2 of ($*)
}

rule Cryptominer_Detection
{
    meta:
        description = "Detects cryptominer behavior"
    strings:
        $pool = "stratum+tcp://"
        $miner1 = "xmrig"
        $miner2 = "minerd"
        $miner3 = "cryptonight"
    condition:
        any of them
}

rule Suspicious_Sandbox_Evasion
{
    meta:
        description = "Detects sandbox evasion techniques"
    strings:
        $vm1 = "VMware"
        $vm2 = "VirtualBox"
        $api1 = "QueryPerformanceCounter"
        $api2 = "GetTickCount"
        $api3 = "GetSystemInfo"
    condition:
        any of ($vm*) and any of ($api*)
}
rule Malicious_PDF
{
    meta:
        description = "Detects malicious PDFs with JavaScript execution"
    strings:
        $js1 = "/JavaScript"
        $js2 = "/Launch"
        $js3 = "/OpenAction"
        $js4 = "/SubmitForm"
    condition:
        any of ($*)
}

rule Suspicious_DOCX
{
    meta:
        description = "Detects DOCX files with potentially dangerous macros"
    strings:
        $macro1 = "AutoOpen"
        $macro2 = "Shell"
        $macro3 = "WScript.Shell"
    condition:
        any of ($*)
}
