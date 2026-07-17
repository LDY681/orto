import ExcelJS from 'exceljs'
import { allPublications, allResources } from './.contentlayer/generated/index.mjs'
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function createExportTable(allPublications, allResources, filename = 'data.xlsx') {
  console.log("Make sure to run 'npm run build' to generate the newest ./.contentlayer/generated before exporting...")
  const workbook = new ExcelJS.Workbook()
  const pubSheet = workbook.addWorksheet('Publication')
  pubSheet.columns = [
    { header: 'Authors', key: 'authors' },
    { header: 'Year', key: 'year' },
    { header: 'Body', key: 'body' },
    { header: 'Topics', key: 'topics' },
    { header: 'DOI', key: 'doi' },
    { header: 'PMID', key: 'pmid' },
    { header: 'Filename', key: 'filename' },
  ]
  pubSheet.properties.defaultRowHeight = 30
  pubSheet.properties.defaultColWidth = 40
  pubSheet.getCell('A1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffcc00' } },
  }
  pubSheet.getCell('B1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff949494' } },
  }
  pubSheet.getCell('C1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff91d2ff' } },
  }
  pubSheet.getCell('D1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffa4ffa4' } },
  }
  pubSheet.getCell('E1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffe580ff' } },
  }
  pubSheet.getCell('F1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff5df542' } },
  }
  pubSheet.getCell('G1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff329ea8' } },
  }
  
  const resSheet = workbook.addWorksheet('Resource')
  resSheet.columns = [
    { header: 'Title', key: 'title' },
    { header: 'Subtitle', key: 'subtitle' },
    { header: 'Body', key: 'body' },
    { header: 'Topics', key: 'topics' },
    { header: 'Category', key: 'category' },
    { header: 'Filename', key: 'filename' },
  ]
  resSheet.properties.defaultRowHeight = 30
  resSheet.properties.defaultColWidth = 40
  resSheet.getCell('A1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffcc00' } },
  }
  resSheet.getCell('B1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff949494' } },
  }
  resSheet.getCell('C1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff91d2ff' } },
  }
  resSheet.getCell('D1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffa4ffa4' } },
  }
  resSheet.getCell('E1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffe580ff' } },
  }
  resSheet.getCell('F1').style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff329ea8' } },
  }

  console.log(allPublications[0])
  for (const pub of allPublications) {
    const {
      body: { raw: body },
      authors,
      year,
      topics,
      doi,
      pmid,
      _raw: { sourceFileName: filename}
    } = pub
    pubSheet.addRow({ authors, year, body: body.trim(), topics, doi, pmid, filename })
  }

  for (const res of allResources) {
    const {
      body: { raw: body },
      title,
      subtitle: { raw: subtitle },
      topics,
      category,
      _raw: { sourceFileName: filename}
    } = res
    resSheet.addRow({ title, subtitle: subtitle.trim(), body: body.trim(), topics, category, filename })
  }

  await workbook.xlsx.writeFile(filename)
  console.log(`Written to ${filename}`)
}

async function main() {
  const rl = readline.createInterface({ input, output });
  const answerConfirm = await rl.question('This will overwrite the existing Excel file, are you sure you want to continue? (y/n) ');
  if (answerConfirm.toLowerCase() !== 'y') {
    return rl.close();
  }

    const answerFilename = await rl.question('Please enter the name to the Excel file (default: data.xlsx): ');
    const filename = answerFilename.trim() || 'data.xlsx';
    rl.close();
  
  await createExportTable(allPublications, allResources, filename)
}
main()
