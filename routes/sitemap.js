var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://utarid.org/single/spring-boot-ta-veritabani-anotasyonlari</loc>
                <lastmod>2023-05-21T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-ta-validation-yapmak</loc>
                <lastmod>2023-05-10T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/linux-te-wifi-yapilandirmasi</loc>
                <lastmod>2023-05-08T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/mapstruct-kullanimi</loc>
                <lastmod>2023-05-07T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-ta-loglama-yapmak</loc>
                <lastmod>2023-05-02T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/exceptionHandler-kullanimi</loc>
                <lastmod>2023-05-01T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/lombok-kullanimi</loc>
                <lastmod>2023-04-29T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/primary-ve-qualifier-kullanimi</loc>
                <lastmod>2023-04-28T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/linux-te-local-postgresql-kurulumu</loc>
                <lastmod>2023-04-28T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/temel-spring-boot-uygulamasi</loc>
                <lastmod>2023-05-16T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-linked-list</loc>
                <lastmod>2023-03-13T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/event-driven-programlama</loc>
                <lastmod>2023-03-05T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/comparator-ve-comparable</loc>
                <lastmod>2023-02-13T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-map</loc>
                <lastmod>2023-02-11T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-stack</loc>
                <lastmod>2023-02-06T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-queue</loc>
                <lastmod>2023-02-05T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-array</loc>
                <lastmod>2023-02-04T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/veri-yapilari:-set</loc>
                <lastmod>2023-02-02T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/try-with-resources</loc>
                <lastmod>2023-01-27T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/List.of-ve-Arrays.asList</loc>
                <lastmod>2023-01-27T00:00:00+00:00</lastmod>
            </url>
        </urlset>
        `);
    });

module.exports = router;
