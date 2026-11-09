import { CATEGORIES, SIZES } from '../data/products';
import styles from './Filters.module.css';

export const PRICE_MIN = 39;
export const PRICE_MAX = 420;

// В поле цены пропускаем только цифры, ведущие нули убираем
const cleanPrice = (value) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 6);

export default function Filters({ filters, onChange, onPriceBlur }) {
  const toggleSize = (size) => {
    const sizes = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size];
    onChange({ sizes });
  };

  const priceProps = (field, placeholder, label) => ({
    type: 'text',
    className: 'input',
    inputMode: 'numeric',
    autoComplete: 'off',
    placeholder: String(placeholder),
    'aria-label': label,
    value: filters[field],
    onChange: (e) => onChange({ [field]: cleanPrice(e.target.value) }, { replace: true }),
    onBlur: onPriceBlur,
  });

  return (
    <div className={styles.filters}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Loại</legend>
        {[{ id: '', name: 'Tất cả sản phẩm' }, ...CATEGORIES].map((c) => (
          <label key={c.id || 'all'} className={styles.option}>
            <input
              type="radio"
              name="category"
              checked={filters.category === c.id}
              onChange={() => onChange({ category: c.id })}
            />
            {c.name}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Giá</legend>
        <div className={styles.price}>
          <label className={styles.priceField}>
            <span aria-hidden="true">từ</span>
            <input {...priceProps('priceMin', PRICE_MIN, 'Giá từ')} />
          </label>
          <label className={styles.priceField}>
            <span aria-hidden="true">đến</span>
            <input {...priceProps('priceMax', PRICE_MAX, 'Giá đến')} />
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Kích thước</legend>
        <div className={styles.sizes}>
          {SIZES.map((size) => (
            <label key={size} className={styles.size}>
              <input type="checkbox" checked={filters.sizes.includes(size)} onChange={() => toggleSize(size)} />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className="visually-hidden">Ngoài ra</legend>
        <label className={styles.option}>
          <input type="checkbox" checked={filters.inStock} onChange={(e) => onChange({ inStock: e.target.checked })} />
          Chỉ còn hàng
        </label>
        <label className={styles.option}>
          <input type="checkbox" checked={filters.sale} onChange={(e) => onChange({ sale: e.target.checked })} />
          Chỉ có khuyến mãi
        </label>
      </fieldset>
    </div>
  );
}
