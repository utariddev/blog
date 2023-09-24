var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://utarid.org/sitemap</loc>
                <lastmod>2023-07-22T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/servlet-listenerlar</loc>
                <lastmod>2023-09-12T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-gateway</loc>
                <lastmod>2023-07-22T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-ta-eureka-kullanimi</loc>
                <lastmod>2023-07-14T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/linuxte-mongodb-kurulumu</loc>
                <lastmod>2023-07-07T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/open-closed-principle</loc>
                <lastmod>2023-06-11T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/oop-kavramlari:-aggregation</loc>
                <lastmod>2023-06-09T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/oop-kavramlari</loc>
                <lastmod>2023-06-09T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/oop-kavramlari:-composition</loc>
                <lastmod>2023-06-09T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/liskov-substitution-principle</loc>
                <lastmod>2023-06-09T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/auto-boxing</loc>
                <lastmod>2023-06-08T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/java-nio-api</loc>
                <lastmod>2023-06-08T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/java-io-api</loc>
                <lastmod>2023-06-08T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/referans-turleri</loc>
                <lastmod>2023-06-06T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/constructor-chaining</loc>
                <lastmod>2023-06-05T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/concurrency</loc>
                <lastmod>2023-06-04T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/busy-spin</loc>
                <lastmod>2023-06-04T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-restTemplate</loc>
                <lastmod>2023-05-27T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/spring-boot-ta-guvenlik</loc>
                <lastmod>2023-05-25T00:00:00+00:00</lastmod>
            </url>
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
            <url>
                <loc>https://utarid.org/single/iterator</loc>
                <lastmod>2023-01-26T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/design-patterns</loc>
                <lastmod>2023-01-21T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/oop-kavramlari:-inheritance</loc>
                <lastmod>2023-01-03T00:00:00+00:00</lastmod>
            </url>
            <url>
                <loc>https://utarid.org/single/BigDecimal</loc>
                <lastmod>2022-12-29T00:00:00+00:00</lastmod>
            </url>
        </urlset>
        `);
    });

module.exports = router;
