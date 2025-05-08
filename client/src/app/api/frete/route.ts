// client/src/app/api/frete/route.ts
import { NextResponse } from 'next/server';
import { calcularPrecoPrazo } from 'correios-brasil';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cepDestino = searchParams.get('cep');
  const peso = searchParams.get('peso');
  const valorDeclarado = searchParams.get('valor');

  if (!cepDestino || !peso || !valorDeclarado) {
    return NextResponse.json(
      { error: 'Parâmetros ausentes: cep, peso e valor são obrigatórios.' },
      { status: 400 }
    );
  }

  try {
    const response = await calcularPrecoPrazo({
      nCdEmpresa: '',                   // sem contrato
      sDsSenha: '',
      nCdServico: ['04510', '04014'],   // SEDEX e PAC
      sCepOrigem: '01001000',           // seu CEP de origem
      sCepDestino: cepDestino,          // string
      nVlPeso: peso,                    // string
      nCdFormato: '1',                  // string
      nVlComprimento: '20',             // string
      nVlAltura: '5',
      nVlLargura: '15',
      nVlDiametro: '0',
      sCdMaoPropria: 'N',
      nVlValorDeclarado: valorDeclarado, // string
      sCdAvisoRecebimento: 'N',
    });

    const resultados = Array.isArray(response) ? response : [response];
    const formato = resultados.map((t) => ({
      code: t.Codigo,
      service: t.Codigo === '04014' ? 'SEDEX' : 'PAC',
      price: parseFloat(t.Valor.replace(',', '.')),
      deadline: parseInt(t.PrazoEntrega, 10),
    }));

    return NextResponse.json(formato);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erro ao calcular frete.' },
      { status: 500 }
    );
  }
}
