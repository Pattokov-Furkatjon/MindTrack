import React, { useState } from "react";
import "../styles/searchfilter.css";

/**
 * SearchFilter Component
 * Allows filtering history by date range and category
 */
function SearchFilter({ entries, onFilter, isDarkMode, categories }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const handleFilterChange = () => {
    let filtered = [...entries];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((entry) => entry.category === selectedCategory);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((entry) => new Date(entry.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((entry) => new Date(entry.date) <= end);
    }

    // Filter by search text (in goal, notes, distraction)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          (entry.goal && entry.goal.toLowerCase().includes(searchLower)) ||
          (entry.notes && entry.notes.toLowerCase().includes(searchLower)) ||
          (entry.distraction &&
            entry.distraction.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    onFilter(filtered);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("All");
    setSearchText("");
    onFilter(entries.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [startDate, endDate, selectedCategory, searchText]);

  return (
    <div className={`search-filter-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h3 className="filter-title">🔍 Filter History</h3>

      {/* Search Text Input */}
      <div className="filter-group">
        <label className="filter-label">Search by Goal, Notes, or Distractions</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Type to search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">🏷️ Category</label>
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filters */}
      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">📅 Start Date</label>
          <input
            type="date"
            className="filter-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">📅 End Date</label>
          <input
            type="date"
            className="filter-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Reset Button */}
      <button className="filter-reset-btn" onClick={handleReset}>
        🔄 Reset Filters
      </button>
    </div>
  );
}

export default SearchFilter;
