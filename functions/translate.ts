export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const onRequestPost = async (content) => {
  const requestText = await content.request.text();
  const requestParams = JSON.parse(requestText);
  const sub_domain = requestParams.free_api ? "api-free" : "api";

  const hoge = await fetch(`https://${sub_domain}.deepl.com/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${requestParams.auth_key}`,
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: requestParams.texts,
      target_lang: requestParams.target_lang,
    }),
  });

  const deeplResponse = await hoge.json();
  return new Response(JSON.stringify(deeplResponse), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST",
      "content-type": "application/json",
    },
  });
};
