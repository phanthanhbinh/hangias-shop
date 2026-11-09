import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Страница не найдена');
  return (
    <div className="container page">
      <EmptyState icon="❀" title="Страница не найдена" titleAs="h1" text="Có vẻ như bó hoa này đã có người chọn rồi. Nhưng chúng tôi vẫn còn rất nhiều bó khác!">
        <Link to="/" className="btn btn-primary">
          Về trang chủ
        </Link>
        <Link to="/catalog" className="btn btn-outline">
          Đến danh mục
        </Link>
      </EmptyState>
    </div>
  );
}
