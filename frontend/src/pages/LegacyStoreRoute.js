import NotFound from './NotFound';

/** Old /store/* pages no longer exist — show the 404 page (server also returns HTTP 404). */
export default function LegacyStoreRoute() {
  return <NotFound />;
}
