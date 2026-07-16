import ExcelJS from 'exceljs'
import { allPublications, allResources } from './.contentlayer/generated/index.mjs'
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'fs';

async function readImportTable(allPublications, allResources, filename = 'data.xlsx') {
  console.log("Make sure you have a backup of your old data...")
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filename);

  const pubSheet = workbook.getWorksheet('Publication')
  pubSheet.eachRow(function(row, idx) {
    if (idx == 1) return; // skip header row

    const rowNumber = row.number;
    const body = (row.getCell(1).value ?? '').toString();
    const authors = (row.getCell(2).value ?? '').toString();
    const year = (row.getCell(3).value ?? '').toString();
    const topics = (row.getCell(4).value ?? '').toString();
    const doi = (row.getCell(5).value ?? '').toString();
    const pmid = (row.getCell(6).value ?? '').toString();
    const filename = (row.getCell(7).value ?? '').toString();

    console.log(`Row ${rowNumber}: Body=${body}, Authors=${authors}, Year=${year}, Topics=${topics}, DOI=${doi}, PMID=${pmid}, Filename=${filename}`);

    if (!filename) return; // skip if filename is empty

    let writer = fs.createWriteStream(`./data/publication/${filename}`);
    writer.write('---\n');
    writer.write(`authors: "${authors}"\n`);
    writer.write(`year: ${year}\n`);
    writer.write(`topics: ${topics}\n`);
    writer.write(`doi: "${doi}"\n`);
    writer.write(`pmid: "${pmid}"\n`);
    writer.write('draft: false\n')
    writer.write('---\n');
    writer.write('\n');
    writer.write(body);
    writer.close();
  });
  
  const resSheet = workbook.getWorksheet('Resource')
  resSheet.eachRow(function(row, idx) {
    if (idx == 1) return; // skip header row

    const rowNumber = row.number;
    const body = (row.getCell(1).value ?? '').toString();
    const title = (row.getCell(2).value ?? '').toString();
    const subtitle = (row.getCell(3).value ?? '').toString();
    const topics = (row.getCell(4).value ?? '').toString();
    const category = (row.getCell(5).value ?? '').toString();
    const filename = (row.getCell(6).value ?? '').toString();

    console.log(`Row ${rowNumber}: Body=${body}, Title=${title}, Subtitle=${subtitle}, Topics=${topics}, Category=${category}, Filename=${filename}`);

    if (!filename) return; // skip if filename is empty

    let writer = fs.createWriteStream(`./data/resource/${filename}`);
    writer.write('---\n');
    writer.write(`title: "${title}"\n`);
    writer.write(`subtitle: "${subtitle}"\n`);
    writer.write(`topics: ${topics}\n`);
    writer.write(`category: "${category}"\n`);
    writer.write('draft: false\n')
    writer.write('---\n');
    writer.write('\n');
    writer.write(body);
    writer.close();
  });
}

async function main() {
  const rl = readline.createInterface({ input, output });
  const answerConfirm = await rl.question('This will overwrite files in your existing data folder, are you sure you want to continue? (y/n) ');
  if (answerConfirm.toLowerCase() !== 'y') {
    return rl.close();
  }

  const answerFilename = await rl.question('Please enter the name to the Excel file (default: data.xlsx): ');
  const filename = answerFilename.trim() || 'data.xlsx';
  rl.close();

  await readImportTable(allPublications, allResources, filename);
}

main();


