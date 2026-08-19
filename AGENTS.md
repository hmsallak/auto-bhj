# Project Agent Rules

## UI/UX Workflow

- For every task that changes how the product looks, moves, responds, or is used, read and apply `.agents/skills/ui-ux-pro-max/SKILL.md` before making UI decisions.
- For new pages, major redesigns, layouts, components, responsive behavior, accessibility, visual polish, typography, colors, or animation, generate or query the local UI/UX guidance with `.agents/skills/ui-ux-pro-max/scripts/search.py`.
- Use a designer-review pass for UI work: critique the proposal, identify weak assumptions, revise the design, then implement. When sub-agents are available and the task is non-trivial, spawn a dedicated designer agent to review the interpretation and challenge the solution before delivery.
- Prefer components and patterns that are current and production-grade. When selecting third-party UI components, check `https://21st.dev/` and use the best fitting component only if it improves maintainability, accessibility, and visual quality for this project.

## Motion

- Prefer Motion from `https://github.com/motiondivision/motion.git` for meaningful React/Next.js animation work when an animation library is needed.
- Animations must communicate state, hierarchy, or continuity. Avoid decorative motion that adds cost without improving understanding.
- Respect `prefers-reduced-motion`, keep animations interruptible, and prefer transform/opacity over layout-affecting properties.
- Do not add Motion as a dependency unless the current task actually needs it; when it is needed, install the `motion` package through the project package manager and keep usage scoped.

## Quality Bar

- Before final delivery of UI work, review mobile, tablet, and desktop behavior; check text wrapping, contrast, focus states, touch/click target size, loading/error states, and reduced-motion behavior.
- Re-check the solution after implementation and correct issues found during the review instead of only reporting them.
- Keep changes aligned with existing project structure and the active Next.js rules in `frontend/AGENTS.md`.
