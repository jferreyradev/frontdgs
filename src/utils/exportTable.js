// utils/exportTable.js
export function exportCSV(columns, rows, filename = 'tabla.csv') {
  if (!rows.length) return
  const csv = [columns.join(',')]
    .concat(
      rows.map((row) =>
        columns.map((col) => `"${(row[col] ?? '').toString().replace(/"/g, '""')}"`).join(','),
      ),
    )
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportJSON(rows, filename = 'tabla.json') {
  if (!rows.length) return
  const json = JSON.stringify(rows, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportExcel(columns, rows, filename = 'tabla.xls') {
  if (!rows.length) return
  let excel = '<table><tr>' + columns.map((col) => `<th>${col}</th>`).join('') + '</tr>'
  rows.forEach((row) => {
    excel += '<tr>' + columns.map((col) => `<td>${row[col] ?? ''}</td>`).join('') + '</tr>'
  })
  excel += '</table>'
  const blob = new Blob(
    [`\uFEFF<html><head><meta charset='UTF-8'></head><body>${excel}</body></html>`],
    { type: 'application/vnd.ms-excel' },
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
