import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import "antd/dist/reset.css";

import exampleData from './static-data/example-data';
import tableColums from './static-data/table-colums';
import { updateValue } from './utils/helper';

function App() {
  const [data, setData] = useState(exampleData);
  const [grandTotal, setGrandTotal] = useState(0);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const calculateGrandTotal = (rows) => {
      return rows.reduce((sum, row) => {
        sum += row.value;
        if (row.children) {
          sum += calculateGrandTotal(row.children);
        }
        return sum;
      }, 0);
    };

    setGrandTotal(calculateGrandTotal(data));
  }, [data]);

  const inputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const AllocationPercentage = (row) => {
    const inputValue = inputValues[row.id];
    if (!isNaN(inputValue)) {
      const updatedData = updateValue(data, row.id, inputValue, true);
      setData(updatedData);
    }
  };

  const AllocationValue = (row) => {
    const inputValue = inputValues[row.id];
    if (!isNaN(inputValue)) {
      const updatedData = updateValue(data, row.id, inputValue, false);
      setData(updatedData);
    }
  };

  const renderRows = (rows, level = 0) => {
    return rows.map((row) => ({
      key: row.id,
      label: `${"-- ".repeat(level)}${row.label}`,
      value: row.value,
      input: (
        <Input
          type="number"
          value={inputValues[row.id] || ""}
          onChange={(e) => inputChange(row.id, parseFloat(e.target.value))}
          placeholder="Enter % or value"
        />
      ),
      allocationPercentage: (
        <Button
          onClick={() => AllocationPercentage(row)}
          type="primary"
        >
          Allocation %
        </Button>
      ),
      allocationValue: (
        <Button
          onClick={() => AllocationValue(row)}
        >
          Allocation Val
        </Button>
      ),
      variance: row.variance || "0%",
      children: row.children ? renderRows(row.children, level + 1) : undefined,
    }));
  };

  const tableData = renderRows(data);

  return (
    <div style={{ padding: "20px" }}>
      <Table
        columns={tableColums}
        dataSource={tableData}
        pagination={false}
        footer={() => (
          <div style={{ fontWeight: "bold" }}>Total: {grandTotal}</div>
        )}
        bordered
        responsive
      />
    </div>
  );
}

export default App;
