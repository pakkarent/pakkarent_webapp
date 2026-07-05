import { Navigate } from 'react-router-dom';

/** Unknown client routes → homepage (avoids blank 404 in the SPA). */
export default function NotFoundRedirect() {
  return <Navigate to="/" replace />;
}
