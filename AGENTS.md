<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Signed-in users' local store (state + extra) mirrors to the user_state table via src/lib/cloud-sync.ts; why: keeps the localStorage-first store working offline/signed-out while persisting across devices.
- Work rewards: only admins can change submission status/reward (DB trigger); members can only flip claimed once verified; why: prevents self-awarding.
