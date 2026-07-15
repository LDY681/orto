import ExcelJS from 'exceljs'
import { allPublications, allResources } from './.contentlayer/generated/index.mjs'

async function createExportTable(allPublications, allResources, filename = 'data.xlsx') {
  console.log("Make sure to run 'npm run build' to generate the newest ./.contentlayer/generated before exporting...")
  const workbook = new ExcelJS.Workbook()
  const pubSheet = workbook.addWorksheet('Publication')
  pubSheet.columns = [
    { header: 'body', key: 'body' },
    { header: 'Authors', key: 'authors' },
    { header: 'Year', key: 'year' },
    { header: 'Topics', key: 'topics' },
    { header: 'DOI', key: 'doi' },
    { header: 'PMID', key: 'pmid' },
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

  const resSheet = workbook.addWorksheet('Resource')
  resSheet.columns = [
    { header: 'Body', key: 'body' },
    { header: 'Title', key: 'title' },
    { header: 'Subtitle', key: 'subtitle' },
    { header: 'Topics', key: 'topics' },
    { header: 'Category', key: 'category' },
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

  for (const pub of allPublications) {
    const {
      body: { raw: body },
      authors,
      year,
      topics,
      doi,
      pmid,
    } = pub
    pubSheet.addRow({ body: body.trim(), authors, year, topics, doi, pmid })
  }

  for (const res of allResources) {
    const {
      body: { raw: body },
      title,
      subtitle,
      topics,
      category,
    } = res
    resSheet.addRow({ body: body.trim(), title, subtitle, topics, category })
  }

  await workbook.xlsx.writeFile(filename)
  console.log(`Written to ${filename}`)
}

createExportTable(allPublications, allResources)
