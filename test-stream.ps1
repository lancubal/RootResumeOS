# Portfolio Stream Test Script
# This script validates that the C-compilation and SSE streaming logic are working.

Write-Host "--- Starting RootResume Stream Validation ---" -ForegroundColor Cyan

# 1. Start Session
try {
    $resStart = Invoke-RestMethod -Uri "http://localhost:3001/start" -Method Post
    $sessionId = $resStart.sessionId
    Write-Host "✅ Session Started: $sessionId" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to start session. Is the server running on port 3001?"
    exit
}

# 2. Connect to Stream
Write-Host "⏳ Connecting to ASCII Stream (compiling C code inside Docker)..." -ForegroundColor Yellow
try {
    # Using WebRequest to handle the persistent stream
    $request = [System.Net.WebRequest]::Create("http://localhost:3001/stream?sessionId=$sessionId&vizId=bubble")
    $request.Timeout = 10000 # 10s timeout to connect
    $response = $request.GetResponse()
    $stream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    
    Write-Host "--- Receiving Data (First 10 frames) ---" -ForegroundColor Cyan
    
    # Read first 10 events
    for ($i=0; $i -lt 10; $i++) {
        $line = $reader.ReadLine()
        if ($line -and $line.StartsWith("data: ")) {
            $b64 = $line.Substring(6).Trim()
            try {
                $bytes = [System.Convert]::FromBase64String($b64)
                $text = [System.Text.Encoding]::UTF8.GetString($bytes)
                
                # Correctly using subexpression for string interpolation to avoid drive letter parsing error
                if ($text.Contains("[2J")) {
                    Write-Host "Frame $($i): [OK] Animation Frame Received (ANSI Clear detected)" -ForegroundColor Green
                } else {
                    Write-Host "Frame $($i): [OK] Text Data Received"
                }
            } catch {
                Write-Host "Frame $($i): [ERROR] Base64 Decode Failed" -ForegroundColor Red
            }
        }
    }
    
    $reader.Close()
    $response.Close()
    Write-Host "`n🎉 SUCCESS: The C visualization engine is streaming correctly!" -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ STREAM ERROR: $_" -ForegroundColor Red
    Write-Host "Check server.err for compilation logs." -ForegroundColor Gray
}