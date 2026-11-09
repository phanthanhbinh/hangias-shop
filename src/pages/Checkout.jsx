import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { PHONE_PREFIX, availableSlots, formatPhone, minDeliveryDate, validateCheckout } from '../utils/validators';
import { imageSrcSet } from '../utils/imageSrcSet';
import styles from './Checkout.module.css';
import { usePageTitle } from '../hooks/usePageTitle';

const PAYMENTS = [
  { value: 'online', label: 'Bằng thẻ trực tuyến' },
  // { value: 'courier-card', label: 'Bằng thẻ của người giao hàng' },
  { value: 'cash', label: 'Tiền mặt khi nhận hàng' },
];
const CARD_LIMIT = 200;
const FIELD_ORDER = ['name', 'phone', 'address', 'date', 'time', 'card', 'payment'];

const INITIAL = { name: '', phone: '', address: '', date: '', time: '', card: '', anonymous: false, payment: 'online' };

export default function Checkout() {
  usePageTitle('Đặt hàng');
  const cart = useCart();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const submittingRef = useRef(false);

  if (order) {
    return (
      <Modal title={`Đơn hàng ${order.number} đã đặt thành công`} onClose={() => navigate('/')}>
        <p>
          Cảm ơn, {order.name}!
        </p>
        <p>Chúng tôi sẽ gọi cho bạn tại số {order.phone} để xác nhận.
        </p>
        <ul className={styles.orderList}>
          {order.lines.map((l) => (
            <li key={l.id}>
              <span>
                {l.name} × {l.qty}
              </span>
              <span>{formatPrice(l.sum)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.orderMeta}>
          <dt>Vận chuyển</dt>
          <dd>
            {new Date(`${order.date}T00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}, {order.time}
          </dd>
          <dt>Địa chỉ</dt>
          <dd>{order.address}</dd>
          <dt>Thành tiền</dt>
          <dd>
            <strong>{formatPrice(order.total)}</strong>
          </dd>
        </dl>
        <Link to="/catalog" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </Modal>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Нечего оформлять" titleAs="h1" text="Сначала добавьте что-нибудь в корзину.">
          <Link to="/catalog" className="btn btn-primary">
            Đi tới Danh mục
          </Link>
        </EmptyState>
      </div>
    );
  }

  const set = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // Сменили дату — интервал, который на неё уже недоступен, сбрасываем
  const setDate = (date) => {
    setValues((v) => ({ ...v, date, time: availableSlots(date).includes(v.time) ? v.time : '' }));
    setErrors((e) => ({ ...e, date: undefined }));
  };

  const slots = availableSlots(values.date);

  const submit = (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const found = validateCheckout(values);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const result = {
      number: Math.floor(10000 + Math.random() * 90000),
      ...values,
      lines: cart.lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, sum: l.qty * l.product.price })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      delivery: cart.delivery,
      total: cart.total,
      promo: cart.promo,
    };
    submittingRef.current = true;
    console.log('Новый заказ', result);
    cart.clear();
    setOrder(result);
  };

  const fieldProps = (name) => ({
    id: `checkout-${name}`,
    name,
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `checkout-${name}-error` : undefined,
  });

  const error = (name) =>
    errors[name] && (
      <p id={`checkout-${name}-error`} className="field-error">
        {errors[name]}
      </p>
    );

  return (
    <div className="container page">
      <h1 className="page-title">Оформление заказа</h1>
      <div className={styles.layout}>
        <form ref={formRef} className={styles.form} onSubmit={submit} noValidate>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Thông tin người nhận</h2>
            <div className={styles.row}>
              <div className="field">
                <label htmlFor="checkout-name">Tên</label>
                <input
                  {...fieldProps('name')}
                  className="input"
                  autoComplete="name"
                  onChange={(e) => set('name', e.target.value)}
                />
                {error('name')}
              </div>
              <div className="field">
                <label htmlFor="checkout-phone">Điện thoại</label>
                <input
                  {...fieldProps('phone')}
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0123-456-789"
                  onFocus={() => !values.phone && set('phone', PHONE_PREFIX)}
                  onChange={(e) => set('phone', formatPhone(e.target.value))}
                />
                {error('phone')}
              </div>
            </div>
            <label className={styles.check}>
              <input type="checkbox" checked={values.anonymous} onChange={(e) => set('anonymous', e.target.checked)} />
              Giao hàng ẩn danh — không cần gọi tên người gửi cho người nhận
            </label>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Giao hàng</h2>
            <div className="field">
              <label htmlFor="checkout-address">Địa chỉ ở Vinh</label>
              <input
                {...fieldProps('address')}
                className="input"
                autoComplete="street-address"
                placeholder="Địa chỉ, ví dụ: 123 Quang Trung, Vinh"
                onChange={(e) => set('address', e.target.value)}
              />
              {error('address')}
            </div>
            <div className={styles.row}>
              <div className="field">
                <label htmlFor="checkout-date">Ngày</label>
                <input
                  {...fieldProps('date')}
                  className="input"
                  type="date"
                  min={minDeliveryDate()}
                  onChange={(e) => setDate(e.target.value)}
                />
                {error('date')}
              </div>
              <div className="field">
                <label htmlFor="checkout-time">Thời gian</label>
                <select {...fieldProps('time')} className="input" onChange={(e) => set('time', e.target.value)}>
                  <option value="">Chọn thời gian</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {error('time')}
              </div>
            </div>
            <p className="field-hint">
              Ở nội thành Vinh sẽ miễn phí. Ra khỏi thành phố - theo thỏa thuận, người quản lý sẽ gọi. Trước khi vận chuyển
Chúng tôi sẽ gửi cho bạn một bức ảnh của bó hoa.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Bưu thiếp</h2>
            <div className="field">
              <label htmlFor="checkout-card">Nội dung bưu thiếp (thiệp làm quà tặng, tùy chọn)</label>
              <textarea
                {...fieldProps('card')}
                className={`input ${styles.textarea}`}
                maxLength={CARD_LIMIT}
                rows={3}
                onChange={(e) => set('card', e.target.value)}
              />
              <p className="field-hint" aria-live="polite">
                {values.card.length} / {CARD_LIMIT}
              </p>
              {error('card')}
            </div>
          </section>

          <section className={styles.section}>
            <fieldset className="field">
              <legend className={styles.sectionTitle}>Cách thanh toán</legend>
              <div className={styles.payments}>
                {PAYMENTS.map((p) => (
                  <label key={p.value} className={styles.payment}>
                    <input
                      type="radio"
                      name="payment"
                      value={p.value}
                      checked={values.payment === p.value}
                      onChange={() => set('payment', p.value)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
              {error('payment')}
            </fieldset>
          </section>

          <button type="submit" className={`btn btn-primary ${styles.submit}`}>
            Подтвердить заказ на {formatPrice(cart.total)}
          </button>
          <p className="field-hint">Đây là demo: đơn hàng không được gửi, dữ liệu được hiển thị trong console của trình duyệt.</p>
        </form>

        <aside className={styles.aside} aria-label="Đơn hàng của bạn">
          <h2 className={styles.sectionTitle}>Đơn hàng của bạn</h2>
          <ul className={styles.items}>
            {cart.lines.map((l) => (
              <li key={l.id}>
                <img src={l.product.images[0]} srcSet={imageSrcSet(l.product.images[0])} sizes="80px" alt="" loading="lazy" />
                <span>
                  {l.product.name}
                  <small>× {l.qty}</small>
                </span>
                <span>{formatPrice(l.qty * l.product.price)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary>
            <Link to="/cart" className="btn btn-ghost">
              ← Thay đổi giỏ hàng
            </Link>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
