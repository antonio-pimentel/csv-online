"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import Papa from "papaparse"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"

export function MainComponent() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length)
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function (results) {
          console.log(results.data)
          console.log(results.meta.fields)
          setData(results.data)
          if (results.meta.fields)
            setColumns(
              results.meta.fields.map((field) => ({
                accessorKey: field,
                header: field,
              }))
            )
        },
      })
  }

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          id="csvfile"
          type="file"
          className="cursor-pointer"
          accept=".csv"
          onChange={changeHandler}
        />
      </div>
      {data.length > 0 && (
        <div className="mt-8">
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </div>
  )
}
