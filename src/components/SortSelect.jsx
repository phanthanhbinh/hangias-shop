import styles from './SortSelect.module.css';

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'cheap', label: 'Giá thấp đến cao' },
  { value: 'expensive', label: 'Giá cao đến thấp' },
  { value: 'new', label: 'Mới nhất' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Sắp xếp</span>
      <select className={`input ${styles.select}`} value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
