const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "https://yukarigaoka1.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const { recordId } = event.queryStringParameters;
    if (!recordId) return { statusCode: 400, headers, body: "recordId is required" };

    const resp = await fetch(`https://${process.env.KINTONE_SUBDOMAIN}.cybozu.com/k/v1/record.json?app=${process.env.KINTONE_IMAGE_APP_ID}&id=${recordId}`, {
      headers: { "X-Cybozu-API-Token": process.env.KINTONE_IMAGE_API_TOKEN }
    });

    const data = await resp.json();
    const fileKeys = data.record.photo.value.map(file => file.fileKey);

    return { statusCode: 200, headers, body: JSON.stringify({ fileKeys }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
