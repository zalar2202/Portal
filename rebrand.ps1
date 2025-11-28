# Rebrand script - Replace Omidar with Vista
$files = Get-ChildItem -Path "." -Recurse -Include *.jsx,*.js,*.json,*.md -Exclude node_modules,*.next*,.git*

$count = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Replace in order (most specific first)
        $content = $content -replace 'گروه مهاجرتی امیدار', 'پرسا گستر ویستا'
        $content = $content -replace 'امیدار', 'ویستا'
        $content = $content -replace 'مجله مهاجرت', 'بلاگ'
        $content = $content -replace 'omidar', 'vista'
        $content = $content -replace 'Omidar', 'Vista'
        $content = $content -replace 'OMIDAR', 'VISTA'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Updated: $($file.FullName)"
            $count++
        }
    } catch {
        Write-Host "Error processing $($file.FullName): $_"
    }
}

Write-Host "`nRebranding complete! Updated $count files."
