#!/usr/bin/env python3
"""Compare products on pakkarent.com (legacy) vs new PakkaRent API."""

import json
import re
import sys
import urllib.request
from difflib import SequenceMatcher

SITEMAP = "https://pakkarent.com/sitemap.xml"
API = "https://pakkarent-api.onrender.com/api/products?limit=200"
STORE_PAGES = [
    "https://pakkarent.com/store/camping/index.html",
    "https://pakkarent.com/store/home_appliances/index.html",
    "https://pakkarent.com/store/event/index.html",
    "https://pakkarent.com/store/backdrop/index.html",
    "https://pakkarent.com/store/propstore/index.html",
    "https://pakkarent.com/store/baby/baby.html",
    "https://pakkarent.com/store/games/games_list.html",
]


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": "PakkaRent-QA/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def norm(s):
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_product_page(html, url):
    title = None
    m = re.search(r"<title>([^<|]+)", html, re.I)
    if m:
        title = re.sub(r"\s*[-|].*$", "", m.group(1)).strip()
    h1 = re.search(r"<h1[^>]*>([^<]+)", html, re.I)
    if h1:
        title = h1.group(1).strip()
    price = None
    for pat in [
        r"₹\s*([\d,]+(?:\.\d+)?)",
        r"Rs\.?\s*([\d,]+(?:\.\d+)?)",
        r"price[^0-9]*([\d,]+)",
    ]:
        pm = re.search(pat, html, re.I)
        if pm:
            price = pm.group(1).replace(",", "")
            break
    name = title or url.rsplit("/", 1)[-1].replace(".html", "").replace("_", " ")
    return {"name": name, "price": price, "url": url, "source": "legacy_page"}


def parse_store_listing(html, url):
    items = []
    for m in re.finditer(
        r'href="(/products/[^"]+\.html)"[^>]*>([^<]{3,80})<',
        html,
        re.I,
    ):
        link, label = m.group(1), re.sub(r"\s+", " ", m.group(2)).strip()
        if label.lower() in {"home", "back", "more", "view"}:
            continue
        items.append(
            {
                "name": label,
                "price": None,
                "url": "https://pakkarent.com" + link,
                "source": "legacy_store",
            }
        )
    # card titles
    for m in re.finditer(r'class="[^"]*card-title[^"]*"[^>]*>([^<]+)', html, re.I):
        name = re.sub(r"\s+", " ", m.group(1)).strip()
        if len(name) > 2:
            items.append({"name": name, "price": None, "url": url, "source": "legacy_store"})
    return items


def best_match(name, candidates):
    n = norm(name)
    best = None
    best_score = 0
    for c in candidates:
        score = SequenceMatcher(None, n, norm(c["name"])).ratio()
        if score > best_score:
            best_score = score
            best = c
    return best, best_score


def main():
    print("Fetching sitemap…")
    sitemap = fetch(SITEMAP)
    urls = re.findall(r"<loc>(https://pakkarent.com/products/[^<]+)</loc>", sitemap)

    legacy = {}
    for url in urls:
        try:
            html = fetch(url)
            item = parse_product_page(html, url)
            key = norm(item["name"])
            if key:
                legacy[key] = item
        except Exception as e:
            print(f"  skip {url}: {e}", file=sys.stderr)

    for store_url in STORE_PAGES:
        try:
            html = fetch(store_url)
            for item in parse_store_listing(html, store_url):
                key = norm(item["name"])
                if key and key not in legacy:
                    legacy[key] = item
        except Exception as e:
            print(f"  skip store {store_url}: {e}", file=sys.stderr)

    print(f"Legacy products collected: {len(legacy)}")

    api_data = json.loads(fetch(API))
    new_products = api_data.get("products", [])
    print(f"New site products: {api_data.get('total', len(new_products))}")

    matched = []
    missing_on_new = []
    weak_matches = []

    for key, old in sorted(legacy.items(), key=lambda x: x[1]["name"].lower()):
        match, score = best_match(old["name"], new_products)
        if match and score >= 0.72:
            matched.append((old, match, score))
        elif match and score >= 0.5:
            weak_matches.append((old, match, score))
        else:
            missing_on_new.append(old)

    new_only = []
    matched_new_ids = {m[1]["id"] for m in matched} | {m[1]["id"] for m in weak_matches}
    for p in new_products:
        if p["id"] not in matched_new_ids:
            new_only.append(p)

    report = {
        "legacy_count": len(legacy),
        "new_count": len(new_products),
        "matched": len(matched),
        "weak_matches": len(weak_matches),
        "missing_on_new": len(missing_on_new),
        "new_only": len(new_only),
    }

    print("\n=== SUMMARY ===")
    for k, v in report.items():
        print(f"  {k}: {v}")

    print("\n=== MISSING ON NEW SITE ===")
    for old in missing_on_new[:40]:
        print(f"  - {old['name']} ({old['url']})")
    if len(missing_on_new) > 40:
        print(f"  … and {len(missing_on_new) - 40} more")

    print("\n=== WEAK MATCHES (review) ===")
    for old, new, score in sorted(weak_matches, key=lambda x: -x[2])[:20]:
        print(f"  {score:.2f}  legacy: {old['name']}  ->  new: {new['name']} ({new.get('city')})")

    print("\n=== NEW ONLY (not on legacy sitemap) ===")
    for p in sorted(new_only, key=lambda x: x["name"])[:30]:
        print(f"  + {p['name']} [{p.get('category_name')}] ({p.get('city')})")
    if len(new_only) > 30:
        print(f"  … and {len(new_only) - 30} more")

    out = "/Users/prasannakumar/Documents/pakkarent/scripts/product-comparison.json"
    with open(out, "w") as f:
        json.dump(
            {
                "report": report,
                "missing_on_new": missing_on_new,
                "weak_matches": [
                    {"legacy": o["name"], "new": n["name"], "score": s, "legacy_url": o["url"]}
                    for o, n, s in weak_matches
                ],
                "new_only": [{"name": p["name"], "id": p["id"], "city": p.get("city")} for p in new_only],
                "matched": [
                    {"legacy": o["name"], "new": n["name"], "score": s}
                    for o, n, s in matched
                ],
            },
            f,
            indent=2,
        )
    print(f"\nFull report: {out}")


if __name__ == "__main__":
    main()
