import { registerEnumType } from "@nestjs/graphql";
import { CountryCode } from "libphonenumber-js";

export interface Country {
  country: string;
  iso: CountryCode;
  code: PhoneCode;
}

export enum Currency {
  USD = "USD",
  CAD = "CAD",
  EUR = "EUR",
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ARS = "ARS",
  AUD = "AUD",
  AZN = "AZN",
  BAM = "BAM",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CDF = "CDF",
  CHF = "CHF",
  CLP = "CLP",
  CNY = "CNY",
  COP = "COP",
  CRC = "CRC",
  CVE = "CVE",
  CZK = "CZK",
  DJF = "DJF",
  DKK = "DKK",
  DOP = "DOP",
  DZD = "DZD",
  EEK = "EEK",
  EGP = "EGP",
  ERN = "ERN",
  ETB = "ETB",
  GBP = "GBP",
  GEL = "GEL",
  GHS = "GHS",
  GNF = "GNF",
  GTQ = "GTQ",
  HKD = "HKD",
  HNL = "HNL",
  HRK = "HRK",
  HUF = "HUF",
  IDR = "IDR",
  ILS = "ILS",
  INR = "INR",
  IQD = "IQD",
  IRR = "IRR",
  ISK = "ISK",
  JMD = "JMD",
  JOD = "JOD",
  JPY = "JPY",
  KES = "KES",
  KHR = "KHR",
  KMF = "KMF",
  KRW = "KRW",
  KWD = "KWD",
  KZT = "KZT",
  LBP = "LBP",
  LKR = "LKR",
  LTL = "LTL",
  LVL = "LVL",
  LYD = "LYD",
  MAD = "MAD",
  MDL = "MDL",
  MGA = "MGA",
  MKD = "MKD",
  MMK = "MMK",
  MOP = "MOP",
  MUR = "MUR",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NAD = "NAD",
  NGN = "NGN",
  NIO = "NIO",
  NOK = "NOK",
  NPR = "NPR",
  NZD = "NZD",
  OMR = "OMR",
  PAB = "PAB",
  PEN = "PEN",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  QAR = "QAR",
  RON = "RON",
  RSD = "RSD",
  RUB = "RUB",
  RWF = "RWF",
  SAR = "SAR",
  SDG = "SDG",
  SEK = "SEK",
  SGD = "SGD",
  SOS = "SOS",
  SYP = "SYP",
  THB = "THB",
  TND = "TND",
  TOP = "TOP",
  TRY = "TRY",
  TTD = "TTD",
  TWD = "TWD",
  TZS = "TZS",
  UAH = "UAH",
  UGX = "UGX",
  UYU = "UYU",
  UZS = "UZS",
  VEF = "VEF",
  VND = "VND",
  XAF = "XAF",
  XOF = "XOF",
  YER = "YER",
  ZAR = "ZAR",
  ZMK = "ZMK",
  ZWL = "ZWL"
}

registerEnumType(Currency, {
  name: "Currency",
  description: "Currency Types"
});

export type PhoneCode =
  | "250"
  | "93"
  | "355"
  | "213"
  | "1-684"
  | "376"
  | "244"
  | "1-264"
  | "672"
  | "1-268"
  | "54"
  | "374"
  | "297"
  | "61"
  | "43"
  | "994"
  | "1-242"
  | "973"
  | "880"
  | "1-246"
  | "375"
  | "32"
  | "501"
  | "229"
  | "1-441"
  | "975"
  | "591"
  | "387"
  | "267"
  | "55"
  | "246"
  | "1-284"
  | "673"
  | "359"
  | "226"
  | "257"
  | "855"
  | "237"
  | "1"
  | "238"
  | "1-345"
  | "236"
  | "235"
  | "56"
  | "86"
  | "61"
  | "61"
  | "57"
  | "269"
  | "682"
  | "506"
  | "385"
  | "53"
  | "599"
  | "357"
  | "420"
  | "243"
  | "45"
  | "253"
  | "1-767"
  | "1-809"
  | "1-829"
  | "1-849"
  | "670"
  | "593"
  | "20"
  | "503"
  | "240"
  | "291"
  | "372"
  | "251"
  | "500"
  | "298"
  | "679"
  | "358"
  | "33"
  | "689"
  | "241"
  | "220"
  | "995"
  | "49"
  | "233"
  | "350"
  | "30"
  | "299"
  | "1-473"
  | "1-671"
  | "502"
  | "44-1481"
  | "224"
  | "245"
  | "592"
  | "509"
  | "504"
  | "852"
  | "36"
  | "354"
  | "91"
  | "62"
  | "98"
  | "964"
  | "353"
  | "44-1624"
  | "972"
  | "39"
  | "225"
  | "1-876"
  | "81"
  | "44-1534"
  | "962"
  | "7"
  | "254"
  | "686"
  | "383"
  | "965"
  | "996"
  | "856"
  | "371"
  | "961"
  | "266"
  | "231"
  | "218"
  | "423"
  | "370"
  | "352"
  | "853"
  | "389"
  | "261"
  | "265"
  | "60"
  | "960"
  | "223"
  | "356"
  | "692"
  | "222"
  | "230"
  | "262"
  | "52"
  | "691"
  | "373"
  | "377"
  | "976"
  | "382"
  | "1-664"
  | "212"
  | "258"
  | "95"
  | "264"
  | "674"
  | "977"
  | "31"
  | "599"
  | "687"
  | "64"
  | "505"
  | "227"
  | "234"
  | "683"
  | "850"
  | "1-670"
  | "47"
  | "968"
  | "92"
  | "680"
  | "970"
  | "507"
  | "675"
  | "595"
  | "51"
  | "63"
  | "64"
  | "48"
  | "351"
  | "1-787"
  | "1-939"
  | "974"
  | "242"
  | "262"
  | "40"
  | "7"
  | "590"
  | "290"
  | "1-869"
  | "1-758"
  | "590"
  | "508"
  | "1-784"
  | "685"
  | "378"
  | "239"
  | "966"
  | "221"
  | "381"
  | "248"
  | "232"
  | "65"
  | "1-721"
  | "421"
  | "386"
  | "677"
  | "252"
  | "27"
  | "82"
  | "211"
  | "34"
  | "94"
  | "249"
  | "597"
  | "47"
  | "268"
  | "46"
  | "41"
  | "963"
  | "886"
  | "992"
  | "255"
  | "66"
  | "228"
  | "690"
  | "676"
  | "1-868"
  | "216"
  | "90"
  | "993"
  | "1-649"
  | "688"
  | "1-340"
  | "256"
  | "380"
  | "971"
  | "44"
  | "1"
  | "598"
  | "998"
  | "678"
  | "379"
  | "58"
  | "84"
  | "681"
  | "212"
  | "967"
  | "260"
  | "263";
