import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Save, X, UtensilsCrossed, Search,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import Navbar from '../../components/Navbar';

const initialMeals = [
  { id: 1, name: 'Paneer Butter Masala', category: 'North Indian', calories: 480, price: 120, inventory: 50, active: true },
  { id: 2, name: 'Dal Tadka + Rice', category: 'North Indian', calories: 380, price: 90, inventory: 80, active: true },
  { id: 3, name: 'Chole Bhature', category: 'North Indian', calories: 550, price: 100, inventory: 40, active: true },
  { id: 4, name: 'Grilled Chicken Bowl', category: 'Continental', calories: 420, price: 150, inventory: 30, active: true },
  { id: 5, name: 'Veg Thali', category: 'Thali', calories: 520, price: 110, inventory: 60, active: false },
  { id: 6, name: 'Rajma Chawal', category: 'North Indian', calories: 410, price: 85, inventory: 70, active: true },
];

const emptyMeal = { name: '', category: 'North Indian', calories: '', price: '', inventory: '', active: true };
const categories = ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Thali'];

const MenuManager = () => {
  const { showToast } = useNotifications();
  const [meals, setMeals] = useState(initialMeals);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // meal id or 'new'
  const [form, setForm] = useState(emptyMeal);

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (meal) => {
    setEditing(meal.id);
    setForm({ ...meal });
  };

  const startAdd = () => {
    setEditing('new');
    setForm(emptyMeal);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyMeal);
  };

  const saveMeal = () => {
    if (!form.name || !form.calories || !form.price) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    if (editing === 'new') {
      const newMeal = { ...form, id: Date.now(), calories: +form.calories, price: +form.price, inventory: +form.inventory || 0 };
      setMeals((prev) => [...prev, newMeal]);
      showToast(`"${form.name}" added to menu!`, 'success');
    } else {
      setMeals((prev) => prev.map((m) =>
        m.id === editing ? { ...form, calories: +form.calories, price: +form.price, inventory: +form.inventory || 0 } : m
      ));
      showToast(`"${form.name}" updated!`, 'success');
    }
    cancelEdit();
  };

  const deleteMeal = (id, name) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast(`"${name}" removed from menu.`, 'info');
  };

  const toggleActive = (id) => {
    setMeals((prev) => prev.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m
    ));
  };

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-serif font-bold text-offwhite mb-1">
              Menu Manager <span className="text-gold">🍽️</span>
            </h1>
            <p className="text-warm-grey text-sm">Add, edit, or remove meals from the daily menu.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startAdd}
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-espresso px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
            id="add-meal-btn"
          >
            <Plus className="w-4 h-4" /> Add Meal
          </motion.button>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
          <input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cocoa border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30"
            id="menu-search"
          />
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {editing !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-cocoa border border-gold/20 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gold mb-4">
                  {editing === 'new' ? '➕ Add New Meal' : '✏️ Edit Meal'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Meal name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-grey focus:outline-none focus:border-gold/30"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Calories *"
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹) *"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30"
                  />
                  <input
                    type="number"
                    placeholder="Inventory cap"
                    value={form.inventory}
                    onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={saveMeal}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" /> Save
                  </motion.button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 text-sm text-warm-grey hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meals Table */}
        <div className="bg-cocoa border border-white/5 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-medium text-warm-grey">Meal</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey hidden sm:table-cell">Category</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey">Cal</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey">Price</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey hidden md:table-cell">Stock</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey">Status</th>
                  <th className="px-4 py-4 text-xs font-medium text-warm-grey text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((meal) => (
                  <tr key={meal.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UtensilsCrossed className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-offwhite">{meal.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-warm-grey hidden sm:table-cell">{meal.category}</td>
                    <td className="px-4 py-4 text-xs text-warm-grey">{meal.calories}</td>
                    <td className="px-4 py-4 text-xs text-offwhite font-medium">₹{meal.price}</td>
                    <td className="px-4 py-4 text-xs text-warm-grey hidden md:table-cell">{meal.inventory}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(meal.id)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                          meal.active ? 'text-emerald-400 bg-emerald-400/10' : 'text-warm-grey bg-white/5'
                        }`}
                      >
                        {meal.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(meal)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-warm-grey hover:text-gold hover:bg-gold/10 transition-colors"
                          aria-label={`Edit ${meal.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMeal(meal.id, meal.name)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-warm-grey hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          aria-label={`Delete ${meal.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
