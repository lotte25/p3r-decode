# p3r-convert
Helper tool for converting Persona 3 Reload saves to Steam version

## Usage
- Download [p3r-save.exe](https://github.com/lotte25/p3r-save-encrypt/releases/latest) and copy it to this project
- Copy your `wgs` folder (%LOCALAPPDATA%\Packages\SEGAofAmericaInc.L0cb6b3aea_s751p9cej88mt\SystemAppData\wgs) to the project root folder
- Run `node index.js`
- Check the generated `converted` folder and copy the `SaveData***.sav` files to `%APPDATA%\SEGA\P3R\Steam\<steam-id>`
- Enjoy