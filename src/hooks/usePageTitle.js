import { useEffect } from 'react';

const SITE = 'Hangias Florist';
export const DEFAULT_TITLE = 'Hangias Florist — giao hoa tại thành phố Vinh trong vòng 2 giờ';

// Заголовок вкладки для текущей страницы
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : DEFAULT_TITLE;
  }, [title]);
}
