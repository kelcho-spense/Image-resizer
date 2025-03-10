import { ImageProcessor } from '@/components/image-processor'
import { createFileRoute } from '@tanstack/react-router'
import { Image }from "lucide-react"

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col items-center">
     <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-bold">Image Converter</h1>
        </div>
        <p className="text-gray-600">Compress and convert your images to AVIF, JPEG, JPEG XL, PNG, or WebP</p>
      </header>
      <ImageProcessor />
    </div>
  )
}
