// Calculadora de Regulagem de Moendas
// Este módulo encapsula todas as fórmulas e cálculos necessários
// As fórmulas são mantidas privadas para proteção intelectual

interface UsinaData {
  usina: string;
  safra: string;
  moenda: string;
  tch: number;
  fibra_cana: number;
  tc_safra: number;
  dias_safra: number;
  meses_safra: number;
  eficiencia_tempo: number;
}

interface EquipamentosData {
  fabricante: string[];
  diametro_nominal: number[];
  comprimento_nominal: number[];
  angulo_inclinacao: number[];
}

interface CamisasData {
  diametros_camisas: {
    pressao: number[];
    entrada: number[];
    superior: number[];
    saida: number[];
  };
  frisos: {
    passo: number[];
    angulo: number[];
    altura: number[];
  };
}

interface OperacaoData {
  rotacoes: number[];
  coeficientes_k: {
    k_et_st: number[];
    k_pt_st: number[];
    k_ebt_et: number[];
    k_cbt_ebt: number[];
    k_sbt_cbt: number[];
  };
  fibra_bagaco: number[];
  densidade_bagaco: number[];
}

interface FormData {
  usina: UsinaData;
  equipamentos: EquipamentosData;
  camisas: CamisasData;
  operacao: OperacaoData;
}

interface TernoResults {
  id: number;
  aberturas: {
    pressao_trabalho: number;
    entrada_trabalho: number;
    saida_trabalho: number;
    pressao_repouso: number;
    entrada_repouso: number;
    saida_repouso: number;
  };
  bagaceiras: {
    entrada: number;
    centro: number;
    saida: number;
  };
  pressoes: {
    hidraulica_trabalho: number;
    hidraulica_repouso: number;
    mancal: number;
    nitrogenio: number;
  };
  velocidades: {
    rotacao: number;
    periferica_media: number;
    periferica_pressao: number;
  };
  distancias: {
    centro_pressao_superior: number;
    centro_entrada_superior: number;
    centro_saida_superior: number;
  };
  bagaco: {
    toneladas_hora: number;
    fibra_percentual: number;
    densidade: number;
  };
}

interface CalculationResults {
  summary: {
    usina: string;
    safra: string;
    moenda: string;
    tch: number;
    fibra_cana_percentual: number;
    total_ternos: number;
    status: 'success' | 'warning' | 'error';
  };
  ternos: TernoResults[];
  graficos: {
    aberturas_data: number[][];
    pressoes_data: number[][];
    velocidades_data: number[][];
    eficiencia_data: number[][];
  };
  validacao: {
    erros: string[];
    avisos: string[];
    observacoes: string[];
  };
}

// Funções auxiliares privadas (encapsuladas)
const calcularBagacoPorcentagemCana = (fibraCana: number, fibraBagaco: number): number => {
  return fibraCana / fibraBagaco;
};

const calcularVelocidadePeriferica = (diametro: number, rotacao: number): number => {
  return (diametro * Math.PI * rotacao) / 1000;
};

const calcularAberturaTrabalho = (
  tbh: number, 
  velocidadePeriferica: number, 
  comprimento: number, 
  densidade: number
): number => {
  return (1000000 * tbh) / (60 * velocidadePeriferica * comprimento * densidade);
};

const calcularPressaoHidraulica = (
  phe: number, 
  diametroSuperior: number, 
  comprimento: number, 
  diametroPressao: number
): number => {
  return (9.05 * phe * diametroSuperior * comprimento) / (diametroPressao * diametroPressao);
};

const calcularDistanciaCentros = (
  diametro1: number, 
  diametro2: number, 
  abertura: number, 
  alturaFriso1: number, 
  alturaFriso2: number
): number => {
  return (diametro1 - alturaFriso1) / 2 + (diametro2 - alturaFriso2) / 2 + abertura;
};

