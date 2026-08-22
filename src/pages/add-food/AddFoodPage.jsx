import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { FoodSearchForm } from '../../components/add-food/FoodSearchForm'
import { FoodTable } from '../../components/add-food/FoodTable'
import { NutrientResultCard } from '../../components/add-food/NutrientResultCard'
import { AddCustomFoodDialog } from '../../components/add-food/AddCustomFoodDialog'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useNutritionLogStore } from '../../stores/nutritionLogStore'
import { useFoodCatalog, useFoodCatalogStore } from '../../stores/foodCatalogStore'
import { scaleNutrients } from '../../utils/nutrientMath'
import { filterFoods } from '../../utils/foodFilter'
import { todayKey } from '../../utils/dateUtils'

export function AddFoodPage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const addEntry = useNutritionLogStore((state) => state.addEntry)
  const foods = useFoodCatalog()
  const addFoodToCatalog = useFoodCatalogStore((state) => state.addFood)

  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false)

  // Live-filters the food table on every keystroke — no query means "show everything".
  const filteredFoods = useMemo(() => filterFoods(foods, query), [foods, query])

  function handleSelectFood(food) {
    setSelectedFood(food)
    setQuantity(1)
    setJustAdded(false)
  }

  function handleCreateFood(formInput) {
    const newFood = addFoodToCatalog(formInput)
    setIsAddFoodOpen(false)
    handleSelectFood(newFood)
  }

  async function handleAdd() {
    if (!selectedFood) return
    setAdding(true)
    addEntry(userId, todayKey(), {
      foodId: selectedFood.id,
      name: selectedFood.name,
      servingLabel: selectedFood.servingLabel,
      servingGrams: selectedFood.servingGrams,
      quantity,
      nutrients: scaleNutrients(selectedFood.nutrients, quantity),
    })
    setAdding(false)
    setJustAdded(true)
  }

  return (
    <>
      <TopBar title="Add Food" />
      <PageContainer className="lg:max-w-3xl">
        <Button
          variant="secondary"
          fullWidth
          icon={Plus}
          onClick={() => setIsAddFoodOpen(true)}
          className="mb-3"
        >
          Add new food
        </Button>

        <FoodSearchForm value={query} onChange={setQuery} />

        {selectedFood ? (
          <div className="mt-6">
            <NutrientResultCard
              food={selectedFood}
              quantity={quantity}
              onQuantityChange={setQuantity}
              targets={profile?.targets}
              onAdd={handleAdd}
              adding={adding}
            />
            {justAdded && (
              <p className="mt-3 text-center text-sm font-medium text-accent-600 dark:text-accent-400">
                Added to today's log
              </p>
            )}
            <button
              type="button"
              onClick={() => setSelectedFood(null)}
              className="mt-3 w-full text-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Back to food list
            </button>
          </div>
        ) : (
          <FoodTable foods={filteredFoods} onSelect={handleSelectFood} />
        )}
      </PageContainer>

      <AddCustomFoodDialog
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onCreate={handleCreateFood}
      />
    </>
  )
}
