import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { CameraIcon, LeafIcon, StarIcon, TruckIcon } from '../components/Icons';
import { CATEGORIES, HERO_IMAGE } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { imageSrcSet } from '../utils/imageSrcSet';
import styles from './Home.module.css';
import { usePageTitle } from '../hooks/usePageTitle';

const BENEFITS = [
  { 
icon: TruckIcon, 
title: 'Delivery in Minsk', 
text: '9 BYN, from 150 BYN - free. Intervals of 2 hours from 9:00 to 22:00. Out of town - by agreement.', 
}, 
{ 
icon: CameraIcon, 
title: 'Photo of the bouquet before sending', 
text: `We'll send the photo to Viber or Telegram. If you don't like something, we'll fix it before the courier leaves.`, 
}, 
{ 
icon: LeafIcon, 
title: 'Gift card', 
text: 'We will sign by hand with your text. You can send anonymously - the recipient will not recognize the name.', 
},
];

const OCCASIONS = [
  { title: 'Birthday', hint: 'Hat boxes: vase not needed', to: '/catalog?category=boxes&stock=1' },
  { title: 'Date night', hint: 'Roses up to 170 BYN', to: '/catalog?category=roses&max=170' },
  { title: 'For Mom', hint: 'Bouquets in stock', to: '/catalog?category=bouquets&stock=1' },
  { title: 'For a Colleague', hint: 'Up to 100 BYN, in stock', to: '/catalog?max=100&stock=1' },
  { title: 'To Apologize', hint: 'Peony roses', to: '/catalog?q=peony' },
];

const REVIEWS = [
  { 
name: 'Alina K.', 
date: 'October 28, 2026', 
rating: 5, 
text: 'I ordered “Zephyr” for a friend for her birthday. An hour before delivery they sent a photo - I asked to remove the pampas, she has allergies. Removed without question.', 
}, 
{ name: 'Sergey', date: 'October 21, 2026', rating: 5, text: 'The courier arrived at his interval and called 15 minutes before. All.' }, 
{ 
name: 'Tatyana Mikhailovna', 
date: '12 October 2026', 
rating: 5, 
text: `My granddaughter sent me chrysanthemums. They've been standing for the second week, I just change the water. The card was signed in beautiful handwriting and I kept it for myself.`, 
}, 
{ 
name: 'Dmitry', 
date: 'October 3, 2026', 
rating: 4, 
text: 'The roses are fresh, carefully collected. The courier arrived at the end of the interval, and I waited closer to the beginning. If time is important, it is better to write about it in the comment.', 
}, 
{ 
name: 'Olga', 
date: 'September 19, 2026', 
rating: 5, 
text: 'I sent a phalaenopsis to a colleague in the office on Nemiga. There was wind and rain outside, but they packed it in such a way that not a single flower was wrinkled.', 
}, 
{ name: 'Vlad', date: 'September 7, 2026', rating: 5, text: 'There was an urgent need to apologize. I took Caramel and it helped.' }, 
{ 
name: 'Natalia', 
date: 'August 26, 2026', 
rating: 5, 
text: 'Mom lives in Borovlyany, it’s already outside the city. The manager called back, immediately quoted the delivery price, and the bouquet was delivered on the same day.', 
},
];

export default function Home() {
  usePageTitle(null);
  const { products, loading } = useProducts();
  const hits = useMemo(
    () => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [products],
  );

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Hằng ngày 8:00–22:00 </p>
            <h1>Chúng tôi sẽ thu thập một bó hoa và giao nó sau hai giờ</h1>
            <p className={styles.lead}>
              Trước khi gửi, chúng tôi sẽ gửi ảnh, thiệp sẽ được tặng miễn phí. Với đơn hàng đầu tiên — giảm 10% bằng mã khuyến mãi{' '}
              <strong>Hangias Florist</strong>.
            </p>
            <div className={styles.heroActions}>
              <Link to="/catalog" className="btn btn-primary">
                Chọn bó hoa
              </Link>
              <Link to="/catalog?sale=1" className="btn btn-outline">
                Sản phẩm có khuyến mãi
              </Link>
            </div>
            {/* <p className={styles.today}>37 đơn hàng được giao hôm nay</p> */}
          </div>
          <div className={styles.heroImage}>
            <img src={HERO_IMAGE} alt="Vitrine của cửa hàng hoa với những chiếc bầu chứa hoa hồng và hoa lilies tươi" />
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="categories-title">
        <h2 id="categories-title">Danh mục</h2>
        <ul className={styles.categories}>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link to={`/catalog?category=${c.id}`} className={styles.category}>
                <img src={c.image} srcSet={imageSrcSet(c.image)} sizes="(min-width: 768px) 25vw, 50vw" alt="" loading="lazy" />
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="occasions-title">
        <h2 id="occasions-title">Lý do</h2>
        <ul className={styles.occasions}>
          {OCCASIONS.map((o) => (
            <li key={o.title}>
              <Link to={o.to} className={styles.occasion}>
                <strong>{o.title}</strong>
                <span>{o.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="hits-title">
        <div className={styles.sectionHead}>
          <h2 id="hits-title">Bán chạy nhất</h2>
          <Link to="/catalog?sort=popular" className="btn btn-ghost">
            Xem tất cả →
          </Link>
        </div>
        <ProductGrid products={hits} loading={loading} />
      </section>

      <section className={styles.benefitsWrap} aria-labelledby="benefits-title">
        <div className="container">
          <h2 id="benefits-title" className="visually-hidden">
            Điều kiện giao hàng
          </h2>
          <ul className={styles.benefits}>
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className={styles.benefit}>
                <span className={styles.benefitIcon}>
                  <Icon width={26} height={26} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="reviews-title">
        <h2 id="reviews-title">Đánh giá của khách hàng</h2>
        <ul className={styles.reviews}>
          {REVIEWS.map((r) => (
            <li key={r.name} className={styles.review}>
              <figure>
                <div className={styles.stars} aria-label={`Đánh giá ${r.rating} trên 5`}>
                  {Array.from({ length: r.rating }, (_, i) => (
                    <StarIcon key={i} width={16} height={16} />
                  ))}
                </div>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  {r.name} <span className={styles.reviewDate}>· {r.date}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="container">
        <div className={styles.cta}>
          <h2>Cần một bó hoa cho ngày hôm nay?</h2>
          <p>30 bó hoa, hộp và cây. Nếu không chọn được hãy gọi: 0963-162-003.</p>
          <Link to="/catalog" className="btn btn-primary">
            Đi tới danh mục
          </Link>
        </div>
      </section>
    </>
  );
}
