import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import { FREE_DELIVERY_FROM, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './Cart.module.css';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Cart() {
  usePageTitle('Giỏ hàng');
  const cart = useCart();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (cart.lines.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Giỏ hàng đang trống" titleAs="h1" text="Hãy ghé thăm danh mục — nơi có rất nhiều điều đẹp mắt.">
          <Link to="/catalog" className="btn btn-primary">
            Chuyển đến danh mục
          </Link>
        </EmptyState>
      </div>
    );
  }

  const remove = (line) => {
    const undo = cart.remove(line.id);
    toast.show(`«${line.product.name}» đã được xóa khỏi giỏ hàng`, { actionLabel: 'Hoàn tác', onAction: undo });
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setPromoError('Vui lòng nhập mã khuyến mãi');
    } else if (cart.applyPromo(code)) {
      setPromoError('');
      setCode('');
      toast.show('Promo code applied: −10%');
    } else {
      setPromoError('Promo code not found. Please check the spelling');
    }
  };

  const left = Math.max(0, FREE_DELIVERY_FROM - cart.subtotal);
  const progress = Math.min(100, (cart.subtotal / FREE_DELIVERY_FROM) * 100);

  return (
    <div className="container page">
      <h1 className="page-title">Giỏ hàng</h1>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {cart.lines.map((line) => (
            <CartItem
              key={line.id}
              line={line}
              onQtyChange={(qty) => cart.setQty(line.id, qty)}
              onRemove={() => remove(line)}
            />
          ))}
        </ul>

        <aside className={styles.aside} aria-label="Tổng số đơn hàng">
          <div className={styles.delivery}>
            <p>
              {left > 0 ? (
                <>
                  Đến miễn phí giao hàng còn <strong>{formatPrice(left)}</strong>
                </>
              ) : (
                <strong>Được giao hàng miễn phí 🎉</strong>
              )}
            </p>
            <div
              className={styles.progress}
              role="progressbar"
              aria-label="Tiến độ đến giao hàng miễn phí"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          {cart.promo ? (
            <div className={styles.promoApplied}>
              <span>
                Mã khuyến mãi <strong>{cart.promo}</strong> đã được áp dụng
              </span>
              <button type="button" className="btn btn-ghost" onClick={cart.removePromo}>
                Xóa
              </button>
            </div>
          ) : (
            <form className={styles.promo} onSubmit={applyPromo} noValidate>
              <label htmlFor="promo" className="visually-hidden">
                Mã khuyến mãi
              </label>
              <input
                id="promo"
                className="input"
                placeholder="Mã khuyến mãi"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setPromoError('');
                }}
                aria-invalid={Boolean(promoError)}
                aria-describedby={promoError ? 'promo-error' : undefined}
              />
              <button type="submit" className="btn btn-outline">
                Áp dụng
              </button>
              {promoError && (
                <p id="promo-error" className={`field-error ${styles.promoError}`} role="alert">
                  {promoError}
                </p>
              )}
            </form>
          )}

          <OrderSummary>
            <Link to="/checkout" className="btn btn-primary">
              Оформить заказ
            </Link>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
