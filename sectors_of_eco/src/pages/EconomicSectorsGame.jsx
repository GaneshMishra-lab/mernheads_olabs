import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Define occupation options with categories
const occupationOptions = [
  { id: "sugar-shop", name: "Sugar Shop", category: "tertiary", image: "/assets/sugarshop.svg", product: "sugar" },
  { id: "gold-mine", name: "Gold Mine", category: "primary", image: "/assets/mine.svg", product: "jewellery" },
  {
    id: "sugarcane-farmer",
    name: "Sugarcane farmer",
    category: "primary",
    image: "/assets/sugarcane.svg",
    product: "sugar",
  },
  { id: "goldsmith", name: "GoldSmith", category: "secondary", image: "/assets/goldsmit.svg", product: "jewellery" },
  { id: "sugarcane-mill", name: "Sugarcane Mill", category: "secondary", image: "/assets/mill.svg", product: "sugar" },
  {
    id: "jewellry-shop",
    name: "Jewellry Shop",
    category: "tertiary",
    image: "/assets/jewelleryshop.svg",
    product: "jewellery",
  },
  { id: "teaching", name: "Teaching", category: "tertiary", image: "/assets/teaching.svg", product: "education" },
  { id: "it-services", name: "IT Services", category: "tertiary", image: "/assets/it.svg", product: "service" },
  {
    id: "automobile-manufacturing",
    name: "Automobile Manufacturing",
    category: "secondary",
    image: "/assets/automobile.svg",
    product: "car",
  },
  { id: "dairy-farming", name: "Dairy Farming", category: "primary", image: "/assets/dairy.svg", product: "milk" },
]

