'use client'

import { useMemo, useRef, useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from 'app/firebase'
import ReCAPTCHA from 'react-google-recaptcha'

interface RatingModalProps {
  isOpen: boolean
  selectedRating: number
  slug: string
  onClose: () => void
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
    stroke="orange"
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

const QUESTIONS = [
  { id: 'usefulness', question: 'Was it useful?', options: {
    'Yes': 1,
    'No': 2
  } },
  { id: 'ease_of_use', question: 'Easy to use?', options: {
    'Easy': 1,
    'OK': 2,
    'Hard': 3
  } },
  { id: 'setup_difficulty', question: 'Setup difficulty?', options: {
    'Easy': 1,
    'Hard': 2
  } },
  { id: 'expectation', question: 'Did it do what you expected?', options: {
    'Yes': 1,
    'Partly': 2,
    'No': 3
  } },
]

const INPUTS = [
  { id: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
  { id: 'email', label: 'Email Address', placeholder: 'Enter your email', type: 'email' },
]

const RatingModal = ({
  isOpen,
  selectedRating,
  slug,
  onClose,
}: RatingModalProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const isSubmissionValid = useMemo(() => {
    // For all questions and inputs, check if there is an answer provided
    const allQuestionAnswered = QUESTIONS.every(q => answers[q.id])
    const allInputsFilled = INPUTS.every(i => answers[i.id] && answers[i.id].trim() !== '')
    return allQuestionAnswered && allInputsFilled
  }, [answers])

  const handleAnswerChange = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSubmit = async () => {
    if (!captchaToken) {
      setSubmitError('Please complete reCAPTCHA before submitting.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await addDoc(collection(db, 'ratings'), {
        title: slug,
        rating: selectedRating,
        recaptchaToken: captchaToken,
        // for answers and input, store each entry as separate field in the document
        ...Object.fromEntries(Object.entries(answers).map(([key, value]) => [`${key}`, value])),
        createdAt: new Date(),
        status: 'pending'
      })
      onClose()
      setAnswers({})
      setCaptchaToken(null)
      recaptchaRef.current?.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit rating.')
      setCaptchaToken(null)
      recaptchaRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selected Rating:</h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              <div
                  className="flex items-center cursor-pointer"
                  aria-label="Rating"
                  tabIndex={0}
              >
                {[...Array(5)].map((_, index) => (
                    <span key={index}>
                    {index < Math.floor(selectedRating) ? STAR_FILLED : index < selectedRating ? STAR_HALVED : STAR_OUTLINED}
                    </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{q.question}</p>
              <div className="flex gap-4">
                {Object.keys(q.options).map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500 dark:text-primary-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-x-6 flex flex-row my-6">
          {INPUTS.map((i) => (
            <div key={i.id}>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                {i.label}
              </label>
              <input
                className="mt-2 rounded-md focus:border-primary-500 dark:focus:border-gray-500"
                onChange={(e) => handleAnswerChange(i.id, e.target.value)}
                type={i.type}
                id={i.id}
                placeholder={i.placeholder}
                required
              />
            </div>
          ))}
        </div>

        <div className="my-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            onChange={(token) => {
              setCaptchaToken(token)
              if (submitError) {
                setSubmitError(null)
              }
            }}
            onExpired={() => setCaptchaToken(null)}
          />
        </div>

        {submitError && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">{submitError}</p>
        )}

        <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isSubmissionValid || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingModal
