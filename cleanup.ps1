# Script PowerShell pour arrêter les processus Node.js et nettoyer le cache

Write-Host "Arrêt des processus Node.js en cours..."
# Arrêter tous les processus Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Nettoyage des dossiers de cache..."
# Supprimer les dossiers de cache
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\.next
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\node_modules\.cache

Write-Host "Nettoyage terminé. Vous pouvez maintenant exécuter 'npm install' et 'npm run build'."
