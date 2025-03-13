import { useState } from 'react'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw } from 'lucide-react'

const problems = [
  {
    id: 1,
    title: 'Rural Employment Crisis',
    description:
      'A rural area lacks job opportunities. How would you allocate resources?',
    solutions: [
      { id: 'agriculture', name: 'Invest in Agriculture (Primary Sector)' },
      {
        id: 'manufacturing',
        name: 'Build Manufacturing Units (Secondary Sector)'
      },
      { id: 'tourism', name: 'Develop Tourism (Tertiary Sector)' }
    ],
    correct: ['manufacturing', 'tourism'],
    impacts: {
      agriculture: {
        employment:
          'Low-Medium impact. Creates seasonal jobs but limited in scale.',
        gdp: 'Low impact. Traditional agriculture has limited growth potential.',
        sustainability:
          'Medium impact. Can be sustainable if modern practices are used.'
      },
      manufacturing: {
        employment:
          'High impact. Creates numerous stable jobs for local residents.',
        gdp: 'High impact. Adds significant value to raw materials.',
        sustainability:
          'Medium impact. Requires careful environmental management.'
      },
      tourism: {
        employment: 'High impact. Creates diverse service sector jobs.',
        gdp: 'High impact. Brings external revenue into the local economy.',
        sustainability: 'High impact if eco-tourism practices are implemented.'
      }
    }
  },
  {
    id: 2,
    title: 'Food Shortage in Cities',
    description: 'Urban areas are facing food shortages. What should be done?',
    solutions: [
      { id: 'agriculture', name: 'Increase Agricultural Output (Primary)' },
      { id: 'logistics', name: 'Improve Transport & Storage (Tertiary)' },
      { id: 'automation', name: 'Introduce Automated Farming (Secondary)' }
    ],
    correct: ['agriculture', 'logistics'],
    impacts: {
      agriculture: {
        employment: 'Medium impact. Creates jobs in farming communities.',
        gdp: 'Medium impact. Increases domestic food production.',
        sustainability: 'Depends on farming methods used.'
      },
      logistics: {
        employment:
          'Medium impact. Creates jobs in transportation and warehousing.',
        gdp: 'High impact. Reduces food waste and stabilizes prices.',
        sustainability:
          'Medium impact. More efficient distribution reduces waste.'
      },
      automation: {
        employment: 'Low impact. May reduce traditional farming jobs.',
        gdp: 'High impact. Increases productivity and output.',
        sustainability:
          'Variable. Can be more resource-efficient but requires energy.'
      }
    }
  },
  {
    id: 3,
    title: 'Coastal Town Development',
    description:
      'A coastal town needs economic revitalization. What sectors should be developed?',
    solutions: [
      { id: 'fishing', name: 'Expand Fishing Industry (Primary)' },
      { id: 'processing', name: 'Build Fish Processing Plants (Secondary)' },
      { id: 'tourism', name: 'Develop Beach Tourism (Tertiary)' }
    ],
    correct: ['processing', 'tourism'],
    impacts: {
      fishing: {
        employment: 'Medium impact. Limited by sustainable catch limits.',
        gdp: 'Low-Medium impact. Raw materials have limited value.',
        sustainability:
          'Low impact. Many fishing grounds are already overfished.'
      },
      processing: {
        employment: 'High impact. Creates year-round manufacturing jobs.',
        gdp: 'High impact. Adds value to local fish catch.',
        sustainability: 'Medium impact. Can use sustainable practices.'
      },
      tourism: {
        employment: 'High impact. Creates diverse service jobs.',
        gdp: 'High impact. Brings external revenue to the local economy.',
        sustainability:
          'Medium impact. Requires careful management of natural resources.'
      }
    }
  }
]

const DraggableItem = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className='p-3 bg-[#006aff] text-white rounded-lg cursor-grab shadow-md'
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : 'none'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {name}
    </motion.div>
  )
}

const DroppableArea = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`min-h-32 border-2 border-dashed rounded-lg p-4 transition-colors ${
        isOver ? 'border-[#006aff] bg-[rgba(0,160,255,0.1)]' : 'border-gray-300'
      }`}
    >
      {children.length > 0 ? (
        <div className='flex flex-wrap gap-2'>{children}</div>
      ) : (
        <div className='flex justify-center items-center h-24 text-gray-500'>
          Drag solutions here
        </div>
      )}
    </div>
  )
}

const Card = ({ children, onClick, backgroundImage }) => (
  <div
    onClick={onClick}
    className='cursor-pointer p-5 border rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group'
  >
    {/* Background image with overlay */}
    <div
      className='absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    />
    {/* Dark overlay for text readability */}
    <div className='absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors' />

    {/* Content */}
    <div className='relative z-10 text-white'>{children}</div>
  </div>
)