const EconomicSystemDiagram = () => {
  const navigate = useNavigate()

  // State for sectors and unassigned items
  const [sectors, setSectors] = useState({
    primary: [],
    secondary: [],
    tertiary: [],
  })
  const [unassignedItems, setUnassignedItems] = useState(occupationOptions)
  const [feedback, setFeedback] = useState("")
  const [points, setPoints] = useState(0)
  const [sectorErrors, setSectorErrors] = useState({
    primary: false,
    secondary: false,
    tertiary: false,
  })

  // Track current product chain and completed products
  const [currentProduct, setCurrentProduct] = useState("sugar")
  const [completedProducts, setCompletedProducts] = useState([])

  // Check if a product chain is complete
  const checkProductCompletion = () => {
    const primary = sectors.primary[0]?.product
    const secondary = sectors.secondary[0]?.product
    const tertiary = sectors.tertiary[0]?.product

    if (primary === currentProduct && secondary === currentProduct && tertiary === currentProduct) {
      if (!completedProducts.includes(currentProduct)) {
        setCompletedProducts((prev) => [...prev, currentProduct])
        setFeedback(`Great job! You've completed the ${currentProduct} production chain!`)
        setPoints((prev) => prev + 20)

        // If current product is sugar, switch to jewellery
        if (currentProduct === "sugar") {
          setTimeout(() => {
            setCurrentProduct("jewellery")
            setFeedback("Now let's complete the jewellery production chain!")
            // Clear sectors for the next chain
            setSectors({
              primary: [],
              secondary: [],
              tertiary: [],
            })
          }, 1500)
        }
      }
    }
  }

  // Check if all products are completed
  useEffect(() => {
    if (completedProducts.includes("sugar") && completedProducts.includes("jewellery")) {
      setFeedback("Congratulations! You've completed all production chains!")
      setTimeout(() => {
        navigate("/level4")
      }, 2000)
    }

    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback("")
      }, 3000) // Clear feedback after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [completedProducts, navigate, feedback])

  // Check for product completion after sectors change
  useEffect(() => {
    checkProductCompletion()
  }, [sectors])

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetSector) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("itemId")

    // Find dragged item in unassigned or sectors
    let draggedItem = unassignedItems.find((item) => item.id === itemId)
    let sourceSector = null

    if (!draggedItem) {
      for (const [sector, items] of Object.entries(sectors)) {
        const foundItem = items.find((item) => item.id === itemId)
        if (foundItem) {
          draggedItem = foundItem
          sourceSector = sector
          break
        }
      }
    }

    if (!draggedItem) return

    // Validate category and product
    const isCorrectSector = draggedItem.category === targetSector
    const isCurrentProduct = draggedItem.product === currentProduct
    const isCorrect = isCorrectSector && isCurrentProduct

    if (!isCorrect) {
      setSectorErrors((prev) => ({ ...prev, [targetSector]: true }))

      if (!isCurrentProduct) {
        setFeedback(`We're currently working on the ${currentProduct} production chain!`)
      } else {
        setFeedback("Incorrect placement! Try another sector.")
      }

      setPoints((prev) => prev - 5)

      setTimeout(() => {
        setSectorErrors((prev) => ({ ...prev, [targetSector]: false }))
      }, 1000)

      return
    } else {
      setFeedback("Good keep going!!")
      setPoints((prev) => prev + 10)
    }

    // Clear errors
    setSectorErrors((prev) => ({ ...prev, [targetSector]: false }))

    const existingItem = sectors[targetSector].length > 0 ? sectors[targetSector][0] : null

    setSectors((prev) => ({
      ...prev,
      [targetSector]: [draggedItem], // Replace with the new item
    }))

    // Remove from source (previous location)
    if (sourceSector) {
      setSectors((prev) => ({
        ...prev,
        [sourceSector]: prev[sourceSector].filter((item) => item.id !== itemId),
      }))
    } else {
      setUnassignedItems((prev) => prev.filter((item) => item.id !== itemId))
    }

    // Move the existing item back to unassigned items
    if (existingItem) {
      setUnassignedItems((prev) => [...prev, existingItem])
    }
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-center mb-8">
            Rearrange the elements into the correct economic sectors
          </h1>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <span className="font-bold text-center">Points: {points}</span>
        </div>
      </div>

      {/* Economic Sectors Flow */}
      <div className="flex justify-between items-center mb-12">
        {["primary", "secondary", "tertiary"].map((sector) => (
          <React.Fragment key={sector}>
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full flex flex-wrap items-center justify-center mb-2 ${
                  sectorErrors[sector] ? "bg-red-200" : "bg-gray-200"
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sector)}
              >
                {sectors[sector].map((item) => (
                  <img
                    key={item.id}
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-fit h-32 rounded-full object-cover"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="font-bold capitalize">{sector}</p>
                <p className="font-bold">Sector</p>
              </div>
            </div>
            {sector !== "tertiary" && (
              <img src="/assets/arrow.svg" alt="Arrow Right" className="w-28 h-32 self-start" />
            )}
          </React.Fragment>
        ))}

        {/* Product Display */}
        <img src="/assets/arrow.svg" alt="Arrow Right" className="w-28 h-32 self-start" />
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full border-2 border-amber-300 flex items-center justify-center mb-2">
            <img
              src={currentProduct === "sugar" ? "/assets/sugar.svg" : "/assets/jewellery.svg"}
              alt={`${currentProduct} image`}
            />
          </div>
          <p className="font-bold">Product</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-4 mb-6">
        <div
          className={`px-4 py-2 rounded-full ${completedProducts.includes("sugar") ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Sugar ✓
        </div>
        <div
          className={`px-4 py-2 rounded-full ${completedProducts.includes("jewellery") ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Jewellery ✓
        </div>
      </div>

      {/* Available Items */}
      <div className="bg-white p-6 rounded-lg">
        <div className="grid grid-cols-5 gap-4">
          {unassignedItems.map((option) => (
            <div key={option.id} className="flex flex-col items-center">
              <div className="relative mb-2" draggable onDragStart={(e) => handleDragStart(e, option)}>
                <img
                  src={option.image || "/placeholder.svg"}
                  alt={option.name}
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80"
                />
              </div>
              <p className="text-xs text-center">{option.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div
          className={`mt-4 p-3 rounded-md animate-pulse absolute top-7 left-1 text-center ${
            feedback.includes("Congratulations") || feedback.includes("Great job") || feedback.charAt(0) === "G"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } font-semibold`}
        >
          {feedback}
        </div>
      )}
    </div>
  )
}

export default EconomicSystemDiagram

