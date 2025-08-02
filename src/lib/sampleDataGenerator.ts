// Gerador de dados de exemplo aleatórios para teste e QA
// Todos os valores são gerados dentro das faixas recomendadas

const getRandomInRange = (min: number, max: number, decimals: number = 0): number => {
  const random = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(random.toFixed(decimals)) : Math.round(random);
};

const getRandomFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateSampleData = () => {
  // Nomes de usinas para exemplo
  const nomes_usinas = [
    "Usina São João", "Usina Santa Cruz", "Usina Esperança",
    "Usina Nova Fronteira", "Usina Vale Verde", "Usina Monte Alto"
  ];
  
  const fabricantes = ["DEDINI", "ZANINI", "BECCARO"];
  const moendas = ["A", "B", "C"];
  
  return {
    usina: {
      usina: getRandomFromArray(nomes_usinas),
      safra: new Date().getFullYear().toString(),
      moenda: getRandomFromArray(moendas),
      // TCH: 200 - 1200 t/h
      tch: getRandomInRange(200, 1200),
      // Fibra % Cana: 8% - 18% (0.08 - 0.18)
      fibra_cana: getRandomInRange(0.08, 0.18, 3),
      // TC Safra: 800.000 - 5.000.000 t
      tc_safra: getRandomInRange(800000, 5000000),
      // Dias Safra: 180 - 250 dias
      dias_safra: getRandomInRange(180, 250),
      // Meses Safra: 6 - 8.5 meses
      meses_safra: getRandomInRange(6, 8.5, 2),
      // Eficiência Tempo: 0.75 - 0.95
      eficiencia_tempo: getRandomInRange(0.75, 0.95, 2)
    },
    equipamentos: {
      // Todos os ternos com mesmo fabricante (mais realista)
      fabricante: Array(6).fill(getRandomFromArray(fabricantes)),
      // Diâmetros: 900 - 1400 mm (1º terno menor, demais crescentes)
      diametro_nominal: [
        getRandomInRange(800, 900, 1),    // 1º terno menor
        getRandomInRange(900, 1100, 1),   // 2º terno
        getRandomInRange(1000, 1200, 1),  // 3º terno
        getRandomInRange(1000, 1200, 1),  // 4º terno
        getRandomInRange(1000, 1200, 1),  // 5º terno
        getRandomInRange(1000, 1200, 1)   // 6º terno
      ],
      // Comprimentos: 1800 - 2600 mm
      comprimento_nominal: Array(6).fill(0).map(() => getRandomInRange(1800, 2600)),
      // Ângulos: 0-15° (1º e 2º = 0, demais com inclinação)
      angulo_inclinacao: [
        0, 0, // 1º e 2º sem inclinação
        getRandomInRange(10, 15), getRandomInRange(10, 15),
        getRandomInRange(10, 15), getRandomInRange(10, 15)
      ]
    },
    camisas: {
      diametros_camisas: {
        // Pressão: base para cálculo dos outros
        pressao: Array(6).fill(0).map(() => getRandomInRange(900, 1200)),
        // Entrada: pressão + 40-100mm
        entrada: [],
        // Superior: entrada + 20-60mm  
        superior: [],
        // Saída: superior + 20-60mm
        saida: []
      },
      frisos: {
        // Passo: 1.2 - 2.5 pol
        passo: Array(6).fill(0).map(() => getRandomInRange(1.2, 2.5, 1)),
        // Ângulo: 25 - 45°
        angulo: Array(6).fill(0).map(() => getRandomInRange(25, 45)),
        // Altura: 40 - 80 mm
        altura: Array(6).fill(0).map(() => getRandomInRange(40, 80))
      }
    },
    operacao: {
      // Rotações: 4.0 - 8.0 rpm
      rotacoes: Array(6).fill(0).map(() => getRandomInRange(4.0, 8.0, 1)),
      coeficientes_k: {
        // K entrada/saída: 1.5 - 2.0
        k_et_st: Array(6).fill(0).map(() => getRandomInRange(1.5, 2.0, 2)),
        // K pressão/saída: 4.0 - 6.0
        k_pt_st: Array(6).fill(0).map(() => getRandomInRange(4.0, 6.0, 1)),
        // K bagaceira entrada/entrada: 1.4 - 1.8
        k_ebt_et: Array(6).fill(0).map(() => getRandomInRange(1.4, 1.8, 2)),
        // K bagaceira centro/entrada bagaceira: 1.05 - 1.2
        k_cbt_ebt: Array(6).fill(0).map(() => getRandomInRange(1.05, 1.2, 2)),
        // K bagaceira saída/centro bagaceira: 1.02 - 1.1
        k_sbt_cbt: Array(6).fill(0).map(() => getRandomInRange(1.02, 1.1, 2))
      },
      // Fibra Bagaço: 30% - 52% (0.30 - 0.52) - crescente por terno
      fibra_bagaco: [
        getRandomInRange(0.30, 0.35, 3),  // 1º terno
        getRandomInRange(0.35, 0.40, 3),  // 2º terno
        getRandomInRange(0.40, 0.45, 3),  // 3º terno
        getRandomInRange(0.45, 0.48, 3),  // 4º terno
        getRandomInRange(0.48, 0.51, 3),  // 5º terno
        getRandomInRange(0.51, 0.52, 3)   // 6º terno
      ],
      // Densidade Bagaço: 1.2 - 1.6 g/cm³
      densidade_bagaco: Array(6).fill(0).map(() => getRandomInRange(1.2, 1.6, 1))
    }
  };
};

// Preencher diâmetros relacionados baseados na pressão
export const generateSampleDataComplete = () => {
  const data = generateSampleData();
  
  // Completar diâmetros das camisas com relações realistas
  const pressao = data.camisas.diametros_camisas.pressao;
  
  data.camisas.diametros_camisas.entrada = pressao.map(p => 
    p + getRandomInRange(40, 100)
  );
  
  data.camisas.diametros_camisas.superior = data.camisas.diametros_camisas.entrada.map(e => 
    e + getRandomInRange(20, 60)
  );
  
  data.camisas.diametros_camisas.saida = data.camisas.diametros_camisas.superior.map(s => 
    s + getRandomInRange(20, 60)
  );
  
  return data;
};