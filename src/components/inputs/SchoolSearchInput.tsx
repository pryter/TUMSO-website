import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"
import { ReactSearchAutocomplete } from "react-search-autocomplete"

const possibleFirstLetters = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ญ",
  "ฐ",
  "ณ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]
const possibleBarnLetters = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ณ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]

const possibleWatLetter = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ญ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]

export const SchoolSearchInput: FC<{
  updateState: Dispatch<string>
  value?: string
}> = ({ updateState, value }) => {
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [keyword, setKW] = useState("")
  const [prevFL, setPrevFL] = useState("")
  const [selection, setSelection] = useState("")
  const [reloadStr, setReloadStr] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    updateState(selection)
  }, [selection])

  useEffect(() => {
    if (value) {
      setSelection(value)
      setReloadStr(value)
      document.body.click()
    }
  }, [value])

  const getSchoolIndex = async (startChar: string, subDir?: string) => {
    if (startChar === prevFL) return
    let data
    setLoading(true)
    if (subDir) {
      data = await fetch(`/schools/indexed/${subDir}/${startChar}.csv`, {
        method: "GET"
      })
    } else {
      data = await fetch(`/schools/indexed/${startChar}.csv`, {
        method: "GET"
      })
    }
    const unpacked = await data.text()
    const processed = unpacked.split("\n").map((i, k) => {
      const spl = i.split(",")
      const obj = {
        id: k,
        name: `โรงเรียน${subDir ? subDir + spl[0] : spl[0]}`,
        address: spl[1],
        area: spl[2]
      }

      return obj
    })
    setItems(processed)
    setPrevFL(startChar)
    setLoading(false)
  }

  useEffect(() => {
    if (keyword !== selection) {
      setSelection("")
    }
    const escaped = `_${keyword}`.replace("_โรงเรียน", "").replace("_", "")
    const es = `_${escaped}`
    if (es.includes("_บ้าน")) {
      const fl = es.replace("_บ้าน", "").replace("_", "").at(0) || ""
      if (!possibleBarnLetters.includes(fl)) return
      getSchoolIndex(fl, "บ้าน")
      return
    }
    if (es.includes("_วัด")) {
      const fl = es.replace("_วัด", "").replace("_", "").at(0) || ""
      if (!possibleWatLetter.includes(fl)) return
      getSchoolIndex(fl, "วัด")
      return
    }
    const firstLetter = escaped.at(0) || ""
    if (!possibleFirstLetters.includes(firstLetter)) return
    getSchoolIndex(firstLetter)
  }, [keyword])

  useEffect(() => {
    if (items.length > 0) {
      setReloadStr(keyword)
    }
  }, [items])
  return (
    <div>
      <ReactSearchAutocomplete
        onSearch={(keywor) => {
          setKW(keywor)
        }}
        onSelect={(v: any) => {
          setSelection(v.name)
        }}
        inputSearchString={reloadStr}
        showNoResultsText={loading ? "กำลังโหลดข้อมูล..." : "ไม่พบในฐานข้อมูล"}
        maxResults={30}
        styling={{
          boxShadow: "none",
          zIndex: 29,
          borderRadius: "6px",
          height: "32px",
          color: "rgb(17, 24, 39)",
          fontFamily: "inherit",
          border: "1px solid rgba(107, 114, 128, 0.6)",
          searchIconMargin: "0 0 0 26px"
        }}
        formatResult={(i: any) => {
          return (
            <div>
              <h1>{i.name}</h1>
              <p className="-mt-1 text-xs text-gray-500">{i.address}</p>
            </div>
          )
        }}
        items={items}
      />
    </div>
  )
}
