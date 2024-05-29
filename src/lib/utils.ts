import dayjs from 'dayjs';

export function getFormattedDate(date: Date | string): string {
  return dayjs(date).format('MMM DD, YYYY');
}
export function getFormattedDateYM(date: Date | string): string {
  return dayjs(date).format('YYYY MMM');
}
export function getFormattedDateYMD(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const getAudioURL = (
  planner: any,
  userId: number,
  PlannerQuestionResponsesByUserId: any[],
) => {
  const { PlannerQuestionResponse } = planner;
  if (PlannerQuestionResponse) {
    const voice = PlannerQuestionResponse.find((o: any) => {
      if (
        o.PlannerQuestionPrompt &&
        o.PlannerQuestionPrompt.type &&
        o.videoUrl_CF &&
        o.waveForm
      ) {
        return o.PlannerQuestionPrompt.type === 'VOICE';
      }
      return false;
    });
    if (voice) {
      return voice.videoUrl_CF;
    }
  } else if (PlannerQuestionResponsesByUserId[userId]) {
    const voice = PlannerQuestionResponsesByUserId[userId].find((o: any) => {
      return o.videoUrl;
    });
    if (voice) {
      return voice.videoUrl_CF;
    }
  }
  return '';
};
export function calculateDistance(
  lattitude1: any,
  longittude1: any,
  lattitude2: any,
  longittude2: any,
) {
  // const toRadian = (n: any) => (n * Math.PI) / 180;

  let lat2 = lattitude2;
  let lon2 = longittude2;
  let lat1 = lattitude1;
  let lon1 = longittude1;

  // console.log(lat1, lon1 + '===' + lat2, lon2);
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles -> 3956
  // for km -> 6371
  const r = 3956;

  // calculate the result
  return (c * r).toFixed(2);
}

export const isInvalidEmail = (email: string) => {
  /* eslint-disable-next-line */
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return '';
  }
  return !email.includes('@')
    ? 'Please include an ‘@’ in the email address.'
    : 'Invalid email address.';
};

export const cardsIcon = [
  {
    brand: 'visa',
    icon: 'https://static-00.iconduck.com/assets.00/visa-icon-512x322-wb39y8f5.png',
  },
  {
    brand: 'mastercard',
    icon: 'https://static-00.iconduck.com/assets.00/mastercard-icon-512x299-z5t44u8e.png',
  },
  {
    brand: 'discover',
    icon: 'https://static-00.iconduck.com/assets.00/discover-icon-512x329-wuydsv1l.png',
  },
  {
    brand: 'jcb',
    icon: 'https://static-00.iconduck.com/assets.00/jcb-icon-512x395-kf0qy68d.png',
  },
  {
    brand: 'unionpay',
    icon: 'https://static-00.iconduck.com/assets.00/unionpay-icon-512x324-ggfirxad.png',
  },
  {
    brand: 'amex',
    icon: 'https://static-00.iconduck.com/assets.00/american-express-icon-512x512-4pbbpska.png',
  },
  {
    brand: 'diners',
    icon: 'https://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Diners-Club-International-icon.png',
  },
];

