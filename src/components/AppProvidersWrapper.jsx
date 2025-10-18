import { AuthProvider } from '@/context/useAuthContext';
import { LayoutProvider } from '@/context/useLayoutContext';
import { CookiesProvider } from 'react-cookie';
const AppProvidersWrapper = ({
  children
}) => {
  return <CookiesProvider defaultSetOptions={{
    path: '/'
  }}>
      <AuthProvider>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </AuthProvider>
    </CookiesProvider>;
};
export default AppProvidersWrapper;