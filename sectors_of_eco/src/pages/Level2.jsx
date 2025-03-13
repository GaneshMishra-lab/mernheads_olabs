import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Level2 = () => {
  const navigate = useNavigate()
  // Define the correct answers for each occupation
  const correctAnswers = {
    Farming: {
      activity: 'Primary',
      conditions: 'Informal',
      ownership: 'Private'
    },
    Fishing: {
      activity: 'Primary',
      conditions: 'Informal',
      ownership: 'Private'
    },
    'Police Officer': {
      activity: 'Tertiary',
      conditions: 'Formal',
      ownership: 'Public'
    },
    "Prime Minister": {
      activity: 'Tertiary',
      conditions: 'Formal',
      ownership: 'Public'
    },
    'Street Vendor': {
      activity: 'Tertiary',
      conditions: 'Informal',
      ownership: 'Private'
    }
  }

  // State for user selections
  const [selections, setSelections] = useState({
    Farming: { activity: '', conditions: '', ownership: '' },
    Fishing: { activity: '', conditions: '', ownership: '' },
    'Police Officer': { activity: '', conditions: '', ownership: '' },
    "Prime Minister": { activity: '', conditions: '', ownership: '' },
    'Street Vendor': { activity: '', conditions: '', ownership: '' }
  })

  // State for validation and feedback
  const [validated, setValidated] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [points, setPoints] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle dropdown change
  const handleChange = (occupation, field, value) => {
    setSelections(prev => ({
      ...prev,
      [occupation]: {
        ...prev[occupation],
        [field]: value
      }
    }))
  }

  // Check if an answer is correct
  const isCorrect = (occupation, field) => {
    if (!validated) return true // Don't show errors until validated
    return selections[occupation][field] === correctAnswers[occupation][field]
  }

  // Check if all answers are correct
  const allCorrect = () => {
    return Object.keys(correctAnswers).every(occupation => {
      return Object.keys(correctAnswers[occupation]).every(field => {
        return (
          selections[occupation][field] === correctAnswers[occupation][field]
        )
      })
    })
  }

  // Count correct answers
  const countCorrectAnswers = () => {
    let count = 0
    Object.keys(correctAnswers).forEach(occupation => {
      Object.keys(correctAnswers[occupation]).forEach(field => {
        if (
          selections[occupation][field] === correctAnswers[occupation][field]
        ) {
          count++
        }
      })
    })
    return count
  }

  // Handle Next button click
  const handleNextClick = () => {
    // First check if all fields are filled
    const allFilled = Object.values(selections).every(occupationSelections =>
      Object.values(occupationSelections).every(value => value !== '')
    )

    if (!allFilled) {
      setFeedback('Please select options for all fields before proceeding.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }

    setValidated(true)

    if (allCorrect()) {
      const totalCorrect = countCorrectAnswers()
      setPoints(totalCorrect)
      setFeedback('Congratulations! All answers are correct!')
      setIsCompleted(true)
      setTimeout(() => {
        navigate('/level3')
      }, 5000)
    } else {
      const totalCorrect = countCorrectAnswers()
      setPoints(totalCorrect)
      setFeedback('Some answers are incorrect. Please try again.')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  return (
    <div className='bg-blue-50 h-screen w-screen flex justify-center items-center'>
      <div className='max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg'>
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-lg text-center animate-pulse ${
              isCompleted
                ? ''
                : 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-80'
            } ${
              feedback.charAt(0) === 'C' || feedback.charAt(0) === 'G'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className={`font-bold ${isCompleted ? 'text-lg' : ''}`}>
              {feedback}
            </p>
            {isCompleted && (
              <p className='mt-2'>
                Final Score: <span className='font-bold'>{points}</span> points
              </p>
            )}
          </div>
        )}

        <table className='w-full border-collapse bg-white rounded-xl overflow-hidden'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-4 text-left'>
                Occupation
              </th>
              <th className='border border-gray-300 p-4 text-left'>
                Nature of Activity
              </th>
              <th className='border border-gray-300 p-4 text-left'>
                Employment conditions
              </th>
              <th className='border border-gray-300 p-4 text-left'>
                Ownership of Enterprises
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(correctAnswers).map(occupation => (
              <tr key={occupation}>
                <td className='border border-gray-300 p-4'>{occupation}</td>
                <td className='border border-gray-300 p-4'>
                  <select
                    className={`px-4 py-2 rounded-full w-full outline-none ${
                      isCorrect(occupation, 'activity')
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-red-100 text-red-700 border border-red-500'
                    }`}
                    value={selections[occupation].activity}
                    onChange={e =>
                      handleChange(occupation, 'activity', e.target.value)
                    }
                  >
                    <option value=''>Select Option</option>
                    <option value='Primary'>Primary</option>
                    <option value='Secondary'>Secondary</option>
                    <option value='Tertiary'>Tertiary</option>
                  </select>
                </td>
                <td className='border border-gray-300 p-4'>
                  <select
                    className={`px-4 py-2 rounded-full w-full outline-none ${
                      isCorrect(occupation, 'conditions')
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-red-100 text-red-700 border border-red-500'
                    }`}
                    value={selections[occupation].conditions}
                    onChange={e =>
                      handleChange(occupation, 'conditions', e.target.value)
                    }
                  >
                    <option value=''>Select Option</option>
                    <option value='Formal'>Formal</option>
                    <option value='Informal'>Informal</option>
                  </select>
                </td>
                <td className='border border-gray-300 p-4'>
                  <select
                    className={`px-4 py-2 rounded-full w-full outline-none ${
                      isCorrect(occupation, 'ownership')
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-red-100 text-red-700 border border-red-500'
                    }`}
                    value={selections[occupation].ownership}
                    onChange={e =>
                      handleChange(occupation, 'ownership', e.target.value)
                    }
                  >
                    <option value=''>Select Option</option>
                    <option value='Public'>Public</option>
                    <option value='Private'>Private</option>
                    <option value='Cooperative'>Cooperative</option>
                    <option value='Mixed'>Mixed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='text-center mt-4 mb-8'>
          <p className='text-lg font-medium'>
            Select appropriate sectors from the dropdown
          </p>
        </div>

        <div className='flex justify-end'>
          <button
            className='bg-yellow-200 hover:bg-yellow-300 px-8 py-2 rounded-full text-black font-medium'
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Level2
