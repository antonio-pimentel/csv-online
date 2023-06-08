"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Edit2, MoreVertical, X } from "lucide-react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { DataTable, SortButton } from "@/components/data-table"
import { DialogForm } from "@/components/dialog-form"
import { OptionsPopover } from "@/components/options-popover"

export function MainComponent() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  const [encoding, setEncoding] = useState("UTF-8")
  const [hasHeader, setHasHeader] = useState(true)
  const [skipEmpty, setSkipEmpty] = useState(true)

  let detectedDelimiter = ";"

  const actionColumns: ColumnDef<any>[] = [
    {
      id: "actions",
      header: () => (
        <div className="flex justify-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>Add row</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportCSV}>
                  Export csv
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogForm
              title="Add row"
              labels={Object.keys(data[0])}
              values={Object.keys(data[0]).reduce(
                (acc, field) => ({ ...acc, [field]: "" }),
                {}
              )}
              onSubmit={(values) => {
                setData((prev) => [values, ...prev])
              }}
            />
          </Dialog>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={(e) => console.log(row)}
                >
                  <span className="sr-only">Edit row</span>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogForm
                title="Edit row"
                labels={Object.keys(data[0])}
                values={row.original}
                onSubmit={(values) => {
                  setData((prev) =>
                    prev.map((r, i) => (i === row.index ? values : r))
                  )
                }}
              />
            </Dialog>
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
        skipEmptyLines: skipEmpty,
        // dynamicTyping: true,
        encoding: encoding,
        complete: function (results) {
          detectedDelimiter = results.meta.delimiter
          setData(results.data)
          if (hasHeader && results.meta.fields) {
            setColumns(
              results.meta.fields.map((field, n) => ({
                accessorKey: field,
                header: ({ column }) => (
                  <SortButton column={column} field={field} />
                ),
              }))
            )
          } else {
            const d = results.data as any[][]
            const cols = Array(
              d.reduce((max, arr) => (arr.length > max ? arr.length : max), 0)
            ).fill("")
            setColumns(
              cols.map((field, n) => ({
                accessorKey: n.toString(),
                header: ({ column }) => (
                  <SortButton column={column} field={field} />
                ),
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
      skipEmptyLines: skipEmpty,
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
          skipEmpty={skipEmpty}
          setSkipEmpty={setSkipEmpty}
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
