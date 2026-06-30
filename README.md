# sagarkapoor.eu

Source for my personal site, [sagarkapoor.eu](https://www.sagarkapoor.eu), where
I write and link to some of the client work I've done through
[Weburz](https://weburz.com). It's separate from the company site at
[weburz.com](https://weburz.com).

## Stack

- Nuxt 4, Nuxt UI 4, and Tailwind v4 on the front end.
- Nitro server routes handle the contact form. Resend sends the mail, and
  Cloudflare Turnstile plus a honeypot field keep out spam.
- Blog posts are markdown files in `app/content/writing`.
- Deployed to Cloudflare Pages.

## Development

You'll need Node 22+, pnpm, [Task](https://taskfile.dev/), and
[pre-commit](https://pre-commit.com/) installed.

```bash
task setup      # install dependencies and git hooks
task dev        # dev server at http://localhost:3000
task qa-checks  # lint and format
```

Commit messages follow Conventional Commits, and the `crisp` pre-commit hook
keeps the subject line under 50 characters. Work on a branch and open a pull
request when it's ready.

## License

MIT. See the [LICENSE](./LICENSE) file for details.
