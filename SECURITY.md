# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `@adi-devtools/sdk` latest | Yes |
| `@adi-devtools/contracts` latest | Yes |
| `hardhat-adi-network` latest | Yes |
| `create-adi-app` latest | Yes |
| Any previous major version | No - please upgrade |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a security vulnerability, open a [GitHub Security Advisory](https://github.com/A1VARA5/adi-dev-tools/security/advisories/new) on this repository. This keeps the disclosure private until a fix is released.

Include as much of the following as possible:

- Type of issue (e.g. private key exposure, code injection, dependency vulnerability)
- Full paths of the source file(s) related to the issue
- The location of the affected source code (tag, branch, commit, or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

You will receive a response within 3 business days. If the issue is confirmed, a patch will be released as soon as possible depending on complexity.

## Scope

This policy covers:

- All packages published under `@adi-devtools` on npm
- The `create-adi-app` CLI
- Example dApps in `examples/`

**Out of scope**: Vulnerabilities in ADI Chain itself or its RPC infrastructure. For those, contact ADI Foundation directly at https://docs.adi.foundation.

## Notes on smart contract security

The Solidity templates in `@adi-devtools/contracts` and `examples/` are **reference implementations** intended for learning and rapid prototyping. They have not been formally audited. Do not deploy them to mainnet with real funds without a professional security audit.
