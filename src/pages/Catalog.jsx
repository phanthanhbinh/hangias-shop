import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SortSelect, { SORT_OPTIONS } from '../components/SortSelect';
import { CloseIcon, FilterIcon } from '../components/Icons';
import { CATEGORIES, SIZES } from '../data/products';
import { useDebounce } from '../hooks/useDebounce';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';
import styles from './Catalog.module.css';

const PAGE_SIZE = 12;
const DESKTOP_QUERY = '(min-width: 960px)';

const SORTERS = {
  popular: (a, b) => b.popularity - a.popularity,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е');

const parsePrice = (value) => (/^\d{1,6}$/.test(value ?? '') ? String(Number(value)) : '');

function readFilters(params) {
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? 'popular';
  return {
    q: params.get('q') ?? '',
    category: CATEGORIES.some((c) => c.id === category) ? category : '',
    priceMin: parsePrice(params.get('min')),
    priceMax: parsePrice(params.get('max')),
    sizes: (params.get('size') ?? '').split(',').filter((s, i, all) => SIZES.includes(s) && all.indexOf(s) === i),
    inStock: params.get('stock') === '1',
    sale: params.get('sale') === '1',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'popular',
  };
}

function writeFilters(f) {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set('q', f.q.trim());
  if (f.category) params.set('category', f.category);
  if (f.priceMin !== '') params.set('min', f.priceMin);
  if (f.priceMax !== '') params.set('max', f.priceMax);
  if (f.sizes.length) params.set('size', f.sizes.join(','));
  if (f.inStock) params.set('stock', '1');
  if (f.sale) params.set('sale', '1');
  if (f.sort !== 'popular') params.set('sort', f.sort);
  return params;
}

function applyFilters(products, f) {
  const q = normalize(f.q.trim());
  let min = f.priceMin === '' ? -Infinity : Number(f.priceMin);
  let max = f.priceMax === '' ? Infinity : Number(f.priceMax);
  if (min > max) [min, max] = [max, min];

  return products
    .filter((p) => {
      if (f.category && p.category !== f.category) return false;
      if (p.price < min || p.price > max) return false;
      if (f.sizes.length && !f.sizes.includes(p.size)) return false;
      if (f.inStock && !p.inStock) return false;
      if (f.sale && !p.oldPrice) return false;
      if (q && !normalize(`${p.name} ${p.composition.join(' ')}`).includes(q)) return false;
      return true;
    })
    .sort((a, b) => SORTERS[f.sort](a, b) || a.id - b.id);
}

const countActive = (f) =>
  [f.category, f.priceMin, f.priceMax, f.inStock, f.sale].filter(Boolean).length + f.sizes.length;

export default function Catalog() {
  const { products, loading, error, retry } = useProducts();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);

  const [searchText, setSearchText] = useState(filters.q);
  const debouncedSearch = useDebounce(searchText, 300);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const update = (patch, { replace = false } = {}) =>
    setParams(writeFilters({ ...filters, ...patch }), { replace });

  usePageTitle(CATEGORIES.find((c) => c.id === filters.category)?.name ?? 'Danh mục');

  useEffect(() => {
    setSearchText((text) => (text.trim() === filters.q.trim() ? text : filters.q));
  }, [filters.q]);

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.q.trim()) update({ q: debouncedSearch }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [params]);

  useEffect(() => {
    if (!panelOpen) return undefined;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const close = () => setPanelOpen(false);
    const onKey = (e) => e.key === 'Escape' && close();
    const onResize = (e) => e.matches && close();
    const toggle = toggleRef.current;

    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
      document.body.style.overflow = '';
      if (!desktop.matches) toggle?.focus();
    };
  }, [panelOpen]);

  const found = useMemo(() => applyFilters(products, filters), [products, filters]);
  const activeCount = countActive(filters);
  const hasAnyFilter = activeCount > 0 || filters.q !== '';
  const categoryName = CATEGORIES.find((c) => c.id === filters.category)?.name;

  const reset = () => {
    setSearchText('');
    setParams(filters.sort === 'popular' ? {} : { sort: filters.sort });
  };

  const normalizePrice = () => {
    const { priceMin, priceMax } = filters;
    if (priceMin !== '' && priceMax !== '' && Number(priceMin) > Number(priceMax)) {
      update({ priceMin: priceMax, priceMax: priceMin }, { replace: true });
    }
  };

  return (
    <div className="container page">
      <h1 className="page-title">{categoryName ?? 'Danh mục'}</h1>

      <div className={styles.layout}>
        <aside
          id="filters-panel"
          ref={panelRef}
          tabIndex={-1}
          className={`${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
          aria-label="Bộ lọc"
        >
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Bộ lọc</h2>
            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setPanelOpen(false)}
              aria-label="Đóng bộ lọc"
            >
              <CloseIcon />
            </button>
          </div>
          <Filters filters={filters} onChange={update} onPriceBlur={normalizePrice} />
          <div className={styles.panelFooter}>
            {hasAnyFilter && (
              <button type="button" className="btn btn-outline" onClick={reset}>
                Xóa bộ lọc
              </button>
            )}
            <button type="button" className={`btn btn-primary ${styles.panelApply}`} onClick={() => setPanelOpen(false)}>
              Hiển thị {found.length}
            </button>
          </div>
        </aside>
        {panelOpen && <div className={styles.backdrop} onClick={() => setPanelOpen(false)} aria-hidden="true" />}

        <section className={styles.results} aria-label="Товары">
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <SearchBar value={searchText} onChange={setSearchText} />
            </div>
            <button
              ref={toggleRef}
              type="button"
              className={`btn btn-outline ${styles.filterToggle}`}
              onClick={() => setPanelOpen(true)}
              aria-expanded={panelOpen}
              aria-controls="filters-panel"
            >
              <FilterIcon width={18} height={18} />
              Bộ lọc{activeCount > 0 && ` (${activeCount})`}
            </button>
            <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
          </div>

          <div className={styles.summary}>
            <p className={styles.count} aria-live="polite">
              {loading ? 'Đang tải sản phẩm…' : error ? '' : `Tìm thấy: ${found.length} ${plural(found.length)}`}
            </p>
            {hasAnyFilter && !loading && (
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {error ? (
            <EmptyState icon="!" title="Không thể tải danh mục" text="Hãy kiểm tra kết nối internet của bạn rồi thử lại.">
              <button type="button" className="btn btn-primary" onClick={retry}>
                Повторить
              </button>
            </EmptyState>
          ) : !loading && found.length === 0 ? (
            <EmptyState title="Không tìm thấy sản phẩm" text="Hãy thử thay đổi yêu cầu hoặc bỏ một số bộ lọc.">
              <button type="button" className="btn btn-primary" onClick={reset}>
                Đặt lại bộ lọc
              </button>
            </EmptyState>
          ) : (
            <>
              <ProductGrid products={found.slice(0, visible)} loading={loading} skeletonCount={6} />
              {!loading && visible < found.length && (
                <div className={styles.more}>
                  <button type="button" className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Hiển thị thêm
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function plural(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'Sản phẩm';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'Sản phẩm';
  return 'Sản phẩm';
}
