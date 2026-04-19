'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { collection, doc, setDoc } from 'firebase/firestore'
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

const STAR_HALVED = (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    stroke="green"
    strokeWidth="1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="orange" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>

    <path
      d="M10 1l2.5 5.5h6l-4.5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-4.5-4h6z"
      fill="url(#halfFill)"
      stroke="orange"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
)

const QUESTIONS = [
  {
    id: 'usefulness',
    question: 'Was it useful?',
    options: {
      Yes: 1,
      No: 2,
    },
  },
  {
    id: 'ease_of_use',
    question: 'Easy to use?',
    options: {
      Easy: 1,
      OK: 2,
      Hard: 3,
    },
  },
  {
    id: 'setup_difficulty',
    question: 'Setup difficulty?',
    options: {
      Easy: 1,
      Hard: 2,
    },
  },
  {
    id: 'expectation',
    question: 'Did it do what you expected?',
    options: {
      Yes: 1,
      Partly: 2,
      No: 3,
    },
  },
]

const INPUTS = [
  { id: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
  { id: 'email', label: 'Email Address', placeholder: 'Enter your email', type: 'email' },
]

const RatingModal = ({ isOpen, selectedRating, slug, onClose }: RatingModalProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitStatus, setSubmitStatus] = useState<null | 'pending' | 'success' | 'error'>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const isSubmissionValid = useMemo(() => {
    // For all questions and inputs, check if there is an answer provided
    const allQuestionAnswered = QUESTIONS.every((q) => answers[q.id])
    const allInputsFilled = INPUTS.every((i) => answers[i.id] && answers[i.id].trim() !== '')
    return allQuestionAnswered && allInputsFilled
  }, [answers])

  useEffect(() => {
    if (isOpen) {
      setAnswers({})
      setSubmitStatus(null)
      setSubmitError(null)
      setCaptchaToken(null)
    }
  }, [isOpen])

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

    setSubmitStatus('pending')
    setSubmitError(null)

    try {
      const currDate = new Date()
      const timestamp = currDate.toISOString()
      await setDoc(
        doc(
          collection(db, 'ratings'),
          `${slug}-${answers['name']}-${answers['email']}-${timestamp}`
        ),
        {
          title: slug,
          rating: selectedRating,
          // recaptchaToken: captchaToken,
          // for answers and input, store each entry as separate field in the document
          ...Object.fromEntries(Object.entries(answers).map(([key, value]) => [`${key}`, value])),
          createdAt: new Date(),
          status: 'pending',
        }
      )
      setAnswers({})
      setCaptchaToken(null)
      recaptchaRef.current?.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit rating.')
      setCaptchaToken(null)
      recaptchaRef.current?.reset()
    } finally {
      setSubmitStatus('success')
    }
  }

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Selected Rating:
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              <div className="flex cursor-pointer items-center" aria-label="Rating">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < Math.floor(selectedRating)
                      ? STAR_FILLED
                      : index < selectedRating
                        ? STAR_HALVED
                        : STAR_OUTLINED}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {submitStatus !== 'success' ? (
          <div>
            <div className="space-y-6">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-b border-gray-200 pb-6 dark:border-gray-700">
                  <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    {q.question}
                  </p>
                  <div className="flex gap-4">
                    {Object.keys(q.options).map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 dark:text-primary-400"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="my-6 flex flex-row space-x-6">
              {INPUTS.map((i) => (
                <div key={i.id}>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {i.label}
                  </label>
                  <input
                    className="mt-2 rounded-md text-gray-500 focus:border-primary-500 dark:text-gray-500 dark:focus:border-gray-500"
                    onChange={(e) => handleAnswerChange(i.id, e.target.value)}
                    type={i.type}
                    id={i.id}
                    placeholder={i.placeholder}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="my-6 flex flex-col">
              <label
                htmlFor="comments"
                className="flex-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Comments
              </label>
              <textarea
                className="mt-2 flex-1 rounded-md text-gray-500 focus:border-primary-500 dark:text-gray-500 dark:focus:border-gray-500"
                onChange={(e) => handleAnswerChange('comments', e.target.value)}
                id="comments"
                placeholder="Enter your comments (Optional)"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-lg font-bold">Thank you for your feedback!</h2>
            <p>Your response is now submitted and will be available once approved.</p>
          </div>
        )}

        {submitStatus !== 'success' && (
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
        )}

        {submitError && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">{submitError}</p>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={submitStatus === 'pending'}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          {submitStatus !== 'success' && (
            <button
              onClick={handleSubmit}
              disabled={!isSubmissionValid || submitStatus === 'pending'}
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitStatus === 'pending' ? 'Submitting...' : 'Submit Rating'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RatingModal
