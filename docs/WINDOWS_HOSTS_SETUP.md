# Configuration DNS pour Accès Navigateur Windows

## Problème

L'application est accessible depuis WSL (`curl` fonctionne) mais pas depuis le navigateur Windows car le fichier `/etc/hosts` de WSL n'est pas lu par Windows.

## Solution

### Méthode 1: PowerShell en Administrateur (Recommandé)

1. **Ouvrir PowerShell en tant qu'Administrateur**
   - Appuyer sur `Windows + X`
   - Cliquer sur "Terminal (Admin)" ou "PowerShell (Admin)"

2. **Exécuter cette commande**:
   ```powershell
   Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "`n192.168.218.143 coach-app.local"
   ```

3. **Vider le cache DNS**:
   ```powershell
   ipconfig /flushdns
   ```

### Méthode 2: Notepad (Alternative)

1. **Ouvrir Notepad en Administrateur**
   - Cliquer droit sur Notepad → "Exécuter en tant qu'administrateur"

2. **Ouvrir le fichier hosts**
   - Menu Fichier → Ouvrir
   - Naviguer vers: `C:\Windows\System32\drivers\etc\`
   - Changer le filtre à "Tous les fichiers (*.*)"
   - Ouvrir le fichier `hosts`

3. **Ajouter à la fin**:
   ```
   192.168.218.143 coach-app.local
   ```

4. **Sauvegarder** (Ctrl+S)

5. **Vider le cache DNS** (CMD en admin):
   ```cmd
   ipconfig /flushdns
   ```

## Vérification

1. **Ping depuis Windows** (PowerShell ou CMD):
   ```powershell
   ping coach-app.local
   ```
   
   Devrait afficher: `Réponse de 192.168.218.143`

2. **Accès navigateur**:
   ```
   http://coach-app.local
   ```

## Alternative: Utiliser localhost

Si vous ne voulez pas modifier le fichier hosts Windows:

```bash
# Dans WSL, faire un port-forward
kubectl port-forward -n coach-app service/frontend-service 8080:80
```

Puis accéder à: **http://localhost:8080**

## Note

L'IP `192.168.218.143` est l'adresse de votre interface réseau WSL qui est accessible depuis Windows.
