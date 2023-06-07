"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Edit2, X } from "lucide-react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"

export function MainComponent() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  const actionColumns: ColumnDef<any>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={(e) => console.log("Edit row")}
            >
              <span className="sr-only">Edit row</span>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={(e) =>
                setData((prev) =>
                  prev.slice(0, row.index).concat(prev.slice(row.index + 1))
                )
              }
            >
              <span className="sr-only">Delete row</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

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
          <DataTable columns={columns.concat(actionColumns)} data={data} />
        </div>
      )}
    </div>
  )
}
