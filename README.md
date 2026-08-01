# Contextual Flow Timer

A smart, adaptive timer that understands real life.  
Stop fighting rigid Pomodoro blocks — flow with your actual routines, tasks, and energy levels.

## Features

- **Multi-Stage Routines (Chains)**  
  Build custom sequences like "Laundry Mode": 35 min Wash → 5 min Transfer → 60 min Dry.  
  Chains automatically progress with smart timing.

- **Smart Buffer**  
  Optional 5-minute wrap-up time between stages.  
  Gives you breathing room to prepare for the next task.

- **Ambient Focus Pulse**  
  A calming simulated counter that keeps you company while you work. It's a local, generated signal, not real user data.

- **Fully Local & Private**  
  No accounts. No sign-up. Custom chains and today's session count are saved in LocalStorage; nothing leaves your browser.

## Tech Stack

- Plain HTML, CSS, and vanilla JavaScript — ES modules under `src/`, no build step, no framework
- LocalStorage for persistence

## Running locally

Native ES modules require an HTTP origin (browsers block `type="module"` over `file://`). Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Built with focus and intention.
