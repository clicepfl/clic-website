/**
 * Express main router, defines URL endpoints for modules
 * CLIC website software
 *
 * @author  Alexandre CHAU
 */

import express from 'express'
import sitemap from 'express-sitemap'
import { config } from './config'

/** Fresh router instance */
const router = express.Router()

// Homepage
router.get('/', (req, res) => {
    res.render('templates/index.njk')
})

/**
/// IC Boost day
router.get(['/icbd', '/icboostday', '/events/icbd'], (req, res) => {
    res.sendFile('static/icbd.html', { root: config.root })
})
/// About page
router.get(['/about'], (req, res) => {
    res.sendFile('static/about.html', { root: config.root })
})
*/

/** 
 * Static assets !Relative to root of project!
 */
// Compiled assets (styles, JS scripts, ...)
router.use(express.static('dist/static/'))
// Vendor libraries assets
router.use('/vendor', express.static('vendor/'))
// Other static assets (images, files, ...)
router.use(express.static('assets/'))

/**
 * Sitemap automatic generation
 */
const sm = sitemap({
    generate: router,
    http: config.protocol,
    url: config.url,
    route: {
        '/': {
            changefreq: 'always',
            priority: 1.0
        }
    }
})
// Sitemap main route
router.get('/sitemap.xml', (req, res) => {
    sm.XMLtoWeb(res)
})
// Sitemap robots config route
router.get('/robots.txt', (req, res) => {
    sm.TXTtoWeb(res)
})

/**
 * 404 handle
 * MUST be at the end of the routing list !
 */
router.use((req, res, next) => {
    res.status(404).render('error-pages/404.njk')
})

/** Export router to mount in express server */
export { router }