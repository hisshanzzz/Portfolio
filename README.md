# The Stage - Portfolio of Mohamed Hisshan

My personal portfolio, built like a speech: a dark stage, a spotlight that follows
your cursor, and my story told in Acts. Plain HTML, CSS and JavaScript - no
frameworks, no build step. Every line is mine and I can explain it.

## Features

- **Spotlight** that follows the mouse (a warm gold stage light, not a robot)
- **Toastmasters timing lights** (green, yellow, red) that track your scroll -
  if you know, you know
- **Live SpeechLens demo** - a JavaScript port of my Python project; paste a
  speech and get timing, filler-word and readability analysis instantly
- **Q&A segment** - clickable interview questions with typewriter answers
- Animated counters, ticker tape, scroll reveals, fully responsive

## Run it locally

No installation needed. Just open `index.html` in a browser
(double-click it, or in VS Code/Cursor right-click and choose "Open with Live Server").

## Deploy free with GitHub + Vercel (one-time setup, ~10 minutes)

1. **Create the repo.** On github.com (logged in as `hisshanzzz`), click
   **New repository**, name it `portfolio`, set it Public, then Create.
2. **Push this folder.** In a terminal, inside the `portfolio` folder:

   ```bash
   git init
   git add .
   git commit -m "My portfolio: The Stage"
   git branch -M main
   git remote add origin https://github.com/hisshanzzz/portfolio.git
   git push -u origin main
   ```

3. **Connect Vercel.** Go to [vercel.com](https://vercel.com), choose **Sign up
   with GitHub** (free Hobby plan), then **Add New > Project**, import
   `portfolio`, leave every setting as default, and click **Deploy**.
4. Done. Vercel gives you a live URL like `hisshan-portfolio.vercel.app`.
   You can rename it under Project > Settings > Domains.

**Updating the site later:** edit the files, then
`git add . && git commit -m "update" && git push` - Vercel redeploys
automatically in about 30 seconds.

## Add the 3D microphone (Spline)

1. Go to [spline.design](https://spline.design) and sign up free.
2. Browse the community library for a microphone (or any object you like)
   and remix it. You can change colors to match the site
   (gold `#f0b429` on dark `#0a0a0e`).
3. Click **Export > Viewer > Copy URL**.
4. In `index.html`, find the comment `SPLINE 3D MICROPHONE GOES HERE`,
   uncomment the two lines below it, paste your URL into
   `url="..."`, and delete the `mic-placeholder` div.

Until then, the site shows a CSS-drawn floating microphone so nothing looks empty.

## Customize

- **Numbers:** the animated counters live in `index.html` - search for
  `data-count` and change the values.
- **Colors:** all colors are defined once at the top of `styles.css`
  under `:root`.
- **Q&A answers:** each question button in `index.html` has a `data-a`
  attribute holding its answer.
