import type { OutputFormat } from "./image-processor"

interface FormatSelectorProps {
  value: OutputFormat
  onChange: (format: OutputFormat) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const formats: OutputFormat[] = ["AVIF", "JPEG", "JXL", "PNG", "WEBP"]

  return (
    <div className="grid grid-cols-5 gap-2">
      {formats.map((format) => (
        <button
          key={format}
          className={`py-3 rounded-md text-center transition-colors ${
            value === format ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => onChange(format)}
        >
          {format}
        </button>
      ))}
    </div>
  )
}

