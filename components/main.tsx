"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, MoreVertical, X } from "lucide-react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { OptionsPopover } from "@/components/options-popover"

export function MainComponent() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  const [encoding, setEncoding] = useState("UTF-8")
  const [hasHeader, setHasHeader] = useState(true)

  let detectedDelimiter = ";"

  const actionColumns: ColumnDef<any>[] = [
    {
      id: "actions",
      header: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem onClick={exportCSV}>Export csv</DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={(e) => console.log("Edit row")}
            >
              <span className="sr-only">Edit row</span>
              <Edit2 className="h-4 w-4" />
            </Button> */}
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
        header: hasHeader,
        skipEmptyLines: true,
        dynamicTyping: true,
        encoding: encoding,
        complete: function (results) {
          detectedDelimiter = results.meta.delimiter
          setData(results.data)

          if (hasHeader && results.meta.fields)
            setColumns(
              results.meta.fields.map((field, n) => ({
                accessorKey: field,
                header: ({ column }) => {
                  return (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                      }
                    >
                      {field}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  )
                },
              }))
            )
          else {
            const d = results.data as any[][]
            const cols = Array(
              d.reduce((max, arr) => (arr.length > max ? arr.length : max), 0)
            ).fill("")
            setColumns(
              cols.map((field, n) => ({
                accessorKey: n.toString(),
                header: ({ column }) => {
                  return (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                      }
                    >
                      {field}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  )
                },
              }))
            )
          }
        },
      })
  }

  const exportCSV = () => {
    const csv = Papa.unparse(data, {
      delimiter: detectedDelimiter,
      header: hasHeader,
    })
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="flex gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="csvfile"
            type="file"
            className="cursor-pointer"
            accept=".csv"
            onChange={changeHandler}
          />
        </div>
        <OptionsPopover
          encoding={encoding}
          setEncoding={setEncoding}
          hasHeader={hasHeader}
          setHasHeader={setHasHeader}
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