export const getContinent = (countryCode: string) => {
  const countryList: any = {
    AD: 'Europe',
    AE: 'Asia',
    AF: 'Asia',
    AG: 'North America',
    AI: 'North America',
    AL: 'Europe',
    AM: 'Asia',
    AN: 'North America',
    AO: 'Africa',
    AQ: 'Antarctica',
    AR: 'South America',
    AS: 'Australia',
    AT: 'Europe',
    AU: 'Australia',
    AW: 'North America',
    AZ: 'Asia',
    BA: 'Europe',
    BB: 'North America',
    BD: 'Asia',
    BE: 'Europe',
    BF: 'Africa',
    BG: 'Europe',
    BH: 'Asia',
    BI: 'Africa',
    BJ: 'Africa',
    BM: 'North America',
    BN: 'Asia',
    BO: 'South America',
    BR: 'South America',
    BS: 'North America',
    BT: 'Asia',
    BW: 'Africa',
    BY: 'Europe',
    BZ: 'North America',
    CA: 'North America',
    CC: 'Asia',
    CD: 'Africa',
    CF: 'Africa',
    CG: 'Africa',
    CH: 'Europe',
    CI: 'Africa',
    CK: 'Australia',
    CL: 'South America',
    CM: 'Africa',
    CN: 'Asia',
    CO: 'South America',
    CR: 'North America',
    CU: 'North America',
    CV: 'Africa',
    CX: 'Asia',
    CY: 'Asia',
    CZ: 'Europe',
    DE: 'Europe',
    DJ: 'Africa',
    DK: 'Europe',
    DM: 'North America',
    DO: 'North America',
    DZ: 'Africa',
    EC: 'South America',
    EE: 'Europe',
    EG: 'Africa',
    EH: 'Africa',
    ER: 'Africa',
    ES: 'Europe',
    ET: 'Africa',
    FI: 'Europe',
    FJ: 'Australia',
    FK: 'South America',
    FM: 'Australia',
    FO: 'Europe',
    FR: 'Europe',
    GA: 'Africa',
    GB: 'Europe',
    GD: 'North America',
    GE: 'Asia',
    GF: 'South America',
    GG: 'Europe',
    GH: 'Africa',
    GI: 'Europe',
    GL: 'North America',
    GM: 'Africa',
    GN: 'Africa',
    GP: 'North America',
    GQ: 'Africa',
    GR: 'Europe',
    GS: 'Antarctica',
    GT: 'North America',
    GU: 'Australia',
    GW: 'Africa',
    GY: 'South America',
    HK: 'Asia',
    HN: 'North America',
    HR: 'Europe',
    HT: 'North America',
    HU: 'Europe',
    ID: 'Asia',
    IE: 'Europe',
    IL: 'Asia',
    IM: 'Europe',
    IN: 'Asia',
    IO: 'Asia',
    IQ: 'Asia',
    IR: 'Asia',
    IS: 'Europe',
    IT: 'Europe',
    JE: 'Europe',
    JM: 'North America',
    JO: 'Asia',
    JP: 'Asia',
    KE: 'Africa',
    KG: 'Asia',
    KH: 'Asia',
    KI: 'Australia',
    KM: 'Africa',
    KN: 'North America',
    KP: 'Asia',
    KR: 'Asia',
    KW: 'Asia',
    KY: 'North America',
    KZ: 'Asia',
    LA: 'Asia',
    LB: 'Asia',
    LC: 'North America',
    LI: 'Europe',
    LK: 'Asia',
    LR: 'Africa',
    LS: 'Africa',
    LT: 'Europe',
    LU: 'Europe',
    LV: 'Europe',
    LY: 'Africa',
    MA: 'Africa',
    MC: 'Europe',
    MD: 'Europe',
    ME: 'Europe',
    MG: 'Africa',
    MH: 'Australia',
    MK: 'Europe',
    ML: 'Africa',
    MM: 'Asia',
    MN: 'Asia',
    MO: 'Asia',
    MP: 'Australia',
    MQ: 'North America',
    MR: 'Africa',
    MS: 'North America',
    MT: 'Europe',
    MU: 'Africa',
    MV: 'Asia',
    MW: 'Africa',
    MX: 'North America',
    MY: 'Asia',
    MZ: 'Africa',
    NA: 'Africa',
    NC: 'Australia',
    NE: 'Africa',
    NF: 'Australia',
    NG: 'Africa',
    NI: 'North America',
    NL: 'Europe',
    NO: 'Europe',
    NP: 'Asia',
    NR: 'Australia',
    NU: 'Australia',
    NZ: 'Australia',
    OM: 'Asia',
    PA: 'North America',
    PE: 'South America',
    PF: 'Australia',
    PG: 'Australia',
    PH: 'Asia',
    PK: 'Asia',
    PL: 'Europe',
    PM: 'North America',
    PN: 'Australia',
    PR: 'North America',
    PS: 'Asia',
    PT: 'Europe',
    PW: 'Australia',
    PY: 'South America',
    QA: 'Asia',
    RE: 'Africa',
    RO: 'Europe',
    RS: 'Europe',
    RU: 'Europe',
    RW: 'Africa',
    SA: 'Asia',
    SB: 'Australia',
    SC: 'Africa',
    SD: 'Africa',
    SE: 'Europe',
    SG: 'Asia',
    SH: 'Africa',
    SI: 'Europe',
    SJ: 'Europe',
    SK: 'Europe',
    SL: 'Africa',
    SM: 'Europe',
    SN: 'Africa',
    SO: 'Africa',
    SR: 'South America',
    ST: 'Africa',
    SV: 'North America',
    SY: 'Asia',
    SZ: 'Africa',
    TC: 'North America',
    TD: 'Africa',
    TF: 'Antarctica',
    TG: 'Africa',
    TH: 'Asia',
    TJ: 'Asia',
    TK: 'Australia',
    TM: 'Asia',
    TN: 'Africa',
    TO: 'Australia',
    TR: 'Asia',
    TT: 'North America',
    TV: 'Australia',
    TW: 'Asia',
    TZ: 'Africa',
    UA: 'Europe',
    UG: 'Africa',
    US: 'North America',
    UY: 'South America',
    UZ: 'Asia',
    VC: 'North America',
    VE: 'South America',
    VG: 'North America',
    VI: 'North America',
    VN: 'Asia',
    VU: 'Australia',
    WF: 'Australia',
    WS: 'Australia',
    YE: 'Asia',
    YT: 'Africa',
    ZA: 'Africa',
    ZM: 'Africa',
    ZW: 'Africa',
  };

  return countryList[countryCode];
};

export function randomId(length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

export const getPlaceHolder = (format: string) => {
  const spaceIndex = format.indexOf(' ');
  const temp = format.slice(spaceIndex + 1);
  let n = 1;
  let result: string = '';
  for (let i = 0; i < temp.length; i += 1) {
    if (temp[i] !== '.') {
      result = `${result}${temp[i]}`;
    } else {
      result = `${result}${n}`;
      n += 1;
      if (n === 10) n = 0;
    }
  }

  return result;
};

export const getHotelBaseAmount = (hotelObj: any) => {
  const nights =
    hotelObj.numberOfNight && hotelObj.numberOfNight !== null
      ? hotelObj.numberOfNight
      : 0;
  const averageNightlyRate =
    hotelObj.averageNightlyRateCents &&
    hotelObj.averageNightlyRateCents !== null
      ? hotelObj.averageNightlyRateCents
      : 0;

  if (nights > 0 && averageNightlyRate > 0) {
    return Number(nights * (averageNightlyRate / 100)).toFixed(2);
  }

  return 0;
};

export const getHotelTaxAmount = (hotelObj: any, baseAmount = 0) => {
  if (hotelObj.totalAfterTaxesCent && hotelObj.totalAfterTaxesCent !== null) {
    const taxAmount = hotelObj.totalAfterTaxesCent / 100 - baseAmount;
    return taxAmount > 0 ? taxAmount : 0;
  }
  return 0;
};

export const getHotelAmountWithTax = (hotelObj: any) => {
  return hotelObj.totalAfterTaxesCent && hotelObj.totalAfterTaxesCent !== null
    ? hotelObj.totalAfterTaxesCent / 100
    : 0;
};