// Função principal de cálculo (exportada)
export const calculateMillRegulation = (formData: FormData): CalculationResults => {
  try {
    const ternos: TernoResults[] = [];
    const erros: string[] = [];
    const avisos: string[] = [];
    const observacoes: string[] = [];

    // Valores padrão para fibra do bagaço se não fornecidos
    const fibraBagacoPadrao = [0.30, 0.375, 0.415, 0.45, 0.485, 0.52];
    
    for (let i = 0; i < 6; i++) {
      try {
        // Dados básicos do terno
        const fibraBagaco = formData.operacao?.fibra_bagaco?.[i] || fibraBagacoPadrao[i];
        const densidade = formData.operacao?.densidade_bagaco?.[i] || 1.4;
        const rotacao = formData.operacao?.rotacoes?.[i] || 6.0;
        
        // Diâmetros das camisas
        const diamPressao = formData.camisas?.diametros_camisas?.pressao?.[i] || 1000;
        const diamEntrada = formData.camisas?.diametros_camisas?.entrada?.[i] || 1000;
        const diamSuperior = formData.camisas?.diametros_camisas?.superior?.[i] || 1000;
        const diamSaida = formData.camisas?.diametros_camisas?.saida?.[i] || 1000;
        
        // Comprimento e alturas dos frisos
        const comprimento = formData.equipamentos?.comprimento_nominal?.[i] || 2000;
        const alturaFriso = formData.camisas?.frisos?.altura?.[i] || 50;
        
        // Coeficientes K
        const kEtSt = formData.operacao?.coeficientes_k?.k_et_st?.[i] || 1.7;
        const kPtSt = formData.operacao?.coeficientes_k?.k_pt_st?.[i] || 5.0;
        const kEbtEt = formData.operacao?.coeficientes_k?.k_ebt_et?.[i] || 1.6;
        const kCbtEbt = formData.operacao?.coeficientes_k?.k_cbt_ebt?.[i] || 1.1;
        const kSbtCbt = formData.operacao?.coeficientes_k?.k_sbt_cbt?.[i] || 1.05;

        // Cálculos principais
        const bagacoPorcentagem = calcularBagacoPorcentagemCana(formData.usina.fibra_cana, fibraBagaco);
        const tonelaBagacoHora = bagacoPorcentagem * formData.usina.tch;
        
        const velocidadePerifericaMedia = calcularVelocidadePeriferica(
          (diamSuperior + diamSaida) / 2, 
          rotacao
        );
        
        const abertutaSaidaTrabalho = calcularAberturaTrabalho(
          tonelaBagacoHora,
          velocidadePerifericaMedia,
          comprimento,
          densidade
        );
        
        const aberturaEntradaTrabalho = abertutaSaidaTrabalho * kEtSt;
        const aberturaPressaoTrabalho = abertutaSaidaTrabalho * kPtSt;
        
        // Bagaceiras
        const bagaceiraEntrada = aberturaEntradaTrabalho * kEbtEt;
        const bagaceiraCentro = bagaceiraEntrada * kCbtEbt;
        const bagaceiraSaida = bagaceiraCentro * kSbtCbt;
        
        // Pressões (valores aproximados para demonstração)
        const pressaoHidraulicaTrabalho = calcularPressaoHidraulica(
          5.0, // PHE estimado
          diamSuperior,
          comprimento,
          diamPressao
        );
        
        const pressaoMancal = pressaoHidraulicaTrabalho * 0.15; // Aproximação
        const pressaoNitrogenio = pressaoHidraulicaTrabalho * 1.1; // Aproximação
        
        // Distâncias entre centros
        const distCentroPressaoSuperior = calcularDistanciaCentros(
          diamSuperior, diamPressao, aberturaPressaoTrabalho, alturaFriso, alturaFriso
        );
        
        const distCentroEntradaSuperior = calcularDistanciaCentros(
          diamSuperior, diamEntrada, aberturaEntradaTrabalho, alturaFriso, alturaFriso
        );
        
        const distCentroSaidaSuperior = calcularDistanciaCentros(
          diamSuperior, diamSaida, abertutaSaidaTrabalho, alturaFriso, alturaFriso
        );
        
        // Velocidades
        const velocidadePerifericaPressao = calcularVelocidadePeriferica(diamPressao, rotacao);
        
        // Aberturas em repouso (aproximação - 5% menores)
        const aberturaEntradaRepouso = aberturaEntradaTrabalho * 0.95;
        const aberturaSaidaRepouso = abertutaSaidaTrabalho * 0.95;
        const aberturaPressaoRepouso = aberturaPressaoTrabalho * 0.95;
        
        const ternoResult: TernoResults = {
          id: i + 1,
          aberturas: {
            pressao_trabalho: aberturaPressaoTrabalho,
            entrada_trabalho: aberturaEntradaTrabalho,
            saida_trabalho: abertutaSaidaTrabalho,
            pressao_repouso: aberturaPressaoRepouso,
            entrada_repouso: aberturaEntradaRepouso,
            saida_repouso: aberturaSaidaRepouso,
          },
          bagaceiras: {
            entrada: bagaceiraEntrada,
            centro: bagaceiraCentro,
            saida: bagaceiraSaida,
          },
          pressoes: {
            hidraulica_trabalho: pressaoHidraulicaTrabalho,
            hidraulica_repouso: pressaoHidraulicaTrabalho * 0.8,
            mancal: pressaoMancal,
            nitrogenio: pressaoNitrogenio,
          },
          velocidades: {
            rotacao: rotacao,
            periferica_media: velocidadePerifericaMedia,
            periferica_pressao: velocidadePerifericaPressao,
          },
          distancias: {
            centro_pressao_superior: distCentroPressaoSuperior,
            centro_entrada_superior: distCentroEntradaSuperior,
            centro_saida_superior: distCentroSaidaSuperior,
          },
          bagaco: {
            toneladas_hora: tonelaBagacoHora,
            fibra_percentual: fibraBagaco * 100,
            densidade: densidade,
          },
        };
        
        ternos.push(ternoResult);
        
        // Validações específicas por terno
        if (abertutaSaidaTrabalho < 10) {
          avisos.push(`Terno ${i + 1}: Abertura de saída muito pequena (${abertutaSaidaTrabalho.toFixed(1)}mm)`);
        }
        
        if (pressaoHidraulicaTrabalho > 2000) {
          avisos.push(`Terno ${i + 1}: Pressão hidráulica elevada (${pressaoHidraulicaTrabalho.toFixed(0)} psi)`);
        }
        
      } catch (error) {
        erros.push(`Erro no cálculo do ${i + 1}º terno: ${error.message}`);
      }
    }
    
    // Preparar dados para gráficos
    const aberturasData = ternos.map(t => [
      t.aberturas.pressao_trabalho,
      t.aberturas.entrada_trabalho,
      t.aberturas.saida_trabalho
    ]);
    
    const pressoesData = ternos.map(t => [
      t.pressoes.hidraulica_trabalho,
      t.pressoes.mancal,
      t.pressoes.nitrogenio
    ]);
    
    const velocidadesData = ternos.map(t => [
      t.velocidades.rotacao,
      t.velocidades.periferica_media,
      t.velocidades.periferica_pressao
    ]);
    
    const eficienciaData = ternos.map((t, i) => [
      t.bagaco.toneladas_hora,
      t.bagaco.fibra_percentual,
      (formData.usina.tch / 6) // TCH por terno aproximado
    ]);
    
    // Validações gerais
    if (formData.usina.tch > 1000) {
      avisos.push("TCH elevado - verificar capacidade dos equipamentos");
    }
    
    if (formData.usina.fibra_cana < 0.10) {
      avisos.push("Fibra % Cana baixa - pode afetar a eficiência da extração");
    }
    
    observacoes.push(`Cálculo realizado para ${ternos.length} ternos`);
    observacoes.push(`Capacidade total processada: ${formData.usina.tch} TCH`);
    observacoes.push(`Fibra média do bagaço: ${(fibraBagacoPadrao.reduce((a, b) => a + b, 0) / 6 * 100).toFixed(1)}%`);
    
    const status = erros.length > 0 ? 'error' : avisos.length > 0 ? 'warning' : 'success';
    
    return {
      summary: {
        usina: formData.usina.usina,
        safra: formData.usina.safra,
        moenda: formData.usina.moenda,
        tch: formData.usina.tch,
        fibra_cana_percentual: formData.usina.fibra_cana * 100,
        total_ternos: ternos.length,
        status,
      },
      ternos,
      graficos: {
        aberturas_data: aberturasData,
        pressoes_data: pressoesData,
        velocidades_data: velocidadesData,
        eficiencia_data: eficienciaData,
      },
      validacao: {
        erros,
        avisos,
        observacoes,
      },
    };
    
  } catch (error) {
    return {
      summary: {
        usina: formData.usina?.usina || 'Erro',
        safra: formData.usina?.safra || 'Erro',
        moenda: formData.usina?.moenda || 'Erro',
        tch: 0,
        fibra_cana_percentual: 0,
        total_ternos: 0,
        status: 'error',
      },
      ternos: [],
      graficos: {
        aberturas_data: [],
        pressoes_data: [],
        velocidades_data: [],
        eficiencia_data: [],
      },
      validacao: {
        erros: [`Erro crítico no cálculo: ${error.message}`],
        avisos: [],
        observacoes: [],
      },
    };
  }
};

// Função auxiliar para validação de dados de entrada
export const validateInputData = (formData: FormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.usina?.tch || formData.usina.tch <= 0) {
    errors.push("TCH deve ser maior que zero");
  }
  
  if (!formData.usina?.fibra_cana || formData.usina.fibra_cana <= 0) {
    errors.push("Fibra % Cana deve ser maior que zero");
  }
  
  if (!formData.equipamentos?.diametro_nominal?.every(d => d > 0)) {
    errors.push("Todos os diâmetros nominais devem ser positivos");
  }
  
  if (!formData.operacao?.rotacoes?.every(r => r > 0)) {
    errors.push("Todas as rotações devem ser positivas");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};