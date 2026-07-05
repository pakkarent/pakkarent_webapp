import useSEO from '../../hooks/useSEO';

/** noindex wrapper for all admin routes. */
export default function AdminSeo({ title = 'Admin' }) {
  useSEO({
    title,
    titleSuffix: false,
    noindex: true,
  });
  return null;
}
