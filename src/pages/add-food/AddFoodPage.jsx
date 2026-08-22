import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { FoodSearchForm } from '../../components/add-food/FoodSearchForm'
import { FoodTable } from '../../components/add-food/FoodTable'
import { NutrientResultCard } from '../../components/add-food/NutrientResultCard'
import { AddCustomFoodDialog } from '../../components/add-food/AddCustomFoodDialog'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../services/apiClient'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useNutritionLogStore } from '../../stores/nutritionLogStore'
import { useFoodCatalog, useFoodCatalogStore } from '../../stores/foodCatalogStore'
import { filterFoods } from '../../utils/foodFilter'
import { todayKey } from '../../utils/dateUtils'

export function AddFoodPage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const addEntry = useNutritionLogStore((state) => state.addEntry)
  const foods = useFoodCatalog()
  const catalogStatus = useFoodCatalogStore((state) => state.status)
  const catalogError = useFoodCatalogStore((state) => state.error)
  const fetchFoods = useFoodCatalogStore((state) => state.fetchFoods)
  const addFoodToCatalog = useFoodCatalogStore((state) => state.addFood)

  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false)
  const [createError, setCreateError] = useState('')
  const [addError, setAddError] = useState('')

  useEffect(() => {
    if (catalogStatus === 'idle') fetchFoods()
  }, [catalogStatus, fetchFoods])

  // Live-filters the food table on every keystroke — no query means "show everything".
  const filteredFoods = useMemo(() => filterFoods(foods, query), [foods, query])

  function handleSelectFood(food) {
    setSelectedFood(food)
    setQuantity(1)
    setJustAdded(false)
    setAddError('')
  }

  async function handleCreateFood(formInput) {
    setCreateError('')
    try {
      const newFood = await addFoodToCatalog(formInput)
      setIsAddFoodOpen(false)
      handleSelectFood(newFood)
    } catch (error) {
      setCreateError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.')
      throw error // let the dialog know creation failed, so it keeps the user's input for retry
    }
  }

  async function handleAdd() {
    if (!selectedFood) return
    setAdding(true)
    setAddError('')
    try {
      // The backend looks up the Food row itself and computes every nutrient server-side
      // (create_entry in app/services/log_service.py) — it only ever accepts {foodId, quantity},
      // never a client-submitted nutrient number.
      await addEntry(userId, todayKey(), { foodId: selectedFood.id, quantity })
      setJustAdded(true)
    } catch (error) {
      setAddError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setAdding(false)
    }
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
            {addError && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-center text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {addError}
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
        ) : catalogStatus === 'error' ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Couldn't load the food catalog. {catalogError}</p>
            <Button variant="secondary" onClick={fetchFoods}>
              Try again
            </Button>
          </div>
        ) : catalogStatus === 'loaded' ? (
          <FoodTable foods={filteredFoods} onSelect={handleSelectFood} />
        ) : (
          <div className="mt-10 flex justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-accent-600 dark:border-slate-700 dark:border-t-accent-400" />
          </div>
        )}
      </PageContainer>

      <AddCustomFoodDialog
        isOpen={isAddFoodOpen}
        onClose={() => {
          setIsAddFoodOpen(false)
          setCreateError('')
        }}
        onCreate={handleCreateFood}
        error={createError}
      />
    </>
  )
}
