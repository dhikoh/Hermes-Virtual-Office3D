---
name: web-research
description: Perform web research, data extraction, and competitive intelligence with isolated browser profiles (optional Camoufox anti-detect engine). Automatically stores findings to the Obsidian knowledge vault at _AI/research/.
metadata: {"hermes":{"skillKey":"web-research"}}
---

# Web Research Intelligence SOP

Use this skill when researching external URLs, analyzing competitor offerings, reading online documentation, or verifying external claims.

## Trigger

```json
{
  "activation": {
    "anyPhrases": [
      "research",
      "browse web",
      "scrape url",
      "analisis website",
      "cari informasi",
      "inspect page"
    ]
  },
  "movement": {
    "target": "desk",
    "skipIfAlreadyThere": true
  }
}
```

## Operating Protocol

1. **Anti-Detect Browsing**:
   - Use isolated agent profiles (`_AI/browser-profiles/<agentId>`). If the Camoufox engine is installed (image built with `INSTALL_CAMOUFOX=true`), it is used for anti-detect rendering; otherwise the isolated HTTP client is used and blocked pages must be reported, not bypassed.
   - Run requests with `saveToVault: true` to archive raw markdown snapshots.

2. **Extraction Discipline**:
   - Extract primary headings, value propositions, key technical specifications, and pricing tiers.
   - Strip navigation headers, cookie banners, tracking scripts, and footer clutter.

3. **Obsidian Vault Archival**:
   - Save the finalized research report in `_AI/research/<date>-<topic-slug>.md`.
   - Include standard YAML frontmatter:
     ```yaml
     ---
     title: "Research Topic"
     source: "https://example.com"
     agent: "researcher"
     date: "YYYY-MM-DD"
     tags: ["research", "intel"]
     ---
     ```
   - Connect related entities using `[[wikilinks]]`.

4. **Verification Gate**:
   - Compare extracted claims with existing workspace documentation.
   - Highlight any discrepancies or uncertainties before reporting to the user.
