import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './OrderSummary.module.css';

// Блок с расчётом суммы — общий для корзины и оформления заказа
export default function OrderSummary({ children }) {
  const { subtotal, discount, delivery, total, promo } = useCart();

  return (
    <div className={styles.summary}>
      <dl className={styles.rows}>
        <div>
          <dt>Sản phẩm</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className={styles.discount}>
            <dt>Giảm giá theo {promo}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div>
          <dt>Vận chuyển</dt>
          <dd>{delivery === 0 ? 'Miễn phí' : formatPrice(delivery)}</dd>
        </div>
        <div className={styles.total}>
          <dt>Tổng cộng</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
