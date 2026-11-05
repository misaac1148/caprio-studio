# Caprio Studio Website

A responsive, static-first, SEO-ready site for Caprio Studio: laser engraving and 3D printing in Eugene, Oregon, with custom-order inquiries and shipping options.

## Pages
- `/` — homepage
- `/laser-engraving` — custom laser engraving
- `/3d-printing` — custom 3D printing
- `/eugene-oregon` — local SEO and appointment-based coordination
- `/about` — studio background
- `/contact` — project inquiry
- `/privacy` — inquiry privacy overview

## Run locally
Install Node.js 20+ then run `npm run build` and `npm run dev`. The output site is in `public/`.

## GitHub and Vercel
1. Create a **new** GitHub repository named `caprio-studio` (do not overwrite other sites).
2. Upload the files in this project, or run `git init && git add . && git commit -m "Launch Caprio Studio website" && git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/caprio-studio.git && git push -u origin main`.
3. In Vercel, choose **Add New → Project → Import Git Repository**, select `caprio-studio`, framework **Other**, build command `npm run build`, output directory `public`.
4. Configure Vercel environment variables: `SITE_URL` set to the final `https://` site origin, plus `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, and `QUOTE_FROM_EMAIL` to activate contact delivery. For Resend, verify the sender domain and use a matching `QUOTE_FROM_EMAIL` such as `Caprio Studio <quotes@your-domain.com>`.
5. Redeploy after setting `SITE_URL`. The build replaces placeholder Open Graph and schema URLs, writes canonical tags and generates `sitemap.xml` and `robots.txt`.
6. Add your domain in Vercel Domains, then verify the public site and submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## SEO notes
- Unique page titles and descriptions, social previews, on-page copy, and structured data.
- Local landing page for Eugene and Lane County without inventing a public address, phone, business hours or Google Business Profile.
- Do not create fake geographic location pages for places where the studio is not located. Nationwide projects are described as remote inquiries with shipping options.
- The text does not promise material or printer capabilities before verification. Add actual material lists and real photographs once confirmed.

## Contact form
`api/quote.js` is a Vercel function that validates and sends inquiries with Resend. The form is **not active** until the Resend variables are configured and the sender verified. Never claim otherwise. To reduce spam, a hidden honeypot field is included; additional rate limiting may be needed as traffic grows.
