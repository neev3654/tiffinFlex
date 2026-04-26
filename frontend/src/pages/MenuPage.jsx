import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Leaf, Wheat, Dumbbell, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import meals from '../data/meals';

const categories = ['All', 'North Indian', 'South Indian', 'Chinese', 'Desserts'];
const dietaryFilters = [
  { label: 'Vegan', tag: 'vegan', icon: Leaf },
  { label: 'Gluten-Free', tag: 'gluten-free', icon: Wheat },
  { label: 'High Protein', tag: 'high-protein', icon: Dumbbell },
];
const sortOptions = ['Popular', 'Calories: Low → High', 'Calories: High → Low', 'Price: Low → High'];

const MenuPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDietary, setActiveDietary] = useState([]);
  const [sortBy, setSortBy] = useState('Popular');
  const [showFilters, setShowFilters] = useState(false);

  const toggleDietary = (tag) => {
    setActiveDietary((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => {
    let result = [...meals];
    if (search) result = result.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'All') result = result.filter((m) => m.category === activeCategory);
    if (activeDietary.length) result = result.filter((m) => activeDietary.every((t) => m.tags.includes(t)));
    if (sortBy === 'Calories: Low → High') result.sort((a, b) => a.calories - b.calories);
    if (sortBy === 'Calories: High → Low') result.sort((a, b) => b.calories - a.calories);
    if (sortBy === 'Price: Low → High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Popular') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, activeCategory, activeDietary, sortBy]);

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-offwhite mb-2">Browse Menu</h1>
          <p className="text-warm-grey">Explore our chef-crafted meals and add to your daily tiffin.</p>
        </motion.div>

        {/* Search + Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search meals..." className="w-full bg-cocoa border border-white/10 rounded-xl pl-11 pr-4 py-3 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 transition-all" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 rounded-xl border transition-all flex items-center gap-2 ${showFilters ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-cocoa border-white/10 text-warm-grey hover:border-gold/30'}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-gold text-espresso' : 'bg-cocoa border border-white/10 text-warm-grey hover:border-gold/30'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-cocoa border border-white/5 rounded-xl p-5 mb-6 flex flex-wrap items-center gap-4">
            <span className="text-sm text-warm-grey font-medium">Dietary:</span>
            {dietaryFilters.map((f) => (
              <button key={f.tag} onClick={() => toggleDietary(f.tag)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeDietary.includes(f.tag) ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-espresso border border-white/10 text-warm-grey'}`}>
                <f.icon className="w-3 h-3" /> {f.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-warm-grey">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-espresso border border-white/10 rounded-lg px-3 py-2 text-sm text-offwhite focus:outline-none focus:border-gold/50">
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <p className="text-sm text-warm-grey mb-6">{filtered.length} meals found</p>

        {/* Meal Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((meal, i) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-cocoa border border-white/5 rounded-2xl overflow-hidden group hover:border-gold/20 transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-espresso/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" /> <span className="text-xs font-bold text-offwhite">{meal.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-serif font-bold text-offwhite">{meal.name}</h3>
                    <span className="text-gold font-bold text-sm">₹{meal.price}</span>
                  </div>
                  <p className="text-warm-grey text-xs mb-3">{meal.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {meal.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-warm-grey capitalize">{tag}</span>
                      ))}
                    </div>
                    <span className="text-xs text-warm-grey">{meal.calories} cal</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-4 bg-gold/10 border border-gold/30 text-gold py-2.5 rounded-xl font-bold text-sm hover:bg-gold/20 transition-colors">
                    Add to Today
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-xl font-serif text-offwhite mb-2">No meals found</p>
            <p className="text-warm-grey text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
