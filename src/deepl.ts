export async function translate(parameters: Parameters) {
  return await fetch(`/translate`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      auth_key: parameters.auth_key,
      free_api: true,
      texts: parameters.texts,
      target_lang: parameters.target_lang,
    }),
  });
}

export type DeeplLanguages =
  | "BG"
  | "CS"
  | "DA"
  | "DE"
  | "EL"
  | "EN-GB"
  | "EN-US"
  | "EN"
  | "ES"
  | "ET"
  | "FI"
  | "FR"
  | "HU"
  | "ID"
  | "IT"
  | "JA"
  | "KO"
  | "LT"
  | "LV"
  | "NB"
  | "NL"
  | "PL"
  | "PT-PT"
  | "PT-BR"
  | "PT"
  | "RO"
  | "RU"
  | "SK"
  | "SL"
  | "SV"
  | "TR"
  | "UK"
  | "ZH";

export interface Parameters {
  free_api: boolean;
  auth_key: string;
  texts: string[];
  source_lang?: DeeplLanguages;
  target_lang: DeeplLanguages;
  split_sentences?: "0" | "1" | "nonewlines";
  preserve_formatting?: "0" | "1";
  formality?: "default" | "more" | "less";
  tag_handling?: string[];
  non_splitting_tags?: string[];
  outline_detection?: string;
  splitting_tags?: string[];
  ignore_tags?: string[];
}

export interface DeeplResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}
