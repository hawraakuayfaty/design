import { useAuth } from "../contexts/useAuth";
import { isPageAllowed } from "../constants/pageAccess";
import AccessDenied from "./AccessDenied";

// Blocks a sub-page/tab's own children (and therefore their data-fetching effects) from ever
// mounting when the current user lacks `permission` — used at each dashboard's page-switch
// point so a stale/forced `page` value can't bypass the sidebar's tab hiding and fire a fetch
// the backend would reject anyway. `permission` may be a single code, an array of codes (any
// one suffices), or null/undefined for pages open to anyone who already reached the parent
// dashboard — same shapes PAGE_PERMISSIONS uses, checked via the same isPageAllowed helper.
export default function RequirePermission({ permission, t, children }) {
  const { hasPermission } = useAuth();
  if (!isPageAllowed(hasPermission, permission)) {
    return <AccessDenied t={t} />;
  }
  return children;
}
