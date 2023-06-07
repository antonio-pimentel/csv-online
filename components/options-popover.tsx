"use client"

import { Dispatch, FC, ReactElement, SetStateAction } from "react"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const encodingOptions = [
  { label: "UTF-8", value: "UTF-8" },
  { label: "ISO-8859-1", value: "ISO-8859-1" },
]

type OptionPopoverProps = {
  encoding: string
  setEncoding: Dispatch<SetStateAction<string>>
  hasHeader: boolean
  setHasHeader: Dispatch<SetStateAction<boolean>>
}

const OptionsPopover: FC<OptionPopoverProps> = ({
  encoding,
  setEncoding,
  hasHeader,
  setHasHeader,
}): ReactElement => {
  const EncodingSelect = () => (
    <div className="flex items-center gap-4">
      <Label>Encoding</Label>
      <Select
        onValueChange={(value) => setEncoding(value)}
        defaultValue={encoding}
      >
        <SelectTrigger className="">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {encodingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )

  const HeaderSwitch = () => (
    <div className="flex items-center space-x-2">
      <Label htmlFor="header-switch">Header</Label>
      <Switch
        id="header-switch"
        defaultChecked={hasHeader}
        onCheckedChange={setHasHeader}
      />
    </div>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 rounded-full p-0">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Open popover</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <HeaderSwitch />
        <EncodingSelect />
      </PopoverContent>
    </Popover>
  )
}

export { OptionsPopover }
