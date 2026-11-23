# VaaniGuard

VaaniGuard is a browser-only checkout guardian prototype. It demonstrates the Round 1 flow from the prototype blueprint: inspect a fictional StreamNest checkout, show evidence-backed warnings, jump to highlighted terms, and let the visitor choose what to do.

The broader project blueprint describes a future extension, voice form filling, multi-page investigation, and cloud services. Those are roadmap ideas, not features in this static demo.

## Preview

Open `index.html` in a browser. No install, backend, account, or payment connection is needed. Add `?clean=1` to the address to view the clean example. Speech playback uses the device's speech synthesis when available.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the static site whenever a commit is pushed to `main`. To enable it, open the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**, and save. GitHub will show the public `github.io` URL in that Pages section after the first successful run.

