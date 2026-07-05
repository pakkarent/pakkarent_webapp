import { Navigate } from 'react-router-dom';

/** Redirect old /store/* category URLs to the matching catalog page or home. */
export default function LegacyStoreRoute() {
  return <Navigate to="/" replace />;
}
