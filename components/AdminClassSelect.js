import * as React from "react";
import { CustomSelect } from "./ui/CustomSelect";

export default function AdminClassSelect({ value, onChange, classes }) {
  const options = [
    { value: '', label: 'Select class' },
    ...classes.map(cls => ({ value: cls, label: cls }))
  ];
  return (
    <CustomSelect label="Class" value={value} onChange={onChange} options={options} />
  );
}
