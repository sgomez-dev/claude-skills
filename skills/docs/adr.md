---
description: Create an Architecture Decision Record (ADR) for important technical decisions
permissions:
  reads: ["docs/adr/**"]
  writes: ["docs/adr/**"]
  commands: []
  network: false
  destructive: false
---

Create a well-structured Architecture Decision Record.

Steps:
1. Understand the decision context from the user
2. Create an ADR following the standard format:

```markdown
# ADR-{number}: {title}

## Status
{Proposed | Accepted | Deprecated | Superseded by ADR-XXX}

## Context
What is the issue? What forces are at play? (Technical, business, social, project constraints)

## Decision
What is the change we're proposing and/or doing?

## Consequences
### Positive
- What becomes easier?

### Negative
- What becomes harder?

### Neutral
- What other changes might this require?

## Alternatives Considered
### Alternative 1: {name}
- Pros: ...
- Cons: ...
- Why rejected: ...

## References
- Links to relevant docs, RFCs, discussions
```

3. Place in `docs/adr/` or `docs/decisions/` directory (create if needed)
4. Update ADR index if one exists

Decision to document: $ARGUMENTS
