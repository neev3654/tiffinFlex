const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 2499,
    annualPrice: 1999,
    description: 'Perfect for trying out flexible tiffins.',
    features: [
      '1 meal per day (Lunch)',
      'Swap up to 3 meals/week',
      'Basic dietary preferences',
      'Standard delivery window',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'regular',
    name: 'Regular',
    monthlyPrice: 3999,
    annualPrice: 3199,
    description: 'Most popular for working professionals.',
    features: [
      '2 meals per day (Lunch + Dinner)',
      'Unlimited swaps',
      'Full dietary customization',
      'Priority delivery window',
      'Nutrition tracking',
      'Chat support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 5999,
    annualPrice: 4799,
    description: 'The ultimate premium tiffin experience.',
    features: [
      '3 meals per day (All meals)',
      'Unlimited swaps + add-ons',
      'AI meal recommendations',
      'Express delivery (30 min window)',
      'Nutrition + calorie tracking',
      'Dedicated account manager',
      'Family sharing (up to 3)',
    ],
    popular: false,
  },
];

export default plans;
