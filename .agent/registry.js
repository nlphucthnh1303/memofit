const fs = require("fs");
const path = require("path");

const REGISTRY_FILE = path.join(__dirname, "feature_registry.json");
const MARKDOWN_REGISTRY = path.join(__dirname, "../docs/00-index/feature-registry.md");

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return { lastUpdated: new Date().toISOString(), counters: {}, features: [] };
  }
  const content = fs.readFileSync(REGISTRY_FILE, "utf-8");
  try {
    return JSON.parse(content);
  } catch {
    return { lastUpdated: new Date().toISOString(), counters: {}, features: [] };
  }
}

function saveRegistry(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(data, null, 2), "utf-8");
  syncMarkdown(data);
}

function syncMarkdown(data) {
  const dir = path.dirname(MARKDOWN_REGISTRY);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const rows = data.features.map(f => {
    const files = (f.relatedFiles || []).join(", ");
    return `| \`${f.featureCode}\` | **${f.name}** | \`${f.status}\` | [${f.docPath}](${f.docPath}) | ${files || "-"} | ${f.createdAt || "-"} |`;
  });

  const content = `# Feature Code Registry (Tra Cứu Tính Năng)

> **Cập nhật lần cuối:** ${data.lastUpdated}  
> **Tổng số tính năng:** ${data.features.length}

| Feature Code | Tên Tính Năng | Trạng Thái | Tài Liệu Kế Hoạch | File Liên Quan | Ngày Tạo |
|---|---|---|---|---|---|
${rows.length > 0 ? rows.join("\n") : "| *(Trống)* | Chưa có tính năng nào được cấp phát | - | - | - | - |"}
`;

  fs.writeFileSync(MARKDOWN_REGISTRY, content, "utf-8");
}

function getNextCode(domain) {
  const normDomain = domain.toUpperCase().replace(/^FEAT-/, "").replace(/[^A-Z0-9]/g, "");
  const data = loadRegistry();
  const currentCount = data.counters[normDomain] || 0;
  const nextNumber = currentCount + 1;
  const formattedNumber = String(nextNumber).padStart(3, "0");
  return `FEAT-${normDomain}-${formattedNumber}`;
}

function registerFeature(domainOrCode, name, docPath, relatedFiles = []) {
  const data = loadRegistry();
  let featureCode = "";

  if (domainOrCode.startsWith("FEAT-")) {
    featureCode = domainOrCode;
    const parts = featureCode.split("-");
    const domain = parts[1];
    const num = parseInt(parts[2], 10);
    if (!isNaN(num) && (!data.counters[domain] || data.counters[domain] < num)) {
      data.counters[domain] = num;
    }
  } else {
    const normDomain = domainOrCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const currentCount = data.counters[normDomain] || 0;
    const nextNumber = currentCount + 1;
    data.counters[normDomain] = nextNumber;
    featureCode = `FEAT-${normDomain}-${String(nextNumber).padStart(3, "0")}`;
  }

  const existingIdx = data.features.findIndex(f => f.featureCode === featureCode);
  const entry = {
    featureCode,
    name,
    status: "PLANNED",
    docPath: docPath || `docs/02-features/${featureCode.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/01-plan.md`,
    relatedFiles: Array.isArray(relatedFiles) ? relatedFiles : [],
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    data.features[existingIdx] = { ...data.features[existingIdx], ...entry };
  } else {
    data.features.push(entry);
  }

  saveRegistry(data);
  return featureCode;
}

function findFeatureCode(query) {
  const data = loadRegistry();
  const q = query.trim().toLowerCase();
  
  const directMatch = data.features.find(f => f.featureCode.toLowerCase() === q);
  if (directMatch) {
    return directMatch.featureCode;
  }

  const match = data.features.find(f => {
    return f.name.toLowerCase().includes(q) || 
           (f.docPath && f.docPath.toLowerCase().includes(q)) ||
           (f.relatedFiles && f.relatedFiles.some(file => file.toLowerCase().includes(q)));
  });

  return match ? match.featureCode : "NOT_FOUND";
}

function updateStatus(featureCode, status) {
  const data = loadRegistry();
  const feature = data.features.find(f => f.featureCode.toUpperCase() === featureCode.toUpperCase());
  if (!feature) {
    return false;
  }
  feature.status = status.toUpperCase();
  feature.updatedAt = new Date().toISOString();
  saveRegistry(data);
  return true;
}

const action = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const arg3 = process.argv[5];
const arg4 = process.argv[6];

switch (action) {
  case "next-code": {
    if (!arg1) {
      console.error("Missing domain");
      process.exit(1);
    }
    console.log(getNextCode(arg1));
    break;
  }
  case "register": {
    if (!arg1 || !arg2) {
      console.error("Missing domain/code or name");
      process.exit(1);
    }
    const files = arg4 ? arg4.split(",") : [];
    const code = registerFeature(arg1, arg2, arg3, files);
    console.log(code);
    break;
  }
  case "find": {
    if (!arg1) {
      console.log("NOT_FOUND");
      break;
    }
    console.log(findFeatureCode(arg1));
    break;
  }
  case "status": {
    if (!arg1 || !arg2) {
      console.error("Missing code or status");
      process.exit(1);
    }
    const success = updateStatus(arg1, arg2);
    console.log(success ? "SUCCESS" : "NOT_FOUND");
    break;
  }
  case "list": {
    const data = loadRegistry();
    console.log(JSON.stringify(data.features, null, 2));
    break;
  }
  case "sync": {
    const data = loadRegistry();
    syncMarkdown(data);
    console.log("SYNCED");
    break;
  }
  default: {
    console.error("Invalid action");
    process.exit(1);
  }
}
