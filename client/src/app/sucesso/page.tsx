import { Suspense } from 'react';
import SucessoClientComponent from '../../components/SucessoClientComponent';

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 h-[70vh]">
            <p className="text-lg">Carregando detalhes do pedido...</p>
        </div>
    }>
      <SucessoClientComponent />
    </Suspense>
  );
}