const Moment = require('moment-timezone');

// Precisa colocar |BRT BRST| por conta do horário de verāo
// Segundo um cara no stackOverflow a primeira linha abaixo funciona até 2020 e a segunda funciona para
// todos os anos. Como não entendi nada eu testei só com |BRST BRT| e funcionou, mas deixei comentado aqui
// pq provavelmente vai dar merda algum dia, ai saberemos o que fazer
// "America/Sao_Paulo|BRST BRT|20 30|01010101010101010101010|1BIq0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10",
// "America/Sao_Paulo|LMT BRT BRST|36.s 30 20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0",
Moment.tz.add(['America/Sao_Paulo|BRT BRST|']); // Precisa estar aqui antes do carregamento do locale
require('moment/locale/pt-br'); // eslint-disable-line import/no-extraneous-dependencies

export const MILLISECONDS_IN_MINUTE = 60000;

export function parseMoment (value = false, params = null) {
  if (value instanceof Moment) {
    return params && params.isMutable ? value : value.clone();
  } else if (value instanceof Date || typeof value === 'number') {
    // Date.now(), moment().valueOf(), new Date()
    return Moment(value);
  } else if (value && typeof value === 'string') {
    let resolvedMask;
    if (params && params.mask) {
      resolvedMask = params.mask;
    } else {
      resolvedMask = (value && value.indexOf('/') === -1 ? null : 'DD/MM/YYYY HH:mm');
    }
    return Moment(value, resolvedMask);
  } else if (arguments.length > 0) {
    // undefined, null, '' passados de parametro
    return Moment();
  } else {
    // chamada vazia parseMoment()
    console.warn('parseMoment() não pode ser chamado sem o parâmetro value');
    return null;
  }
}

export function format (mask, value) {
  if (value) {
    // Quando a data é anterior a 1914-01-01, o Postgres armazena o timezone diferente, incluindo com minutos e segundos
    // Exemplos:
    // 1914-01-01 12:00:00-03 salva como 1914-01-01 12:00:00-03
    // 1913-12-31 12:00:00-03 salva como 1913-12-31 11:53:32-03:06:28
    // O moment não aceita o formato com segundos, então testamos o tamanho da string
    // Caso o timezone contenha minutos e segundos, cortamos os segundos fora
    const resolvedValue = value.length === 28 ? value.substr(0, 25) : value;
    const valueMoment = parseMoment(resolvedValue);
    return valueMoment.isValid() ? valueMoment.format(mask) : value;
  } else {
    return value;
  }
}


export default Moment;
