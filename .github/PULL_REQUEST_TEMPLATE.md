## Summary

<!-- What does this PR do? One paragraph is enough. -->

## Type of change

- [ ] Bug fix
- [ ] New feature / example
- [ ] Documentation update
- [ ] Refactor (no behavior change)
- [ ] Dependency update

## Related issue

Closes #

## Testing

<!-- How did you verify this works? -->

- [ ] `pnpm build` passes from repo root
- [ ] Tested against ADI Testnet (Chain ID 99999)
- [ ] If new example: deployed and frontend connects
- [ ] If SDK/plugin change: tested in a local consumer project

## Checklist

- [ ] No em dashes (use plain hyphen `-`) in any text, comments, or docs
- [ ] No `zksync-ethers` added anywhere (Node.js only - broken in browser)
- [ ] No type-113 transactions or `customData` fields (rejected by ADI Chain)
- [ ] No `hardhat ignition deploy` directly (use `deploy.mjs` - Ignition breaks on ADI RPC)
- [ ] If touching `@adi-devtools/contracts/system/`: ABIs + addresses verified against live chain
- [ ] `CHANGELOG.md` or package version updated if publishing

## Screenshots (if frontend changes)

<!-- Before / after, or a short screen recording -->
