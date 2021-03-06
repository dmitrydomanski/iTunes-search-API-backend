
import { Router } from 'express';
import bodyParser from 'body-parser';
import async from 'express-async-await';
import fetch from 'node-fetch';
import SearchEntry from '../model/searchEntry';

const searchRouter = module.exports = new Router();

searchRouter.post('/search', (req, res) => {

    const entry = new SearchEntry();
    const query = { searchWord: req.query.term.toLowerCase() };
    const update = { $inc: { numEntries: 1 } }

    SearchEntry.findOneAndUpdate(query, update)
        .exec()
        .then(result => {
            if (result === null) {
                entry.searchWord = query.searchWord;
                entry.save()
                    .then(item => res.status(201).json(item))
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
                return;
            }
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

const api = process.env.ITUNES_API || 'https://itunes.apple.com/search?term=';
const results = [];

const getContent = (term) => {
    const appendix = '&media=musicVideo';
    return fetch(`${api}${term}${appendix}`);
}

searchRouter.get('/search', (req, res) => {
    getContent(req.query.term)
        .then(response => response.json())
        .then(responseData => res.send(responseData.results))
        .catch(err => res.status(500).json({ error: err }));
});

searchRouter.get('/top', (req, res) => {
    SearchEntry
        .find()
        .sort({ numEntries: -1 })
        .limit(10)
        .then(result => {
            const queries = result.map(query => query.searchWord);
            res.send(queries);
        });
});

const getSingleTrackInfo = (trackId) => this.results.filter(result => result.trackId === trackId)

searchRouter.get('/lookup', (req, res) => {
    getContent(req.query.term)
        .then(response => response.json())
        .then(responseData => res.send(responseData.results
            .filter(result => result.trackId === parseInt(req.query.trackId))))
        .catch(err => res.status(500).json({ error: err }))
});