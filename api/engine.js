import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MODEL_DB = {
  "GLB1-v6": "GLB1v6.glb",
  "GLB2-v7": "GLB2v7.glb",
  "GLB3-v8": "GLB3v8.glb",
  "GLB4-v9": "GLB4v9.glb",
  "GLB5-v10": "GLB5v10.glb",
  "GLB6-v11": "GLB6v11.glb",
  "GLB7-v12": "GLB7v12.glb",
  "GLB8-v13": "GLB8v13.glb",
  "GLB9-v14": "GLB9v14.glb",
  "GLB10-v15": "GLB10v15.glb",
  "GLB11-v16": "GLB11v16.glb",
  "GLB12-v17": "GLB12v17.glb",
  "GLB13-v18": "GLB13v18.glb",
  "GLB14-v19": "GLB14v19.glb",
  "GLB15-v20": "GLB15v20.glb",
  "GLB16-v1": "GLB16v1.glb",
  "GLB17-v1": "GLB17v1.glb",
  "GLB18-v2": "GLB18v2.glb",
  "GLB19-v3": "GLB19v3.glb",
  "GLB20-v4": "GLB20v4.glb",
  "GLB21-v5": "GLB21v5.glb",
  "GLB22-v6": "GLB22v6.glb",
  "GLB23V1-v2": "GLB23V1v2.glb",
  "GLB24-v1": "GLB24v1.glb",
  "GLB25-v2": "GLB25v2.glb",
  "GLB26V1-v1": "GLB26V1v1.glb",
  "GLB27-v1": "GLB27v1.glb",
  "GLB28-v2": "GLB28v2.glb",
  "GLB29V1-v1": "GLB29V1v1.glb",
  "GLB30-v3": "GLB30v3.glb",
  "GLB31-v4": "GLB31v4.glb",
  "GLBS1": "GLBS1.glb",
  "GLBS2": "GLBS2.glb",
  "GLBS3-v1": "GLBS3v1.glb",
  "GLBS4": "GLBS4.glb",
  "GLBS5": "GLBS5.glb",
  "GLBS6": "GLBS6.glb",
  "GLBS7": "GLBS7.glb",
  "GLBS8": "GLBS8.glb",
  "GLBS9": "GLBS9.glb",
  "GLBS10": "GLBS10.glb",
  "GLBS11": "GLBS11.glb",
  "GLBS12": "GLBS12.glb",
  "GLBS13": "GLBS13.glb"


  // Diğer modellerin...
};

// Varsayılan HDR Sahnesi
const DEFAULT_ENV = "environments/studio.jpg"; 

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const sku = url.searchParams.get("sku")?.toUpperCase();
    const type = url.searchParams.get("type"); // 'env' isteği için

    // A. ORTAM (HDR) İSTEĞİ
    if (type === 'env') {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: DEFAULT_ENV
      });
      // HDR dosyaları büyük olabilir, link 1 saat geçerli olsun
      const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
      return res.status(200).json({ ok: true, url: signedUrl });
    }

    // B. MODEL İSTEĞİ
    if (!sku || !MODEL_DB[sku]) {
      return res.status(404).json({ ok: false, error: "Model Not Found" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: MODEL_DB[sku],
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return res.status(200).json({ ok: true, url: signedUrl });

  } catch (error) {
    console.error("Engine Error:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
