// Static "AI coach" replies. Each entry's `reply` may be a string or a function that receives
// { profile, todayTotals } for a bit of context-awareness (e.g. quoting today's calorie count)
// while everything is still mocked. `chatService.getReply` matches on `keywords`, and this same
// call shape (userMessage, context) -> reply text is what a real streaming endpoint will replace.
export const CHAT_REPLIES = [
  {
    keywords: ['hi', 'hello', 'hey'],
    replies: [
      "Hey! I'm your nutrition coach. Ask me about your progress today, your macros, or how to hit a goal.",
      "Hi there! Want a quick check-in on today's nutrients, or advice on your goal?",
    ],
  },
  {
    keywords: ['protein'],
    replies: [
      ({ todayTotals, targets }) =>
        targets
          ? `You're at ${todayTotals.proteinG}g of your ${targets.proteinG}g protein target today. Chicken breast, Greek yogurt, and eggs are easy ways to close the gap.`
          : 'Protein helps preserve muscle, especially in a calorie deficit. Aim for lean meats, eggs, dairy, or legumes at each meal.',
      'Good protein sources in your food log: chicken breast, salmon, Greek yogurt, tofu, and lentils all score well per calorie.',
    ],
  },
  {
    keywords: ['calorie', 'calories', 'kcal'],
    replies: [
      ({ todayTotals, targets }) =>
        targets
          ? `You've logged ${todayTotals.calories} of ${targets.calories} kcal today — about ${Math.max(targets.calories - todayTotals.calories, 0)} kcal left.`
          : "Once you've completed onboarding I can track your calories against a personalized target.",
    ],
  },
  {
    keywords: ['lose weight', 'lose fat', 'cut', 'lean', 'deficit'],
    replies: [
      "For fat loss, a moderate calorie deficit (~500 kcal/day) with higher protein tends to preserve muscle best while you lean out.",
    ],
  },
  {
    keywords: ['bulk', 'gain muscle', 'build muscle', 'surplus', 'gain weight'],
    replies: [
      'To bulk effectively, aim for a modest calorie surplus and prioritize protein + progressive resistance training — a slow, steady gain is easier to keep lean.',
    ],
  },
  {
    keywords: ['carb', 'carbohydrate'],
    replies: [
      'Carbs are your main energy source, especially around workouts. Whole grains, oats, rice, and fruit are good picks over refined sugar.',
    ],
  },
  {
    keywords: ['fat', 'fats'],
    replies: [
      "Don't fear dietary fat — it's essential for hormones. Just favor unsaturated sources like avocado, nuts, and olive oil over fried foods.",
    ],
  },
  {
    keywords: ['fiber', 'fibre'],
    replies: [
      ({ todayTotals, targets }) =>
        targets
          ? `You're at ${todayTotals.fiberG}g of fiber today, aiming for at least ${targets.fiberG}g. Beans, oats, and vegetables are great sources.`
          : 'Fiber supports digestion and fullness — beans, lentils, oats, and vegetables are the easiest way to hit your daily target.',
    ],
  },
  {
    keywords: ['sugar'],
    replies: [
      ({ todayTotals, targets }) =>
        targets
          ? `You've had ${todayTotals.sugarG}g of sugar today, and the guideline is to stay under ${targets.sugarMaxG}g.`
          : 'Try to keep added sugar under about 10% of your daily calories — watch for it in sodas, sauces, and packaged snacks.',
    ],
  },
  {
    keywords: ['sodium', 'salt'],
    replies: ['Most guidelines suggest staying under about 2,300mg of sodium a day — processed and fast food are usually the biggest sources.'],
  },
  {
    keywords: ['water', 'hydration', 'drink'],
    replies: ["Hydration isn't tracked here yet, but a good rule of thumb is about 30-35ml of water per kg of bodyweight per day."],
  },
  {
    keywords: ['bmi'],
    replies: [
      ({ profile }) =>
        profile
          ? `Your current BMI is ${profile.bmi}. Remember BMI is a rough screening tool — it doesn't account for muscle mass, so use it alongside how you feel and perform.`
          : 'Once you complete onboarding, I can calculate your BMI from your height and weight.',
    ],
  },
  {
    keywords: ['what should i eat', 'meal idea', 'suggest a meal', 'recommend'],
    replies: [
      'A balanced plate: a palm-sized portion of protein, a fist of carbs (rice, potato, or oats), some healthy fat, and half the plate in vegetables.',
    ],
  },
  {
    keywords: ['progress', 'how am i doing', 'today'],
    replies: [
      ({ todayTotals, targets }) =>
        targets
          ? `So far today: ${todayTotals.calories}/${targets.calories} kcal, ${todayTotals.proteinG}g/${targets.proteinG}g protein. Check the Today tab for the full breakdown.`
          : "I don't have your targets yet — finish onboarding and I can track your daily progress.",
    ],
  },
  {
    keywords: ['thanks', 'thank you'],
    replies: ["You're welcome! Keep logging your meals and I'll keep the advice coming."],
  },
]

export const FALLBACK_REPLIES = [
  "I'm still a mock coach for now — but I can talk macros, calories, fiber, sugar, sodium, or your BMI. Try asking about one of those!",
  "That's outside what I can answer right now (the real AI coach is coming soon). Ask me about protein, calories, or your daily progress in the meantime.",
]
