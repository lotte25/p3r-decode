import fs from "fs";
import { spawn } from "child_process";
import path from "path";

function convertSave(filePath, cwd) {
  return new Promise((resolve) => {
    const subprocess = spawn(path.join(process.cwd(), "p3r-save.exe"), [filePath], { cwd, windowsHide: true });
    subprocess.on("exit", (code) => resolve(code === 0));
  })
}

async function main() {
  const wgsRoot = path.join(process.cwd(), "wgs");
  const convertedRoot = path.join(process.cwd(), "converted");

  if (!fs.existsSync(convertedRoot)) fs.mkdirSync(convertedRoot);

  for (const userId of fs.readdirSync(wgsRoot)) {
    const userPath = path.join(wgsRoot, userId);
    if (!fs.statSync(userPath).isDirectory()) continue;

    const saveFiles = [];
    for (const saveId of fs.readdirSync(userPath)) {
      const savePath = path.join(userPath, saveId);
      if (!fs.statSync(savePath).isDirectory()) continue;

      for (const fileId of fs.readdirSync(savePath)) {
        if (
          fileId.startsWith("container.")
          && fileId.endsWith(".sav")
        ) continue;

        const filePath = path.join(savePath, fileId);

        const stat = fs.statSync(filePath);
        saveFiles.push({ filePath, savePath, mtime: stat.mtime });
      }
    }

    if (saveFiles.length === 0) continue;

    saveFiles.sort((a, b) => a.mtime - b.mtime);

    const userConvertedPath = path.join(convertedRoot, userId);
    if (!fs.existsSync(userConvertedPath)) fs.mkdirSync(userConvertedPath);

    let convertedCount = 0;
    let invalidP3RSaveCount = 0;

    for (let i = 0; i < saveFiles.length; i++) {
      const { filePath, savePath } = saveFiles[i];
      const saveNum = String(convertedCount + 1).padStart(3, "0");

      await convertSave(filePath, savePath);

      const convertedSave = path.join(savePath, "encrypted.sav");
      const destFile = path.join(userConvertedPath, `SaveData${saveNum}.sav`);

      if (!fs.existsSync(convertedSave)) {
        invalidP3RSaveCount++;
        continue;
      }

      fs.renameSync(convertedSave, destFile);
      convertedCount++;
    }

    console.log(`Finished save conversion for user ID ${userId}, invalid saves: ${invalidP3RSaveCount}`);
  }
}

main();