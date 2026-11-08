# dsh-ui-accent 安装脚本
# 作用：在 desktop profile 中创建指向本目录的目录联接，并把插件登记到 cordis.patch.yml。
# 说明：cordis.patch.yml 是热重载的，脚本不会重启 DSH；补丁已存在时保持幂等。

$ErrorActionPreference = 'Stop'

# 插件包名：与 package.json 的 name 一致
$packageName = 'dsh-ui-accent'
# 只用于提示的旧包名：重命名前的目录联接需要手动清理
$legacyPackageName = 'dsh-client-ui-accent'

# 本仓库根目录（脚本所在目录）
$pluginRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
# DSH 主目录
$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' }
# desktop profile 目录
$profileDir = Join-Path $dshHome 'profiles\desktop'
# profile 的 node_modules
$nodeModules = Join-Path $profileDir 'node_modules'
# 目录联接路径
$linkPath = Join-Path $nodeModules $packageName
# 旧版目录联接路径
$legacyLinkPath = Join-Path $nodeModules $legacyPackageName
# profile 补丁文件
$patchFile = Join-Path $profileDir 'cordis.patch.yml'

Write-Host "插件目录：$pluginRoot"

if (-not (Test-Path $profileDir)) {
  throw "找不到 desktop profile：$profileDir"
}

# 创建 node_modules 目录（不存在时）
if (-not (Test-Path $nodeModules)) {
  New-Item -ItemType Directory -Path $nodeModules -Force | Out-Null
}

# 旧版目录联接只提示不处理，避免误删用户环境
if (Test-Path $legacyLinkPath) {
  Write-Host "检测到旧版目录联接（可手动删除）：$legacyLinkPath"
}

# 已存在且指向本目录时保持幂等
if (Test-Path $linkPath) {
  $item = Get-Item $linkPath
  if ($item.LinkType -eq 'Junction' -and ($item.Target -contains $pluginRoot)) {
    Write-Host "目录联接已存在：$linkPath"
  } else {
    throw "$linkPath 已存在且不是指向本目录的联接，请先确认并手动删除"
  }
} else {
  New-Item -ItemType Junction -Path $linkPath -Target $pluginRoot | Out-Null
  Write-Host "已创建目录联接：$linkPath"
}

# 检查补丁是否登记了插件
$patchText = if (Test-Path $patchFile) { Get-Content $patchFile -Raw } else { '' }
if ($patchText -match [regex]::Escape($packageName)) {
  Write-Host "cordis.patch.yml 已登记 $packageName"
} else {
  $snippet = @"

# 界面配色插件：结果标题/加粗/行内代码/思考/提问与各类工具行取色，设置侧边栏提供取色面板。
- insert:
    - id: ui-accent
      name: $packageName
"@
  Add-Content -Path $patchFile -Value $snippet -Encoding UTF8
  Write-Host '已向 cordis.patch.yml 追加插件补丁，保存后由 Loader 热加载'
}

Write-Host '完成。打开 设置 → 界面配色 / Settings → Accent colors 即可取色；若侧边栏尚未出现，请刷新界面（Ctrl+R）。'
