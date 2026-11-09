import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import styles from './Footer.module.css';

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://t.me', label: 'Telegram' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.logo}>Hangias Florist</p>
          <p className={styles.muted}>
            Cửa hàng hoa nhỏ ở thành phố Vinh. Chúng tôi kết hoa ngay trong ngày bạn đặt hàng và gửi ảnh cho bạn xem trước khi giao.
          </p>
        </div>

        <nav aria-label="Danh mục">
          <h2 className={styles.title}>Danh mục</h2>
          <ul className={styles.list}>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/catalog?category=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.title}>Liên hệ</h2>
          <address className={styles.list}>
            <span>Quang Trung, Vinh, Nghệ An</span>
            <a href="tel:+0963162003">0963162003</a>
            <a href="mailto:hello@fleur.by">hello@fleur.by</a>
          </address>
        </div>

        <div>
          <h2 className={styles.title}>Giờ mở cửa</h2>
          <p className={styles.muted}>
            Hằng ngày 8:00–22:00
            <br />
            Vận chuyển 9:00–22:00
          </p>
          <ul className={styles.socials}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        © {new Date().getFullYear()} Hangias Florist. All rights reserved.
      </div>
    </footer>
  );
}
