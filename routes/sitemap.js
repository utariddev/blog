var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://utarid.org/single/lombok-kullanimi</loc>
                <lastmod>2023-04-30T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/primary-ve-qualifier-kullanimi</loc>
                <lastmod>2023-04-30T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/linux-te-local-postgresql-kurulumu</loc>
                <lastmod>2023-04-30T00:00:00+00:00</lastmod>
            </url>
        </urlset>
        `);
    });

module.exports = router;
