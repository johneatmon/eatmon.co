<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — eatmon.co</title>
        <style>
          @font-face {
            font-family: "Uncut Sans";
            src: url("/fonts/uncut_sans.woff2") format("woff2");
            font-weight: 300 700;
            font-style: normal;
            font-display: swap;
          }

          :root {
            color-scheme: dark;
            --bg: #050505;
            --fg: #f0eee8;
            --muted: #8a8780;
            --border: #1a1a1a;
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            min-height: 100dvh;
            background: var(--bg);
            color: var(--fg);
            font-family: "Uncut Sans", ui-sans-serif, system-ui, sans-serif;
            font-feature-settings: "kern", "liga", "ss02", "ss05";
            -webkit-font-smoothing: antialiased;
          }

          main {
            width: min(48rem, calc(100% - 2.5rem));
            margin: 0 auto;
            padding: 4rem 0 6rem;
          }

          .eyebrow {
            margin: 0 0 0.75rem;
            font-size: 0.6875rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
          }

          h1 {
            margin: 0 0 0.75rem;
            font-size: clamp(2rem, 4vw, 2.75rem);
            letter-spacing: -0.04em;
            font-weight: 550;
          }

          .lede {
            margin: 0 0 2.5rem;
            max-width: 36rem;
            color: color-mix(in oklab, var(--fg) 72%, transparent);
            line-height: 1.6;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 0.9rem 0;
            border-bottom: 1px solid var(--border);
            text-align: left;
            vertical-align: baseline;
          }

          th {
            font-size: 0.6875rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
            font-weight: 450;
          }

          td.path a {
            color: var(--fg);
            text-decoration: none;
            letter-spacing: -0.015em;
          }

          td.path a:hover {
            opacity: 0.7;
          }

          td.date {
            width: 8rem;
            white-space: nowrap;
            font-size: 0.6875rem;
            letter-spacing: 0.04em;
            color: var(--muted);
            font-variant-numeric: tabular-nums;
            text-align: right;
          }

          .count {
            margin-top: 1.5rem;
            font-size: 0.6875rem;
            letter-spacing: 0.04em;
            color: var(--muted);
          }
        </style>
      </head>
      <body>
        <main>
          <p class="eyebrow">eatmon.co</p>
          <h1>Sitemap</h1>
          <p class="lede">
            Machine-readable index for crawlers. This page is styled for humans;
            bots read the underlying XML.
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th class="date">Last modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sm:urlset/sm:url">
                <tr>
                  <td class="path">
                    <a href="{sm:loc}">
                      <xsl:value-of select="sm:loc"/>
                    </a>
                  </td>
                  <td class="date">
                    <xsl:value-of select="sm:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <p class="count">
            <xsl:value-of select="count(sm:urlset/sm:url)"/>
            <xsl:text> URLs</xsl:text>
          </p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
