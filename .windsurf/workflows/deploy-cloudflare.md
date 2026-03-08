---
description: Build and deploy to Cloudflare Pages manually via Wrangler CLI
---

## Prerequisites
- ต้องล็อกอิน Cloudflare ก่อน: `npx wrangler login`
- ต้องมี CLOUDFLARE_API_TOKEN และ CLOUDFLARE_ACCOUNT_ID ใน GitHub Secrets สำหรับ CI/CD

## Steps

1. Bump version and stage
// turbo
Run: `python scripts/bump-version.py`
Working directory: `d:\Dropbox\DB.mr.Krich\PARA\3_Projects\0_Dev\Hyperlocal_community_marketplace`

2. Build the Next.js static export
// turbo
Run: `pnpm --filter @chm/web build`
Working directory: `d:\Dropbox\DB.mr.Krich\PARA\3_Projects\0_Dev\Hyperlocal_community_marketplace`

3. Deploy to Cloudflare Pages
Run: `npx wrangler pages deploy ./out --project-name=community-hyper-marketplace`
Working directory: `d:\Dropbox\DB.mr.Krich\PARA\3_Projects\0_Dev\Hyperlocal_community_marketplace\apps\web`

4. Commit and push the version bump
// turbo
Run: `git add -A`
Working directory: `d:\Dropbox\DB.mr.Krich\PARA\3_Projects\0_Dev\Hyperlocal_community_marketplace`
