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

  const cepDestinoLimpo = cepDestino.replace(/\D/g, "");
  if (cepDestinoLimpo.length !== 8) {
      return NextResponse.json(
          { error: 'CEP de destino inválido. Deve conter 8 números.' },
          { status: 400 }
      );
  }

  try {
    const response = await calcularPrecoPrazo({
      nCdEmpresa: '',
      sDsSenha: '',
      nCdServico: ['04510', '04014'],
      sCepOrigem: '37704273', // <-- ATENÇÃO: Verifique se este é seu CEP de origem correto
      sCepDestino: cepDestinoLimpo,
      nVlPeso: peso,
      nCdFormato: '1',
      nVlComprimento: '20',
      nVlAltura: '5',
      nVlLargura: '15',
      nVlDiametro: '0',
      sCdMaoPropria: 'N',
      nVlValorDeclarado: valorDeclarado,
      sCdAvisoRecebimento: 'N',
    });

    const resultados = Array.isArray(response) ? response : [response];
    const validos = resultados.filter(
        (r) => r.Erro === '0' && parseFloat(r.Valor.replace(',', '.')) > 0
    );

    const formato = validos.map((t) => ({
      code: t.Codigo,
      service: t.Codigo === '04014' ? 'SEDEX' : (t.Codigo === '04510' ? 'PAC' : 'Desconhecido'),
      price: parseFloat(t.Valor.replace(',', '.')),
      deadline: parseInt(t.PrazoEntrega, 10),
    }));

    return NextResponse.json(formato);
  } catch (error: unknown) { // <-- MUDANÇA: 'any' para 'unknown'
    console.error("Erro na API /api/frete:", error);
    let errorMessage = 'Erro interno ao calcular frete.';
    // <-- MUDANÇA: Verifica se é um Erro para pegar a mensagem
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}