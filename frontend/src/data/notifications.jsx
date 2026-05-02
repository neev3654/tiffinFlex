const notifications = [
  {
    id: 1,
    type: 'swap',
    title: 'Meal swap confirmed',
    message: 'Your lunch was swapped to Paneer Butter Masala.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'menu',
    title: "Tomorrow's menu is live",
    message: 'Check out the new dishes available for Tuesday.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'subscription',
    title: 'Subscription renewing soon',
    message: 'Your Regular plan renews on May 27. Manage billing in settings.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'delivery',
    title: 'Delivery on the way',
    message: 'Your lunch will arrive between 12:30 – 1:00 PM today.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'reward',
    title: 'Referral reward earned!',
    message: 'You earned 1 free week for referring Sneha Patel.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'swap',
    title: 'Swap window closing',
    message: 'You have 30 minutes left to customize today\'s dinner.',
    time: 'Yesterday',
    read: true,
  },
];

export default notifications;
