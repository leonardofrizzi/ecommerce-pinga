import { Suspense } from 'react';
import ProductsClientComponent from '../../components/ProductsClientComponent';

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<p className="pt-[50px] text-center">Carregando...</p>}>
      <ProductsClientComponent />
    </Suspense>
  );
}