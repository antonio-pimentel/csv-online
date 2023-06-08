"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type DialogMenuProps = {
  labels: string[]
  addRow: (row: unknown) => void
}

export function DialogMenu({ labels, addRow }: DialogMenuProps) {
  const formSchema = z.object(
    labels.reduce((acc, field) => ({ ...acc, [field]: z.string() }), {})
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: labels.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addRow(values)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add row</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {labels.map((label) => (
            <FormField
              key={`form-field-${label}`}
              control={form.control}
              name={label as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <DialogFooter>
            <Button type="submit">Save row</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
