import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ProductGrid from '../components/ProductGrid';
import { useFavorites } from '../context/FavoritesContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';

export default function Favorites() {
  usePageTitle('Yêu thích');
  const { ids } = useFavorites();
  const { products, loading, error, retry } = useProducts();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container page">
      <h1 className="page-title">Yêu thích</h1>
      {ids.length === 0 ? (
        <EmptyState icon="♡" title="Ở đây vẫn còn trống" text="Bấm vào trái tim của sản phẩm để lưu nó ở đây.">
          <Link to="/catalog" className="btn btn-primary">
            Chuyển đến danh mục
          </Link>
        </EmptyState>
      ) : error ? (
        <EmptyState icon="!" title="Không thể tải sản phẩm yêu thích" text="Kiểm tra kết nối internet và thử lại.">
          <button type="button" className="btn btn-primary" onClick={retry}>
            Thử lại
          </button>
        </EmptyState>
      ) : (
        <ProductGrid products={saved} loading={loading} skeletonCount={Math.min(ids.length, 8)} />
      )}
    </div>
  );
}
