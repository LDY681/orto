'use client'

import { useMemo, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import RatingModal from './RatingModal'

interface RatingProps {
  average: number
  count: number
  slug: string
}

const STAR_FILLED = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 1L12.363 6.911L18.5 7.424L13.5 11.536L14.726 17.5L10 14.175L5.274 17.5L6.5 11.536L1.5 7.424L7.637 6.911L10 1Z"
      fill="orange"
      stroke="orange"
      strokeLinejoin="round"
    />
  </svg>
)

const STAR_OUTLINED = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    xmlns="http://www.w3.org/2000/svg"
  >
    {' '}
    <path
      d="M10 1L12.363 6.911L18.5 7.424L13.5 11.536L14.726 17.5L10 14.175L5.274 17.5L6.5 11.536L1.5 7.424L7.637 6.911L10 1Z"
      fill="none"
      stroke="orange"
      strokeLinejoin="round"
    />
  </svg>
)

const STAR_HALVED = (<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="green" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="50%" stopColor="orange" />
      <stop offset="50%" stopColor="transparent" />
    </linearGradient>
  </defs>
  
  <path d="M10 1l2.5 5.5h6l-4.5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-4.5-4h6z" 
        fill="url(#halfFill)" 
        stroke="orange" 
        strokeWidth="1" 
        strokeLinejoin="round"/>
</svg>)

function clampRating(value: number) {
  return Math.min(5, Math.max(0.5, value))
}

function roundToHalf(value: number) {
  return Math.round(value * 2) / 2
}

const Rating = ({ average, count, slug }: RatingProps) => {
  const starsRef = useRef<HTMLDivElement>(null)
  const [hoverRating, setHoverRating] = useState<number | 0>(average)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRating, setSelectedRating] = useState<number | 0>(0)

  // Show average rating by default but display user rating is user is hovering
  const displayRating = hoverRating ?? average

  const ratingSummary = useMemo(() => {
    return `${average !== null ? average.toFixed(1) : '0.0'}/5 (${count} ratings)`
  }, [average, count])

  // Get relative rating based on clientX position
  const getPointerRating = (clientX: number) => {
    const el = starsRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return null
    const relativeX = Math.min(rect.width, Math.max(0, clientX - rect.left))
    const raw = (relativeX / rect.width) * 5
    return clampRating(roundToHalf(raw))
  }

  // On hover: change rating position to user pointer
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const value = getPointerRating(event.clientX)
    if (value !== null) {
      setHoverRating(value)
    }
  }

  // On hover leave: reset to average rating
  const handlePointerLeave = () => {
    setHoverRating(average)
  }

  const handleClick = async (event: MouseEvent<HTMLDivElement>) => {
    const value = getPointerRating(event.clientX)
    if (value !== null) {
      setHoverRating(value)
      openRatingModal(slug, value)
    }
  }

  const openRatingModal = (slug: string, selectedRating: number) => {
    // Hook this to your real API once ready.
    setIsModalOpen(true)
    setSelectedRating(selectedRating)
  }

  return (
    <div className="flex">
      <div
        ref={starsRef}
        className="flex items-center cursor-pointer"
        aria-label="Rating"
        tabIndex={0}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < Math.floor(displayRating) ? STAR_FILLED : index < displayRating ? STAR_HALVED : STAR_OUTLINED}
          </span> 
        ))}
      </div>
      <span className="ml-2 text-sm text-gray-500">{ratingSummary}</span>
      <RatingModal isOpen={isModalOpen} selectedRating={selectedRating} slug={slug} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Rating