const Button = ({ onClick, children, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'primary'
        ? 'bg-[#006aff] text-white hover:bg-[#006aff]'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`}
  >
    {children}
  </button>
)

const ImpactCard = ({ title, description }) => (
  <div className='bg-gray-50 p-3 rounded-lg'>
    <h4 className='font-semibold text-sm'>{title}</h4>
    <p className='text-sm text-gray-600'>{description}</p>
  </div>
)

export default function SectorSimulation () {
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [selectedSolutions, setSelectedSolutions] = useState([])
  const [feedback, setFeedback] = useState('')
  const [showImpacts, setShowImpacts] = useState(false)

  const scenarioBackgrounds = {
    1: '/Rural.jpeg', // Rural scene
    2: '/Food.jpeg', // City scene
    3: 'costal.webp' // Coastal scene
  }

  const handleDrop = event => {
    const id = event.active.id
    if (!selectedSolutions.includes(id)) {
      setSelectedSolutions(prev => [...prev, id])
    }
  }

  const checkAnswer = () => {
    if (!selectedProblem) return

    const isCorrect =
      selectedProblem.correct.every(sol => selectedSolutions.includes(sol)) &&
      selectedSolutions.length === selectedProblem.correct.length

    setFeedback(
      isCorrect
        ? '✅ Correct! Your solution is effective. View the economic impacts below.'
        : '❌ Incorrect. Try again or view the impacts to learn more.'
    )

    setShowImpacts(true)
  }

  const resetSelection = () => {
    setSelectedSolutions([])
    setFeedback('')
    setShowImpacts(false)
  }

  const goBack = () => {
    setSelectedProblem(null)
    resetSelection()
  }

  const removeSelection = id => {
    setSelectedSolutions(prev => prev.filter(item => item !== id))
    if (feedback) {
      setFeedback('')
      setShowImpacts(false)
    }
  }

  return (
    <div className='min-h-screen bg-blue-50 py-8'>
      <div className='max-w-3xl mx-auto px-4'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Economic Sectors Simulation
        </h1>

        <div className='bg-white rounded-xl shadow-lg p-6'>
          {!selectedProblem ? (
            <>
              <h2 className='text-xl font-semibold mb-4'>
                Select a Problem Scenario
              </h2>
              <div className='grid gap-4'>
                {problems.map(problem => (
                  <Card
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    backgroundImage={scenarioBackgrounds[problem.id]}
                  >
                    <h3 className='font-semibold text-lg text-white'>
                      {problem.title}
                    </h3>
                    <p className='text-gray-100 mt-1'>{problem.description}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <DndContext onDragEnd={handleDrop}>
              <div className='space-y-6'>
                <div className='flex items-center'>
                  <button
                    onClick={goBack}
                    className='mr-3 p-2 rounded-full hover:bg-gray-100'
                    aria-label='Go back'
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className='text-xl font-bold'>{selectedProblem.title}</h2>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-gray-700'>{selectedProblem.description}</p>
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Available Solutions:</h3>
                  <div className='flex flex-wrap gap-3 mb-6'>
                    {selectedProblem.solutions.map(
                      solution =>
                        !selectedSolutions.includes(solution.id) && (
                          <DraggableItem
                            key={solution.id}
                            id={solution.id}
                            name={solution.name}
                          />
                        )
                    )}
                  </div>

                  <h3 className='font-semibold mb-2'>
                    Your Selected Solutions:
                  </h3>
                  <DroppableArea id='drop-zone'>
                    {selectedSolutions.map(id => {
                      const solution = selectedProblem.solutions.find(
                        s => s.id === id
                      )
                      return solution ? (
                        <div key={id} className='relative group'>
                          <div className='p-3 bg-[#006aff] text-white rounded-lg shadow-md'>
                            {solution.name}
                          </div>
                          <button
                            onClick={() => removeSelection(id)}
                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                            aria-label='Remove'
                          >
                            ×
                          </button>
                        </div>
                      ) : null
                    })}
                  </DroppableArea>
                </div>

                <div className='flex gap-3'>
                  <Button onClick={checkAnswer}>Submit Answer</Button>
                  {selectedSolutions.length > 0 && (
                    <Button onClick={resetSelection} variant='secondary'>
                      <div className='flex items-center'>
                        <RefreshCw size={16} className='mr-1' /> Reset
                      </div>
                    </Button>
                  )}
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-lg ${
                      feedback.includes('✅') ? 'bg-green-50' : 'bg-amber-50'
                    }`}
                  >
                    <p className='font-semibold'>{feedback}</p>
                  </div>
                )}

                {showImpacts && (
                  <div className='mt-6 space-y-4'>
                    <h3 className='font-semibold text-lg'>
                      Economic Impacts of Your Choices:
                    </h3>

                    {selectedSolutions.map(id => {
                      const solution = selectedProblem.solutions.find(
                        s => s.id === id
                      )
                      const impact = selectedProblem.impacts[id]

                      return solution && impact ? (
                        <div key={id} className='border rounded-lg p-4'>
                          <h4 className='font-semibold mb-2'>
                            {solution.name}
                          </h4>
                          <div className='grid gap-3 md:grid-cols-3'>
                            <ImpactCard
                              title='Employment'
                              description={impact.employment}
                            />
                            <ImpactCard title='GDP' description={impact.gdp} />
                            <ImpactCard
                              title='Sustainability'
                              description={impact.sustainability}
                            />
                          </div>
                        </div>
                      ) : null
                    })}

                    {selectedProblem.correct.some(
                      id => !selectedSolutions.includes(id)
                    ) && (
                      <div className='bg-blue-50 p-4 rounded-lg mt-4'>
                        <p className='font-semibold'>
                          Hint: Consider combining different sectors for optimal
                          results.
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          Economic development often requires a balanced
                          approach across primary, secondary, and tertiary
                          sectors.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DndContext>
          )}
        </div>

        <div className='mt-6 text-center text-sm text-gray-500'>
          <p>Learn about economic sectors and their impacts on development</p>
        </div>
      </div>
    </div>
  )
}
