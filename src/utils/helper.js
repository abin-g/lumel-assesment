export const updateRow = (row, id, newValue, isPercentage) => {
    if (row.id === id) {
      const originalValue = row.originalValue;
  
      if (isPercentage) {
        row.value = Math.round(originalValue + (originalValue * newValue) / 100);
      } else {
        row.value = newValue;
      }
  
      row.variance = `${(((row.value - originalValue) / originalValue) * 100).toFixed(2)}%`;
    } else if (row.children) {
      row.children = row.children.map((child) => updateRow(child, id, newValue, isPercentage));
    }
    return { ...row };
  };
  
  export const updateValue = (data, id, newValue, isPercentage = false) => {
    return data.map((row) => updateRow(row, id, newValue, isPercentage));
  };
  