import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./search.css";

const SearchField = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Trigger onSearch callback with the current search query
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
      <label htmlFor="simple-search" className="label">
        Search:
      </label>
      <input
        type="text"
        id="simple-search"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Type to search..."
        style={{
          padding: "8px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

// PropTypes validation
SearchField.propTypes = {
  onSearch: PropTypes.func,
};

export default SearchField;
