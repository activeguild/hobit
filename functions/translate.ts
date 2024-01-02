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
  console.log("content :>> ", content);
  const requestText = await content.request.text();
  const requestParams = JSON.parse(requestText);
  const subDomain = requestParams.free_api ? "api-free" : "api";

  const deeplResponse = await fetch(
    `https://${subDomain}.deepl.com/v2/translate`,
    {
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
    }
  );

  const deeplJson = await deeplResponse.json();
  return new Response(JSON.stringify(deeplJson), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST",
      "content-type": "application/json",
    },
  });
};
