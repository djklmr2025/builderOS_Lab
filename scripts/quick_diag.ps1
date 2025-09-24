$gw    = $env:GW
if (-not $gw)    { $gw = "https://arkaios-gateway-open.onrender.com" }
$index = $env:INDEX
if (-not $index) { $index = "https://djklmr2025.github.io/builderOS_Lab/index.json" }

"== Ping health =="
irm "$gw/aida/health" | ConvertTo-Json -Depth 6

"== Test echo =="
$body = @{ agent_id="diag"; action="echo"; params=@{ msg="hola" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 8

"== Test plan (index) =="
$body = @{ agent_id="diag"; action="plan"; params=@{ objective="mapear index"; index=$index } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 8
