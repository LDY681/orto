'use client'
import { useState } from 'react'
import NextImage, { ImageProps } from 'next/image'
const basePath = process.env.BASE_PATH

const ThumbNail = ({ src, ...rest }: ImageProps) => {
  const [clicked, setClicked] = useState(false)

  return (
    // Scale image on hover
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setClicked(!clicked)}
      onClick={() => setClicked(!clicked)}
    >
      <NextImage
        className="align-center cursor-pointer justify-center transition ease-in-out hover:scale-110"
        src={`${basePath || ''}${src}`}
        {...rest}
      />

      {/* Full sized imaged on click */}
      {clicked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <NextImage src={`${basePath || ''}${src}`} {...rest} height={1000} width={1000} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ThumbNail
