#!/usr/bin/env python3
import argparse
import datetime
import json
import os
import re
import sys

DB_RELATIVE_PATH = "docs/features/features-db.json"

def get_workspace_root():
    current_dir = os.path.abspath(os.getcwd())
    while current_dir != os.path.dirname(current_dir):
        if os.path.exists(os.path.join(current_dir, "WORKSPACE.md")) or os.path.exists(os.path.join(current_dir, "AGENTS.md")) or os.path.exists(os.path.join(current_dir, ".git")):
            return current_dir
        current_dir = os.path.dirname(current_dir)
    return os.path.abspath(os.getcwd())

def get_db_path():
    return os.path.join(get_workspace_root(), DB_RELATIVE_PATH)

def load_db():
    path = get_db_path()
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        initial_data = {"features": []}
        with open(path, "w", encoding="utf-8") as f:
            json.dump(initial_data, f, indent=2, ensure_ascii=False)
        return initial_data
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return {"features": []}

def save_db(data):
    path = get_db_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")

def get_next_feature_code(module_name):
    module_upper = module_name.upper().replace("-", "").strip()
    db = load_db()
    highest_num = 0
    pattern = re.compile(rf"^FEAT-{re.escape(module_upper)}-(\d+)$")
    for feat in db.get("features", []):
        code = feat.get("featureCode", "")
        match = pattern.match(code)
        if match:
            num = int(match.group(1))
            if num > highest_num:
                highest_num = num
    next_num = highest_num + 1
    return f"FEAT-{module_upper}-{next_num:03d}", next_num

def create_feature(module_name, title):
    feature_code, num = get_next_feature_code(module_name)
    slug = slugify(title)
    if not slug:
        slug = f"feature-{num}"
    module_slug = slugify(module_name)
    
    feature_folder = f"{feature_code}-{slug}"
    rel_feature_dir = os.path.join("docs", "features", module_slug, feature_folder)
    abs_feature_dir = os.path.join(get_workspace_root(), rel_feature_dir)
    os.makedirs(abs_feature_dir, exist_ok=True)
    
    plan_path = os.path.join(rel_feature_dir, "plan.md")
    spec_path = os.path.join(rel_feature_dir, "technical-spec.md")
    changelog_path = os.path.join(rel_feature_dir, "changelog.md")
    
    now_iso = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    abs_plan = os.path.join(get_workspace_root(), plan_path)
    if not os.path.exists(abs_plan):
        with open(abs_plan, "w", encoding="utf-8") as f:
            f.write(f"# Implementation Plan: [{feature_code}] - {title}\n\n")
            f.write(f"- **Mã tính năng**: {feature_code}\n")
            f.write(f"- **Mục tiêu tính năng**: {title}\n")
            f.write(f"- **Trạng thái**: Planned\n")
            f.write(f"- **Ngày tạo**: {today_str}\n\n---\n\n")
            f.write("### 🎯 KHUYẾN NGHỊ CHẾ ĐỘ THỰC THI (TOKEN ECONOMY)\n")
            f.write("- **Độ phức tạp task**: [ 🟢 LOW | 🟡 MEDIUM | 🔴 HIGH ]\n")
            f.write("- **Cấu hình tối ưu**: [ Model: Gemini Flash-Lite / Flash / Pro ] | [ Thinking: Low / Medium / High ]\n")
            f.write("- **Lý do**: [ Phân tích ngắn gọn phạm vi file, rủi ro database / logic nghiệp vụ ]\n\n---\n\n")
            f.write("## 1. Danh Sách File Cần Chỉnh Sửa / Tạo Mới (File Matrix)\n\n")
            f.write("| Đường dẫn file | Phân loại | Trách nhiệm chính |\n")
            f.write("|---|---|---|\n\n---\n\n")
            f.write("## 2. Phương Án Kỹ Thuật (Data -> Logic -> UI)\n\n")

    abs_spec = os.path.join(get_workspace_root(), spec_path)
    if not os.path.exists(abs_spec):
        with open(abs_spec, "w", encoding="utf-8") as f:
            f.write(f"# Technical Specification: [{feature_code}] - {title}\n\n")
            f.write(f"- **Mã tính năng**: {feature_code}\n\n## 1. Luồng Xử Lý (Sequence Flow)\n\n")

    abs_changelog = os.path.join(get_workspace_root(), changelog_path)
    if not os.path.exists(abs_changelog):
        with open(abs_changelog, "w", encoding="utf-8") as f:
            f.write(f"# Changelog: [{feature_code}] - {title}\n\n")
            f.write(f"## [{today_str}] Khởi tạo kế hoạch tính năng\n- Tạo tài liệu plan.md và technical-spec.md.\n")

    db = load_db()
    record = {
        "featureCode": feature_code,
        "module": module_name.upper().strip(),
        "number": num,
        "title": title,
        "slug": slug,
        "status": "Planned",
        "planPath": plan_path,
        "docPath": spec_path,
        "changelogPath": changelog_path,
        "createdAt": now_iso,
        "updatedAt": now_iso
    }
    db["features"].append(record)
    save_db(db)
    
    print(json.dumps(record, indent=2, ensure_ascii=False))
    return record

def get_feature(feature_code):
    db = load_db()
    for feat in db.get("features", []):
        if feat.get("featureCode", "").upper() == feature_code.upper():
            print(json.dumps(feat, indent=2, ensure_ascii=False))
            return feat
    print(f"Error: Feature '{feature_code}' not found.", file=sys.stderr)
    sys.exit(1)

def update_status(feature_code, new_status):
    db = load_db()
    found = False
    for feat in db.get("features", []):
        if feat.get("featureCode", "").upper() == feature_code.upper():
            feat["status"] = new_status
            feat["updatedAt"] = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
            found = True
            break
    if found:
        save_db(db)
        print(f"Success: {feature_code} status updated to '{new_status}'")
    else:
        print(f"Error: Feature '{feature_code}' not found.", file=sys.stderr)
        sys.exit(1)

def search_features(query, code_only=False):
    db = load_db()
    query_lower = query.lower()
    matches = []
    for feat in db.get("features", []):
        if query_lower in feat.get("featureCode", "").lower() or query_lower in feat.get("title", "").lower() or query_lower in feat.get("slug", "").lower():
            matches.append(feat)
    if code_only:
        if matches:
            print(matches[0].get("featureCode"))
        return
    print(json.dumps(matches, indent=2, ensure_ascii=False))

def main():
    parser = argparse.ArgumentParser(description="Feature DB Manager CLI")
    subparsers = parser.add_subparsers(dest="command")

    create_parser = subparsers.add_parser("create")
    create_parser.add_argument("--module", required=True, help="Module name (e.g. AUTH, ORDER)")
    create_parser.add_argument("--title", required=True, help="Feature title")

    get_parser = subparsers.add_parser("get")
    get_parser.add_argument("feature_code", help="Feature Code (e.g. FEAT-AUTH-001)")

    status_parser = subparsers.add_parser("update-status")
    status_parser.add_argument("feature_code", help="Feature Code")
    status_parser.add_argument("status", choices=["Planned", "In-Progress", "Completed", "Archived"])

    search_parser = subparsers.add_parser("search")
    search_parser.add_argument("query", help="Keyword to search")
    search_parser.add_argument("--code-only", action="store_true", help="Print only feature code")

    args = parser.parse_args()
    if args.command == "create":
        create_feature(args.module, args.title)
    elif args.command == "get":
        get_feature(args.feature_code)
    elif args.command == "update-status":
        update_status(args.feature_code, args.status)
    elif args.command == "search":
        search_features(args.query, code_only=args.code_only)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
